import type {
  DeliverableType,
  Prisma,
  SalesMotion,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  PAGE_SIZES,
  type DatePreset,
  type OrdersFilterChip,
  type OrdersListQuery,
  type PageSize,
  type ReceiveFilter,
  type SalesMotionFilter,
  type AdminOrderListRow,
} from "@/lib/admin-orders";
import { receiveFromDeliverable } from "@/storefront/lib/customer-labels";
import {
  emailDomain,
  isConsumerEmailDomain,
  parseCompanyFilter,
} from "@/lib/company-order-filter";

export type {
  DatePreset,
  OrdersFilterChip,
  OrdersListQuery,
  PageSize,
  ReceiveFilter,
  SalesMotionFilter,
  AdminOrderListRow,
} from "@/lib/admin-orders";
export { PAGE_SIZES } from "@/lib/admin-orders";

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

function parseVnd(s: string | undefined): number | null {
  if (!s || !/^\d+$/.test(s.trim())) return null;
  const n = Number(s.trim());
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function resolveCreatedAtRange(
  preset: DatePreset,
  from?: string,
  to?: string,
): { gte?: Date; lte?: Date } | null {
  const now = new Date();
  if (preset === "all") return null;
  if (preset === "today") {
    return { gte: startOfDay(now), lte: endOfDay(now) };
  }
  if (preset === "yesterday") {
    const y = startOfDay(now);
    y.setDate(y.getDate() - 1);
    return { gte: y, lte: endOfDay(y) };
  }
  if (preset === "last7") {
    const gte = startOfDay(now);
    gte.setDate(gte.getDate() - 6);
    return { gte, lte: endOfDay(now) };
  }
  if (preset === "last30") {
    const gte = startOfDay(now);
    gte.setDate(gte.getDate() - 29);
    return { gte, lte: endOfDay(now) };
  }
  if (preset === "thisMonth") {
    return {
      gte: new Date(now.getFullYear(), now.getMonth(), 1),
      lte: endOfDay(now),
    };
  }
  if (preset === "lastMonth") {
    const gte = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lte = endOfDay(new Date(now.getFullYear(), now.getMonth(), 0));
    return { gte, lte };
  }
  const fromD = parseYmd(from);
  const toD = parseYmd(to);
  if (!fromD && !toD) return null;
  return {
    ...(fromD ? { gte: startOfDay(fromD) } : {}),
    ...(toD ? { lte: endOfDay(toD) } : {}),
  };
}

function chipWhere(chip: OrdersFilterChip): Prisma.OrderWhereInput | undefined {
  if (chip === "all") return undefined;
  if (chip === "awaiting_payment") return { status: "PENDING_PAYMENT" };
  if (chip === "completed") return { status: "COMPLETED" };
  if (chip === "cancelled") {
    return { status: { in: ["CANCELLED", "PAYMENT_FAILED"] } };
  }
  if (chip === "fulfilling") {
    return {
      OR: [
        { status: "FULFILLING" },
        {
          fulfillmentJobs: {
            some: { status: { in: ["QUEUED", "PROCESSING", "RESERVED"] } },
          },
        },
      ],
    };
  }
  if (chip === "needs_action") {
    return {
      fulfillmentJobs: {
        some: {
          status: { in: ["WAITING_HUMAN", "WAITING_STOCK", "FAILED"] },
        },
      },
    };
  }
  return {
    OR: [
      { status: { in: ["PAID", "FULFILLING"] } },
      {
        fulfillmentJobs: {
          some: {
            status: {
              in: [
                "WAITING_HUMAN",
                "WAITING_STOCK",
                "QUEUED",
                "PROCESSING",
                "FAILED",
              ],
            },
          },
        },
      },
    ],
  };
}

function receiveTypes(receive: ReceiveFilter): DeliverableType[] | null {
  if (receive === "all") return null;
  if (receive === "key") return ["KEY"];
  if (receive === "account") return ["ACCOUNT"];
  return ["EXTERNAL_PORTAL", "SUBSCRIPTION"];
}

/** Admin list filter only — not membership, not storefront auth. */
async function companyOrderWhere(
  raw: string,
): Promise<Prisma.OrderWhereInput | undefined> {
  const parsed = parseCompanyFilter(raw);
  if (!parsed.domain && !parsed.name) return undefined;

  const or: Prisma.OrderWhereInput[] = [];
  if (parsed.domain) {
    or.push({
      email: { endsWith: `@${parsed.domain}`, mode: "insensitive" },
    });
  }
  if (parsed.name) {
    const quotes = await prisma.quoteRequest.findMany({
      where: { companyName: { contains: parsed.name, mode: "insensitive" } },
      select: { email: true },
      take: 400,
    });
    const emails = [...new Set(quotes.map((q) => q.email))];
    if (emails.length) or.push({ email: { in: emails } });
    or.push({ email: { contains: parsed.name, mode: "insensitive" } });
  }
  if (or.length === 0) return { id: "__none__" };
  if (or.length === 1) return or[0];
  return { OR: or };
}

async function buildWhere(input: OrdersListQuery): Promise<Prisma.OrderWhereInput> {
  const chip = input.chip ?? "all";
  const date = input.date ?? "all";
  const q = (input.q ?? "").trim();
  const parts: Prisma.OrderWhereInput[] = [];

  const range = resolveCreatedAtRange(date, input.from, input.to);
  if (range && (range.gte || range.lte)) {
    parts.push({ createdAt: range });
  }

  const cw = chipWhere(chip);
  if (cw) parts.push(cw);

  if (q) {
    parts.push({
      OR: [
        { code: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        {
          payments: {
            some: {
              paymentReference: { contains: q, mode: "insensitive" },
            },
          },
        },
      ],
    });
  }

  const companyPart = await companyOrderWhere(input.company ?? "");
  if (companyPart) parts.push(companyPart);

  const minVnd = parseVnd(input.minVnd);
  const maxVnd = parseVnd(input.maxVnd);
  if (minVnd != null || maxVnd != null) {
    parts.push({
      totalVnd: {
        ...(minVnd != null ? { gte: minVnd } : {}),
        ...(maxVnd != null ? { lte: maxVnd } : {}),
      },
    });
  }

  if (input.provider) {
    parts.push({
      payments: { some: { provider: input.provider } },
    });
  }

  const itemAnd: Prisma.OrderItemWhereInput[] = [];
  if (input.brandId) {
    itemAnd.push({ variant: { product: { brandId: input.brandId } } });
  }
  if (input.productId) {
    itemAnd.push({ variant: { productId: input.productId } });
  }
  const types = receiveTypes(input.receive ?? "all");
  if (types) {
    itemAnd.push({ variant: { deliverableType: { in: types } } });
  }
  const motion = input.salesMotion;
  if (motion && motion !== "all") {
    itemAnd.push({ variant: { salesMotion: motion as SalesMotion } });
  }
  if (itemAnd.length === 1) {
    parts.push({ items: { some: itemAnd[0]! } });
  } else if (itemAnd.length > 1) {
    parts.push({ items: { some: { AND: itemAnd } } });
  }

  if (parts.length === 0) return {};
  if (parts.length === 1) return parts[0]!;
  return { AND: parts };
}

export type OrdersSummary = {
  awaitingPayment: number;
  awaitingFulfillment: number;
  needsAction: number;
  completedInRange: number;
  matching: number;
};

export async function queryAdminOrders(input: OrdersListQuery) {
  const pageSize: PageSize = PAGE_SIZES.includes(input.pageSize as PageSize)
    ? (input.pageSize as PageSize)
    : 20;
  const page = Math.max(1, input.page ?? 1);
  const where = await buildWhere(input);

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        items: {
          include: {
            deliveries: {
              orderBy: { createdAt: "asc" },
              take: 1,
              select: { id: true, createdAt: true },
            },
            fulfillmentJobs: {
              orderBy: { createdAt: "desc" },
              take: 1,
              select: { status: true, createdAt: true, startedAt: true },
            },
            variant: {
              select: {
                fulfillmentStrategy: true,
                deliverableType: true,
                salesMotion: true,
                product: {
                  select: {
                    name: true,
                    brand: { select: { name: true } },
                  },
                },
              },
            },
          },
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            status: true,
            paymentReference: true,
            expiresAt: true,
            provider: true,
            succeededAt: true,
          },
        },
        fulfillmentJobs: {
          where: {
            status: { in: ["WAITING_HUMAN", "WAITING_STOCK", "FAILED"] },
          },
          take: 1,
          select: { id: true },
        },
      },
    }),
  ]);

  const now = Date.now();
  const rows: AdminOrderListRow[] = orders.map((o) => {
    const payment = o.payments[0];
    const first = o.items[0];
    const firstDelivery =
      o.items.flatMap((i) => i.deliveries).sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      )[0] ?? null;
    const hasDelivery = o.items.some((i) => i.deliveries.length > 0);
    const job = first?.fulfillmentJobs[0];
    const jobStatus = job?.status ?? null;
    const deliverableType = first?.variant.deliverableType ?? null;
    const paymentExpired =
      payment?.status === "EXPIRED" ||
      (o.status === "PENDING_PAYMENT" &&
        payment?.expiresAt != null &&
        payment.expiresAt.getTime() < now);

    const fulfillmentAt =
      job?.startedAt ?? job?.createdAt ?? (o.status === "FULFILLING" || o.status === "PAID" ? o.paidAt : null);

    return {
      id: o.id,
      code: o.code,
      email: o.email,
      userId: o.userId,
      status: o.status,
      totalVnd: o.totalVnd,
      createdAt: o.createdAt,
      itemTitles: o.items.map((i) => i.title),
      itemCount: o.items.reduce((n, i) => n + i.quantity, 0),
      brandName: first?.variant.product.brand.name ?? null,
      productName: first?.variant.product.name ?? null,
      strategy: first?.variant.fulfillmentStrategy ?? null,
      deliverableType,
      receiveLabel: deliverableType
        ? receiveFromDeliverable(deliverableType).label
        : "—",
      salesMotion: first?.variant.salesMotion ?? null,
      paymentStatus: payment?.status ?? null,
      paymentReference: payment?.paymentReference ?? null,
      paymentProvider: payment?.provider ?? null,
      paymentExpired,
      hasDelivery,
      primaryDeliveryId: firstDelivery?.id ?? null,
      jobStatus,
      waitingInbox: o.fulfillmentJobs.length > 0,
      timeline: {
        createdAt: o.createdAt,
        paidAt: payment?.succeededAt ?? o.paidAt,
        fulfillmentAt,
        deliveredAt: firstDelivery?.createdAt ?? o.completedAt,
      },
      companyLabel: "",
    };
  });

  return {
    rows: await attachCompanyLabels(rows),
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  };
}

