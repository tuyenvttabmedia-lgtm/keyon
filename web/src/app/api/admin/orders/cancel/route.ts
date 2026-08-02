import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { AppError, toErrorResponse } from "@/lib/errors";
import { assertStaffCapability } from "@/lib/staff-access";
import { LicensePoolService } from "@/server/license-pool";

const schema = z.object({ orderId: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(session.role, "orders", "Không có quyền hủy đơn");
    const { orderId } = schema.parse(await req.json());
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw new AppError("Order not found", 404);
    if (order.status !== "PENDING_PAYMENT") {
      throw new AppError("Chỉ hủy đơn PENDING_PAYMENT", 400);
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });
      await tx.payment.updateMany({
        where: { orderId, status: "AWAITING" },
        data: { status: "EXPIRED" },
      });
    });

    for (const item of order.items) {
      if (item.reservationToken) {
        await LicensePoolService.release({
          reservationToken: item.reservationToken,
          reason: "order_cancelled",
        }).catch(() => undefined);
      }
    }

    await audit("order.cancel", "Order", orderId, session.id, { code: order.code });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return toErrorResponse(e, "order.cancel");
  }
}
