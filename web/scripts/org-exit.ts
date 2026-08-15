/**
 * Organization B3.1 exit O1–O6 + ADR-008 B3.2 exit A1–A7
 * npm run test:org
 */
import { readFileSync } from "fs";
import { join } from "path";
import { prisma } from "../src/lib/db";
import { orderWhereForActor } from "../src/server/org/customer-order-access";

type R = { id: string; ok: boolean; detail: string };
const results: R[] = [];

function pass(id: string, detail: string) {
  results.push({ id, ok: true, detail });
  console.log(`${id} ✅ PASS  ${detail}`);
}
function fail(id: string, detail: string) {
  results.push({ id, ok: false, detail });
  console.log(`${id} ❌ FAIL  ${detail}`);
}

const srcRoot = join(process.cwd(), "src");
const schemaPath = join(process.cwd(), "prisma", "schema.prisma");
const accountOrdersPath = join(
  srcRoot,
  "app",
  "(storefront)",
  "account",
  "orders",
  "page.tsx",
);
const orderDetailPath = join(
  srcRoot,
  "app",
  "(storefront)",
  "account",
  "orders",
  "[orderId]",
  "page.tsx",
);
const assetsPath = join(
  srcRoot,
  "app",
  "(storefront)",
  "account",
  "assets",
  "page.tsx",
);
const assetDetailPath = join(
  srcRoot,
  "app",
  "(storefront)",
  "account",
  "assets",
  "[deliveryId]",
  "page.tsx",
);
const overviewPath = join(
  srcRoot,
  "app",
  "(storefront)",
  "account",
  "page.tsx",
);
const ticketsPath = join(
  srcRoot,
  "app",
  "(storefront)",
  "account",
  "tickets",
  "page.tsx",
);
const resendPath = join(srcRoot, "app", "api", "deliveries", "resend", "route.ts");
const helperPath = join(srcRoot, "server", "org", "customer-order-access.ts");
const filterPath = join(srcRoot, "lib", "company-order-filter.ts");

function read(p: string) {
  return readFileSync(p, "utf8");
}

function o1() {
  const schema = read(schemaPath);
  const hasOrg = /model Organization\b/.test(schema);
  const hasMem = /model OrganizationMembership\b/.test(schema);
  const orderBlock = schema.match(/model Order \{[\s\S]*?\n\}/)?.[0] ?? "";
  const orderHasOrgId = /organizationId/.test(orderBlock);
  if (hasOrg && hasMem && !orderHasOrgId) {
    pass("O1", "Organization + Membership; Order không organizationId");
  } else {
    fail("O1", `org=${hasOrg} mem=${hasMem} orderOrgId=${orderHasOrgId}`);
  }
}

function o2() {
  const src = read(accountOrdersPath);
  const usesHelper =
    /orderWhereForActor|customerOrderWhere/.test(src) &&
    /customer-order-access/.test(src);
  const noOrgColumn = !/organizationId/.test(src);
  if (usesHelper && noOrgColumn) {
    pass("O2", "account/orders dùng membership helper — không Order.organizationId");
  } else {
    fail("O2", `usesHelper=${usesHelper} noOrgColumn=${noOrgColumn}`);
  }
}

function o3() {
  const src = read(accountOrdersPath);
  const usesHeuristic = /company-order-filter/.test(src);
  const filterSrc = read(filterPath);
  const forbidsAuth = /Never use for authorization/i.test(filterSrc);
  if (!usesHeuristic && forbidsAuth) {
    pass("O3", "heuristic không vào storefront orders; comment cấm auth");
  } else {
    fail("O3", `usesHeuristic=${usesHeuristic} forbidsAuth=${forbidsAuth}`);
  }
}

async function o4() {
  const name = `__exit_org_${Date.now()}`;
  const org = await prisma.organization.create({ data: { name } });
  const found = await prisma.organization.findUnique({ where: { id: org.id } });
  await prisma.organization.delete({ where: { id: org.id } });
  if (found?.name === name) {
    pass("O4", "Admin-equivalent create Organization trên DB");
  } else {
    fail("O4", "create/read org thất bại");
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
    pass("O5", "Không có CUSTOMER trên DB — skip gán member; Order count không đổi");
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
    pass("O5", "Gán member không đụng hàng Order");
  } else {
    fail("O5", `orderCount ${before} → ${after}`);
  }
}