async function attachCompanyLabels(
  rows: AdminOrderListRow[],
): Promise<AdminOrderListRow[]> {
  const emails = [...new Set(rows.map((r) => r.email))];
  if (emails.length === 0) return rows;
  const quotes = await prisma.quoteRequest.findMany({
    where: { email: { in: emails } },
    orderBy: { createdAt: "desc" },
    select: { email: true, companyName: true },
  });
  const byEmail = new Map<string, string>();
  for (const q of quotes) {
    const key = q.email.toLowerCase();
    const name = q.companyName.trim();
    if (!byEmail.has(key) && name) byEmail.set(key, name);
  }
  return rows.map((r) => ({
    ...r,
    companyLabel:
      byEmail.get(r.email.toLowerCase()) ?? emailDomain(r.email) ?? "—",
  }));
}

/** KPI respects date + search + brand/product/receive/provider/…; ignores status chip. */
export async function queryOrdersSummary(
  input: Omit<OrdersListQuery, "chip" | "page" | "pageSize">,
) {
  const base = await buildWhere({ ...input, chip: "all" });
  const range = resolveCreatedAtRange(
    input.date ?? "all",
    input.from,
    input.to,
  );

  const completedWhere: Prisma.OrderWhereInput = {
    AND: [
      base,
      { status: "COMPLETED" },
      range?.gte || range?.lte
        ? {
            OR: [
              { completedAt: range },
              { completedAt: null, createdAt: range },
            ],
          }
        : {},
    ],
  };

  const [awaitingPayment, awaitingFulfillment, needsAction, completedInRange, matching] =
    await Promise.all([
      prisma.order.count({
        where: { AND: [base, { status: "PENDING_PAYMENT" }] },
      }),
      prisma.order.count({
        where: { AND: [base, chipWhere("awaiting_fulfillment") ?? {}] },
      }),
      prisma.order.count({
        where: { AND: [base, chipWhere("needs_action") ?? {}] },
      }),
      prisma.order.count({ where: completedWhere }),
      prisma.order.count({ where: base }),
    ]);

  return {
    awaitingPayment,
    awaitingFulfillment,
    needsAction,
    completedInRange,
    matching,
  } satisfies OrdersSummary;
}

