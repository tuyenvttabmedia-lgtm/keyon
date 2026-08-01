import type {
  FulfillmentJobStatus,
  OrderStatus,
  PaymentStatus,
} from "@prisma/client";

export type StatusTone = "success" | "warning" | "info" | "danger" | "muted";

export type CustomerStatus = {
  label: string;
  tone: StatusTone;
};

/** Payment status for customer UI — never raw enum alone as primary copy */
export function paymentStatusForCustomer(
  payment: PaymentStatus | null | undefined,
  orderStatus: OrderStatus,
): CustomerStatus {
  if (payment === "SUCCEEDED" || orderStatus === "PAID" || orderStatus === "FULFILLING" || orderStatus === "COMPLETED") {
    return { label: "Đã thanh toán", tone: "success" };
  }
  if (payment === "EXPIRED" || orderStatus === "PAYMENT_FAILED") {
    return { label: "Hết hạn / thất bại", tone: "danger" };
  }
  if (payment === "FAILED" || payment === "CANCELLED" || orderStatus === "CANCELLED") {
    return { label: "Đã hủy", tone: "danger" };
  }
  if (payment === "AWAITING" || payment === "CREATED" || orderStatus === "PENDING_PAYMENT") {
    return { label: "Chờ thanh toán", tone: "warning" };
  }
  return { label: "Chờ thanh toán", tone: "warning" };
}

/** Fulfillment / delivery for customer — PAID ≠ delivered */
export function fulfillmentStatusForCustomer(input: {
  orderStatus: OrderStatus;
  hasDelivery: boolean;
  jobStatus?: FulfillmentJobStatus | null;
}): CustomerStatus {
  if (input.hasDelivery || input.orderStatus === "COMPLETED") {
    return { label: "Đã giao", tone: "success" };
  }
  if (input.orderStatus === "CANCELLED" || input.orderStatus === "PAYMENT_FAILED") {
    return { label: "Không giao", tone: "muted" };
  }
  if (
    input.orderStatus === "PENDING_PAYMENT" ||
    input.orderStatus === "DRAFT"
  ) {
    return { label: "Chưa xử lý", tone: "muted" };
  }
  if (
    input.jobStatus === "WAITING_HUMAN" ||
    input.jobStatus === "WAITING_STOCK" ||
    input.jobStatus === "PROCESSING" ||
    input.jobStatus === "QUEUED" ||
    input.jobStatus === "RESERVED" ||
    input.orderStatus === "FULFILLING" ||
    input.orderStatus === "PAID"
  ) {
    return { label: "Đang giao", tone: "info" };
  }
  return { label: "Chưa xử lý", tone: "muted" };
}

export function statusBadgeClass(tone: StatusTone): string {
  switch (tone) {
    case "success":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "warning":
    case "info":
      // Pending — yellow (info mapped to pending for ops consistency)
      return "bg-amber-50 text-amber-800 ring-1 ring-amber-200";
    case "danger":
      return "bg-red-50 text-red-700 ring-1 ring-red-200";
    default:
      return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  }
}