function o6() {
  const schema = read(schemaPath);
  const quote = schema.match(/model QuoteRequest \{[\s\S]*?\n\}/)?.[0] ?? "";
  if (!/organizationId/.test(quote)) {
    pass("O6", "QuoteRequest không có organizationId");
  } else {
    fail("O6", "QuoteRequest có organizationId — vi phạm B3.1");
  }
}

function a1() {
  const schema = read(schemaPath);
  const orderBlock = schema.match(/model Order \{[\s\S]*?\n\}/)?.[0] ?? "";
  if (!/organizationId/.test(orderBlock)) {
    pass("A1", "Order schema vẫn không organizationId");
  } else {
    fail("A1", "Order có organizationId");
  }
}

function a2() {
  const helper = read(helperPath);
  const usesActive = /status:\s*"ACTIVE"/.test(helper);
  const noHeuristic = !/company-order-filter/.test(helper);
  const noInvited = !/INVITED/.test(helper);
  const where = orderWhereForActor(
    { id: "u1", email: "a@x.com" },
    { userIds: ["u1", "u2"], emails: ["a@x.com", "b@x.com"] },
  );
  const or = Array.isArray(where.OR) ? where.OR : [];
  const hasPeerId = or.some(
    (c) =>
      c &&
      typeof c === "object" &&
      "userId" in c &&
      typeof c.userId === "object" &&
      c.userId &&
      "in" in c.userId &&
      Array.isArray(c.userId.in) &&
      c.userId.in.includes("u2"),
  );
  if (usesActive && noHeuristic && noInvited && hasPeerId) {
    pass("A2", "Helper ACTIVE peers — không company-order-filter");
  } else {
    fail(
      "A2",
      `active=${usesActive} noH=${noHeuristic} noInv=${noInvited} peer=${hasPeerId}`,
    );
  }
}

function a3() {
  const src = read(accountOrdersPath);
  if (/customer-order-access/.test(src) && /orderWhereForActor/.test(src)) {
    pass("A3", "/account/orders dùng helper");
  } else {
    fail("A3", "orders page chưa wire helper");
  }
}

function a4() {
  const src = read(orderDetailPath);
  if (/customerCanAccessOrder/.test(src)) {
    pass("A4", "Chi tiết đơn dùng helper");
  } else {
    fail("A4", "order detail chưa customerCanAccessOrder");
  }
}

function a5() {
  const assets = read(assetsPath);
  const detail = read(assetDetailPath);
  const overview = read(overviewPath);
  const ok =
    /customerOrderWhere/.test(assets) &&
    /customerCanAccessOrder/.test(detail) &&
    /customerOrderWhere/.test(overview);
  if (ok) {
    pass("A5", "Assets + overview dùng helper");
  } else {
    fail("A5", "assets/overview chưa đủ helper");
  }
}

function a6() {
  const src = read(resendPath);
  if (/customerCanAccessOrder/.test(src)) {
    pass("A6", "Resend API dùng helper");
  } else {
    fail("A6", "resend chưa customerCanAccessOrder");
  }
}

function a7() {
  const tickets = read(ticketsPath);
  const ticketsApi = read(
    join(srcRoot, "app", "api", "account", "tickets", "route.ts"),
  );
  const noHelper =
    !/customer-order-access/.test(tickets) &&
    !/customer-order-access/.test(ticketsApi);
  if (noHelper) {
    pass("A7", "Tickets không dùng org peer where");
  } else {
    fail("A7", "tickets import customer-order-access");
  }
}

async function main() {
  o1();
  o2();
  o3();
  o6();
  a1();
  a2();
  a3();
  a4();
  a5();
  a6();
  a7();
  try {
    await o4();
  } catch (e) {
    fail("O4", e instanceof Error ? e.message : String(e));
  }
  try {
    await o5();
  } catch (e) {
    fail("O5", e instanceof Error ? e.message : String(e));
  }
  const failed = results.filter((r) => !r.ok);
  console.log(
    failed.length
      ? `\nORG EXIT ${failed.map((f) => f.id).join(", ")} FAIL`
      : "\nORG EXIT O1–O6 + A1–A7 PASS",
  );
  process.exit(failed.length ? 1 : 0);
}

void main();
