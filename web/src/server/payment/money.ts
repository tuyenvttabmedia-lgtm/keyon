import type { Payment, Prisma } from "@prisma/client";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { AppError } from "@/lib/errors";
import { enqueueFulfillmentOrder, enqueueEmail } from "@/server/queue";
import { emailPaymentSucceeded } from "@/server/mail/templates";
import { emitPaymentEvent } from "./events";
import { paymentKpis } from "./kpis";
import { childLogger } from "@/lib/logger";
import { LicensePoolService } from "@/server/license-pool";
import { parseVndAmount } from "./amount";

const log = childLogger("payment.money");

function id() {
  return randomBytes(12).toString("base64url");
}

export type MarkPaidInput = {
  paymentReference: string;
  rawPayload?: Prisma.InputJsonValue;
  providerEventId?: string | null;
  providerTransactionId?: string | null;
  providerReference?: string | null;
  providerPaidAt?: Date | null;
  amountVnd?: number | null;
};

/**
 * Payment Domain only — mark PAID + enqueue Fulfillment.
 * NEVER imports Pool.consume (ADR-004).
 */
export async function markPaymentSucceeded(input: MarkPaidInput | string): Promise<{
  payment: Payment;
  duplicateWebhook: boolean;
  alreadyPaid: boolean;
}> {
  const normalized: MarkPaidInput =
    typeof input === "string" ? { paymentReference: input } : input;
  const { paymentReference } = normalized;

  // Layer 1 — provider_event_id
  if (normalized.providerEventId) {
    const prior = await prisma.paymentWebhookReceipt.findUnique({
      where: { providerEventId: normalized.providerEventId },
    });
    if (prior) {
      const payment = await prisma.payment.findUniqueOrThrow({
        where: { paymentReference: prior.paymentReference },
      });
      log.info({ paymentReference, eventId: normalized.providerEventId }, "L1 duplicate webhook");
      return { payment, duplicateWebhook: true, alreadyPaid: payment.status === "SUCCEEDED" };
    }
  }

  const existing = await prisma.payment.findUnique({
    where: { paymentReference },
    include: { order: true },
  });
  if (!existing) throw new AppError("Payment not found", 404, "PAYMENT_NOT_FOUND");

  // Layer 2 — already SUCCEEDED
  if (existing.status === "SUCCEEDED") {
    if (normalized.providerEventId) {
      await prisma.paymentWebhookReceipt
        .create({
          data: {
            id: id(),
            providerEventId: normalized.providerEventId,
            paymentReference,
            provider: existing.provider,
            rawPayload: normalized.rawPayload ?? undefined,
          },
        })
        .catch(() => undefined);
    }
    log.info({ paymentReference }, "L2 idempotent — already SUCCEEDED");
    return { payment: existing, duplicateWebhook: true, alreadyPaid: true };
  }

  if (existing.status === "EXPIRED" || existing.status === "CANCELLED") {
    throw new AppError(`Payment is ${existing.status}`, 409, "PAYMENT_TERMINAL");
  }

  if (existing.provider !== "stub") {
    const paid = parseVndAmount(normalized.amountVnd);
    if (paid == null || paid !== existing.amountVnd) {
      log.warn(
        {
          paymentReference,
          expected: existing.amountVnd,
          got: normalized.amountVnd,
        },
        "reject payment — amount mismatch",
      );
      throw new AppError(
        "Số tiền webhook không khớp đơn — không đánh PAID",
        409,
        "PAYMENT_AMOUNT_MISMATCH",
      );
    }
  }

  const payment = await prisma.$transaction(async (tx) => {
    if (normalized.providerEventId) {
      await tx.paymentWebhookReceipt.create({
        data: {
          id: id(),
          providerEventId: normalized.providerEventId,
          paymentReference,
          provider: existing.provider,
          rawPayload: normalized.rawPayload ?? undefined,
        },
      });
    }

    const updated = await tx.payment.update({
      where: { id: existing.id },
      data: {
        status: "SUCCEEDED",
        succeededAt: new Date(),
        providerEventId: normalized.providerEventId ?? undefined,
        providerTransactionId: normalized.providerTransactionId ?? undefined,
        providerReference: normalized.providerReference ?? undefined,
        providerPaidAt: normalized.providerPaidAt ?? new Date(),
        rawPayload: normalized.rawPayload ?? undefined,
      },
    });

    await tx.order.update({
      where: { id: existing.orderId },
      data: { status: "PAID", paidAt: new Date() },
    });

    await tx.paymentDomainEvent.create({
      data: {
        id: id(),
        type: "SUCCEEDED",
        paymentId: updated.id,
      },
    });

    return updated;
  });

  paymentKpis.payment_succeeded++;
  await audit("payment.succeeded", "Payment", payment.id, null, { paymentReference });
  emitPaymentEvent({
    name: "PaymentSucceeded",
    paymentId: payment.id,
    paymentReference,
    orderId: existing.orderId,
    at: new Date(),
  });

  // Fulfillment orchestration — not Pool
  await enqueueFulfillmentOrder(existing.orderId);
  const t0 = Date.now();
  try {
    const { processFulfillmentForOrder } = await import("@/server/fulfillment/engine");
    await processFulfillmentForOrder(existing.orderId);
    paymentKpis.fulfillment_ms_sum += Date.now() - t0;
    paymentKpis.fulfillment_count++;
  } catch (err) {
    log.warn({ err, orderId: existing.orderId }, "inline fulfillment fallback failed");
  }

  const mail = emailPaymentSucceeded({
    orderCode: existing.order.code,
    amountVnd: existing.amountVnd,
  });
  await enqueueEmail({
    type: "generic",
    to: existing.order.email,
    ...mail,
  }).catch((err) => log.warn({ err }, "enqueue email failed"));

  return { payment, duplicateWebhook: false, alreadyPaid: false };
}

