import { prisma } from "@/lib/db";
import { encryptPayload } from "@/lib/crypto";
import { audit } from "@/lib/audit";
import { hintFor } from "@/server/fulfillment/types";
import { enqueueEmail } from "@/server/queue";
import { emailDeliveryReplaced } from "@/server/mail/templates";
import { AppError } from "@/lib/errors";
import { childLogger } from "@/lib/logger";

const log = childLogger("delivery.replace");

/** Staff replace: tạo delivery mới, giữ bản cũ (không xóa) — audit trail. */
export async function replaceDelivery(input: {
  deliveryId: string;
  plainPayload: string;
  actorId: string;
  reason?: string;
}) {
  const old = await prisma.delivery.findUnique({
    where: { id: input.deliveryId },
    include: {
      orderItem: { include: { order: true, variant: true } },
      fulfillmentJob: true,
    },
  });
  if (!old) throw new AppError("Delivery not found", 404);

  const type = old.deliverableType;
  const payloadEnc = encryptPayload(input.plainPayload);

  const created = await prisma.$transaction(async (tx) => {
    const d = await tx.delivery.create({
      data: {
        orderItemId: old.orderItemId,
        fulfillmentJobId: old.fulfillmentJobId,
        deliverableType: type,
        payloadEnc,
        displayHint: hintFor(type, input.plainPayload),
      },
    });
    return d;
  });

  await audit("delivery.replace", "Delivery", created.id, input.actorId, {
    replacedId: old.id,
    reason: input.reason ?? "replace",
  });

  const mail = emailDeliveryReplaced({
    orderCode: old.orderItem.order.code,
    productTitle: old.orderItem.title,
  });
  await enqueueEmail({
    type: "delivery_notice",
    to: old.orderItem.order.email,
    ...mail,
  }).catch((err) => log.warn({ err }, "replace email failed"));

  return created;
}
