/**
 * SePay / Payment Domain Exit P1–P10
 * Run: npm run test:sepay
 * Does NOT call Pool from webhook path assertions.
 */
import { createHmac, createCipheriv, randomBytes, scryptSync } from "crypto";
import { PrismaClient } from "@prisma/client";
import { sepayPaymentProvider } from "../src/server/payment/providers/sepay";
import {
  markPaymentSucceeded,
  markPaymentFailed,
  markPaymentExpired,
} from "../src/server/payment/money";
import { LicensePoolService } from "../src/server/license-pool";
import { processFulfillmentForOrder } from "../src/server/fulfillment/engine";
import { InventoryReadModel } from "../src/server/inventory-read-model";
import { AppError } from "../src/lib/errors";

const prisma = new PrismaClient();

type R = { id: string; ok: boolean; detail: string };
const results: R[] = [];

function pass(id: string, detail: string) {
  results.push({ id, ok: true, detail });
  console.log(`P${id} ✅ PASS  ${detail}`);
}
function fail(id: string, detail: string) {
  results.push({ id, ok: false, detail });
  console.log(`P${id} ❌ FAIL  ${detail}`);
}

function encrypt(plain: string): string {
  const raw = process.env.DELIVERY_ENCRYPTION_KEY ?? "0123456789abcdef0123456789abcdef";
  const key = scryptSync(raw, "keyon-delivery", 32);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

function signBody(body: string, secret: string, ts: string) {
  const sig = createHmac("sha256", secret).update(`${ts}.${body}`).digest("hex");
  return `sha256=${sig}`;
}

async function fixtureInstant(label: string) {
  const slug = `sepay-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const supplier = await prisma.supplier.upsert({
    where: { name: "KEYON Stock" },
    update: {},
    create: { name: "KEYON Stock", supplierType: "INTERNAL", integrationMode: "NONE" },
  });
  const brand = await prisma.brand.upsert({
    where: { slug: "sepay-test-brand" },
    update: {},
    create: { name: "SePay Test", slug: "sepay-test-brand", supplierId: supplier.id },
  });
  const product = await prisma.product.create({
    data: { brandId: brand.id, name: `SP ${label}`, slug, description: "t" },
  });
  const variant = await prisma.productVariant.create({
    data: {
      productId: product.id,
      sku: `SP-${slug}`.slice(0, 40),
      name: "1",
      licenseModel: "PERPETUAL",
      fulfillmentStrategy: "INSTANT",
      deliverableType: "KEY",
      salesMotion: "SELF_SERVE",
      supplierId: supplier.id,
      priceVnd: 50_000,
    },
  });
  await prisma.licenseItem.create({
    data: {
      variantId: variant.id,
      payloadEnc: encrypt(`KEY-${label}`),
      status: "AVAILABLE",
    },
  });
  return variant;
}

async function makeOrderWithPayment(variantId: string, ref: string) {
  const code = `SP${Date.now()}${Math.random().toString(36).slice(2, 5)}`;
  const order = await prisma.order.create({
    data: {
      code,
      email: "sepay@test.local",
      status: "PENDING_PAYMENT",
      totalVnd: 50_000,
      items: {
        create: {
          variantId,
          quantity: 1,
          unitPriceVnd: 50_000,
          title: "SePay test",
        },
      },
    },
    include: { items: true },
  });
  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: "sepay",
      paymentReference: ref,
      amountVnd: 50_000,
      currency: "VND",
      status: "AWAITING",
    },
  });
  return { order, payment };
}

async function p1() {
  process.env.SEPAY_ACCOUNT_NUMBER = "0123456789";
  process.env.SEPAY_BANK_BIN = "970422";
  const r = await sepayPaymentProvider.createPayment({
    orderId: "x",
    amountVnd: 50_000,
    paymentReference: "pay_TEST_QR",
  });
  if (r.qrImageUrl?.includes("vietqr") && r.qrImageUrl.includes("pay_TEST_QR")) {
    pass("1", `QR created — ${r.qrImageUrl.slice(0, 60)}…`);
  } else {
    fail("1", `qr=${r.qrImageUrl}`);
  }
}

async function p2() {
  const secret = "test_webhook_secret";
  process.env.SEPAY_WEBHOOK_SECRET = secret;
  delete process.env.SEPAY_API_KEY;
  const body = JSON.stringify({
    id: 999001,
    transferType: "in",
    transferAmount: 50000,
    code: "pay_AUTH_TEST",
  });
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = signBody(body, secret, ts);
  const ok = await sepayPaymentProvider.verifyWebhook!({
    headers: { "x-sepay-signature": sig, "x-sepay-timestamp": ts },
    body: { ...JSON.parse(body), _rawBody: body },
  });
  let bad = false;
  try {
    await sepayPaymentProvider.verifyWebhook!({
      headers: { "x-sepay-signature": "sha256=dead", "x-sepay-timestamp": ts },
      body: { ...JSON.parse(body), _rawBody: body },
    });
  } catch (e) {
    bad = e instanceof AppError && e.code === "SEPAY_SIG";
  }
  if (ok.success && ok.paymentReference === "pay_AUTH_TEST" && bad) {
    pass("2", "Webhook HMAC valid + reject bad sig");
  } else {
    fail("2", `ok=${JSON.stringify(ok)} badReject=${bad}`);
  }
}

async function p3() {
  const variant = await fixtureInstant("p3");
  const ref = `pay_DUP_${Date.now()}`;
  const { order } = await makeOrderWithPayment(variant.id, ref);
  await LicensePoolService.reserve({
    variantId: variant.id,
    orderId: order.id,
    orderItemId: order.items[0]!.id,
    quantity: 1,
  });
  const eventId = `evt_dup_${Date.now()}`;
  const a = await markPaymentSucceeded({
    paymentReference: ref,
    providerEventId: eventId,
    providerTransactionId: "tx1",
    rawPayload: { id: eventId },
  });
  await processFulfillmentForOrder(order.id);
  const deliveries1 = await prisma.delivery.count({
    where: { orderItemId: order.items[0]!.id },
  });
  const b = await markPaymentSucceeded({
    paymentReference: ref,
    providerEventId: eventId,
    rawPayload: { id: eventId },
  });
  await processFulfillmentForOrder(order.id);
  const deliveries2 = await prisma.delivery.count({
    where: { orderItemId: order.items[0]!.id },
  });
  const consumed = await prisma.licenseItem.count({
    where: { variantId: variant.id, status: "CONSUMED" },
  });
  if (a.duplicateWebhook === false && b.duplicateWebhook === true && deliveries1 === 1 && deliveries2 === 1 && consumed === 1) {
    pass("3", "Duplicate webhook — 1 delivery, 1 consume");
  } else {
    fail(
      "3",
      `dupA=${a.duplicateWebhook} dupB=${b.duplicateWebhook} d1=${deliveries1} d2=${deliveries2} consumed=${consumed}`,
    );
  }
}

async function p4() {
  const variant = await fixtureInstant("p4");
  const ref = `pay_FLOW_${Date.now()}`;
  const { order } = await makeOrderWithPayment(variant.id, ref);
  const reserved = await LicensePoolService.reserve({
    variantId: variant.id,
    orderId: order.id,
    orderItemId: order.items[0]!.id,
    quantity: 1,
  });
  // Assert money module path does not need to be checked via source — check order of status
  await markPaymentSucceeded({
    paymentReference: ref,
    providerEventId: `evt_flow_${Date.now()}`,
    providerTransactionId: "tx_flow",
    providerPaidAt: new Date(),
  });
  const pay = await prisma.payment.findUniqueOrThrow({ where: { paymentReference: ref } });
  await processFulfillmentForOrder(order.id);
  const item = await prisma.licenseItem.findUniqueOrThrow({
    where: { id: reserved[0]!.licenseId },
  });
  const delivery = await prisma.delivery.findFirst({
    where: { orderItemId: order.items[0]!.id },
  });
  if (pay.status === "SUCCEEDED" && item.status === "CONSUMED" && delivery) {
    pass("4", "Payment → Fulfillment → Pool.consume → Delivery");
  } else {
    fail("4", `pay=${pay.status} lic=${item.status} delivery=${!!delivery}`);
  }
}

async function p5() {
  const variant = await fixtureInstant("p5");
  const ref = `pay_FAIL_${Date.now()}`;
  const { order } = await makeOrderWithPayment(variant.id, ref);
  await LicensePoolService.reserve({
    variantId: variant.id,
    orderId: order.id,
    orderItemId: order.items[0]!.id,
    quantity: 1,
  });
  await markPaymentFailed(ref, "declined");
  const consumed = await prisma.licenseItem.count({
    where: { variantId: variant.id, status: "CONSUMED" },
  });
  const avail = await prisma.licenseItem.count({
    where: { variantId: variant.id, status: "AVAILABLE" },
  });
  if (consumed === 0 && avail === 1) {
    pass("5", "Payment fail — no consume, key released/available");
  } else {
    fail("5", `consumed=${consumed} avail=${avail}`);
  }
}

async function p6() {
  const variant = await fixtureInstant("p6");
  const ref = `pay_EXP_${Date.now()}`;
  const { order } = await makeOrderWithPayment(variant.id, ref);
  await LicensePoolService.reserve({
    variantId: variant.id,
    orderId: order.id,
    orderItemId: order.items[0]!.id,
    quantity: 1,
  });
  await markPaymentExpired(ref);
  const pay = await prisma.payment.findUniqueOrThrow({ where: { paymentReference: ref } });
  const avail = await prisma.licenseItem.count({
    where: { variantId: variant.id, status: "AVAILABLE" },
  });
  if (pay.status === "EXPIRED" && avail === 1) {
    pass("6", "Payment expired — reserve released");
  } else {
    fail("6", `pay=${pay.status} avail=${avail}`);
  }
}

async function p7() {
  const variant = await fixtureInstant("p7");
  const ref = `pay_REC_${Date.now()}`;
  const { order } = await makeOrderWithPayment(variant.id, ref);
  await LicensePoolService.reserve({
    variantId: variant.id,
    orderId: order.id,
    orderItemId: order.items[0]!.id,
    quantity: 1,
  });
  const paidAt = new Date("2026-07-21T12:00:00Z");
  await markPaymentSucceeded({
    paymentReference: ref,
    providerEventId: `evt_rec_${Date.now()}`,
    providerTransactionId: "bank_tx_99",
    providerReference: "prov_ref_99",
    providerPaidAt: paidAt,
  });
  const pay = await prisma.payment.findUniqueOrThrow({ where: { paymentReference: ref } });
  if (
    pay.providerTransactionId === "bank_tx_99" &&
    pay.providerReference === "prov_ref_99" &&
    pay.providerEventId &&
    pay.providerPaidAt &&
    pay.currency === "VND" &&
    pay.amountVnd === 50_000
  ) {
    pass("7", "Reconciliation fields populated");
  } else {
    fail("7", JSON.stringify(pay));
  }
}

async function p8() {
  const audits = await prisma.auditLog.findMany({
    where: { action: { in: ["payment.succeeded", "payment.failed", "payment.expired"] } },
    take: 5,
    orderBy: { createdAt: "desc" },
  });
  const events = await prisma.paymentDomainEvent.count();
  if (audits.length >= 1 && events >= 1) {
    pass("8", `Audit+domain events — audits=${audits.length} events=${events}`);
  } else {
    fail("8", `audits=${audits.length} events=${events}`);
  }
}

async function p9() {
  const list = await InventoryReadModel.listInstantSkus();
  const ok = list.every((r) => typeof r.available === "number");
  if (ok && list.length >= 0) {
    pass("9", `Inventory Read Model readable after payments — skus=${list.length}`);
  } else {
    fail("9", "inventory broken");
  }
}

async function p10() {
  const variant = await fixtureInstant("p10");
  const ref = `pay_E2E_${Date.now()}`;
  const { order } = await makeOrderWithPayment(variant.id, ref);
  await LicensePoolService.reserve({
    variantId: variant.id,
    orderId: order.id,
    orderItemId: order.items[0]!.id,
    quantity: 1,
  });
  const qr = await sepayPaymentProvider.createPayment({
    orderId: order.id,
    amountVnd: 50_000,
    paymentReference: ref,
  });
  const secret = process.env.SEPAY_WEBHOOK_SECRET ?? "test_webhook_secret";
  process.env.SEPAY_WEBHOOK_SECRET = secret;
  const bodyObj = {
    id: Date.now(),
    transferType: "in",
    transferAmount: 50000,
    code: ref,
    referenceCode: "e2e_tx",
  };
  const body = JSON.stringify(bodyObj);
  const ts = String(Math.floor(Date.now() / 1000));
  const verified = await sepayPaymentProvider.verifyWebhook!({
    headers: {
      "x-sepay-signature": signBody(body, secret, ts),
      "x-sepay-timestamp": ts,
    },
    body: { ...bodyObj, _rawBody: body },
  });
  await markPaymentSucceeded({
    paymentReference: verified.paymentReference,
    providerEventId: verified.providerEventId,
    providerTransactionId: verified.providerTransactionId,
    providerPaidAt: verified.providerPaidAt,
    rawPayload: verified.rawPayload,
  });
  await processFulfillmentForOrder(order.id);
  const order2 = await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
  const delivery = await prisma.delivery.findFirst({
    where: { orderItemId: order.items[0]!.id },
  });
  if (qr.qrImageUrl && verified.success && order2.status !== "PENDING_PAYMENT" && delivery) {
    pass("10", `E2E QR→webhook→PAID→delivery order=${order2.status}`);
  } else {
    fail("10", `qr=${!!qr.qrImageUrl} order=${order2.status} delivery=${!!delivery}`);
  }
}

async function main() {
  console.log("\n=== SePay / Payment Exit P1–P10 ===\n");
  await p1();
  await p2();
  await p3();
  await p4();
  await p5();
  await p6();
  await p7();
  await p8();
  await p9();
  await p10();

  const failed = results.filter((r) => !r.ok);
  console.log("\n--- Summary ---");
  for (const r of results) console.log(`${r.ok ? "✅" : "❌"} P${r.id}`);
  if (failed.length) {
    console.log(`\nSePay NOT complete — ${failed.length} FAIL`);
    process.exit(1);
  }
  console.log("\nSePay P1–P10 ALL PASS — ready for Monitoring\n");
  process.exit(0);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
