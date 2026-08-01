/**
 * Supplier provisioner — Outer Layer (Pax8 / distributors).
 * Fulfillment strategy calls this; Payment never does.
 */
import type { DeliverableType } from "@prisma/client";

export type ProvisionInput = {
  /** Globally unique per fulfillment attempt — idempotency key */
  requestId: string;
  orderId: string;
  orderItemId: string;
  orderCode: string;
  upstreamProductRef: string;
  quantity: number;
  customerEmail: string;
  /** Preferred deliverable from Variant */
  deliverableType: DeliverableType;
};

export type ProvisionResult = {
  provisionId: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  /** Plain payload to encrypt into Delivery (portal URL / subscription JSON) */
  deliverablePlain: string;
  deliverableType: DeliverableType;
  raw?: unknown;
};

export interface SupplierProvisioner {
  readonly name: string;
  provision(input: ProvisionInput): Promise<ProvisionResult>;
  checkProvision(provisionId: string): Promise<ProvisionResult>;
}
