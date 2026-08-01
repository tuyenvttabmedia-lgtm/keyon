import type { SupplierProvisioner } from "./provisioner";
import { pax8StubProvisioner } from "./pax8-stub";
import { AppError } from "@/lib/errors";
import { resolveSupplierApi } from "./config";

let cached: SupplierProvisioner | null = null;
let cachedFp: string | null = null;

export function resetSupplierProvisionerCache(): void {
  cached = null;
  cachedFp = null;
}

/**
 * Resolve provisioner — Admin suppliers-api.json (hybrid) ?? ENV PAX8_DRIVER.
 * Drivers: stub | sandbox → stub provisioner; http reserved until live adapter ships.
 */
export async function getSupplierProvisioner(): Promise<SupplierProvisioner> {
  const resolved = await resolveSupplierApi();
  const driver = resolved.pax8.driver;
  const fp = `${driver}:${resolved.pax8.driverSource}:${resolved.pax8.baseUrl}:${resolved.pax8.clientId}`;

  if (cached && cachedFp === fp) return cached;

  if (driver === "stub" || driver === "sandbox") {
    cached = pax8StubProvisioner;
    cachedFp = fp;
    return cached;
  }

  if (driver === "http") {
    if (!resolved.pax8.baseUrl || !resolved.pax8.clientId || !resolved.pax8.clientSecret) {
      throw new AppError(
        "Pax8 HTTP thiếu baseUrl / clientId / clientSecret (Admin hoặc ENV)",
        501,
        "PAX8_HTTP_NOT_CONFIGURED",
      );
    }
    throw new AppError(
      "PAX8_DRIVER=http chưa bật live adapter — dùng stub/sandbox; credentials đã sẵn sàng khi bật",
      501,
      "PAX8_HTTP_NOT_ENABLED",
    );
  }

  throw new AppError(`Unknown PAX8 driver=${driver}`, 500, "PAX8_DRIVER");
}

export type { SupplierProvisioner, ProvisionInput, ProvisionResult } from "./provisioner";
export { pax8StubProvisioner, resetPax8StubStore } from "./pax8-stub";
export {
  resolveSupplierApi,
  getSupplierApiSettingsPublic,
  saveSupplierApiSettings,
} from "./config";
