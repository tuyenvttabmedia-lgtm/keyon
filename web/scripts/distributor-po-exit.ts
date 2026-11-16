/**
 * Exit checks for FPT/TechData PO helpers (no DB).
 * npm run test:distributor-po
 */
import assert from "node:assert/strict";
import {
  buildPoMailBody,
  buildPoMailSubject,
  buildPoMailtoHref,
  distributorOpsHint,
  isManualOpsDistributor,
} from "../src/lib/distributor-po";

assert.equal(
  isManualOpsDistributor({
    supplierType: "DISTRIBUTOR",
    integrationMode: "MANUAL_OPS",
  }),
  true,
);
assert.equal(
  isManualOpsDistributor({
    supplierType: "DISTRIBUTOR",
    integrationMode: "API",
  }),
  false,
);
assert.equal(
  isManualOpsDistributor({
    supplierType: "INTERNAL",
    integrationMode: "NONE",
  }),
  false,
);

const draft = {
  orderCode: "KO-1001",
  productName: "Kaspersky",
  variantName: "1 năm",
  variantSku: "KAV-IS-1Y",
  quantity: 2,
  deliverableType: "KEY",
  supplierName: "TechData",
  supplierEmail: "ops@techdata.example",
  customerEmail: "khach@example.com",
  poNumber: "PO-9",
};

const subject = buildPoMailSubject(draft);
assert.ok(subject.includes("PO-9"));
assert.ok(subject.includes("KAV-IS-1Y"));
assert.ok(subject.includes("× 2"));

const body = buildPoMailBody(draft);
assert.ok(body.includes("KO-1001"));
assert.ok(body.includes("TechData"));
assert.ok(body.includes("khach@example.com"));

const href = buildPoMailtoHref(draft);
assert.ok(href.startsWith("mailto:ops@techdata.example?"));
assert.ok(href.includes("subject="));
assert.ok(href.includes("body="));

assert.match(
  distributorOpsHint({
    strategy: "MANUAL",
    status: "WAITING_HUMAN",
    supplierType: "DISTRIBUTOR",
    integrationMode: "MANUAL_OPS",
  }) ?? "",
  /Manual/,
);
assert.match(
  distributorOpsHint({
    strategy: "INSTANT",
    status: "WAITING_STOCK",
    supplierType: "DISTRIBUTOR",
    integrationMode: "MANUAL_OPS",
  }) ?? "",
  /Stock Import/,
);
assert.equal(
  distributorOpsHint({
    strategy: "MANUAL",
    status: "WAITING_HUMAN",
    supplierType: "EXTERNAL",
    integrationMode: "MANUAL_OPS",
  }),
  null,
);

console.log("distributor-po exit: PASS");
