export { LicensePoolService } from "./service";
export { onLicenseEvent, emitLicenseEvent } from "./events";
export { parseReserveTtlMs, reserveExpiresAt } from "./ttl";
export type {
  LicenseReservation,
  ConsumedLicense,
  PoolMetrics,
  ReleaseReason,
  LicenseDomainEvent,
  ReserveInput,
  ConsumeInput,
  ReleaseInput,
  DisableInput,
} from "./types";
