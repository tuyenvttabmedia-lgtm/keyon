import type { FulfillmentJobStatus, OrderStatus, PaymentStatus } from "@prisma/client";
import {
  fulfillmentStatusForCustomer,
  paymentStatusForCustomer,
  type CustomerStatus,
} from "@/storefront/lib/order-status";

export type OrderTimelineStep = {
  id: string;
  title: string;
  at: Date | null;
  detail?: string;
  /** done | current | pending */
  state: "done" | "current" | "pending";
};

/** Customer-facing order timeline (mockup 5 steps). */
export function buildCustomerOrderTimeline(input: {
  createdAt: Date;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus | null | undefined;
  paymentSucceededAt: Date | null | undefined;
  hasDelivery: boolean;
  deliveredAt: Date | null | undefined;
  jobStatus?: FulfillmentJobStatus | null;
}): OrderTimelineStep[] {
  const paid =
    input.paymentStatus === "SUCCEEDED" ||
    input.orderStatus === "PAID" ||
    input.orderStatus === "FULFILLING" ||
    input.orderStatus === "COMPLETED";
  const awaitingPay =
    !paid &&
    (input.paymentStatus === "AWAITING" ||
      input.paymentStatus === "CREATED" ||
      input.orderStatus === "PENDING_PAYMENT");
  const delivered = input.hasDelivery || input.orderStatus === "COMPLETED";
  const completed = input.orderStatus === "COMPLETED";

  const steps: OrderTimelineStep[] = [
    {
      id: "created",
      title: "Tạo đơn",
      at: input.createdAt,
      detail: "Đơn hàng được khởi tạo",
      state: "done",
    },
    {
      id: "awaiting",
      title: "Chờ thanh toán",
      at: paid || awaitingPay ? input.createdAt : null,
      detail: "Chờ khách hoàn tất thanh toán",
      state: paid ? "done" : awaitingPay ? "current" : "pending",
    },
    {
      id: "paid",
      title: "Đã thanh toán",
      at: input.paymentSucceededAt ?? (paid ? input.createdAt : null),
      detail: "Thanh toán thành công",
      state: paid ? (delivered ? "done" : "current") : "pending",
    },
    {
      id: "delivered",
      title: "Đã giao",
      at: input.deliveredAt ?? null,
      detail: delivered
        ? "Đơn hàng đã được giao"
        : input.jobStatus
          ? "Đang xử lý giao hàng"
          : "Chờ giao license",
      state: delivered ? (completed ? "done" : "current") : paid ? "current" : "pending",
    },
    {
      id: "done",
      title: "Hoàn tất",
      at: completed ? input.deliveredAt ?? input.paymentSucceededAt ?? null : null,
      detail: "Đơn hàng hoàn tất",
      state: completed ? "done" : "pending",
    },
  ];

  // Only one current: prefer later current
  let sawCurrent = false;
  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i]!.state === "current") {
      if (sawCurrent) steps[i]!.state = "done";
      else sawCurrent = true;
    }
  }

  return steps;
}

export function dualPaymentFulfillment(input: {
  paymentStatus: PaymentStatus | null | undefined;
  orderStatus: OrderStatus;
  hasDelivery: boolean;
  jobStatus?: FulfillmentJobStatus | null;
}): { payment: CustomerStatus; fulfillment: CustomerStatus } {
  return {
    payment: paymentStatusForCustomer(input.paymentStatus, input.orderStatus),
    fulfillment: fulfillmentStatusForCustomer({
      orderStatus: input.orderStatus,
      hasDelivery: input.hasDelivery,
      jobStatus: input.jobStatus,
    }),
  };
}
