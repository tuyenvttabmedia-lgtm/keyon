import { prisma } from "@/lib/db";
import type { FulfillmentJobStatus, OrderStatus } from "@prisma/client";

const SOLD_STATUSES: OrderStatus[] = ["PAID", "FULFILLING", "COMPLETED"];
const OPEN_JOB_STATUSES: FulfillmentJobStatus[] = [
  "QUEUED",
  "RESERVED",
  "PROCESSING",
  "WAITING_HUMAN",
  "WAITING_STOCK",
];

function startOfUtcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function dayKey(d: Date): string {
  return startOfUtcDay(d).toISOString().slice(0, 10);
}

/** Last `days` UTC day keys, oldest → newest (includes today). */
export function lastDayKeys(days: number, now = new Date()): string[] {
  const today = startOfUtcDay(now);
  const keys: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    keys.push(dayKey(d));
  }
  return keys;
}

export const HeroStatsRepository = {
  async sumSoldQuantity(before?: Date): Promise<number> {
    const agg = await prisma.orderItem.aggregate({
      where: {
        order: {
          status: { in: SOLD_STATUSES },
          ...(before
            ? {
                OR: [
                  { paidAt: { lt: before } },
                  { AND: [{ paidAt: null }, { createdAt: { lt: before } }] },
                ],
              }
            : {}),
        },
      },
      _sum: { quantity: true },
    });
    return agg._sum.quantity ?? 0;
  },

  async countDeliveries(before?: Date): Promise<number> {
    return prisma.delivery.count({
      where: before ? { createdAt: { lt: before } } : undefined,
    });
  },

  async countOpenJobs(createdBefore?: Date): Promise<number> {
    return prisma.fulfillmentJob.count({
      where: {
        status: { in: OPEN_JOB_STATUSES },
        ...(createdBefore ? { createdAt: { lt: createdBefore } } : {}),
      },
    });
  },

  /** Daily sold quantity for [from, to) by paidAt (fallback createdAt). */
  async dailySoldQuantity(from: Date, to: Date): Promise<Map<string, number>> {
    const items = await prisma.orderItem.findMany({
      where: {
        order: {
          status: { in: SOLD_STATUSES },
          OR: [
            { paidAt: { gte: from, lt: to } },
            {
              AND: [
                { paidAt: null },
                { createdAt: { gte: from, lt: to } },
              ],
            },
          ],
        },
      },
      select: {
        quantity: true,
        order: { select: { paidAt: true, createdAt: true } },
      },
    });
    const map = new Map<string, number>();
    for (const row of items) {
      const t = row.order.paidAt ?? row.order.createdAt;
      const k = dayKey(t);
      map.set(k, (map.get(k) ?? 0) + row.quantity);
    }
    return map;
  },

  async dailyDeliveryCounts(from: Date, to: Date): Promise<Map<string, number>> {
    const rows = await prisma.delivery.findMany({
      where: { createdAt: { gte: from, lt: to } },
      select: { createdAt: true },
    });
    const map = new Map<string, number>();
    for (const row of rows) {
      const k = dayKey(row.createdAt);
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  },

  async dailyOpenJobCreatedCounts(from: Date, to: Date): Promise<Map<string, number>> {
    const rows = await prisma.fulfillmentJob.findMany({
      where: {
        status: { in: OPEN_JOB_STATUSES },
        createdAt: { gte: from, lt: to },
      },
      select: { createdAt: true },
    });
    const map = new Map<string, number>();
    for (const row of rows) {
      const k = dayKey(row.createdAt);
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  },

  async recentDeliveries(take = 12) {
    return prisma.delivery.findMany({
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        orderItem: {
          select: {
            title: true,
            variant: {
              select: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    brand: { select: { name: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
  },
};
