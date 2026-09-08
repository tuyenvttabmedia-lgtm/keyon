import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRedisConnection } from "@/server/queue";
import { StorageService } from "@/server/storage";
import { PaymentService } from "@/server/payment";
import { InventoryReadModel } from "@/server/inventory-read-model";
import { readWorkerHeartbeat, getQueueDepths } from "@/server/monitoring";

export const dynamic = "force-dynamic";

function wantsFullDetail(req: Request): boolean {
  const host = (req.headers.get("host") ?? "").split(",")[0]?.trim() ?? "";
  return host.startsWith("127.0.0.1") || host.startsWith("localhost");
}

export async function GET(req: Request) {
  const full = wantsFullDetail(req);

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
    checks.redis = pong === "PONG" ? "ok" : "error";
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

  const paymentProvider = String(checks.paymentProvider);
  const stubInProduction =
    paymentProvider === "stub" && process.env.NODE_ENV === "production";

  const healthy =
    checks.database === "ok" &&
    checks.redis === "ok" &&
    checks.worker === "ok" &&
    !stubInProduction;

  const publicBody = {
    status: healthy ? "healthy" : "degraded",
    checks: {
      app: checks.app,
      database: checks.database,
      redis: checks.redis,
      worker: checks.worker,
      paymentProvider: checks.paymentProvider,
      storage: checks.storage,
    },
    timestamp: new Date().toISOString(),
  };

  if (!full) {
    return NextResponse.json(publicBody, { status: healthy ? 200 : 503 });
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

  const warnings: string[] = [];
  if (stubInProduction) {
    warnings.push(
      "PAYMENT_PROVIDER=stub in production — do not accept real payments",
    );
  }
  if (checks.worker !== "ok") {
    warnings.push("Worker down — fulfillment/email queues will stall");
  }

  return NextResponse.json(
    {
      ...publicBody,
      checks,
      worker,
      queues,
      inventory: inv,
      warnings: warnings.length ? warnings : undefined,
    },
    { status: healthy ? 200 : 503 },
  );
}
