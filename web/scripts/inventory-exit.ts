/**
 * Inventory Read Model Exit Criteria I1–I6
 * Run: npm run test:inventory
 */
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import { createCipheriv, randomBytes, scryptSync } from "crypto";
import { InventoryReadModel } from "../src/server/inventory-read-model";
import { LicensePoolService } from "../src/server/license-pool";
import { stockStatus as stockStatusFn } from "../src/server/inventory-read-model/types";

const prisma = new PrismaClient();

type Result = { id: string; ok: boolean; detail: string };
const results: Result[] = [];

function pass(id: string, detail: string) {
  results.push({ id, ok: true, detail });
  console.log(`I${id} ✅ PASS  ${detail}`);
}
function fail(id: string, detail: string) {
  results.push({ id, ok: false, detail });
  console.log(`I${id} ❌ FAIL  ${detail}`);
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

async function i1() {
  const variant = await prisma.productVariant.findFirst({
    where: { fulfillmentStrategy: "INSTANT", active: true },
  });
  if (!variant) {
    fail("1", "No Instant variant in DB — seed first");
    return;
  }
  const ok = await InventoryReadModel.assertMatchesPool(variant.sku);
  const row = await InventoryReadModel.getBySku(variant.sku);
  const m = await LicensePoolService.metrics(variant.id);
  if (
    ok &&
    row.available === m.available_count &&
    row.reserved === m.reserved_count &&
    row.consumed === m.consumed_count &&
    row.disabled === m.disabled_count
  ) {
    pass("1", `Metrics khớp Pool for ${variant.sku} avail=${row.available}`);
  } else {
    fail("1", `mismatch row=${JSON.stringify(row)} pool=${JSON.stringify(m)}`);
  }
}

async function i2() {
  const schemaPath = join(process.cwd(), "prisma", "schema.prisma");
  const schema = readFileSync(schemaPath, "utf8");
  const forbidden = ["stock_quantity", "remaining_quantity", "sold_quantity", "model StockInventory", "model InventoryStock"];
  const hit = forbidden.filter((f) => schema.includes(f));
  // Also ensure no second inventory table migration creating quantity columns
  const migDir = join(process.cwd(), "prisma", "migrations");
  let migHit: string[] = [];
  if (existsSync(migDir)) {
    for (const dir of readdirSync(migDir)) {
      const sql = join(migDir, dir, "migration.sql");
      if (!existsSync(sql)) continue;
      const text = readFileSync(sql, "utf8");
      for (const f of forbidden) {
        if (text.includes(f)) migHit.push(`${dir}:${f}`);
      }
    }
  }
  if (hit.length === 0 && migHit.length === 0) {
    pass("2", "Không có bảng/cột stock quantity thứ hai");
  } else {
    fail("2", `schema=${hit.join(",")} mig=${migHit.join(",")}`);
  }
}

async function i3() {
  // Pure function + fixture with threshold
  const a = stockStatusFn(0, 10);
  const b = stockStatusFn(5, 10);
  const c = stockStatusFn(10, 10);
  const d = stockStatusFn(11, 10);
  if (a !== "OUT_OF_STOCK" || b !== "LOW_STOCK" || c !== "OK" || d !== "OK") {
    fail("3", `status fn a=${a} b=${b} c=${c} d=${d}`);
    return;
  }

  const supplier = await prisma.supplier.upsert({
    where: { name: "KEYON Stock" },
    update: {},
    create: { name: "KEYON Stock", supplierType: "INTERNAL", integrationMode: "NONE" },
  });
  const brand = await prisma.brand.upsert({
    where: { slug: "inv-i3-brand" },
    update: {},
    create: { name: "Inv I3", slug: "inv-i3-brand", supplierId: supplier.id },
  });
  const slug = `inv-i3-${Date.now()}`;
  const product = await prisma.product.create({
    data: { brandId: brand.id, name: "I3", slug, description: "i3" },
  });
  const variant = await prisma.productVariant.create({
    data: {
      productId: product.id,
      sku: `I3-${slug}`.slice(0, 40),
      name: " thr5",
      licenseModel: "PERPETUAL",
      fulfillmentStrategy: "INSTANT",
      deliverableType: "KEY",
      salesMotion: "SELF_SERVE",
      supplierId: supplier.id,
      priceVnd: 1000,
      lowStockThreshold: 5,
    },
  });
  // 3 available → LOW_STOCK vs thr 5
  await prisma.licenseItem.createMany({
    data: [1, 2, 3].map((n) => ({
      variantId: variant.id,
      payloadEnc: encrypt(`I3-KEY-${n}`),
      status: "AVAILABLE" as const,
    })),
  });
  const row = await InventoryReadModel.getBySku(variant.sku);
  if (row.stock_status === "LOW_STOCK" && row.available === 3 && row.low_stock_threshold === 5) {
    pass("3", `Low stock OK — avail=3 thr=5 → ${row.stock_status}`);
  } else {
    fail("3", `got status=${row.stock_status} avail=${row.available} thr=${row.low_stock_threshold}`);
  }
}

async function i4() {
  const summary = await InventoryReadModel.dashboardSummary();
  const pool = await LicensePoolService.metrics();
  // Dashboard available must equal pool available for Instant SKUs only —
  // Instant-only sum vs global pool: compare via listInstantSkus sum
  const list = await InventoryReadModel.listInstantSkus();
  const sumAvail = list.reduce((a, r) => a + r.available, 0);
  if (summary.available === sumAvail && summary.skus.length === list.length) {
    pass(
      "4",
      `Dashboard summary via Read Model — available=${summary.available} skus=${summary.skus.length} (pool global avail=${pool.available_count})`,
    );
  } else {
    fail("4", `summary.available=${summary.available} sum=${sumAvail}`);
  }
}

async function i5() {
  const adminPage = join(process.cwd(), "src", "app", "admin", "page.tsx");
  const src = readFileSync(adminPage, "utf8");
  const hasPrismaLicenseItem = /prisma\.licenseItem/.test(src);
  const usesReadModel =
    /InventoryReadModel/.test(src) ||
    /dashboard-read-model/.test(src) ||
    /loadDashboardView/.test(src);
  if (!hasPrismaLicenseItem && usesReadModel) {
    pass("5", "Admin Dashboard không prisma.licenseItem — dùng Inventory Read Model / facade");
  } else {
    fail("5", `hasPrismaLicenseItem=${hasPrismaLicenseItem} usesReadModel=${usesReadModel}`);
  }
}

async function i6() {
  const started = Date.now();
  await InventoryReadModel.listInstantSkus();
  const ms = Date.now() - started;
  if (ms < 200) {
    pass("6", `listInstantSkus ${ms}ms < 200ms`);
  } else {
    fail("6", `listInstantSkus ${ms}ms >= 200ms`);
  }
}

async function main() {
  console.log("\n=== Inventory Read Model Exit I1–I6 ===\n");
  await i1();
  await i2();
  await i3();
  await i4();
  await i5();
  await i6();

  const failed = results.filter((r) => !r.ok);
  console.log("\n--- Summary ---");
  for (const r of results) console.log(`${r.ok ? "✅" : "❌"} I${r.id}`);
  if (failed.length) {
    console.log(`\nInventory Read Model NOT complete — ${failed.length} FAIL`);
    process.exit(1);
  }
  console.log("\nInventory Read Model I1–I6 ALL PASS — ready for SePay\n");
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
