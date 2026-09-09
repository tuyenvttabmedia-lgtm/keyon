import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRedisConnection } from "@/server/queue";
import { StorageService } from "@/server/storage";
import { PaymentService } from "@/server/payment";
import { InventoryReadModel } from "@/server/inventory-read-model";
import { readWorkerHeartbeat, getQueueDepths } from "@/server/monitoring";

export const dynamic = "force-dynamic";

function wantsFullDetail(req: Request): boolean {
  // Only trust loopback — do not use Host header (spoofable via proxy)
  const xf = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  if (xf || realIp) return false;
  return true;
}

export async function GET(req: Request) {
  const full = wantsFullDetail(req);

  const checks: Record<string, "ok" | "error" | string> = {
    app: "ok",
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch {
    checks.database = "error";
  }

  try {
    const pong = await getRedisConnection().ping();
    checks.redis = pong === "PONG" ? "ok" : "error";
  } catch {
    checks.redis = "error";
  }

  let workerOk = false;
  try {
    const worker = await readWorkerHeartbeat();
    workerOk = worker.ok;
    checks.worker = worker.ok ? "ok" : "stale_or_down";
  } catch {
    checks.worker = "error";
  }

  const paymentProvider = await PaymentService.providerName();
  const stubInProduction =
    paymentProvider === "stub" && process.env.NODE_ENV === "production";

  const healthy =
    checks.database === "ok" &&
    checks.redis === "ok" &&
    workerOk &&
    !stubInProduction;

  if (!full) {
    return NextResponse.json(
      {
        status: healthy ? "healthy" : "degraded",
        timestamp: new Date().toISOString(),
      },
      { status: healthy ? 200 : 503 },
    );
  }

  checks.paymentProvider = paymentProvider;
  checks.storage = await StorageService.driverName();

  let queues: Awaited<ReturnType<typeof getQueueDepths>> | null = null;
  try {
    queues = await getQueueDepths();
    checks.queues = "ok";
  } catch {
    checks.queues = "error";
  }

  const inv = InventoryReadModel.health();
  checks.inventory = inv.inventory_healthy ? "ok" : "error";
  const worker = await readWorkerHeartbeat().catch(() => ({
    ok: false,
    last_ms: null as number | null,
    age_ms: null as number | null,
  }));

  const warnings: string[] = [];
  if (stubInProduction) {
    warnings.push(
      "PAYMENT_PROVIDER=stub in production — do not accept real payments",
    );
  }
  if (!workerOk) {
    warnings.push("Worker down — fulfillment/email queues will stall");
  }

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      checks,
      worker,
      queues,
      inventory: inv,
      warnings: warnings.length ? warnings : undefined,
      timestamp: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 },
  );
}
