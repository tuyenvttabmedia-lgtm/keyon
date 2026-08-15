/**
 * Organization B3.1 exit O1–O6
 * npm run test:org
 */
import { readFileSync } from "fs";
import { join } from "path";
import { prisma } from "../src/lib/db";

type R = { id: string; ok: boolean; detail: string };
const results: R[] = [];

function pass(id: string, detail: string) {
  results.push({ id, ok: true, detail });
  console.log(`O${id} ✅ PASS  ${detail}`);
}
function fail(id: string, detail: string) {
  results.push({ id, ok: false, detail });
  console.log(`O${id} ❌ FAIL  ${detail}`);
}

const schemaPath = join(process.cwd(), "prisma", "schema.prisma");
const accountOrdersPath = join(
  process.cwd(),
  "src",
  "app",
  "(storefront)",
  "account",
  "orders",
  "page.tsx",
);
const filterPath = join(process.cwd(), "src", "lib", "company-order-filter.ts");

function o1() {
  const schema = readFileSync(schemaPath, "utf8");
  const hasOrg = /model Organization\b/.test(schema);
  const hasMem = /model OrganizationMembership\b/.test(schema);
  const orderBlock = schema.match(/model Order \{[\s\S]*?\n\}/)?.[0] ?? "";
  const orderHasOrgId = /organizationId/.test(orderBlock);
  if (hasOrg && hasMem && !orderHasOrgId) {
    pass("1", "Organization + Membership; Order không organizationId");
  } else {
    fail(
      "1",
      `org=${hasOrg} mem=${hasMem} orderOrgId=${orderHasOrgId}`,
    );
  }
}

function o2() {
  const src = readFileSync(accountOrdersPath, "utf8");
  const whereAccount =
    /userId:\s*session\.id/.test(src) && /email:\s*session\.email/.test(src);
  const noOrgWhere =
    !/organizationMembership|organizationId/.test(src);
  if (whereAccount && noOrgWhere) {
    pass("2", "account/orders scoped userId|email — không org");
  } else {
    fail("2", `whereAccount=${whereAccount} noOrgWhere=${noOrgWhere}`);
  }
}

function o3() {
  const src = readFileSync(accountOrdersPath, "utf8");
  const usesHeuristic = /company-order-filter/.test(src);
  const filterSrc = readFileSync(filterPath, "utf8");
  const forbidsAuth = /Never use for authorization/i.test(filterSrc);
  if (!usesHeuristic && forbidsAuth) {
    pass("3", "heuristic không vào storefront orders; comment cấm auth");
  } else {
    fail("3", `usesHeuristic=${usesHeuristic} forbidsAuth=${forbidsAuth}`);
  }
}

async function o4() {
  const name = `__exit_org_${Date.now()}`;
  const org = await prisma.organization.create({ data: { name } });
  const found = await prisma.organization.findUnique({ where: { id: org.id } });
  await prisma.organization.delete({ where: { id: org.id } });
  if (found?.name === name) {
    pass("4", "Admin-equivalent create Organization trên DB");
  } else {
    fail("4", "create/read org thất bại");
  }
}

async function o5() {
  const before = await prisma.order.count();
  const org = await prisma.organization.create({
    data: { name: `__exit_mem_${Date.now()}` },
  });
  const customer = await prisma.user.findFirst({
    where: { role: "CUSTOMER" },
    select: { id: true },
  });
  if (!customer) {
    await prisma.organization.delete({ where: { id: org.id } });
    pass("5", "Không có CUSTOMER trên DB — skip gán member; Order count không đổi");
    return;
  }
  await prisma.organizationMembership.create({
    data: {
      organizationId: org.id,
      userId: customer.id,
      role: "MEMBER",
      status: "ACTIVE",
    },
  });
  const after = await prisma.order.count();
  await prisma.organization.delete({ where: { id: org.id } });
  if (after === before) {
    pass("5", "Gán member không đụng hàng Order");
  } else {
    fail("5", `orderCount ${before} → ${after}`);
  }
}

function o6() {
  const schema = readFileSync(schemaPath, "utf8");
  const quote = schema.match(/model QuoteRequest \{[\s\S]*?\n\}/)?.[0] ?? "";
  if (!/organizationId/.test(quote)) {
    pass("6", "QuoteRequest không có organizationId");
  } else {
    fail("6", "QuoteRequest có organizationId — vi phạm B3.1");
  }
}

async function main() {
  o1();
  o2();
  o3();
  o6();
  try {
    await o4();
  } catch (e) {
    fail("4", e instanceof Error ? e.message : String(e));
  }
  try {
    await o5();
  } catch (e) {
    fail("5", e instanceof Error ? e.message : String(e));
  }
  const failed = results.filter((r) => !r.ok);
  console.log(
    failed.length
      ? `\nORG EXIT ${failed.map((f) => "O" + f.id).join(", ")} FAIL`
      : "\nORG EXIT O1–O6 PASS",
  );
  process.exit(failed.length ? 1 : 0);
}

void main();
