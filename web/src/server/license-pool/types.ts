import type { LicenseItem, LicenseItemStatus } from "@prisma/client";

export type ReleaseReason =
  | "ttl_expired"
  | "order_cancelled"
  | "payment_failed"
  | (string & {});

export type LicenseReservation = {
  licenseId: string;
  reservationToken: string;
  variantId: string;
  orderId: string;
  orderItemId: string;
  expiresAt: Date;
  version: number;
};

export type ConsumedLicense = {
  licenseId: string;
  variantId: string;
  orderId: string;
  orderItemId: string;
  payloadEnc: string;
};

export type PoolMetrics = {
  available_count: number;
  reserved_count: number;
  consumed_count: number;
  disabled_count: number;
  /** Lifetime TTL releases */
  ttl_release_count: number;
  /** TTL releases since local midnight */
  ttl_release_today: number;
};

export type LicenseDomainEventName =
  | "LicenseReserved"
  | "LicenseConsumed"
  | "LicenseReleased"
  | "LicenseDisabled";

export type LicenseDomainEvent = {
  name: LicenseDomainEventName;
  licenseId: string;
  variantId: string;
  orderId?: string | null;
  orderItemId?: string | null;
  reservationToken?: string | null;
  reason?: string | null;
  at: Date;
};

export type ReserveInput = {
  variantId: string;
  orderId: string;
  orderItemId: string;
  quantity: number;
};

export type ConsumeInput = {
  reservationToken: string;
};

export type ReleaseInput = {
  reservationToken: string;
  reason: ReleaseReason;
};

export type DisableInput = {
  licenseId: string;
  reason: string;
  actorId?: string;
};

export type LicenseItemRow = LicenseItem;
export type { LicenseItemStatus };
