import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { assertStaffCapability } from "@/lib/staff-access";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { AppError, toErrorResponse } from "@/lib/errors";
import {
  formatCommercialRefNote,
  parseCommercialRefNote,
  sanitizeCommercialPart,
} from "@/server/admin/commercial-ref";

const schema = z.object({
  orderId: z.string().min(1),
  poNumber: z.string().max(80).optional().default(""),
  contractRef: z.string().max(80).optional().default(""),
});

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(
      session.role,
      "orders",
      "Không có quyền ghi HĐ/PO trên đơn",
    );
    const raw = schema.parse(await req.json());
    const poNumber = sanitizeCommercialPart(raw.poNumber);
    const contractRef = sanitizeCommercialPart(raw.contractRef);
    if (!poNumber && !contractRef) {
      throw new AppError("Nhập số PO hoặc số HĐ", 400);
    }

    const order = await prisma.order.findUnique({
      where: { id: raw.orderId },
      select: { id: true, status: true },
    });
    if (!order) throw new AppError("Order not found", 404);

    const body = formatCommercialRefNote({ poNumber, contractRef });
    const note = await prisma.orderNote.create({
      data: {
        orderId: order.id,
        authorId: session.id,
        body,
      },
    });

    await audit("order.commercial_ref", "Order", order.id, session.id, {
      noteId: note.id,
      poNumber: poNumber || null,
      contractRef: contractRef || null,
    });

    const parsed = parseCommercialRefNote(note.body);

    return NextResponse.json({
      ok: true,
      noteId: note.id,
      poNumber: parsed?.poNumber ?? poNumber,
      contractRef: parsed?.contractRef ?? contractRef,
      orderStatus: order.status,
    });
  } catch (e) {
    return toErrorResponse(e, "order.commercial_ref");
  }
}
