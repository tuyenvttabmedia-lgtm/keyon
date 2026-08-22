import "server-only";

import type { Prisma, QuoteRequestStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  QUOTE_REQUEST_STATUSES,
  type AdminQuoteRequestListRow,
  type QuoteRequestsKpi,
  type QuoteRequestsListQuery,
} from "@/lib/admin-quote-requests";

const LIST_LIMIT = 300;

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

function productSummary(raw: unknown): string {
  if (!Array.isArray(raw) || raw.length === 0) return "—";
  const names = raw
    .map((p) => {
      if (p && typeof p === "object" && "name" in p) {
        const name = (p as { name?: unknown }).name;
        return typeof name === "string" ? name.trim() : "";
      }
      return "";
    })
    .filter(Boolean);
  if (names.length === 0) return "—";
  if (names.length <= 2) return names.join(", ");
  return `${names.slice(0, 2).join(", ")} +${names.length - 2}`;
}

function buildWhere(input: QuoteRequestsListQuery): Prisma.QuoteRequestWhereInput {
  const parts: Prisma.QuoteRequestWhereInput[] = [];
  const q = (input.q ?? "").trim();

  if (q) {
    parts.push({
      OR: [
        { referenceCode: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { companyName: { contains: q, mode: "insensitive" } },
        { fullName: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
      ],
    });
  }

  const status = input.status ?? "all";
  if (status !== "all") {
    parts.push({ status });
  }

  const requestType = (input.requestType ?? "").trim();
  if (requestType) {
    parts.push({ requestType });
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

  if (parts.length === 0) return {};
  if (parts.length === 1) return parts[0]!;
  return { AND: parts };
}

async function countKpi(
  base: Prisma.QuoteRequestWhereInput,
): Promise<QuoteRequestsKpi> {
  const groups = await prisma.quoteRequest.groupBy({
    by: ["status"],
    where: base,
    _count: { _all: true },
  });
  const kpi = {
    total: 0,
    NEW: 0,
    IN_REVIEW: 0,
    QUOTED: 0,
    CLOSED: 0,
    SPAM: 0,
  } satisfies QuoteRequestsKpi;

  for (const row of groups) {
    const n = row._count._all;
    kpi.total += n;
    if (QUOTE_REQUEST_STATUSES.includes(row.status)) {
      kpi[row.status as QuoteRequestStatus] = n;
    }
  }
  return kpi;
}

export async function queryAdminQuoteRequests(
  input: QuoteRequestsListQuery,
): Promise<{
  rows: AdminQuoteRequestListRow[];
  totalMatched: number;
  kpi: QuoteRequestsKpi;
  requestTypes: string[];
}> {
  const where = buildWhere(input);
  const dateOnlyWhere = buildWhere({
    ...input,
    status: "all",
    q: "",
    requestType: "",
  });

  const [rows, totalMatched, kpi, typeRows] = await Promise.all([
    prisma.quoteRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: LIST_LIMIT,
      select: {
        id: true,
        referenceCode: true,
        status: true,
        requestType: true,
        fullName: true,
        email: true,
        phone: true,
        companyName: true,
        estimatedUsers: true,
        licenseType: true,
        term: true,
        interestedProducts: true,
        createdAt: true,
      },
    }),
    prisma.quoteRequest.count({ where }),
    countKpi(dateOnlyWhere),
    prisma.quoteRequest.groupBy({
      by: ["requestType"],
      orderBy: { requestType: "asc" },
      _count: { _all: true },
    }),
  ]);

  return {
    rows: rows.map((r) => ({
      id: r.id,
      referenceCode: r.referenceCode,
      status: r.status,
      requestType: r.requestType,
      fullName: r.fullName,
      email: r.email,
      phone: r.phone,
      companyName: r.companyName,
      estimatedUsers: r.estimatedUsers,
      licenseType: r.licenseType,
      term: r.term,
      createdAt: r.createdAt.toISOString(),
      productSummary: productSummary(r.interestedProducts),
    })),
    totalMatched,
    kpi,
    requestTypes: typeRows.map((t) => t.requestType).filter(Boolean),
  };
}
