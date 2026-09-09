import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { toErrorResponse } from "@/lib/errors";
import { requireStaffSession } from "@/server/auth/require-staff";

const schema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
  adminNote: z.string().max(2000).optional(),
});

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    await requireStaffSession({ capability: "tickets" });
    const { id } = await ctx.params;
    const body = schema.parse(await req.json());
    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: {
        status: body.status,
        adminNote: body.adminNote,
      },
    });
    await prisma.userNotification.create({
      data: {
        userId: ticket.userId,
        title: `Yêu cầu hỗ trợ: ${ticket.status}`,
        body: body.adminNote?.trim()
          ? body.adminNote
          : `Trạng thái yêu cầu «${ticket.subject}» đã cập nhật.`,
        href: "/account/tickets",
      },
    });
    return NextResponse.json({ ticket });
  } catch (e) {
    return toErrorResponse(e);
  }
}
