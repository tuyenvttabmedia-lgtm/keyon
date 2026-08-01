/**
 * Dashboard Exit D1–D6
 * npm run test:dashboard
 */
import { readFileSync } from "fs";
import { join } from "path";
import { loadDashboardView } from "../src/server/dashboard-read-model";
import { recordWebhookProcessed } from "../src/server/payment/kpis";

type R = { id: string; ok: boolean; detail: string };
const results: R[] = [];

function pass(id: string, detail: string) {
  results.push({ id, ok: true, detail });
  console.log(`D${id} ✅ PASS  ${detail}`);
}
function fail(id: string, detail: string) {
  results.push({ id, ok: false, detail });
  console.log(`D${id} ❌ FAIL  ${detail}`);
}

const pagePath = join(process.cwd(), "src", "app", "admin", "page.tsx");

function d1() {
  const src = readFileSync(pagePath, "utf8");
  const usesIrm =
    /InventoryReadModel|loadDashboardView|dashboard-read-model/.test(src);
  const noLicenseItem = !/prisma\.licenseItem|licenseItem\.count/.test(src);
  if (usesIrm && noLicenseItem) {
    pass("1", "Dashboard dùng Inventory Read Model / facade — không LicenseItem");
  } else {
    fail("1", `usesIrm=${usesIrm} noLicenseItem=${noLicenseItem}`);
  }
}

function d2() {
  const src = readFileSync(pagePath, "utf8");
  const usesPayMetrics =
    /monitoring\.payment|mon\.payment|avg_webhook|payment\.avg/.test(src) ||
    /loadDashboardView/.test(src);
  const noPrismaPayment = !/prisma\.payment/.test(src);
  if (usesPayMetrics && noPrismaPayment) {
    pass("2", "Payment widget ← Monitoring payment metrics — không Prisma Payment");
  } else {
    fail("2", `usesPayMetrics=${usesPayMetrics} noPrismaPayment=${noPrismaPayment}`);
  }
}

function d3() {
  const src = readFileSync(pagePath, "utf8");
  const usesQueue =
    /queues\.waiting|mon\.queues|Queue Depth|loadDashboardView/.test(src);
  if (usesQueue) {
    pass("3", "Queue widget ← Monitoring");
  } else {
    fail("3", "missing queue metrics usage");
  }
}

function d4() {
  const src = readFileSync(pagePath, "utf8");
  const hasPrisma = /from \"@\/lib\/db\"|prisma\./.test(src);
  const hasThresholdLogic =
    /available\s*<\s*|lowStockThreshold|threshold\s*</.test(src);
  const usesStockStatus = /stock_status|LOW_STOCK|OUT_OF_STOCK|low_stock_skus/.test(src);
  if (!hasPrisma && !hasThresholdLogic && usesStockStatus) {
    pass("4", "Không Prisma Domain · không soft-threshold · dùng stock_status/low_stock_skus");
  } else {
    fail(
      "4",
      `prisma=${hasPrisma} thresholdLogic=${hasThresholdLogic} stockStatus=${usesStockStatus}`,
    );
  }
}

async function d5() {
  recordWebhookProcessed(10, false);
  const t0 = Date.now();
  await loadDashboardView();
  const ms = Date.now() - t0;
  if (ms < 500) {
    pass("5", `Cold loadDashboardView ${ms}ms < 500ms`);
  } else {
    fail("5", `${ms}ms >= 500ms`);
  }
}

async function d6() {
  const src = readFileSync(pagePath, "utf8");
  // Page should not loop await in map over prisma; single loadDashboardView / Promise.all
  const nPlusOneSmell =
    /\.map\s*\([^)]*await/.test(src) ||
    /for\s*\(.*of.*\)\s*\{[^}]*await.*prisma/.test(src);
  const singleFacade = /loadDashboardView\(/.test(src);
  const view = await loadDashboardView();
  if (!nPlusOneSmell && singleFacade && view.inventory && view.monitoring) {
    pass("6", "Một facade loadDashboardView — không N+1 trên page");
  } else {
    fail("6", `nPlusOneSmell=${nPlusOneSmell} facade=${singleFacade}`);
  }
}

async function main() {
  console.log("\n=== Dashboard Exit D1–D6 ===\n");
  d1();
  d2();
  d3();
  d4();
  await d5();
  await d6();

  const failed = results.filter((r) => !r.ok);
  console.log("\n--- Summary ---");
  for (const r of results) console.log(`${r.ok ? "✅" : "❌"} D${r.id}`);
  if (failed.length) {
    console.log(`\nDashboard NOT complete — ${failed.length} FAIL`);
    process.exit(1);
  }
  console.log("\nDashboard D1–D6 ALL PASS — ready for Backup\n");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
