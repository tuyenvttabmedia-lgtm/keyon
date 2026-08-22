import type { QuoteRequestStatus } from "@prisma/client";

export const QUOTE_REQUEST_STATUSES = [
  "NEW",
  "IN_REVIEW",
  "QUOTED",
  "CLOSED",
  "SPAM",
] as const satisfies readonly QuoteRequestStatus[];

export type QuoteRequestStatusFilter =
  | "all"
  | (typeof QUOTE_REQUEST_STATUSES)[number];

export const QUOTE_REQUEST_STATUS_LABEL: Record<
  (typeof QUOTE_REQUEST_STATUSES)[number],
  string
> = {
  NEW: "Mới",
  IN_REVIEW: "Đang xử lý",
  QUOTED: "Đã báo giá",
  CLOSED: "Đóng",
  SPAM: "Spam",
};

export const QUOTE_REQUEST_TYPE_LABEL: Record<string, string> = {
  GENERAL: "Báo giá chung",
  VOLUME_LICENSING: "Volume licensing",
  SUBSCRIPTION: "Subscription",
  LICENSING_CONSULTING: "Tư vấn licensing",
  IMPLEMENTATION: "Triển khai",
};

export function quoteRequestTypeLabel(raw: string): string {
  const key = raw.trim().toUpperCase();
  return QUOTE_REQUEST_TYPE_LABEL[key] ?? (raw || "—");
}

export type QuoteRequestsListQuery = {
  q?: string;
  status?: QuoteRequestStatusFilter;
  requestType?: string;
  from?: string;
  to?: string;
};

export type AdminQuoteRequestListRow = {
  id: string;
  referenceCode: string;
  status: QuoteRequestStatus;
  requestType: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  estimatedUsers: string;
  licenseType: string;
  term: string;
  createdAt: string;
  productSummary: string;
  assigneeLabel: string | null;
};

export type QuoteRequestsKpi = Record<
  (typeof QUOTE_REQUEST_STATUSES)[number],
  number
> & { total: number };

export function parseQuoteRequestsSearchParams(
  sp: Record<string, string | string[] | undefined>,
): QuoteRequestsListQuery {
  const one = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const status = one("status") ?? "all";
  const statuses: QuoteRequestStatusFilter[] = ["all", ...QUOTE_REQUEST_STATUSES];

  return {
    q: one("q") ?? "",
    status: statuses.includes(status as QuoteRequestStatusFilter)
      ? (status as QuoteRequestStatusFilter)
      : "all",
    requestType: one("requestType") ?? "",
    from: one("from") ?? "",
    to: one("to") ?? "",
  };
}

export function quoteStatusTone(status: QuoteRequestStatus): {
  bg: string;
  text: string;
} {
  switch (status) {
    case "NEW":
      return { bg: "bg-sky-50", text: "text-sky-800" };
    case "IN_REVIEW":
      return { bg: "bg-amber-50", text: "text-amber-900" };
    case "QUOTED":
      return { bg: "bg-emerald-50", text: "text-emerald-800" };
    case "CLOSED":
      return { bg: "bg-slate-100", text: "text-slate-700" };
    case "SPAM":
      return { bg: "bg-red-50", text: "text-red-700" };
    default:
      return { bg: "bg-navy-soft", text: "text-navy" };
  }
}
