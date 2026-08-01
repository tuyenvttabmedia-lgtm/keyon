/**
 * Monitoring Exit M1–M7
 * Run: npm run test:monitoring
 * Requires Redis + Postgres. Starts heartbeat itself (does not require worker process).
 */
import {
  writeWorkerHeartbeat,
  readWorkerHeartbeat,
  getQueueDepths,
  collectMonitoringSnapshot,
} from "../src/server/monitoring";
import { recordWebhookProcessed, paymentKpis } from "../src/server/payment/kpis";
import { recordError, errorStats, resetErrorStats } from "../src/server/monitoring/errors";
import { fireAlert, clearAlerts, listAlerts } from "../src/server/monitoring/alerts";
import { prisma } from "../src/lib/db";
import { getRedisConnection } from "../src/server/queue";

type R = { id: string; ok: boolean; detail: string };
const results: R[] = [];

function pass(id: string, detail: string) {
  results.push({ id, ok: true, detail });
  console.log(`M${id} ✅ PASS  ${detail}`);
}
function fail(id: string, detail: string) {
  results.push({ id, ok: false, detail });
  console.log(`M${id} ❌ FAIL  ${detail}`);
}

async function m1() {
  let db = false;
  let redis = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    db = true;
  } catch {
    /* */
  }
  try {
    redis = (await getRedisConnection().ping()) === "PONG";
  } catch {
    /* */
  }
  await writeWorkerHeartbeat();
  const worker = await readWorkerHeartbeat();
  if (db && redis && worker.ok) {
    pass("1", `Health components OK — db=${db} redis=${redis} worker.age_ms=${worker.age_ms}`);
  } else {
    fail("1", `db=${db} redis=${redis} worker.ok=${worker.ok}`);
  }
}

async function m2() {
  const q = await getQueueDepths();
  const hasShape =
    q.payment &&
    q.fulfillment &&
    q.email &&
    typeof q.waiting_total === "number" &&
    typeof q.payment.wait === "number";
  if (hasShape) {
    pass(
      "2",
      `Queue depth — pay.wait=${q.payment.wait} fulfill.wait=${q.fulfillment.wait} email.wait=${q.email.wait} waiting_total=${q.waiting_total}`,
    );
  } else {
    fail("2", JSON.stringify(q));
  }
}

async function m3() {
  await writeWorkerHeartbeat(Date.now());
  const a = await readWorkerHeartbeat();
  // Stale simulation: write old timestamp
  const redis = getRedisConnection();
  await redis.set("keyon:worker:heartbeat", String(Date.now() - 200_000), "EX", 120);
  const stale = await readWorkerHeartbeat();
  await writeWorkerHeartbeat();
  if (a.ok && !stale.ok) {
    pass("3", `Heartbeat fresh then stale detected — age_fresh=${a.age_ms} age_stale=${stale.age_ms}`);
  } else {
    fail("3", `fresh.ok=${a.ok} stale.ok=${stale.ok}`);
  }
}

async function m4() {
  const before = paymentKpis.webhook_processing_count;
  recordWebhookProcessed(42, false);
  recordWebhookProcessed(58, false);
  const snap = await collectMonitoringSnapshot();
  const avg = snap.payment.avg_webhook_ms;
  if (avg != null && avg >= 40 && paymentKpis.webhook_processing_count >= before + 2) {
    pass("4", `Payment latency (webhook) avg_ms=${avg.toFixed(1)}`);
  } else {
    fail("4", `avg=${avg} count=${paymentKpis.webhook_processing_count}`);
  }
}

async function m5() {
  paymentKpis.fulfillment_ms_sum += 120;
  paymentKpis.fulfillment_count += 1;
  paymentKpis.fulfillment_ms_sum += 80;
  paymentKpis.fulfillment_count += 1;
  const snap = await collectMonitoringSnapshot();
  const avg = snap.payment.avg_fulfillment_ms;
  if (avg != null && avg > 0) {
    pass("5", `Fulfillment latency avg_ms=${avg.toFixed(1)}`);
  } else {
    fail("5", `avg=${avg}`);
  }
}

async function m6() {
  resetErrorStats();
  recordError(500, "INTERNAL");
  recordError(400, "APP_ERROR");
  recordError(503, "DOWN");
  const e = errorStats();
  if (e.total === 3 && e.error_rate_5xx > 0 && e.by_status["500"] === 1) {
    pass("6", `Error rate — total=${e.total} rate_5xx=${e.error_rate_5xx.toFixed(2)}`);
  } else {
    fail("6", JSON.stringify(e));
  }
}

async function m7() {
  clearAlerts();
  const a = fireAlert({ source: "alert-test", message: "M7 test alert", level: "info" });
  const list = listAlerts(5);
  if (a.id && list.some((x) => x.id === a.id && x.message.includes("M7"))) {
    pass("7", `Alert test stored — id=${a.id}`);
  } else {
    fail("7", JSON.stringify(list));
  }
}

async function main() {
  console.log("\n=== Monitoring Exit M1–M7 ===\n");
  await m1();
  await m2();
  await m3();
  await m4();
  await m5();
  await m6();
  await m7();

  const failed = results.filter((r) => !r.ok);
  console.log("\n--- Summary ---");
  for (const r of results) console.log(`${r.ok ? "✅" : "❌"} M${r.id}`);
  if (failed.length) {
    console.log(`\nMonitoring NOT complete — ${failed.length} FAIL`);
    process.exit(1);
  }
  console.log("\nMonitoring M1–M7 ALL PASS — ready for Dashboard\n");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
