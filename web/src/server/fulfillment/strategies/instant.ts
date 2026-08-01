import type { FulfillmentStrategyHandler, FulfillmentContext } from "../types";
import { prisma } from "@/lib/db";
import { decryptPayload } from "@/lib/crypto";
import { audit } from "@/lib/audit";
import { hintFor } from "../types";
import { FulfillmentStrategy } from "@prisma/client";
import { LicensePoolService } from "@/server/license-pool";
import { enqueueEmail } from "@/server/queue";
import { emailDeliveryReady } from "@/server/mail/templates";
import { childLogger } from "@/lib/logger";
import { AppError } from "@/lib/errors";

const log = childLogger("fulfillment.instant");

export const instantStrategy: FulfillmentStrategyHandler = {
  strategy: FulfillmentStrategy.INSTANT,
  async execute(ctx: FulfillmentContext) {
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: ctx.orderItemId },
      include: { order: true, deliveries: true },
    });
    if (!orderItem) throw new AppError("Order item not found", 404);
    if (orderItem.deliveries.length > 0) {
      await prisma.fulfillmentJob.update({
        where: { id: ctx.jobId },
        data: { status: "SUCCEEDED", finishedAt: new Date() },
      });
      return;
    }

    let token = orderItem.reservationToken;
    if (!token) {
      try {
        const reserved = await LicensePoolService.reserve({
          variantId: ctx.variant.id,
          orderId: orderItem.orderId,
          orderItemId: orderItem.id,
          quantity: orderItem.quantity,
        });
        token = reserved[0]?.reservationToken ?? null;
      } catch (err) {
        if (err instanceof AppError && err.code === "POOL_INSUFFICIENT") {
          await prisma.fulfillmentJob.update({
            where: { id: ctx.jobId },
            data: { status: "WAITING_STOCK", notes: "Hết kho Instant (License Pool)" },
          });
          return;
        }
        throw err;
      }
    }
    if (!token) {
      await prisma.fulfillmentJob.update({
        where: { id: ctx.jobId },
        data: { status: "WAITING_STOCK", notes: "Reserve failed" },
      });
      return;
    }

    const consumed = await LicensePoolService.consume({ reservationToken: token });
    const unit = consumed[0];
    if (!unit) throw new AppError("Consume returned empty", 500);

    const plain = decryptPayload(unit.payloadEnc);

    await prisma.$transaction(async (tx) => {
      await tx.delivery.create({
        data: {
          orderItemId: ctx.orderItemId,
          fulfillmentJobId: ctx.jobId,
          deliverableType: ctx.variant.deliverableType,
          payloadEnc: unit.payloadEnc,
          displayHint: hintFor(ctx.variant.deliverableType, plain),
        },
      });
      await tx.fulfillmentJob.update({
        where: { id: ctx.jobId },
        data: { status: "SUCCEEDED", finishedAt: new Date() },
      });
    });

    await audit("fulfillment.instant", "FulfillmentJob", ctx.jobId, null, {
      orderItemId: ctx.orderItemId,
      variantId: ctx.variant.id,
      licenseId: unit.licenseId,
    });

    const mail = emailDeliveryReady({
      orderCode: orderItem.order.code,
      productTitle: orderItem.title,
    });
    await enqueueEmail({
      type: "delivery_notice",
      to: orderItem.order.email,
      ...mail,
    }).catch((err) => log.warn({ err }, "instant delivery email failed"));
  },
};
