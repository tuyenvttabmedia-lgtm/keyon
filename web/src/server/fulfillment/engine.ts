import { prisma } from "@/lib/db";
import { encryptPayload } from "@/lib/crypto";
import { audit } from "@/lib/audit";
import { getFulfillmentStrategy } from "./registry";
import { hintFor } from "./types";
import { enqueueEmail } from "@/server/queue";
import { emailDeliveryReady, emailDeliveryResend } from "@/server/mail/templates";
import { childLogger } from "@/lib/logger";

const log = childLogger("fulfillment.engine");

export async function processFulfillmentForOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { variant: true } },
      fulfillmentJobs: true,
    },
  });
  if (!order) throw new Error("Order not found");
  if (order.status !== "PAID" && order.status !== "FULFILLING") {
    return;
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "FULFILLING" },
  });

  for (const item of order.items) {
    const already = order.fulfillmentJobs.find((j) => j.orderItemId === item.id);
    if (already) {
      if (
        already.status === "QUEUED" ||
        already.status === "PROCESSING" ||
        already.status === "FAILED"
      ) {
        await runFulfillmentJob(already.id);
      }
      continue;
    }

    const job = await prisma.fulfillmentJob.create({
      data: {
        orderId,
        orderItemId: item.id,
        strategy: item.variant.fulfillmentStrategy,
        status: "QUEUED",
      },
    });
    await runFulfillmentJob(job.id);
  }

  await refreshOrderCompletion(orderId);
}

export async function runFulfillmentJob(jobId: string) {
  const job = await prisma.fulfillmentJob.findUnique({
    where: { id: jobId },
    include: {
      orderItem: { include: { variant: true, deliveries: true } },
    },
  });
  if (!job) return;

  if (job.orderItem.deliveries.length > 0) {
    await prisma.fulfillmentJob.update({
      where: { id: jobId },
      data: { status: "SUCCEEDED", finishedAt: new Date() },
    });
    return;
  }

  await prisma.fulfillmentJob.update({
    where: { id: jobId },
    data: { status: "PROCESSING", startedAt: new Date() },
  });

  const handler = getFulfillmentStrategy(job.orderItem.variant.fulfillmentStrategy);
  log.info({ jobId, strategy: handler.strategy }, "execute strategy");
  await handler.execute({
    jobId: job.id,
    orderItemId: job.orderItemId,
    variant: job.orderItem.variant,
  });
}

export async function completeManualDelivery(input: {
  jobId: string;
  plainPayload: string;
  actorId: string;
  displayHint?: string;
}) {
  const job = await prisma.fulfillmentJob.findUnique({
    where: { id: input.jobId },
    include: {
      order: true,
      orderItem: { include: { variant: true, deliveries: true } },
    },
  });
  if (!job) throw new Error("Job not found");
  if (job.orderItem.deliveries.length > 0) throw new Error("Already delivered");
  if (
    !["WAITING_HUMAN", "WAITING_STOCK", "QUEUED", "PROCESSING", "FAILED"].includes(job.status)
  ) {
    throw new Error(`Cannot complete job in status ${job.status}`);
  }

  const type = job.orderItem.variant.deliverableType;
  const payloadEnc = encryptPayload(input.plainPayload);

  await prisma.$transaction(async (tx) => {
    await tx.delivery.create({
      data: {
        orderItemId: job.orderItemId,
        fulfillmentJobId: job.id,
        deliverableType: type,
        payloadEnc,
        displayHint: input.displayHint ?? hintFor(type, input.plainPayload),
      },
    });
    await tx.fulfillmentJob.update({
      where: { id: job.id },
      data: { status: "SUCCEEDED", finishedAt: new Date(), notes: "Manual complete" },
    });
  });

  await audit("fulfillment.manual_complete", "FulfillmentJob", job.id, input.actorId);
  await refreshOrderCompletion(job.orderId);

  const mail = emailDeliveryReady({
    orderCode: job.order.code,
    productTitle: job.orderItem.title,
  });
  await enqueueEmail({
    type: "delivery_notice",
    to: job.order.email,
    ...mail,
  }).catch((err) => log.warn({ err }, "email enqueue failed"));
}

export async function refreshOrderCompletion(orderId: string) {
  const jobs = await prisma.fulfillmentJob.findMany({ where: { orderId } });
  if (jobs.length === 0) return;
  const allOk = jobs.every((j) => j.status === "SUCCEEDED");
  if (allOk) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
    await audit("order.completed", "Order", orderId, null);
  }
}

export async function resendDelivery(input: {
  deliveryId: string;
  actorId?: string;
  reason?: string;
  maxResends?: number;
}) {
  const max = input.maxResends ?? 5;
  const delivery = await prisma.delivery.findUnique({
    where: { id: input.deliveryId },
    include: { orderItem: { include: { order: true } } },
  });
  if (!delivery) throw new Error("Delivery not found");
  if (delivery.resendCount >= max) throw new Error("Resend limit reached");

  await prisma.$transaction(async (tx) => {
    await tx.delivery.update({
      where: { id: delivery.id },
      data: { resendCount: { increment: 1 } },
    });
    await tx.deliveryResend.create({
      data: {
        deliveryId: delivery.id,
        actorId: input.actorId,
        reason: input.reason ?? "resend",
      },
    });
  });

  await audit("delivery.resend", "Delivery", delivery.id, input.actorId ?? null, {
    count: delivery.resendCount + 1,
  });

  const count = delivery.resendCount + 1;
  const mail = emailDeliveryResend({
    orderCode: delivery.orderItem.order.code,
    resendCount: count,
  });
  await enqueueEmail({
    type: "delivery_notice",
    to: delivery.orderItem.order.email,
    ...mail,
  }).catch((err) => log.warn({ err }, "resend email enqueue failed"));

  return { ok: true, resendCount: count };
}
