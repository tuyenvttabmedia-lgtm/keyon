import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  deriveReconcileHint,
  extractRawHints,
  parseVndBound,
  paymentAgeLabel,
  type AdminPaymentListRow,
  type PaymentsKpi,
  type PaymentsListQuery,
} from "@/lib/admin-payments";

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

function buildWhere(input: PaymentsListQuery): Prisma.PaymentWhereInput {
  const parts: Prisma.PaymentWhereInput[] = [];
  const q = (input.q ?? "").trim();

  if (q) {
    parts.push({
      OR: [
        { paymentReference: { contains: q, mode: "insensitive" } },
        { providerTransactionId: { contains: q, mode: "insensitive" } },
        { providerEventId: { contains: q, mode: "insensitive" } },
        { orderId: { contains: q, mode: "insensitive" } },
        { order: { code: { contains: q, mode: "insensitive" } } },
        { order: { email: { contains: q, mode: "insensitive" } } },
        {
          order: {
            user: { name: { contains: q, mode: "insensitive" } },
          },
        },
      ],
    });
  }

  if (input.provider) {
    parts.push({ provider: input.provider });
  }

  const status = input.status ?? "all";
  if (status === "SUCCEEDED") {
    parts.push({ status: "SUCCEEDED" });
  } else if (status === "AWAITING") {
    parts.push({ status: { in: ["CREATED", "AWAITING"] } });
  } else if (status === "FAILED") {
    parts.push({ status: { in: ["FAILED", "EXPIRED", "CANCELLED"] } });
  }
  // needs_review filtered in memory after map

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

  const minVnd = parseVndBound(input.minVnd);
  const maxVnd = parseVndBound(input.maxVnd);
  if (minVnd != null || maxVnd != null) {
    parts.push({
      amountVnd: {
        ...(minVnd != null ? { gte: minVnd } : {}),
        ...(maxVnd != null ? { lte: maxVnd } : {}),
      },
    });
  }

  if (parts.length === 0) return {};
  if (parts.length === 1) return parts[0]!;
  return { AND: parts };
}

function toRow(
  p: {
    id: string;
    paymentReference: string;
    provider: string;
    status: string;
    amountVnd: number;
    createdAt: Date;
    succeededAt: Date | null;
    expiresAt: Date | null;
    providerTransactionId: string | null;
    providerEventId: string | null;
    providerPaidAt: Date | null;
    rawPayload: unknown;
    orderId: string;
    order: {
      code: string;
      status: string;
      email: string;
      userId: string | null;
      user: { id: string; name: string | null } | null;
    };
  },
  now: number,
): AdminPaymentListRow {
  const raw = extractRawHints(p.rawPayload);
  const reconcileHint = deriveReconcileHint({
    status: p.status,
    createdAt: p.createdAt,
    providerTransactionId: p.providerTransactionId,
    providerEventId: p.providerEventId,
    amountVnd: p.amountVnd,
    rawTransferAmount: raw.transferAmount,
    now,
  });

  return {
    id: p.id,
    paymentReference: p.paymentReference,
    provider: p.provider,
    status: p.status,
    amountVnd: p.amountVnd,
    createdAt: p.createdAt.toISOString(),
    succeededAt: p.succeededAt?.toISOString() ?? null,
    expiresAt: p.expiresAt?.toISOString() ?? null,
    providerTransactionId: p.providerTransactionId,
    providerEventId: p.providerEventId,
    providerPaidAt: p.providerPaidAt?.toISOString() ?? null,
    orderId: p.orderId,
    orderCode: p.order.code,
    orderStatus: p.order.status,
    customerEmail: p.order.email,
    customerId: p.order.userId ?? p.order.user?.id ?? null,
    customerName: p.order.user?.name ?? null,
    ageLabel: paymentAgeLabel(p.createdAt, now),
    reconcileHint,
    rawTransferAmount: raw.transferAmount,
    rawGateway: raw.gateway,
  };
}

export async function queryAdminPayments(input: PaymentsListQuery): Promise<{
  rows: AdminPaymentListRow[];
  totalMatched: number;
  providers: string[];
  kpi: PaymentsKpi;
}> {
  const now = Date.now();
  const where = buildWhere(input);

  const [raw, providerRows, paid, awaiting, failed] = await Promise.all([
    prisma.payment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        order: {
          select: {
            code: true,
            status: true,
            email: true,
            userId: true,
            user: { select: { id: true, name: true } },
          },
        },
      },
    }),
    prisma.payment.findMany({
      distinct: ["provider"],
      select: { provider: true },
      orderBy: { provider: "asc" },
    }),
    prisma.payment.count({
      where: { AND: [buildWhere({ ...input, status: "all" }), { status: "SUCCEEDED" }] },
    }),
    prisma.payment.count({
      where: {
        AND: [
          buildWhere({ ...input, status: "all" }),
          { status: { in: ["CREATED", "AWAITING"] } },
        ],
      },
    }),
    prisma.payment.count({
      where: {
        AND: [
          buildWhere({ ...input, status: "all" }),
          { status: { in: ["FAILED", "EXPIRED", "CANCELLED"] } },
        ],
      },
    }),
  ]);

  let rows = raw.map((p) => toRow(p, now));

  // needs_review KPI from a broader recent set
  const reviewSample = await prisma.payment.findMany({
    where: buildWhere({ ...input, status: "all" }),
    orderBy: { createdAt: "desc" },
    take: 300,
    include: {
      order: {
        select: {
          code: true,
          status: true,
          email: true,
          userId: true,
          user: { select: { id: true, name: true } },
        },
      },
    },
  });
  const needsReview = reviewSample
    .map((p) => toRow(p, now))
    .filter((r) => r.reconcileHint === "needs_review" || r.reconcileHint === "mismatch")
    .length;

  if (input.status === "needs_review") {
    rows = rows.filter(
      (r) => r.reconcileHint === "needs_review" || r.reconcileHint === "mismatch",
    );
  }

  const totalMatched = rows.length;
  return {
    rows: rows.slice(0, 100),
    totalMatched,
    providers: providerRows.map((p) => p.provider).filter(Boolean),
    kpi: { paid, awaiting, failed, needsReview },
  };
}
