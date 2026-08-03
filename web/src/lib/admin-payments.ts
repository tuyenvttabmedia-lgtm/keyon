import { formatOrderAge } from "@/lib/admin-orders";

export type PaymentStatusFilter =
  | "all"
  | "SUCCEEDED"
  | "AWAITING"
  | "FAILED"
  | "needs_review";

export type PaymentsListQuery = {
  q?: string;
  status?: PaymentStatusFilter;
  provider?: string;
  from?: string;
  to?: string;
  minVnd?: string;
  maxVnd?: string;
};

/** Soft ops hint — not a DB reconcile enum */
export type ReconcileHint = "matched" | "pending" | "needs_review" | "mismatch" | "failed";

export type AdminPaymentListRow = {
  id: string;
  paymentReference: string;
  provider: string;
  status: string;
  amountVnd: number;
  createdAt: string;
  succeededAt: string | null;
  expiresAt: string | null;
  providerTransactionId: string | null;
  providerEventId: string | null;
  providerPaidAt: string | null;
  orderId: string;
  orderCode: string;
  orderStatus: string;
  customerEmail: string;
  customerId: string | null;
  customerName: string | null;
  ageLabel: string;
  reconcileHint: ReconcileHint;
  rawTransferAmount: number | null;
  rawGateway: string | null;
  /** Soft PL5: deliveries attached to order items */
  deliveryCount: number;
  fulfillmentStatuses: string;
};

export type PaymentsKpi = {
  paid: number;
  awaiting: number;
  failed: number;
  needsReview: number;
};

export function parsePaymentsSearchParams(
  sp: Record<string, string | string[] | undefined>,
): PaymentsListQuery {
  const one = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const statusRaw = one("status") ?? "all";
  const statuses: PaymentStatusFilter[] = [
    "all",
    "SUCCEEDED",
    "AWAITING",
    "FAILED",
    "needs_review",
  ];
  return {
    q: one("q") ?? "",
    status: statuses.includes(statusRaw as PaymentStatusFilter)
      ? (statusRaw as PaymentStatusFilter)
      : "all",
    provider: one("provider") ?? "",
    from: one("from") ?? "",
    to: one("to") ?? "",
    minVnd: one("minVnd") ?? "",
    maxVnd: one("maxVnd") ?? "",
  };
}

export function parseVndBound(s: string | undefined): number | null {
  if (!s || !/^\d+$/.test(s.trim())) return null;
  const n = Number(s.trim());
  return Number.isFinite(n) && n >= 0 ? n : null;
}

const REVIEW_MS = 30 * 60 * 1000;

export function deriveReconcileHint(input: {
  status: string;
  createdAt: Date | string;
  providerTransactionId: string | null;
  providerEventId: string | null;
  amountVnd: number;
  rawTransferAmount: number | null;
  now?: number;
}): ReconcileHint {
  const now = input.now ?? Date.now();
  const created =
    typeof input.createdAt === "string"
      ? new Date(input.createdAt).getTime()
      : input.createdAt.getTime();
  const age = Math.max(0, now - created);

  if (
    input.status === "FAILED" ||
    input.status === "EXPIRED" ||
    input.status === "CANCELLED"
  ) {
    return "failed";
  }

  if (
    input.status === "SUCCEEDED" &&
    input.rawTransferAmount != null &&
    input.rawTransferAmount !== input.amountVnd
  ) {
    return "mismatch";
  }

  if (input.status === "SUCCEEDED") {
    if (input.providerTransactionId || input.providerEventId) return "matched";
    return "needs_review";
  }

  if (input.status === "AWAITING" || input.status === "CREATED") {
    if (age >= REVIEW_MS) return "needs_review";
    return "pending";
  }

  return "pending";
}

export function reconcileHintLabel(h: ReconcileHint): string {
  switch (h) {
    case "matched":
      return "Đã đối soát";
    case "needs_review":
      return "Cần đối soát";
    case "mismatch":
      return "Lệch";
    case "failed":
      return "Thất bại";
    default:
      return "Chưa đối soát";
  }
}

export function paymentAgeLabel(createdAt: string | Date, now = Date.now()) {
  return formatOrderAge(createdAt, now);
}

export function extractRawHints(raw: unknown): {
  transferAmount: number | null;
  gateway: string | null;
} {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { transferAmount: null, gateway: null };
  }
  const o = raw as Record<string, unknown>;
  const amount =
    typeof o.transferAmount === "number"
      ? o.transferAmount
      : typeof o.amount === "number"
        ? o.amount
        : null;
  const gateway =
    o.gateway != null
      ? String(o.gateway)
      : o.bank != null
        ? String(o.bank)
        : null;
  return { transferAmount: amount, gateway };
}
