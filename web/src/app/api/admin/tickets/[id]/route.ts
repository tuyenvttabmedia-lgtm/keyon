import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toErrorResponse } from "@/lib/errors";

const schema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
  adminNote: z.string().max(2000).optional(),
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
    const { id } = await ctx.params;
    const body = schema.parse(await req.json());
    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: {
        status: body.status,
        adminNote: body.adminNote,
      },
    });
    // Notify customer
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
