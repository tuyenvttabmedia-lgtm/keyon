import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Lightweight poll for checkout confirm — order id is UUID (same exposure as confirm page).
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await ctx.params;
  if (!orderId || orderId.length < 10) {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      payments: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { status: true },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const paymentStatus = order.payments[0]?.status ?? "PENDING";
  const paid =
    order.status === "PAID" ||
    order.status === "FULFILLING" ||
    order.status === "COMPLETED" ||
    paymentStatus === "SUCCEEDED";

  return NextResponse.json({
    orderId: order.id,
    orderStatus: order.status,
    paymentStatus,
    paid,
    redirectTo: paid ? `/checkout/${order.id}/success` : null,
  });
}
