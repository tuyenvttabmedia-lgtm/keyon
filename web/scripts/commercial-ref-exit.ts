/**
 * B4.1 commercial ref exit R1–R6
 * npm run test:commercial-ref
 */
import { readFileSync } from "fs";
import { join } from "path";
import { prisma } from "../src/lib/db";
import {
  COMMERCIAL_REF_MARKER,
  formatCommercialRefNote,
  latestCommercialRef,
  parseCommercialRefNote,
} from "../src/server/admin/commercial-ref";

type R = { id: string; ok: boolean; detail: string };
const results: R[] = [];

function pass(id: string, detail: string) {
  results.push({ id, ok: true, detail });
  console.log(`R${id} ✅ PASS  ${detail}`);
}
function fail(id: string, detail: string) {
  results.push({ id, ok: false, detail });
  console.log(`R${id} ❌ FAIL  ${detail}`);
}

const srcRoot = join(process.cwd(), "src");
const schemaPath = join(process.cwd(), "prisma", "schema.prisma");

function read(p: string) {
  return readFileSync(p, "utf8");
}

function r1() {
  const schema = read(schemaPath);
  const orderBlock = schema.match(/model Order \{[\s\S]*?\n\}/)?.[0] ?? "";
  const hasPo = /poNumber|contractRef|agreementId/.test(orderBlock);
  if (!hasPo) {
    pass("1", "Order không poNumber/contractRef/agreementId");
  } else {
    fail("1", "Order có cột HĐ — vi phạm ADR-009");
  }
}

function r2() {
  const body = formatCommercialRefNote({
    poNumber: "PO-1",
    contractRef: "HD-88",
  });
  const parsed = parseCommercialRefNote(body);
  const latest = latestCommercialRef([
    { body: "ops note", createdAt: new Date(1) },
    { body, createdAt: new Date(2) },
  ]);
  const ok =
    body.startsWith(COMMERCIAL_REF_MARKER) &&
    parsed?.poNumber === "PO-1" &&
    parsed.contractRef === "HD-88" &&
    latest?.poNumber === "PO-1";
  if (ok) {
    pass("2", "format/parse roundtrip + latest");
  } else {
    fail("2", `body=${body} parsed=${JSON.stringify(parsed)}`);
  }
}

function r3() {
  const api = read(
    join(srcRoot, "app", "api", "admin", "orders", "commercial-ref", "route.ts"),
  );
  const createsNote = /orderNote\.create/.test(api);
  const noOrderUpdate = !/prisma\.order\.update/.test(api);
  const usesHelper = /formatCommercialRefNote/.test(api);
  if (createsNote && noOrderUpdate && usesHelper) {
    pass("3", "API Admin tạo OrderNote, không order.update");
  } else {
    fail(
      "3",
      `note=${createsNote} noUpdate=${noOrderUpdate} helper=${usesHelper}`,
    );
  }
}

function r4() {
  const accountRoot = join(srcRoot, "app", "(storefront)", "account");
  const files = [
    join(accountRoot, "page.tsx"),
    join(accountRoot, "orders", "page.tsx"),
    join(accountRoot, "orders", "[orderId]", "page.tsx"),
    join(accountRoot, "assets", "page.tsx"),
  ];
  const leaked = files.some((f) => /commercial-ref/.test(read(f)));
  if (!leaked) {
    pass("4", "Storefront account không import commercial-ref");
  } else {
    fail("4", "account import commercial-ref");
  }
}

function r5() {
  const schema = read(schemaPath);
  const enumBlock =
    schema.match(/enum OrderStatus \{[\s\S]*?\n\}/)?.[0] ?? "";
  const extra = /CONTRACT|AGREEMENT|PO_/.test(enumBlock);
  if (!extra) {
    pass("5", "OrderStatus không thêm state HĐ");
  } else {
    fail("5", enumBlock.replace(/\s+/g, " ").slice(0, 120));
  }
}

async function r6() {
  const order = await prisma.order.findFirst({
    select: { id: true, status: true },
    orderBy: { createdAt: "desc" },
  });
  if (!order) {
    pass("6", "Không có Order — skip live write");
    return;
  }
  const body = formatCommercialRefNote({
    poNumber: `__exit_po_${Date.now()}`,
    contractRef: "",
  });
  const note = await prisma.orderNote.create({
    data: { orderId: order.id, body },
  });
  const after = await prisma.order.findUnique({
    where: { id: order.id },
    select: { status: true },
  });
  const parsed = parseCommercialRefNote(note.body);
  await prisma.orderNote.delete({ where: { id: note.id } });
  if (after?.status === order.status && parsed?.poNumber) {
    pass("6", "Ghi OrderNote không đổi Order.status");
  } else {
    fail("6", `status ${order.status} → ${after?.status}`);
  }
}

async function main() {
  r1();
  r2();
  r3();
  r4();
  r5();
  try {
    await r6();
  } catch (e) {
    fail("6", e instanceof Error ? e.message : String(e));
  }
  const failed = results.filter((r) => !r.ok);
  console.log(
    failed.length
      ? `\nCOMMERCIAL REF EXIT ${failed.map((f) => "R" + f.id).join(", ")} FAIL`
      : "\nCOMMERCIAL REF EXIT R1–R6 PASS",
  );
  process.exit(failed.length ? 1 : 0);
}

void main();
