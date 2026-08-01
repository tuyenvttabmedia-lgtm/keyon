import { LicensePoolService } from "./service";
import { childLogger } from "@/lib/logger";

const log = childLogger("license-pool.ttl-worker");

const INTERVAL_MS = Number(process.env.LICENSE_TTL_SWEEP_MS ?? 30_000);

/** Chỉ gọi LicensePoolService.releaseExpired() — không UPDATE DB trực tiếp. */
export function startLicenseTtlSweeper() {
  const tick = async () => {
    try {
      const n = await LicensePoolService.releaseExpired();
      if (n > 0) log.info({ released: n }, "ttl sweep released reservations");
    } catch (err) {
      log.error({ err }, "ttl sweep failed");
    }
  };
  void tick();
  const timer = setInterval(tick, INTERVAL_MS);
  timer.unref?.();
  log.info({ INTERVAL_MS }, "license TTL sweeper started");
  return () => clearInterval(timer);
}
