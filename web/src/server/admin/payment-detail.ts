import "server-only";

import { prisma } from "@/lib/db";
import {
  deriveReconcileHint,
  extractRawHints,
  paymentAgeLabel,
  reconcileHintLabel,
  type ReconcileHint,
} from "@/lib/admin-payments";

export type PaymentTimelineItem = {
  at: string;
  title: string;
  detail?: string;
  tone?: "default" | "success" | "warn" | "danger";
};

export type PaymentWorkspaceData = {
  payment: {
    id: string;
    paymentReference: string;
    provider: string;
    status: string;
    amountVnd: number;
    currency: string;
    createdAt: string;
    succeededAt: string | null;
    expiresAt: string | null;
    providerReference: string | null;
    providerTransactionId: string | null;
    providerEventId: string | null;
    providerPaidAt: string | null;
    ageLabel: string;
    reconcileHint: ReconcileHint;
    reconcileLabel: string;
    rawTransferAmount: number | null;
    rawGateway: string | null;
    rawPayload: unknown;
  };
  order: {
    id: string;
    code: string;
    status: string;
    email: string;
    totalVnd: number;
    createdAt: string;
    paidAt: string | null;
    completedAt: string | null;
  };
  customer: {
    id: string | null;
    email: string;
    name: string | null;
  };
  webhooks: {
    id: string;
    providerEventId: string;
    provider: string;
    createdAt: string;
  }[];
  timeline: PaymentTimelineItem[];
};

export async function loadPaymentWorkspace(
  id: string,
): Promise<PaymentWorkspaceData | null> {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          user: { select: { id: true, name: true, email: true } },
          fulfillmentJobs: { orderBy: { createdAt: "asc" }, take: 10 },
        },
      },
      events: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!payment) return null;

  const webhooks = await prisma.paymentWebhookReceipt
    .findMany({
      where: { paymentReference: payment.paymentReference },
      orderBy: { createdAt: "asc" },
      take: 20,
      select: {
        id: true,
        providerEventId: true,
        provider: true,
        createdAt: true,
      },
    })
    .catch(() => []);

  const raw = extractRawHints(payment.rawPayload);
  const now = Date.now();
  const reconcileHint = deriveReconcileHint({
    status: payment.status,
    createdAt: payment.createdAt,
    providerTransactionId: payment.providerTransactionId,
    providerEventId: payment.providerEventId,
    amountVnd: payment.amountVnd,
    rawTransferAmount: raw.transferAmount,
    now,
  });

  const timeline: PaymentTimelineItem[] = [];
  timeline.push({
    at: payment.createdAt.toISOString(),
    title: "Create",
    detail: payment.paymentReference,
  });

  for (const ev of payment.events) {
    const title =
      ev.type === "CREATED"
        ? "QR / Created"
        : ev.type === "SUCCEEDED"
          ? "Paid"
          : ev.type;
    timeline.push({
      at: ev.createdAt.toISOString(),
      title,
      detail: ev.reason ?? undefined,
      tone:
        ev.type === "SUCCEEDED"
          ? "success"
          : ev.type === "FAILED" || ev.type === "CANCELLED"
            ? "danger"
            : ev.type === "EXPIRED"
              ? "warn"
              : "default",
    });
  }

  if (payment.succeededAt) {
    timeline.push({
      at: payment.succeededAt.toISOString(),
      title: "Paid",
      detail: `${payment.amountVnd.toLocaleString("vi-VN")} đ`,
      tone: "success",
    });
  }

  for (const w of webhooks) {
    timeline.push({
      at: w.createdAt.toISOString(),
      title: "Webhook",
      detail: w.providerEventId,
      tone: "success",
    });
  }

  for (const job of payment.order.fulfillmentJobs) {
    timeline.push({
      at: job.createdAt.toISOString(),
      title: "Fulfillment",
      detail: `${job.strategy} · ${job.status}`,
      tone:
        job.status === "SUCCEEDED"
          ? "success"
          : job.status === "FAILED"
            ? "danger"
            : "default",
    });
  }

  if (payment.order.completedAt) {
    timeline.push({
      at: payment.order.completedAt.toISOString(),
      title: "Completed",
      detail: payment.order.code,
      tone: "success",
    });
  }

  timeline.sort(
    (a, b) => new Date(a.at).getTime() - new Date(b.at).getTime(),
  );

  return {
    payment: {
      id: payment.id,
      paymentReference: payment.paymentReference,
      provider: payment.provider,
      status: payment.status,
      amountVnd: payment.amountVnd,
      currency: payment.currency,
      createdAt: payment.createdAt.toISOString(),
      succeededAt: payment.succeededAt?.toISOString() ?? null,
      expiresAt: payment.expiresAt?.toISOString() ?? null,
      providerReference: payment.providerReference,
      providerTransactionId: payment.providerTransactionId,
      providerEventId: payment.providerEventId,
      providerPaidAt: payment.providerPaidAt?.toISOString() ?? null,
      ageLabel: paymentAgeLabel(payment.createdAt, now),
      reconcileHint,
      reconcileLabel: reconcileHintLabel(reconcileHint),
      rawTransferAmount: raw.transferAmount,
      rawGateway: raw.gateway,
      rawPayload: payment.rawPayload,
    },
    order: {
      id: payment.order.id,
      code: payment.order.code,
      status: payment.order.status,
      email: payment.order.email,
      totalVnd: payment.order.totalVnd,
      createdAt: payment.order.createdAt.toISOString(),
      paidAt: payment.order.paidAt?.toISOString() ?? null,
      completedAt: payment.order.completedAt?.toISOString() ?? null,
    },
    customer: {
      id: payment.order.userId ?? payment.order.user?.id ?? null,
      email: payment.order.email,
      name: payment.order.user?.name ?? null,
    },
    webhooks: webhooks.map((w) => ({
      id: w.id,
      providerEventId: w.providerEventId,
      provider: w.provider,
      createdAt: w.createdAt.toISOString(),
    })),
    timeline,
  };
}
