import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  parseVndBound,
  type AdminCustomerListRow,
  type CustomersListQuery,
} from "@/lib/admin-customers";

const NEW_CUSTOMER_DAYS = 7;

const AWAITING_ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "PAID",
  "FULFILLING",
] as const;

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function parseYmd(s: string | undefined): Date | null {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function buildWhere(input: CustomersListQuery): Prisma.UserWhereInput {
  const parts: Prisma.UserWhereInput[] = [{ role: "CUSTOMER" }];
  const q = (input.q ?? "").trim();
  if (q) {
    parts.push({
      OR: [
        { email: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
      ],
    });
  }

  if (input.verified === "verified") {
    parts.push({ emailVerifiedAt: { not: null } });
  } else if (input.verified === "unverified") {
    parts.push({ emailVerifiedAt: null });
  }

  if (input.isNew === "yes") {
    const since = new Date();
    since.setDate(since.getDate() - NEW_CUSTOMER_DAYS);
    parts.push({ createdAt: { gte: since } });
  } else if (input.isNew === "no") {
    const since = new Date();
    since.setDate(since.getDate() - NEW_CUSTOMER_DAYS);
    parts.push({ createdAt: { lt: since } });
  }

  const from = parseYmd(input.from);
  const to = parseYmd(input.to);
  if (from || to) {
    parts.push({
      createdAt: {
        ...(from ? { gte: startOfDay(from) } : {}),
        ...(to ? { lte: endOfDay(to) } : {}),
      },
    });
  }

  if (input.awaiting === "yes") {
    parts.push({
      orders: {
        some: {
          OR: [
            { status: { in: [...AWAITING_ORDER_STATUSES] } },
            {
              fulfillmentJobs: {
                some: {
                  status: {
                    in: ["WAITING_HUMAN", "WAITING_STOCK", "FAILED", "QUEUED", "PROCESSING"],
                  },
                },
              },
            },
          ],
        },
      },
    });
  } else if (input.awaiting === "no") {
    parts.push({
      NOT: {
        orders: {
          some: {
            OR: [
              { status: { in: [...AWAITING_ORDER_STATUSES] } },
              {
                fulfillmentJobs: {
                  some: {
                    status: {
                      in: ["WAITING_HUMAN", "WAITING_STOCK", "FAILED"],
                    },
                  },
                },
              },
            ],
          },
        },
      },
    });
  }

  if (input.ticket === "yes") {
    parts.push({
      tickets: { some: { status: { in: ["OPEN", "IN_PROGRESS"] } } },
    });
  } else if (input.ticket === "no") {
    parts.push({
      NOT: {
        tickets: { some: { status: { in: ["OPEN", "IN_PROGRESS"] } } },
      },
    });
  }

  if (parts.length === 1) return parts[0]!;
  return { AND: parts };
}

export async function queryAdminCustomers(input: CustomersListQuery): Promise<{
  rows: AdminCustomerListRow[];
  totalMatched: number;
}> {
  const where = buildWhere(input);
  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      emailVerifiedAt: true,
      totpEnabledAt: true,
      _count: { select: { orders: true } },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { id: true, code: true, createdAt: true, status: true },
      },
      tickets: {
        where: { status: { in: ["OPEN", "IN_PROGRESS"] } },
        select: { id: true },
        take: 5,
      },
      authSessions: {
        where: { revokedAt: null },
        orderBy: { lastSeenAt: "desc" },
        take: 1,
        select: { lastSeenAt: true },
      },
    },
  });

  const ids = users.map((u) => u.id);
  const spendRows =
    ids.length === 0
      ? []
      : await prisma.order.groupBy({
          by: ["userId"],
          where: {
            userId: { in: ids },
            status: { in: ["COMPLETED", "PAID", "FULFILLING"] },
          },
          _sum: { totalVnd: true },
        });
  const spendMap = new Map(
    spendRows
      .filter((r) => r.userId)
      .map((r) => [r.userId!, r._sum.totalVnd ?? 0]),
  );

  const awaitingFlags = new Map<string, boolean>();
  if (ids.length > 0) {
    const awaitingOrders = await prisma.order.findMany({
      where: {
        userId: { in: ids },
        OR: [
          { status: { in: [...AWAITING_ORDER_STATUSES] } },
          {
            fulfillmentJobs: {
              some: {
                status: {
                  in: ["WAITING_HUMAN", "WAITING_STOCK", "FAILED", "QUEUED", "PROCESSING"],
                },
              },
            },
          },
        ],
      },
      select: { userId: true },
      distinct: ["userId"],
    });
    for (const o of awaitingOrders) {
      if (o.userId) awaitingFlags.set(o.userId, true);
    }
  }

  const minSpend = parseVndBound(input.minSpend);
  const maxSpend = parseVndBound(input.maxSpend);

  let rows: AdminCustomerListRow[] = users.map((u) => {
    const last = u.orders[0];
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      createdAt: u.createdAt.toISOString(),
      emailVerified: Boolean(u.emailVerifiedAt),
      totpEnabled: Boolean(u.totpEnabledAt),
      orderCount: u._count.orders,
      totalSpendVnd: spendMap.get(u.id) ?? 0,
      lastOrderAt: last?.createdAt.toISOString() ?? null,
      lastOrderCode: last?.code ?? null,
      hasAwaiting: awaitingFlags.get(u.id) ?? false,
      openTicketCount: u.tickets.length,
      lastSeenAt: u.authSessions[0]?.lastSeenAt.toISOString() ?? null,
    };
  });

  if (minSpend != null) {
    rows = rows.filter((r) => r.totalSpendVnd >= minSpend);
  }
  if (maxSpend != null) {
    rows = rows.filter((r) => r.totalSpendVnd <= maxSpend);
  }

  const totalMatched = rows.length;
  return { rows: rows.slice(0, 100), totalMatched };
}
