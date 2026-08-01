import { prisma } from "@/lib/db";

/** Read-only ops aggregates for Dashboard — không business rules. */
export async function getOpsMetrics() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const [
    orders_today,
    revenueAgg,
    pending_orders,
    instant_queue,
    manual_queue,
  ] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: start } } }),
    prisma.payment.aggregate({
      where: { status: "SUCCEEDED", succeededAt: { gte: start } },
      _sum: { amountVnd: true },
    }),
    prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
    prisma.fulfillmentJob.count({
      where: {
        strategy: "INSTANT",
        status: { in: ["QUEUED", "PROCESSING", "WAITING_STOCK"] },
      },
    }),
    prisma.fulfillmentJob.count({
      where: {
        strategy: "MANUAL",
        status: { in: ["QUEUED", "PROCESSING", "WAITING_HUMAN"] },
      },
    }),
  ]);

  return {
    orders_today,
    revenue_today_vnd: revenueAgg._sum.amountVnd ?? 0,
    pending_orders,
    instant_queue,
    manual_queue,
  };
}
