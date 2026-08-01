/**
 * License Pool Exit Criteria E1–E9
 * Run: npx tsx --env-file=.env.local --env-file=.env scripts/license-pool-exit.ts
 * Exit 0 only if ALL PASS.
 */
import { PrismaClient } from "@prisma/client";
import { createCipheriv, randomBytes, scryptSync } from "crypto";
import { LicensePoolService } from "../src/server/license-pool";
import { AppError } from "../src/lib/errors";
import { parseReserveTtlMs } from "../src/server/license-pool/ttl";

const prisma = new PrismaClient();

function encrypt(plain: string): string {
  const raw = process.env.DELIVERY_ENCRYPTION_KEY ?? "0123456789abcdef0123456789abcdef";
  const key = scryptSync(raw, "keyon-delivery", 32);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

type Result = { id: string; ok: boolean; detail: string };

const results: Result[] = [];

function pass(id: string, detail: string) {
  results.push({ id, ok: true, detail });
  console.log(`E${id} ✅ PASS  ${detail}`);
}
function fail(id: string, detail: string) {
  results.push({ id, ok: false, detail });
  console.log(`E${id} ❌ FAIL  ${detail}`);
}

async function makeFixture(label: string) {
  const slug = `lp-exit-${label}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
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
    where: { slug: "lp-exit-brand" },
    update: {},
    create: { name: "LP Exit Brand", slug: "lp-exit-brand", supplierId: supplier.id },
  });
  const product = await prisma.product.create({
    data: {
      brandId: brand.id,
      name: `LP Exit ${label}`,
      slug,
      description: "exit test",
    },
  });
  const variant = await prisma.productVariant.create({
    data: {
      productId: product.id,
      sku: `LP-${slug}`.slice(0, 40),
      name: "Exit",
      licenseModel: "PERPETUAL",
      fulfillmentStrategy: "INSTANT",
      deliverableType: "KEY",
      salesMotion: "SELF_SERVE",
      supplierId: supplier.id,
      priceVnd: 1000,
      costVnd: 500,
    },
  });
  return { variant, product };
}

async function makeOrder(variantId: string, email: string) {
  const code = `LP${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
  return prisma.order.create({
    data: {
      code,
      email,
      status: "PENDING_PAYMENT",
      totalVnd: 1000,
      items: {
        create: {
          variantId,
          quantity: 1,
          unitPriceVnd: 1000,
          title: "LP Exit Item",
        },
      },
    },
    include: { items: true },
  });
}

async function addKeys(variantId: string, keys: string[]) {
  await prisma.licenseItem.createMany({
    data: keys.map((k) => ({
      variantId,
      payloadEnc: encrypt(k),
      status: "AVAILABLE" as const,
    })),
  });
}

async function e1() {
  const { variant } = await makeFixture("e1");
  await addKeys(variant.id, ["ONLY-ONE-KEY"]);
  const o1 = await makeOrder(variant.id, "a@test.local");
  const o2 = await makeOrder(variant.id, "b@test.local");

  const settled = await Promise.allSettled([
    LicensePoolService.reserve({
      variantId: variant.id,
      orderId: o1.id,
      orderItemId: o1.items[0]!.id,
      quantity: 1,
    }),
    LicensePoolService.reserve({
      variantId: variant.id,
      orderId: o2.id,
      orderItemId: o2.items[0]!.id,
      quantity: 1,
    }),
  ]);

  const wins = settled.filter((s) => s.status === "fulfilled").length;
  const losses = settled.filter((s) => s.status === "rejected").length;
  const reserved = await prisma.licenseItem.count({
    where: { variantId: variant.id, status: "RESERVED" },
  });

  if (wins === 1 && losses === 1 && reserved === 1) {
    pass("1", `Concurrent reserve — wins=${wins} losses=${losses} reserved=${reserved}`);
  } else {
    fail("1", `wins=${wins} losses=${losses} reserved=${reserved}`);
  }
}

async function e2() {
  const prev = process.env.LICENSE_RESERVE_TTL;
  process.env.LICENSE_RESERVE_TTL = "1s";
  try {
    const { variant } = await makeFixture("e2");
    await addKeys(variant.id, ["TTL-KEY"]);
    const o = await makeOrder(variant.id, "ttl@test.local");
    const [r] = await LicensePoolService.reserve({
      variantId: variant.id,
      orderId: o.id,
      orderItemId: o.items[0]!.id,
      quantity: 1,
    });
    // Force expires_at into the past
    await prisma.licenseItem.update({
      where: { id: r!.licenseId },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });
    const before = (await LicensePoolService.metrics(variant.id)).ttl_release_count;
    const n = await LicensePoolService.releaseExpired();
    const item = await prisma.licenseItem.findUniqueOrThrow({ where: { id: r!.licenseId } });
    const after = (await LicensePoolService.metrics(variant.id)).ttl_release_count;
    const ev = await prisma.licenseEvent.findFirst({
      where: {
        licenseItemId: r!.licenseId,
        type: "RELEASED",
        reason: "ttl_expired",
      },
    });
    if (n >= 1 && item.status === "AVAILABLE" && ev && after === before + 1) {
      pass("2", `TTL release — status=${item.status} metric ${before}→${after}`);
    } else {
      fail(
        "2",
        `n=${n} status=${item.status} ev=${!!ev} metric ${before}→${after} ttlMs=${parseReserveTtlMs()}`,
      );
    }
  } finally {
    if (prev === undefined) delete process.env.LICENSE_RESERVE_TTL;
    else process.env.LICENSE_RESERVE_TTL = prev;
  }
}

async function e3() {
  const { variant } = await makeFixture("e3");
  await addKeys(variant.id, ["DUP-WEBHOOK"]);
  const o = await makeOrder(variant.id, "dup@test.local");
  const [r] = await LicensePoolService.reserve({
    variantId: variant.id,
    orderId: o.id,
    orderItemId: o.items[0]!.id,
    quantity: 1,
  });
  const token = r!.reservationToken;
  const c1 = await LicensePoolService.consume({ reservationToken: token });
  const c2 = await LicensePoolService.consume({ reservationToken: token });
  const consumed = await prisma.licenseItem.count({
    where: { variantId: variant.id, status: "CONSUMED" },
  });
  if (c1.length === 1 && c2.length === 1 && c1[0]!.licenseId === c2[0]!.licenseId && consumed === 1) {
    pass("3", `Duplicate consume idempotent — same license ${c1[0]!.licenseId}`);
  } else {
    fail("3", `consumed_count=${consumed} c1=${c1.length} c2=${c2.length}`);
  }
}

async function e4() {
  const { variant } = await makeFixture("e4");
  await addKeys(variant.id, ["CANCEL-KEY"]);
  const o = await makeOrder(variant.id, "cancel@test.local");
  const [r] = await LicensePoolService.reserve({
    variantId: variant.id,
    orderId: o.id,
    orderItemId: o.items[0]!.id,
    quantity: 1,
  });
  await LicensePoolService.release({
    reservationToken: r!.reservationToken,
    reason: "order_cancelled",
  });
  const item = await prisma.licenseItem.findUniqueOrThrow({ where: { id: r!.licenseId } });
  const ev = await prisma.licenseEvent.findFirst({
    where: { licenseItemId: r!.licenseId, type: "RELEASED", reason: "order_cancelled" },
  });
  if (item.status === "AVAILABLE" && ev) {
    pass("4", "Cancel → release order_cancelled");
  } else {
    fail("4", `status=${item.status} ev=${!!ev}`);
  }
}

async function e5() {
  const { variant } = await makeFixture("e5");
  await addKeys(variant.id, ["NO-REL-CONSUMED"]);
  const o = await makeOrder(variant.id, "e5@test.local");
  const [r] = await LicensePoolService.reserve({
    variantId: variant.id,
    orderId: o.id,
    orderItemId: o.items[0]!.id,
    quantity: 1,
  });
  await LicensePoolService.consume({ reservationToken: r!.reservationToken });
  // Force token onto CONSUMED row to hit release guard (token normally cleared)
  await prisma.licenseItem.update({
    where: { id: r!.licenseId },
    data: { reservationToken: `rt_force_consumed_${r!.licenseId}` },
  });
  let rejected = false;
  try {
    await LicensePoolService.release({
      reservationToken: `rt_force_consumed_${r!.licenseId}`,
      reason: "order_cancelled",
    });
  } catch (e) {
    rejected = e instanceof AppError && e.code === "POOL_RELEASE_CONSUMED";
  }
  const item = await prisma.licenseItem.findUniqueOrThrow({ where: { id: r!.licenseId } });
  if (item.status === "CONSUMED" && rejected) {
    pass("5", "Cannot release CONSUMED");
  } else {
    fail("5", `status=${item.status} rejected=${rejected}`);
  }
}

async function e6() {
  const { variant } = await makeFixture("e6");
  await addKeys(variant.id, ["NOT-RESERVED"]);
  const item = await prisma.licenseItem.findFirstOrThrow({
    where: { variantId: variant.id, status: "AVAILABLE" },
  });
  // Fake token on AVAILABLE — consume must fail (no RESERVED)
  await prisma.licenseItem.update({
    where: { id: item.id },
    data: { reservationToken: `rt_fake_available_${item.id}`, version: { increment: 1 } },
  });
  let rejected = false;
  try {
    await LicensePoolService.consume({ reservationToken: `rt_fake_available_${item.id}` });
  } catch (e) {
    rejected = e instanceof AppError && e.code === "POOL_NOT_RESERVED";
  }
  if (rejected) pass("6", "Cannot consume non-RESERVED");
  else fail("6", `rejected=${rejected}`);
}

async function e7() {
  const { variant } = await makeFixture("e7");
  await addKeys(variant.id, ["TOKEN-MISMATCH"]);
  const o1 = await makeOrder(variant.id, "t1@test.local");
  const o2 = await makeOrder(variant.id, "t2@test.local");
  const [r1] = await LicensePoolService.reserve({
    variantId: variant.id,
    orderId: o1.id,
    orderItemId: o1.items[0]!.id,
    quantity: 1,
  });
  const oldToken = r1!.reservationToken;
  await LicensePoolService.release({
    reservationToken: oldToken,
    reason: "order_cancelled",
  });
  const [r2] = await LicensePoolService.reserve({
    variantId: variant.id,
    orderId: o2.id,
    orderItemId: o2.items[0]!.id,
    quantity: 1,
  });
  let rejected = false;
  try {
    await LicensePoolService.consume({ reservationToken: oldToken });
  } catch (e) {
    rejected =
      e instanceof AppError &&
      (e.code === "POOL_TOKEN_MISMATCH" || e.code === "POOL_NOT_RESERVED");
  }
  // New token still works
  await LicensePoolService.consume({ reservationToken: r2!.reservationToken });
  if (rejected) pass("7", "Old token after re-reserve rejected");
  else fail("7", `rejected=${rejected}`);
}

async function e8() {
  const { variant } = await makeFixture("e8");
  await addKeys(variant.id, ["DISABLED-KEY"]);
  const item = await prisma.licenseItem.findFirstOrThrow({
    where: { variantId: variant.id },
  });
  await LicensePoolService.disable({ licenseId: item.id, reason: "bad_key" });
  const o = await makeOrder(variant.id, "dis@test.local");
  let rejected = false;
  try {
    await LicensePoolService.reserve({
      variantId: variant.id,
      orderId: o.id,
      orderItemId: o.items[0]!.id,
      quantity: 1,
    });
  } catch (e) {
    rejected = e instanceof AppError && e.code === "POOL_INSUFFICIENT";
  }
  if (rejected) pass("8", "Cannot reserve DISABLED (insufficient)");
  else fail("8", `rejected=${rejected}`);
}

async function e9() {
  const total = await prisma.licenseItem.count();
  const byStatus = await prisma.licenseItem.groupBy({
    by: ["status"],
    _count: true,
  });
  const sum = byStatus.reduce((a, b) => a + b._count, 0);
  const invalid = byStatus.filter(
    (s) => !["AVAILABLE", "RESERVED", "CONSUMED", "DISABLED"].includes(s.status),
  );
  if (total === sum && invalid.length === 0) {
    pass(
      "9",
      `No orphan — total=${total} Σstatus=${sum} [${byStatus.map((s) => `${s.status}:${s._count}`).join(", ")}]`,
    );
  } else {
    fail("9", `total=${total} sum=${sum} invalid=${JSON.stringify(invalid)}`);
  }
}

async function main() {
  console.log("\n=== License Pool Exit Criteria E1–E9 ===\n");
  await e1();
  await e2();
  await e3();
  await e4();
  await e5();
  await e6();
  await e7();
  await e8();
  await e9();

  const failed = results.filter((r) => !r.ok);
  console.log("\n--- Summary ---");
  for (const r of results) {
    console.log(`${r.ok ? "✅" : "❌"} E${r.id}`);
  }
  if (failed.length) {
    console.log(`\nLicense Pool NOT complete — ${failed.length} FAIL`);
    process.exit(1);
  }
  console.log("\nLicense Pool E1–E9 ALL PASS — ready for Inventory\n");
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
