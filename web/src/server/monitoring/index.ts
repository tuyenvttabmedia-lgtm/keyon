import { getRedisConnection, getPaymentQueue, getFulfillmentQueue, getEmailQueue } from "@/server/queue";
import {
  paymentKpis,
  paymentSuccessRate,
  avgWebhookMs,
  avgFulfillmentMs,
} from "@/server/payment/kpis";
import { errorStats } from "@/server/monitoring/errors";
import { listAlerts } from "@/server/monitoring/alerts";
import { getOpsMetrics } from "@/server/monitoring/ops-metrics";

export const WORKER_HEARTBEAT_KEY = "keyon:worker:heartbeat";
export const WORKER_HEARTBEAT_TTL_SEC = 120;

export async function writeWorkerHeartbeat(now = Date.now()) {
  const redis = getRedisConnection();
  await redis.set(WORKER_HEARTBEAT_KEY, String(now), "EX", WORKER_HEARTBEAT_TTL_SEC);
}

export async function readWorkerHeartbeat(): Promise<{
  ok: boolean;
  last_ms: number | null;
  age_ms: number | null;
}> {
  const redis = getRedisConnection();
  const raw = await redis.get(WORKER_HEARTBEAT_KEY);
  if (!raw) return { ok: false, last_ms: null, age_ms: null };
  const last_ms = Number(raw);
  if (!Number.isFinite(last_ms)) return { ok: false, last_ms: null, age_ms: null };
  const age_ms = Date.now() - last_ms;
  const ok = age_ms < WORKER_HEARTBEAT_TTL_SEC * 1000;
  return { ok, last_ms, age_ms };
}

export async function getQueueDepths() {
  const [payment, fulfillment, email] = await Promise.all([
    getPaymentQueue().getJobCounts("wait", "active", "delayed", "failed", "completed"),
    getFulfillmentQueue().getJobCounts("wait", "active", "delayed", "failed", "completed"),
    getEmailQueue().getJobCounts("wait", "active", "delayed", "failed", "completed"),
  ]);
  return {
    payment,
    fulfillment,
    email,
    waiting_total:
      (payment.wait ?? 0) +
      (fulfillment.wait ?? 0) +
      (email.wait ?? 0) +
      (payment.delayed ?? 0) +
      (fulfillment.delayed ?? 0) +
      (email.delayed ?? 0),
  };
}

export async function collectMonitoringSnapshot() {
  const [worker, queues, ops] = await Promise.all([
    readWorkerHeartbeat(),
    getQueueDepths(),
    getOpsMetrics(),
  ]);
  const err = errorStats();
  return {
    worker,
    queues,
    ops,
    payment: {
      success_rate: paymentSuccessRate(),
      avg_webhook_ms: avgWebhookMs(),
      avg_fulfillment_ms: avgFulfillmentMs(),
      counters: { ...paymentKpis },
    },
    errors: err,
    alerts: listAlerts(10),
    at: new Date().toISOString(),
  };
}
