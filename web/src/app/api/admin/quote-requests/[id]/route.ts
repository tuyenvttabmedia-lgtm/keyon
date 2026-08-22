import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { childLogger } from "@/lib/logger";
import { toErrorResponse } from "@/lib/errors";
import { assertStaffCapability } from "@/lib/staff-access";
import { QUOTE_REQUEST_STATUSES } from "@/lib/admin-quote-requests";
import { sendQuoteStatusEmail } from "@/server/quote/quote-request-ops";

const log = childLogger("admin.quote-requests");

const schema = z
  .object({
    status: z.enum(QUOTE_REQUEST_STATUSES).optional(),
    adminNote: z.string().max(5000).optional().nullable(),
    assigneeId: z.string().cuid().optional().nullable(),
  })
  .refine(
    (v) =>
      v.status !== undefined ||
      v.adminNote !== undefined ||
      v.assigneeId !== undefined,
    { message: "Không có thay đổi" },
  );

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(session.role, "quote_requests");

    const { id } = await ctx.params;
    const body = schema.parse(await req.json());

    const existing = await prisma.quoteRequest.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        referenceCode: true,
        fullName: true,
        email: true,
        companyName: true,
        assigneeId: true,
      },
    });
    if (!existing) {
      return NextResponse.json({ error: "Không tìm thấy yêu cầu" }, { status: 404 });
    }

    let nextAssigneeId =
      body.assigneeId !== undefined ? body.assigneeId : existing.assigneeId;

    if (
      body.status === "IN_REVIEW" &&
      body.assigneeId === undefined &&
      !existing.assigneeId
    ) {
      nextAssigneeId = session.id;
    }

    if (body.assigneeId) {
      const assignee = await prisma.user.findFirst({
        where: {
          id: body.assigneeId,
          role: { in: ["ADMIN", "CS", "FULFILLMENT"] },
          disabledAt: null,
        },
        select: { id: true },
      });
      if (!assignee) {
        return NextResponse.json(
          { error: "Nhân viên phụ trách không hợp lệ" },
          { status: 400 },
        );
      }
    }

    const row = await prisma.quoteRequest.update({
      where: { id },
      data: {
        ...(body.status !== undefined ? { status: body.status } : {}),
        ...(body.adminNote !== undefined
          ? { adminNote: body.adminNote?.trim() || null }
          : {}),
        assigneeId: nextAssigneeId,
      },
      select: {
        id: true,
        referenceCode: true,
        status: true,
        adminNote: true,
        assigneeId: true,
        updatedAt: true,
      },
    });

    if (body.status !== undefined && existing.status !== body.status) {
      await prisma.auditLog.create({
        data: {
          actorId: session.id,
          action: "quote_request.status",
          entityType: "QuoteRequest",
          entityId: id,
          meta: {
            referenceCode: existing.referenceCode,
            from: existing.status,
            to: body.status,
          },
        },
      });

      void sendQuoteStatusEmail({
        referenceCode: existing.referenceCode,
        fullName: existing.fullName,
        email: existing.email,
        companyName: existing.companyName,
        status: body.status,
      }).catch((e) => {
        log.error(
          {
            err: e instanceof Error ? e.message : e,
            referenceCode: existing.referenceCode,
          },
          "quote status mail failed",
        );
      });
    }

    return NextResponse.json({ quoteRequest: row });
  } catch (e) {
    return toErrorResponse(e);
  }
}
