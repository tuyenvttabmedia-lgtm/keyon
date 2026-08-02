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

  const paymentProvider = String(checks.paymentProvider);
  const warnings: string[] = [];
  if (paymentProvider === "stub" && process.env.NODE_ENV === "production") {
    warnings.push(
      "PAYMENT_PROVIDER=stub in production — do not accept real payments",
    );
  }
  if (checks.worker !== "ok") {
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
