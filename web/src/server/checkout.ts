import { prisma } from "@/lib/db";
import { nextOrderCode, audit } from "@/lib/audit";
import { PaymentService } from "@/server/payment";
import { LicensePoolService } from "@/server/license-pool";
import { AppError } from "@/lib/errors";
import { emitPaymentEvent } from "@/server/payment/events";
import { childLogger } from "@/lib/logger";
import { randomBytes } from "crypto";
import { variantAllowsCheckout } from "@/lib/variant-checkout";

const log = childLogger("checkout");

function eid() {
  return randomBytes(12).toString("base64url");
}

export async function createCheckoutOrder(input: {
  variantId: string;
  email: string;
  userId?: string;
  quantity?: number;
}) {
  const qty = input.quantity ?? 1;
  const variant = await prisma.productVariant.findUnique({
    where: { id: input.variantId },
    include: { product: true },
  });
  if (!variant || !variant.active) throw new AppError("Variant not available", 404);
  if (!variantAllowsCheckout(variant)) {
    throw new AppError("Sản phẩm này cần nhận báo giá — chưa hỗ trợ mua ngay", 400);
  }
  if (
    variant.fulfillmentStrategy !== "MANUAL" &&
    variant.fulfillmentStrategy !== "INSTANT" &&
    variant.fulfillmentStrategy !== "SEMI_AUTOMATED"
  ) {
    throw new AppError(
      "Strategy chưa mở — chỉ Manual / Instant / Semi-Automated (1 SKU)",
      400,
    );
  }

  const totalVnd = variant.priceVnd * qty;
  const code = await nextOrderCode();
  const paymentReference = `pay_${code}_${Date.now()}`;
  const ttlMs = Number(process.env.PAYMENT_EXPIRE_MS ?? 15 * 60 * 1000);
  const expiresAt = new Date(Date.now() + ttlMs);

  const order = await prisma.$transaction(async (tx) => {
    const o = await tx.order.create({
      data: {
        code,
        email: input.email,
        userId: input.userId,
        status: "PENDING_PAYMENT",
        totalVnd,
        items: {
          create: {
            variantId: variant.id,
            quantity: qty,
            unitPriceVnd: variant.priceVnd,
            title: `${variant.product.name} — ${variant.name}`,
          },
        },
      },
      include: { items: true },
    });
    await tx.payment.create({
      data: {
        orderId: o.id,
        provider: await PaymentService.providerName(),
        paymentReference,
        amountVnd: totalVnd,
        currency: "VND",
        status: "AWAITING",
        expiresAt,
      },
    });
    return o;
  });

  const payment = await prisma.payment.findFirstOrThrow({
    where: { paymentReference },
  });
  await prisma.paymentDomainEvent.create({
    data: { id: eid(), type: "CREATED", paymentId: payment.id },
  });
  emitPaymentEvent({
    name: "PaymentCreated",
    paymentId: payment.id,
    paymentReference,
    orderId: order.id,
    at: new Date(),
  });

  // Instant: reserve before pay (Pool) — orchestration, not webhook
  if (variant.fulfillmentStrategy === "INSTANT") {
    const item = order.items[0]!;
    try {
      await LicensePoolService.reserve({
        variantId: variant.id,
        orderId: order.id,
        orderItemId: item.id,
        quantity: qty,
      });
    } catch (err) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "CANCELLED" },
      });
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      });
      throw err;
    }
  }

  await audit("order.created", "Order", order.id, input.userId ?? null, { code });
  log.info({ orderId: order.id, code }, "order created");

  const created = await PaymentService.createPayment({
    orderId: order.id,
    amountVnd: totalVnd,
    paymentReference,
    description: code,
  });

  return {
    order,
    paymentReference,
    instructions: created.instructions,
    redirectUrl: created.redirectUrl,
    qrImageUrl: created.qrImageUrl,
  };
}