export async function loadOrderFilterOptions() {
  const [brands, products, providerRows, recentEmails, quoteNames] =
    await Promise.all([
      prisma.brand.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      }),
      prisma.product.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, brandId: true },
      }),
      prisma.payment.findMany({
        distinct: ["provider"],
        select: { provider: true },
        orderBy: { provider: "asc" },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 800,
        select: { email: true },
      }),
      prisma.quoteRequest.groupBy({
        by: ["companyName"],
        _count: { companyName: true },
        orderBy: { _count: { companyName: "desc" } },
        take: 12,
      }),
    ]);

  const domainCount = new Map<string, number>();
  for (const row of recentEmails) {
    const d = emailDomain(row.email);
    if (!d || isConsumerEmailDomain(d)) continue;
    domainCount.set(d, (domainCount.get(d) ?? 0) + 1);
  }
  const companies: { label: string; value: string }[] = [
    ...[...domainCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([domain, n]) => ({
        label: `${domain} (${n})`,
        value: domain,
      })),
  ];
  const seen = new Set(companies.map((c) => c.value.toLowerCase()));
  for (const q of quoteNames) {
    const name = q.companyName.trim();
    if (!name || name.length < 2) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    companies.push({
      label: `${name} (${q._count.companyName})`,
      value: name,
    });
  }

  return {
    brands,
    products,
    providers: providerRows.map((p) => p.provider).filter(Boolean),
    companies: companies.slice(0, 18),
  };
}

