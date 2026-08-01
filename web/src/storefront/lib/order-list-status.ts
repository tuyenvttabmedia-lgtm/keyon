import type { OrderStatus, PaymentStatus } from "@prisma/client";
import type { AccountCopy } from "@/storefront/lib/account-cms";

export type OrderListTabKey = "success" | "processing" | "cancelled";
export type OrderListStatusTone = "success" | "warning" | "danger" | "muted";

/**
 * Single customer-facing status for list / overview UI.
 * Keeps payment ≠ fulfillment internally via tab rules.
 */
export function orderListStatus(
  orderStatus: OrderStatus,
  payment: PaymentStatus | null | undefined,
  hasDelivery: boolean,
  cms: Pick<
    AccountCopy,
    | "ordersStatusCancelled"
    | "ordersStatusCancelledSub"
    | "ordersStatusSuccess"
    | "ordersStatusSuccessSub"
    | "ordersStatusPendingPay"
    | "ordersStatusPendingPaySub"
    | "ordersStatusProcessing"
    | "ordersStatusProcessingSub"
  >,
): {
  tab: OrderListTabKey;
  statusLabel: string;
  statusSub: string;
  statusTone: OrderListStatusTone;
  countsAsSpend: boolean;
} {
  if (
    orderStatus === "CANCELLED" ||
    orderStatus === "PAYMENT_FAILED" ||
    payment === "FAILED" ||
    payment === "CANCELLED" ||
    payment === "EXPIRED"
  ) {
    return {
      tab: "cancelled",
      statusLabel: cms.ordersStatusCancelled,
      statusSub: cms.ordersStatusCancelledSub,
      statusTone: "danger",
      countsAsSpend: false,
    };
  }

  if (
    hasDelivery ||
    orderStatus === "COMPLETED" ||
    (payment === "SUCCEEDED" && orderStatus === "FULFILLING")
  ) {
    const done = hasDelivery || orderStatus === "COMPLETED";
    if (done) {
      return {
        tab: "success",
        statusLabel: cms.ordersStatusSuccess,
        statusSub: cms.ordersStatusSuccessSub,
        statusTone: "success",
        countsAsSpend: true,
      };
    }
  }

  if (
    orderStatus === "PENDING_PAYMENT" ||
    orderStatus === "DRAFT" ||
    payment === "AWAITING" ||
    payment === "CREATED" ||
    !payment
  ) {
    return {
      tab: "processing",
      statusLabel: cms.ordersStatusPendingPay,
      statusSub: cms.ordersStatusPendingPaySub,
      statusTone: "warning",
      countsAsSpend: false,
    };
  }

  if (
    orderStatus === "PAID" ||
    orderStatus === "FULFILLING" ||
    payment === "SUCCEEDED"
  ) {
    return {
      tab: "processing",
      statusLabel: cms.ordersStatusProcessing,
      statusSub: cms.ordersStatusProcessingSub,
      statusTone: "warning",
      countsAsSpend: true,
    };
  }

  return {
    tab: "processing",
    statusLabel: cms.ordersStatusProcessing,
    statusSub: cms.ordersStatusProcessingSub,
    statusTone: "muted",
    countsAsSpend: false,
  };
}
