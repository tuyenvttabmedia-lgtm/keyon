/**
 * Pax8 1 SKU Exit X1–X8
 * npm run test:pax8
 */
import { createCipheriv, randomBytes, scryptSync } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import {
  getSupplierProvisioner,
  resetPax8StubStore,
  pax8StubProvisioner,
} from "../src/server/supplier";
import { createCheckoutOrder } from "../src/server/checkout";
import { markPaymentSucceeded } from "../src/server/payment/money";
import { processFulfillmentForOrder } from "../src/server/fulfillment/engine";
import { LicensePoolService } from "../src/server/license-pool";

const prisma = new PrismaClient();

type R = { id: string; ok: boolean; detail: string };
const results: R[] = [];

function pass(id: string, detail: string) {
  results.push({ id, ok: true, detail });
  console.log(`X${id} ✅ PASS  ${detail}`);
}
function fail(id: string, detail: string) {
  results.push({ id, ok: false, detail });
  console.log(`X${id} ❌ FAIL  ${detail}`);
}

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

async function fixtureSaSku() {
  const slug = `pax8-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const supplier = await prisma.supplier.upsert({
    where: { name: "Pax8" },
    update: {
      supplierType: "DISTRIBUTOR",
      integrationMode: "API",
    },
    create: {
      name: "Pax8",
      supplierType: "DISTRIBUTOR",
      integrationMode: "API",
      notes: "Sprint 2 — 1 SKU sandbox",
    },
  });
  const brand = await prisma.brand.upsert({
    where: { slug: "pax8-pilot-brand" },
    update: {},
    create: {
      name: "Pax8 Pilot",
      slug: "pax8-pilot-brand",
      supplierId: supplier.id,
    },
  });
  const product = await prisma.product.create({
    data: {
      brandId: brand.id,
      name: "M365 Business Basic (Pilot SKU)",
      slug,
      description: "Pax8 1 SKU",
      active: true,
    },
  });
  const variant = await prisma.productVariant.create({
    data: {
      productId: product.id,
      sku: `PX8-${slug}`.slice(0, 40),
      name: "1 seat",
      licenseModel: "SUBSCRIPTION",
      fulfillmentStrategy: "SEMI_AUTOMATED",
      deliverableType: "EXTERNAL_PORTAL",
      salesMotion: "SELF_SERVE",
      supplierId: supplier.id,
      upstreamProductRef: "pax8-product-m365-bb-basic",
      priceVnd: 120_000,
      active: true,
    },
  });
  return { supplier, product, variant };
}

async function x1() {
  process.env.PAX8_DRIVER = "stub";
  const p = await getSupplierProvisioner();
  const iface = join(
    process.cwd(),
    "src",
    "server",
    "supplier",
    "provisioner.ts",
  );
  const src = readFileSync(iface, "utf8");
  if (
    p.name === "pax8_stub" &&
    /interface SupplierProvisioner/.test(src) &&
    /provision\(/.test(src) &&
    /checkProvision\(/.test(src)
  ) {
    pass("1", `SupplierProvisioner + driver=${p.name}`);
  } else {
    fail("1", `name=${p.name}`);
  }
}

async function x2() {
  const { supplier, product, variant } = await fixtureSaSku();
  if (
    supplier.integrationMode === "API" &&
    variant.fulfillmentStrategy === "SEMI_AUTOMATED" &&
    variant.upstreamProductRef &&
    product.id
  ) {
    pass(
      "2",
      `1 Supplier=${supplier.name} · 1 Product · 1 SKU=${variant.sku} ref=${variant.upstreamProductRef}`,
    );
  } else {
    fail("2", "fixture incomplete");
  }
  return variant;
}

async function x3(variantId: string) {
  const checkout = await createCheckoutOrder({
    variantId,
    email: "pax8-x3@keyon.local",
    quantity: 1,
  });
  const reserved = await prisma.licenseItem.count({
    where: { reservedOrderId: checkout.order.id },
  });
  if (checkout.order.status === "PENDING_PAYMENT" && reserved === 0) {
    pass("3", `Checkout SEMI OK order=${checkout.order.code} · no Pool reserve`);
  } else {
    fail(
      "3",
      `status=${checkout.order.status} reserved=${reserved}`,
    );
  }
  return checkout;
}

function x4() {
  const saPath = join(
    process.cwd(),
    "src",
    "server",
    "fulfillment",
    "strategies",
    "semi-automated.ts",
  );
  const src = readFileSync(saPath, "utf8");
  const usesPool =
    /LicensePoolService|license-pool/.test(src) ||
    /\.consume\(|\.reserve\(/.test(src);
  const usesProvisioner = /getSupplierProvisioner|provisioner\.provision/.test(
    src,
  );
  if (!usesPool && usesProvisioner) {
    pass("4", "SA → SupplierProvisioner — không LicensePool");
  } else {
    fail("4", `usesPool=${usesPool} usesProvisioner=${usesProvisioner}`);
  }
}

async function x5() {
  resetPax8StubStore();
  const input = {
    requestId: `idem_${Date.now()}`,
    orderId: "o1",
    orderItemId: "oi1",
    orderCode: "KOTEST",
    upstreamProductRef: "pax8-product-m365-bb-basic",
    quantity: 1,
    customerEmail: "idem@keyon.local",
    deliverableType: "EXTERNAL_PORTAL" as const,
  };
  const a = await pax8StubProvisioner.provision(input);
  const b = await pax8StubProvisioner.provision(input);
  if (a.provisionId === b.provisionId && a.status === "COMPLETED") {
    pass("5", `Idempotent provisionId=${a.provisionId}`);
  } else {
    fail("5", `a=${a.provisionId} b=${b.provisionId}`);
  }
}

async function x6x7() {
  resetPax8StubStore();
  process.env.PAX8_DRIVER = "stub";
  const { variant } = await fixtureSaSku();
  const checkout = await createCheckoutOrder({
    variantId: variant.id,
    email: "pax8-e2e@keyon.local",
    quantity: 1,
  });
  await markPaymentSucceeded({
    paymentReference: checkout.paymentReference,
    providerEventId: `pax8_evt_${Date.now()}`,
    providerTransactionId: `pax8_tx_${Date.now()}`,
    providerPaidAt: new Date(),
    amountVnd: checkout.order.totalVnd,
  });
  await processFulfillmentForOrder(checkout.order.id);

  const delivery = await prisma.delivery.findFirst({
    where: { orderItemId: checkout.order.items[0]!.id },
  });
  const job = await prisma.fulfillmentJob.findFirst({
    where: { orderItemId: checkout.order.items[0]!.id },
  });
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: checkout.order.id },
  });

  const typeOk =
    delivery &&
    (delivery.deliverableType === "EXTERNAL_PORTAL" ||
      delivery.deliverableType === "SUBSCRIPTION");

  if (typeOk) {
    pass("6", `Delivery type=${delivery!.deliverableType}`);
  } else {
    fail("6", `delivery=${delivery?.deliverableType ?? "none"}`);
  }

  if (
    order.status === "COMPLETED" &&
    job?.status === "SUCCEEDED" &&
    job.upstreamProvisionId &&
    delivery
  ) {
    pass(
      "7",
      `E2E COMPLETED provision=${job.upstreamProvisionId} order=${order.code}`,
    );
  } else {
    fail(
      "7",
      `order=${order.status} job=${job?.status} provision=${job?.upstreamProvisionId}`,
    );
  }
}

async function x8() {
  const slug = `inst-reg-${Date.now()}`;
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
    where: { slug: "pax8-reg-brand" },
    update: {},
    create: { name: "Reg", slug: "pax8-reg-brand", supplierId: supplier.id },
  });
  const product = await prisma.product.create({
    data: { brandId: brand.id, name: "Instant Reg", slug, active: true },
  });
  const variant = await prisma.productVariant.create({
    data: {
      productId: product.id,
      sku: `IR-${slug}`.slice(0, 40),
      name: "key",
      licenseModel: "PERPETUAL",
      fulfillmentStrategy: "INSTANT",
      deliverableType: "KEY",
      salesMotion: "SELF_SERVE",
      supplierId: supplier.id,
      priceVnd: 10_000,
      active: true,
    },
  });
  await prisma.licenseItem.create({
    data: {
      variantId: variant.id,
      payloadEnc: encrypt("REG-KEY"),
      status: "AVAILABLE",
    },
  });

  const order = await prisma.order.create({
    data: {
      code: `IR${Date.now()}`,
      email: "reg@keyon.local",
      status: "PAID",
      totalVnd: 10_000,
      paidAt: new Date(),
      items: {
        create: {
          variantId: variant.id,
          quantity: 1,
          unitPriceVnd: 10_000,
          title: "Instant reg",
        },
      },
    },
    include: { items: true },
  });
  const reserved = await LicensePoolService.reserve({
    variantId: variant.id,
    orderId: order.id,
    orderItemId: order.items[0]!.id,
    quantity: 1,
  });
  await LicensePoolService.consume({
    reservationToken: reserved[0]!.reservationToken,
  });
  const consumed = await prisma.licenseItem.count({
    where: { variantId: variant.id, status: "CONSUMED" },
  });
  if (consumed === 1) {
    pass("8", "Instant Pool reserve→consume vẫn hoạt động (không qua Pax8)");
  } else {
    fail("8", `consumed=${consumed}`);
  }
}

async function main() {
  console.log("\n=== KEYON Pax8 1 SKU Exit X1–X8 ===\n");
  process.env.PAX8_DRIVER = "stub";
  // Ensure Admin hybrid does not force http during exit tests
  const { writeJsonFile, defaultSupplierApiSettings } = await import(
    "@/server/cms/store"
  );
  const { resetSupplierProvisionerCache } = await import("@/server/supplier");
  await writeJsonFile("suppliers-api.json", defaultSupplierApiSettings);
  resetSupplierProvisionerCache();
  resetPax8StubStore();

  await x1();
  const variant = await x2();
  await x3(variant.id);
  x4();
  await x5();
  await x6x7();
  await x8();

  const failed = results.filter((r) => !r.ok);
  console.log("\n--- Summary ---");
  for (const r of results) console.log(`${r.ok ? "✅" : "❌"} X${r.id}: ${r.detail}`);
  if (failed.length) {
    console.log(`\n❌ ${failed.length} FAIL\n`);
    process.exit(1);
  }
  console.log("\n✅ ALL X1–X8 PASS — Pax8 1 SKU stub ready\n");
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
