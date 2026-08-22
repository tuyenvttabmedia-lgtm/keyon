import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toErrorResponse } from "@/lib/errors";
import { assertStaffCapability } from "@/lib/staff-access";
import { QUOTE_REQUEST_STATUSES } from "@/lib/admin-quote-requests";

const schema = z.object({
  status: z.enum(QUOTE_REQUEST_STATUSES),
});

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
      select: { id: true, status: true, referenceCode: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Không tìm thấy yêu cầu" }, { status: 404 });
    }

    const row = await prisma.quoteRequest.update({
      where: { id },
      data: { status: body.status },
      select: {
        id: true,
        referenceCode: true,
        status: true,
        updatedAt: true,
      },
    });

    if (existing.status !== body.status) {
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
    }

    return NextResponse.json({ quoteRequest: row });
  } catch (e) {
    return toErrorResponse(e);
  }
}