export function parseOrdersSearchParams(
  sp: Record<string, string | string[] | undefined>,
): OrdersListQuery {
  const one = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const chipRaw = one("chip") ?? "all";
  const chips: OrdersFilterChip[] = [
    "all",
    "awaiting_payment",
    "awaiting_fulfillment",
    "fulfilling",
    "needs_action",
    "completed",
    "cancelled",
  ];
  const dateRaw = one("date") ?? "all";
  const dates: DatePreset[] = [
    "all",
    "today",
    "yesterday",
    "last7",
    "last30",
    "thisMonth",
    "lastMonth",
    "custom",
  ];
  const receiveRaw = one("receive") ?? "all";
  const receives: ReceiveFilter[] = ["all", "key", "account", "activation"];
  const motionRaw = one("salesMotion") ?? "all";
  const motions: SalesMotionFilter[] = ["all", "SELF_SERVE", "QUOTE_REQUIRED"];
  const pageSizeRaw = Number(one("pageSize") ?? 20);
  const pageSize = PAGE_SIZES.includes(pageSizeRaw as PageSize)
    ? (pageSizeRaw as PageSize)
    : 20;

  return {
    q: one("q") ?? "",
    chip: chips.includes(chipRaw as OrdersFilterChip)
      ? (chipRaw as OrdersFilterChip)
      : "all",
    date: dates.includes(dateRaw as DatePreset)
      ? (dateRaw as DatePreset)
      : "all",
    from: one("from") ?? "",
    to: one("to") ?? "",
    brandId: one("brandId") ?? "",
    productId: one("productId") ?? "",
    receive: receives.includes(receiveRaw as ReceiveFilter)
      ? (receiveRaw as ReceiveFilter)
      : "all",
    provider: one("provider") ?? "",
    salesMotion: motions.includes(motionRaw as SalesMotionFilter)
      ? (motionRaw as SalesMotionFilter)
      : "all",
    minVnd: one("minVnd") ?? "",
    maxVnd: one("maxVnd") ?? "",
    company: one("company") ?? "",
    page: Math.max(1, Number(one("page") ?? 1) || 1),
    pageSize,
  };
}
