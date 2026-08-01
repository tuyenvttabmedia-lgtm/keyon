import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRedisConnection } from "@/server/queue";
import { StorageService } from "@/server/storage";
import { PaymentService } from "@/server/payment";
import { InventoryReadModel } from "@/server/inventory-read-model";
import { readWorkerHeartbeat, getQueueDepths } from "@/server/monitoring";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, "ok" | "error" | string> = {
    app: "ok",
    paymentProvider: await PaymentService.providerName(),
    storage: await StorageService.driverName(),
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = "ok";
  } catch {
    checks.database = "error";
  }

  try {
    const pong = await getRedisConnection().ping();
    checks.redis = pong === "PONG" ? "ok" : pong;
  } catch {
    checks.redis = "error";
  }

  let worker: Awaited<ReturnType<typeof readWorkerHeartbeat>> = {
    ok: false,
    last_ms: null,
    age_ms: null,
  };
  try {
    worker = await readWorkerHeartbeat();
    checks.worker = worker.ok ? "ok" : "stale_or_down";
  } catch {
    checks.worker = "error";
  }

  let queues: Awaited<ReturnType<typeof getQueueDepths>> | null = null;
  try {
    queues = await getQueueDepths();
    checks.queues = "ok";
  } catch {
    checks.queues = "error";
  }

  const inv = InventoryReadModel.health();
  checks.inventory = inv.inventory_healthy ? "ok" : "error";

  const healthy =
    checks.database === "ok" && checks.redis === "ok" && checks.worker === "ok";

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      checks,
      worker,
      queues,
      inventory: inv,
      timestamp: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 },
  );
}
