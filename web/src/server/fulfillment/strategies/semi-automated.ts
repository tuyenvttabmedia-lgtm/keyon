import type { FulfillmentStrategyHandler, FulfillmentContext } from "../types";
import { prisma } from "@/lib/db";
import { encryptPayload } from "@/lib/crypto";
import { audit } from "@/lib/audit";
import { hintFor } from "../types";
import { FulfillmentStrategy } from "@prisma/client";
import { getSupplierProvisioner } from "@/server/supplier";
import { enqueueEmail } from "@/server/queue";
import { emailDeliveryReady } from "@/server/mail/templates";
import { childLogger } from "@/lib/logger";
import { AppError } from "@/lib/errors";

const log = childLogger("fulfillment.semi");

/**
 * Semi-Automated — Supplier API (Pax8). Never touches License Pool.
 */
export const semiAutomatedStrategy: FulfillmentStrategyHandler = {
  strategy: FulfillmentStrategy.SEMI_AUTOMATED,
  async execute(ctx: FulfillmentContext) {
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: ctx.orderItemId },
      include: {
        order: true,
        deliveries: true,
        variant: { include: { supplier: true } },
      },
    });
    if (!orderItem) throw new AppError("Order item not found", 404);

    if (orderItem.deliveries.length > 0) {
      await prisma.fulfillmentJob.update({
        where: { id: ctx.jobId },
        data: { status: "SUCCEEDED", finishedAt: new Date() },
      });
      return;
    }

    const upstreamRef = orderItem.variant.upstreamProductRef;
    if (!upstreamRef) {
      await prisma.fulfillmentJob.update({
        where: { id: ctx.jobId },
        data: {
          status: "WAITING_HUMAN",
          notes: "SEMI_AUTOMATED thiếu upstreamProductRef — map 1 SKU trước",
        },
      });
      return;
    }

    const requestId = `prov_${ctx.jobId}`;
    const existingJob = await prisma.fulfillmentJob.findUnique({
      where: { id: ctx.jobId },
    });
    if (existingJob?.upstreamProvisionId && existingJob.status === "SUCCEEDED") {
      return;
    }

    const provisioner = await getSupplierProvisioner();
    let result;
    try {
      result = await provisioner.provision({
        requestId,
        orderId: orderItem.orderId,
        orderItemId: orderItem.id,
        orderCode: orderItem.order.code,
        upstreamProductRef: upstreamRef,
        quantity: orderItem.quantity,
        customerEmail: orderItem.order.email,
        deliverableType: orderItem.variant.deliverableType,
      });
    } catch (err) {
      log.warn({ err, jobId: ctx.jobId }, "provision failed");
      await prisma.fulfillmentJob.update({
        where: { id: ctx.jobId },
        data: {
          status: "FAILED",
          notes: err instanceof Error ? err.message : "provision error",
          upstreamRequestId: requestId,
        },
      });
      return;
    }

    if (result.status === "PENDING") {
      await prisma.fulfillmentJob.update({
        where: { id: ctx.jobId },
        data: {
          status: "WAITING_HUMAN",
          notes: `Awaiting supplier provision ${result.provisionId}`,
          upstreamRequestId: requestId,
          upstreamProvisionId: result.provisionId,
        },
      });
      return;
    }

    if (result.status === "FAILED") {
      await prisma.fulfillmentJob.update({
        where: { id: ctx.jobId },
        data: {
          status: "FAILED",
          notes: "Supplier provision FAILED",
          upstreamRequestId: requestId,
          upstreamProvisionId: result.provisionId,
        },
      });
      return;
    }

    const payloadEnc = encryptPayload(result.deliverablePlain);
    await prisma.$transaction(async (tx) => {
      await tx.delivery.create({
        data: {
          orderItemId: ctx.orderItemId,
          fulfillmentJobId: ctx.jobId,
          deliverableType: result.deliverableType,
          payloadEnc,
          displayHint: hintFor(result.deliverableType, result.deliverablePlain),
        },
      });
      await tx.fulfillmentJob.update({
        where: { id: ctx.jobId },
        data: {
          status: "SUCCEEDED",
          finishedAt: new Date(),
          notes: `Provisioned via ${provisioner.name}`,
          upstreamRequestId: requestId,
          upstreamProvisionId: result.provisionId,
        },
      });
    });

    await audit("fulfillment.semi_automated", "FulfillmentJob", ctx.jobId, null, {
      orderItemId: ctx.orderItemId,
      provisionId: result.provisionId,
      driver: provisioner.name,
    });

    const mail = emailDeliveryReady({
      orderCode: orderItem.order.code,
      productTitle: orderItem.title,
    });
    await enqueueEmail({
      type: "delivery_notice",
      to: orderItem.order.email,
      ...mail,
    }).catch((err) => log.warn({ err }, "SA delivery email failed"));
  },
};
