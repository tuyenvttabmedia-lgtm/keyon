/**
 * B4.2 CommercialAgreement exit C1–C7
 * npm run test:agreements
 */
import { readFileSync } from "fs";
import { join } from "path";
import { prisma } from "../src/lib/db";

type R = { id: string; ok: boolean; detail: string };
const results: R[] = [];

function pass(id: string, detail: string) {
  results.push({ id, ok: true, detail });
  console.log(`C${id} ✅ PASS  ${detail}`);
}
function fail(id: string, detail: string) {
  results.push({ id, ok: false, detail });
  console.log(`C${id} ❌ FAIL  ${detail}`);
}

function read(p: string) {
  return readFileSync(p, "utf8");
}

const schemaPath = join(process.cwd(), "prisma", "schema.prisma");

function c1() {
  const schema = read(schemaPath);
  const orderBlock = schema.match(/model Order \{[\s\S]*?\n\}/)?.[0] ?? "";
  const banned = /agreementId|poNumber|contractRef/.test(orderBlock);
  if (!banned) {
    pass("1", "Order không agreementId/poNumber/contractRef");
  } else {
    fail("1", "Order có cột HĐ — vi phạm ADR-010");
  }
}

function c2() {
  const schema = read(schemaPath);
  const hasA = /model CommercialAgreement\b/.test(schema);
  const hasJ = /model CommercialAgreementOrder\b/.test(schema);
  if (hasA && hasJ) {
    pass("2", "CommercialAgreement + join table");
  } else {
    fail("2", `agreement=${hasA} join=${hasJ}`);
  }
}

function c3() {
  const schema = read(schemaPath);
  const pay = schema.match(/model Payment \{[\s\S]*?\n\}/)?.[0] ?? "";
  if (!/agreementId/.test(pay)) {
    pass("3", "Payment không agreementId");
  } else {
    fail("3", "Payment có agreementId");
  }
}

function c4() {
  const account = join(process.cwd(), "src", "app", "(storefront)", "account");
  const files = [
    join(account, "page.tsx"),
    join(account, "orders", "page.tsx"),
    join(account, "orders", "[orderId]", "page.tsx"),
  ];
  const leaked = files.some((f) => /admin\/agreements|CommercialAgreement/.test(read(f)));
  if (!leaked) {
    pass("4", "Storefront account không đọc khung HĐ");
  } else {
    fail("4", "account leak agreement");
  }
}

function c5() {
  const schema = read(schemaPath);
  const enumBlock = schema.match(/enum OrderStatus \{[\s\S]*?\n\}/)?.[0] ?? "";
  if (!/CONTRACT|AGREEMENT/.test(enumBlock)) {
    pass("5", "OrderStatus không thêm state HĐ");
  } else {
    fail("5", enumBlock.replace(/\s+/g, " ").slice(0, 120));
  }
}

function c6() {
  const src = read(join(process.cwd(), "src", "server", "admin", "agreements.ts"));
  const joinCreate = /commercialAgreementOrder\.create/.test(src);
  const noOrderUpdate = !/prisma\.order\.update/.test(src);
  if (joinCreate && noOrderUpdate) {
    pass("6", "Gắn đơn qua join, không order.update");
  } else {
    fail("6", `join=${joinCreate} noUpdate=${noOrderUpdate}`);
  }
}

async function c7() {
  const order = await prisma.order.findFirst({
    select: { id: true, status: true, code: true },
    orderBy: { createdAt: "desc" },
  });
  const title = `__exit_agr_${Date.now()}`;
  const agr = await prisma.commercialAgreement.create({
    data: { title },
  });
  if (!order) {
    await prisma.commercialAgreement.delete({ where: { id: agr.id } });
    pass("7", "Tạo khung HĐ OK; skip gắn đơn (không có Order)");
    return;
  }
  await prisma.commercialAgreementOrder.create({
    data: { agreementId: agr.id, orderId: order.id },
  });
  const after = await prisma.order.findUnique({
    where: { id: order.id },
    select: { status: true },
  });
  await prisma.commercialAgreement.delete({ where: { id: agr.id } });
  const leftover = await prisma.commercialAgreementOrder.count({
    where: { orderId: order.id, agreementId: agr.id },
  });
  if (after?.status === order.status && leftover === 0) {
    pass("7", "Gắn/xóa khung không đổi Order.status");
  } else {
    fail("7", `status ${order.status} → ${after?.status} leftover=${leftover}`);
  }
}

async function main() {
  c1();
  c2();
  c3();
  c4();
  c5();
  c6();
  try {
    await c7();
  } catch (e) {
    fail("7", e instanceof Error ? e.message : String(e));
  }
  const failed = results.filter((r) => !r.ok);
  console.log(
    failed.length
      ? `\nAGREEMENT EXIT ${failed.map((f) => "C" + f.id).join(", ")} FAIL`
      : "\nAGREEMENT EXIT C1–C7 PASS",
  );
  process.exit(failed.length ? 1 : 0);
}

void main();
