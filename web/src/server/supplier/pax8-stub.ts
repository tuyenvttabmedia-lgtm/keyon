/**
 * Pax8 stub — sandbox for Sprint 2 Exit X1–X8.
 * No real HTTP. Idempotent in-memory + deterministic IDs from requestId.
 */
import { createHash } from "crypto";
import type { DeliverableType } from "@prisma/client";
import type {
  ProvisionInput,
  ProvisionResult,
  SupplierProvisioner,
} from "./provisioner";

const store = new Map<string, ProvisionResult>();

function provisionIdFor(requestId: string) {
  return `pax8_stub_${createHash("sha256").update(requestId).digest("hex").slice(0, 24)}`;
}

function buildResult(input: ProvisionInput): ProvisionResult {
  const provisionId = provisionIdFor(input.requestId);
  const type: DeliverableType =
    input.deliverableType === "SUBSCRIPTION" ||
    input.deliverableType === "EXTERNAL_PORTAL"
      ? input.deliverableType
      : "EXTERNAL_PORTAL";

  const portalUrl = `https://portal.stub.pax8.local/activate/${provisionId}`;
  const deliverablePlain =
    type === "SUBSCRIPTION"
      ? JSON.stringify({
          provider: "pax8_stub",
          provisionId,
          productRef: input.upstreamProductRef,
          portalUrl,
          seat: input.quantity,
        })
      : JSON.stringify({
          provider: "pax8_stub",
          provisionId,
          portalUrl,
          productRef: input.upstreamProductRef,
        });

  return {
    provisionId,
    status: "COMPLETED",
    deliverablePlain,
    deliverableType: type,
    raw: { stub: true, requestId: input.requestId },
  };
}

export const pax8StubProvisioner: SupplierProvisioner = {
  name: "pax8_stub",

  async provision(input: ProvisionInput): Promise<ProvisionResult> {
    const existing = store.get(input.requestId);
    if (existing) return { ...existing };
    const result = buildResult(input);
    store.set(input.requestId, result);
    store.set(`id:${result.provisionId}`, result);
    return { ...result };
  },

  async checkProvision(provisionId: string): Promise<ProvisionResult> {
    const hit = store.get(`id:${provisionId}`);
    if (!hit) {
      return {
        provisionId,
        status: "FAILED",
        deliverablePlain: "",
        deliverableType: "EXTERNAL_PORTAL",
        raw: { error: "not_found" },
      };
    }
    return { ...hit };
  },
};

/** Test helper — clear stub store between suites */
export function resetPax8StubStore() {
  store.clear();
}
