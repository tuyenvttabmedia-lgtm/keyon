import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { AppError, toErrorResponse } from "@/lib/errors";

const schema = z.object({
  orderId: z.string().min(1),
  body: z.string().trim().min(1).max(2000),
});

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { orderId, body } = schema.parse(await req.json());
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, code: true },
    });
    if (!order) throw new AppError("Order not found", 404);

    const note = await prisma.orderNote.create({
      data: {
        orderId,
        authorId: session.id,
        body,
      },
    });

    await audit("order.note_add", "Order", orderId, session.id, {
      noteId: note.id,
      preview: body.slice(0, 120),
    });

    return NextResponse.json({
      ok: true,
      note: {
        id: note.id,
        body: note.body,
        createdAt: note.createdAt.toISOString(),
        authorId: session.id,
      },
    });
  } catch (e) {
    return toErrorResponse(e, "order.note");
  }
}
