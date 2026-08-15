/**
 * B5 service SKU exit S1–S6
 * npm run test:service-sku
 */
import { readFileSync } from "fs";
import { join } from "path";
import { prisma } from "../src/lib/db";
import { variantAllowsCheckout } from "../src/lib/variant-checkout";
import { receiveFromDeliverable } from "../src/storefront/lib/customer-labels";
import {
  SERVICE_HANDOVER_SKU,
  SERVICE_HANDOVER_SLUG,
} from "../src/storefront/lib/service-sku";

type R = { id: string; ok: boolean; detail: string };
const results: R[] = [];

function pass(id: string, detail: string) {
  results.push({ id, ok: true, detail });
  console.log(`S${id} ✅ PASS  ${detail}`);
}
function fail(id: string, detail: string) {
  results.push({ id, ok: false, detail });
  console.log(`S${id} ❌ FAIL  ${detail}`);
}

function read(p: string) {
  return readFileSync(p, "utf8");
}

function s1() {
  const schema = read(join(process.cwd(), "prisma", "schema.prisma"));
  const noServiceOrder = !/model ServiceOrder\b/.test(schema);
  const noServicePay = !/model ServicePayment\b/.test(schema);
  const deliverable = schema.match(/enum DeliverableType \{[\s\S]*?\n\}/)?.[0] ?? "";
  const noServiceEnum = !/\bSERVICE\b/.test(deliverable);
  if (noServiceOrder && noServicePay && noServiceEnum) {
    pass("1", "Không ServiceOrder/ServicePayment; không enum SERVICE");
  } else {
    fail("1", "Có abstraction dịch vụ song song");
  }
}

function s2() {
  const okManualQuote = variantAllowsCheckout({
    salesMotion: "QUOTE_REQUIRED",
    fulfillmentStrategy: "MANUAL",
  });
  const blockSemi = !variantAllowsCheckout({
    salesMotion: "QUOTE_REQUIRED",
    fulfillmentStrategy: "SEMI_AUTOMATED",
  });
  const blockInstantQuote = !variantAllowsCheckout({
    salesMotion: "QUOTE_REQUIRED",
    fulfillmentStrategy: "INSTANT",
  });
  const selfInstant = variantAllowsCheckout({
    salesMotion: "SELF_SERVE",
    fulfillmentStrategy: "INSTANT",
  });
  if (okManualQuote && blockSemi && blockInstantQuote && selfInstant) {
    pass("2", "QUOTE+MANUAL checkout; Pax8/Instant quote vẫn chặn");
  } else {
    fail("2", `mq=${okManualQuote} semi=${blockSemi} iq=${blockInstantQuote}`);
  }
}

function s3() {
  const checkout = read(join(process.cwd(), "src", "server", "checkout.ts"));
  const usesHelper = /variantAllowsCheckout/.test(checkout);
  const poolOnlyInstant =
    /fulfillmentStrategy === "INSTANT"/.test(checkout) &&
    /LicensePoolService\.reserve/.test(checkout);
  if (usesHelper && poolOnlyInstant) {
    pass("3", "Checkout helper; Pool reserve chỉ INSTANT");
  } else {
    fail("3", `helper=${usesHelper} poolInstant=${poolOnlyInstant}`);
  }
}

function s4() {
  const label = receiveFromDeliverable("DIGITAL_FILE").label;
  if (label !== "Key" && /bàn giao/i.test(label)) {
    pass("4", `DIGITAL_FILE label = ${label}`);
  } else {
    fail("4", `label=${label}`);
  }
}

function s5() {
  const landing = read(
    join(
      process.cwd(),
      "src",
      "storefront",
      "components",
      "business",
      "ImplementationLanding.tsx",
    ),
  );
  if (/SERVICE_HANDOVER_HREF/.test(landing)) {
    pass("5", "Landing triển khai trỏ PDP gói bàn giao");
  } else {
    fail("5", "Landing chưa link service SKU");
  }
}

async function s6() {
  const variant = await prisma.productVariant.findUnique({
    where: { sku: SERVICE_HANDOVER_SKU },
    include: { product: { select: { slug: true } } },
  });
  if (!variant) {
    fail("6", `Chưa có SKU ${SERVICE_HANDOVER_SKU} — chạy catalog:ensure-service-sku`);
    return;
  }
  const pool = await prisma.licenseItem.count({ where: { variantId: variant.id } });
  const ok =
    variant.product.slug === SERVICE_HANDOVER_SLUG &&
    variant.fulfillmentStrategy === "MANUAL" &&
    variant.deliverableType === "DIGITAL_FILE" &&
    variant.salesMotion === "QUOTE_REQUIRED" &&
    pool === 0;
  if (ok) {
    pass("6", "SKU MANUAL+DIGITAL_FILE+QUOTE, không LicenseItem");
  } else {
    fail(
      "6",
      `${variant.fulfillmentStrategy}/${variant.deliverableType}/${variant.salesMotion} pool=${pool}`,
    );
  }
}

async function main() {
  s1();
  s2();
  s3();
  s4();
  s5();
  try {
    await s6();
  } catch (e) {
    fail("6", e instanceof Error ? e.message : String(e));
  }
  const failed = results.filter((r) => !r.ok);
  console.log(
    failed.length
      ? `\nSERVICE SKU EXIT ${failed.map((f) => "S" + f.id).join(", ")} FAIL`
      : "\nSERVICE SKU EXIT S1–S6 PASS",
  );
  process.exit(failed.length ? 1 : 0);
}

void main();
