/**
 * IT7 — End-to-end Instant order flow
 * Order → Payment → Fulfillment → Delivery → Resend → Replace
 */
import { createCipheriv, randomBytes, scryptSync } from "crypto";
import { PrismaClient } from "@prisma/client";
import { createCheckoutOrder } from "../src/server/checkout";
import { markPaymentSucceeded } from "../src/server/payment/money";
import { processFulfillmentForOrder } from "../src/server/fulfillment/engine";
import { resendDelivery } from "../src/server/fulfillment/engine";
import { replaceDelivery } from "../src/server/fulfillment/replace";

const prisma = new PrismaClient();

function encrypt(plain: string): string {
  const raw =
    process.env.DELIVERY_ENCRYPTION_KEY ??
    "0123456789abcdef0123456789abcdef";
  const key = scryptSync(raw, "keyon-delivery", 32);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

async function ensureInstantVariant() {
  const slug = `it7-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const supplier = await prisma.supplier.upsert({
    where: { name: "KEYON Stock" },
    update: {},
    create: {
      name: "KEYON Stock",
      supplierType: "INTERNAL",
      integrationMode: "NONE",
    },
  });
  const brand = await prisma.brand.upsert({
    where: { slug: "it7-test-brand" },
    update: {},
    create: {
      name: "IT7 Test",
      slug: "it7-test-brand",
      supplierId: supplier.id,
    },
  });
  const product = await prisma.product.create({
    data: {
      brandId: brand.id,
      name: `IT7 ${slug}`,
      slug,
      description: "internal e2e",
    },
  });
  const variant = await prisma.productVariant.create({
    data: {
      productId: product.id,
      sku: `IT7-${slug}`.slice(0, 40),
      name: "1 key",
      licenseModel: "PERPETUAL",
      fulfillmentStrategy: "INSTANT",
      deliverableType: "KEY",
      salesMotion: "SELF_SERVE",
      supplierId: supplier.id,
      priceVnd: 49_000,
      active: true,
    },
  });
  await prisma.licenseItem.create({
    data: {
      variantId: variant.id,
      payloadEnc: encrypt(`IT7-KEY-${slug}`),
      status: "AVAILABLE",
    },
  });
  return variant;
}

export type E2EResult = { ok: boolean; detail: string };

export async function runInternalE2E(): Promise<E2EResult> {
  const steps: string[] = [];
  try {
    const variant = await ensureInstantVariant();
    steps.push("variant+license");

    const checkout = await createCheckoutOrder({
      variantId: variant.id,
      email: "it7@keyon.local",
      quantity: 1,
    });
    const orderId = checkout.order.id;
    const paymentReference = checkout.paymentReference;
    steps.push(`order:${checkout.order.code}`);

    const reserved = await prisma.licenseItem.count({
      where: { variantId: variant.id, status: "RESERVED" },
    });
    if (reserved < 1) {
      return { ok: false, detail: `reserve failed after checkout reserved=${reserved}` };
    }
    steps.push("reserved");

    await markPaymentSucceeded({
      paymentReference,
      providerEventId: `it7_evt_${Date.now()}`,
      providerTransactionId: `it7_tx_${Date.now()}`,
      providerPaidAt: new Date(),
      amountVnd: checkout.order.totalVnd,
    });
    const pay = await prisma.payment.findUniqueOrThrow({
      where: { paymentReference },
    });
    if (pay.status !== "SUCCEEDED") {
      return { ok: false, detail: `payment status=${pay.status}` };
    }
    steps.push("payment.SUCCEEDED");

    await processFulfillmentForOrder(orderId);
    const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
    const orderItemId = checkout.order.items[0]!.id;
    const delivery = await prisma.delivery.findFirst({
      where: { orderItemId },
      orderBy: { createdAt: "asc" },
    });
    if (!delivery) {
      return { ok: false, detail: `no delivery after fulfill order=${order.status}` };
    }
    if (order.status !== "COMPLETED") {
      return {
        ok: false,
        detail: `unexpected order status=${order.status} after fulfill (want COMPLETED)`,
      };
    }
    steps.push(`delivery:${delivery.id} order=${order.status}`);

    const admin =
      (await prisma.user.findFirst({ where: { role: "ADMIN" } })) ??
      (await prisma.user.findFirst());
    const actorId = admin?.id ?? "it7-actor";

    const resend = await resendDelivery({
      deliveryId: delivery.id,
      actorId,
      reason: "it7_resend",
    });
    if (resend.resendCount < 1) {
      return { ok: false, detail: `resendCount=${resend.resendCount}` };
    }
    steps.push(`resend:${resend.resendCount}`);

    const replaced = await replaceDelivery({
      deliveryId: delivery.id,
      plainPayload: "IT7-REPLACED-KEY",
      actorId,
      reason: "it7_replace",
    });
    const deliveries = await prisma.delivery.count({
      where: { orderItemId },
    });
    if (deliveries < 2) {
      return {
        ok: false,
        detail: `replace should keep old + new deliveries=${deliveries}`,
      };
    }
    steps.push(`replace:${replaced.id} deliveries=${deliveries}`);

    const consumed = await prisma.licenseItem.count({
      where: { variantId: variant.id, status: "CONSUMED" },
    });
    if (consumed < 1) {
      return { ok: false, detail: `expected CONSUMED license consumed=${consumed}` };
    }
    steps.push("license.CONSUMED");

    return {
      ok: true,
      detail: steps.join(" → "),
    };
  } catch (e) {
    return {
      ok: false,
      detail: `${steps.join(" → ")} · ERR ${e instanceof Error ? e.message : String(e)}`,
    };
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const r = await runInternalE2E();
  console.log(r.ok ? `IT7 ✅ PASS  ${r.detail}` : `IT7 ❌ FAIL  ${r.detail}`);
  process.exit(r.ok ? 0 : 1);
}

const isDirect =
  process.argv[1] &&
  (process.argv[1].endsWith("internal-e2e.ts") ||
    process.argv[1].includes("internal-e2e"));

if (isDirect) {
  main();
}
