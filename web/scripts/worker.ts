import { startWorkers } from "../src/server/queue/workers";
import { startLicenseTtlSweeper } from "../src/server/license-pool/ttl-worker";
import { writeWorkerHeartbeat } from "../src/server/monitoring";
import { childLogger } from "../src/lib/logger";

const log = childLogger("worker-boot");

startWorkers();
startLicenseTtlSweeper();

const HEARTBEAT_MS = Number(process.env.WORKER_HEARTBEAT_MS ?? 15_000);
void writeWorkerHeartbeat().catch((err) => log.warn({ err }, "heartbeat init failed"));
const hb = setInterval(() => {
  void writeWorkerHeartbeat().catch((err) => log.warn({ err }, "heartbeat failed"));
}, HEARTBEAT_MS);
hb.unref?.();

log.info("KEYON worker process ready (queues + license TTL + heartbeat)");

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