/** Back-compat for stub confirmDev */
export async function markPaymentSucceededByRef(
  paymentReference: string,
  rawPayload?: Prisma.InputJsonValue,
): Promise<Payment> {
  const r = await markPaymentSucceeded({ paymentReference, rawPayload });
  return r.payment;
}

export async function markPaymentFailed(paymentReference: string, reason?: string) {
  const existing = await prisma.payment.findUnique({
    where: { paymentReference },
    include: { order: { include: { items: true } } },
  });
  if (!existing) throw new AppError("Payment not found", 404);
  if (existing.status === "SUCCEEDED") {
    throw new AppError("Cannot fail SUCCEEDED payment", 409);
  }
  if (existing.status === "FAILED") return existing;

  const payment = await prisma.$transaction(async (tx) => {
    const p = await tx.payment.update({
      where: { id: existing.id },
      data: { status: "FAILED" },
    });
    await tx.order.update({
      where: { id: existing.orderId },
      data: { status: "PAYMENT_FAILED" },
    });
    await tx.paymentDomainEvent.create({
      data: { id: id(), type: "FAILED", paymentId: p.id, reason: reason ?? "failed" },
    });
    return p;
  });

  paymentKpis.payment_failed++;
  await releaseOrderReserves(existing.order.items, "payment_failed");
  emitPaymentEvent({
    name: "PaymentFailed",
    paymentId: payment.id,
    paymentReference,
    orderId: existing.orderId,
    reason,
    at: new Date(),
  });
  await audit("payment.failed", "Payment", payment.id, null, { reason });
  return payment;
}

export async function markPaymentExpired(paymentReference: string) {
  const existing = await prisma.payment.findUnique({
    where: { paymentReference },
    include: { order: { include: { items: true } } },
  });
  if (!existing) throw new AppError("Payment not found", 404);
  if (existing.status === "SUCCEEDED") {
    throw new AppError("Cannot expire SUCCEEDED payment", 409);
  }
  if (existing.status === "EXPIRED") return existing;

  const payment = await prisma.$transaction(async (tx) => {
    const p = await tx.payment.update({
      where: { id: existing.id },
      data: { status: "EXPIRED" },
    });
    await tx.order.update({
      where: { id: existing.orderId },
      data: { status: "CANCELLED" },
    });
    await tx.paymentDomainEvent.create({
      data: { id: id(), type: "EXPIRED", paymentId: p.id, reason: "ttl_expired" },
    });
    return p;
  });

  await releaseOrderReserves(existing.order.items, "ttl_expired");
  emitPaymentEvent({
    name: "PaymentExpired",
    paymentId: payment.id,
    paymentReference,
    orderId: existing.orderId,
    reason: "ttl_expired",
    at: new Date(),
  });
  await audit("payment.expired", "Payment", payment.id, null, {});
  return payment;
}

async function releaseOrderReserves(
  items: Array<{ reservationToken: string | null }>,
  reason: string,
) {
  for (const item of items) {
    if (!item.reservationToken) continue;
    await LicensePoolService.release({
      reservationToken: item.reservationToken,
      reason,
    }).catch((err) => log.warn({ err }, "release on payment terminal failed"));
  }
}
