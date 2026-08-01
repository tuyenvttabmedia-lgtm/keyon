/**
 * Pilot ops snapshot — evidence helper for PL1 / PL2 / PL5
 * Does NOT change Core. Run during Pilot week, paste into Pilot Review log.
 *
 * npm run pilot:snapshot
 */
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";
import { collectMonitoringSnapshot } from "../src/server/monitoring";

const prisma = new PrismaClient();

async function main() {
  const at = new Date().toISOString();
  const mon = await collectMonitoringSnapshot();

  const [
    ordersByStatus,
    paymentsByStatus,
    paidWithDelivery,
    paidWithoutDelivery,
    instantCompleted,
    manualJobs,
    recentReconcile,
    resendCount,
    replaceAudits,
  ] = await Promise.all([
    prisma.order.groupBy({ by: ["status"], _count: true }),
    prisma.payment.groupBy({ by: ["status"], _count: true }),
    prisma.order.count({
      where: {
        status: { in: ["COMPLETED", "FULFILLING", "PAID"] },
        items: { some: { deliveries: { some: {} } } },
      },
    }),
    prisma.order.count({
      where: {
        status: { in: ["PAID", "FULFILLING"] },
        items: { every: { deliveries: { none: {} } } },
      },
    }),
    prisma.order.count({
      where: {
        status: "COMPLETED",
        items: { some: { variant: { fulfillmentStrategy: "INSTANT" } } },
      },
    }),
    prisma.fulfillmentJob.groupBy({
      by: ["status"],
      where: { strategy: "MANUAL" },
      _count: true,
    }),
    prisma.payment.findMany({
      where: { status: "SUCCEEDED" },
      orderBy: { succeededAt: "desc" },
      take: 15,
      include: {
        order: {
          include: {
            items: { include: { deliveries: true } },
          },
        },
      },
    }),
    prisma.deliveryResend.count(),
    prisma.auditLog.count({ where: { action: "delivery.replace" } }),
  ]);

  const paidSucceeded = paymentsByStatus.find((p) => p.status === "SUCCEEDED")?._count ?? 0;
  const deliverySuccessRate =
    paidSucceeded === 0
      ? null
      : Number(((paidWithDelivery / Math.max(paidSucceeded, 1)) * 100).toFixed(1));

  const reconcileRows = recentReconcile.map((p) => {
    const deliveries = p.order.items.reduce((n, i) => n + i.deliveries.length, 0);
    return {
      payment_reference: p.paymentReference,
      order_code: p.order.code,
      order_status: p.order.status,
      amount_vnd: p.amountVnd,
      provider_tx: p.providerTransactionId,
      deliveries,
      paid_at: p.succeededAt?.toISOString() ?? null,
    };
  });

  const snapshot = {
    at,
    pilot: {
      note: "Ops evidence for PL1–PL5 — paste into docs/PILOT.md review table",
      roadmap: "Pilot → Pilot Review → Pax8 HTTP (live) if needed",
    },
    pl1_sla_ops: {
      worker_heartbeat_ok: mon.worker.ok,
      worker_age_ms: mon.worker.age_ms,
      queue_waiting_total: mon.queues.waiting_total,
      avg_webhook_ms: mon.payment.avg_webhook_ms,
      avg_fulfillment_ms: mon.payment.avg_fulfillment_ms,
      instant_completed_orders: instantCompleted,
      manual_jobs_by_status: Object.fromEntries(
        manualJobs.map((j) => [j.status, j._count]),
      ),
    },
    pl2_reliability: {
      payments_by_status: Object.fromEntries(
        paymentsByStatus.map((p) => [p.status, p._count]),
      ),
      orders_by_status: Object.fromEntries(
        ordersByStatus.map((o) => [o.status, o._count]),
      ),
      paid_or_fulfilling_with_delivery: paidWithDelivery,
      paid_or_fulfilling_without_delivery: paidWithoutDelivery,
      approx_payment_to_delivery_pct: deliverySuccessRate,
      process_payment_success_rate_runtime: mon.payment.success_rate,
    },
    pl3_operations_reminder: {
      backup_drill: "cd web && npm run test:backup  (or backup:create + restore-verify)",
      runbook_drill: "docs/RUNBOOK.md — pick R1–R11 dry-run and note date",
    },
    pl4_support: {
      delivery_resend_total: resendCount,
      delivery_replace_audits: replaceAudits,
    },
    pl5_reconciliation_sample: reconcileRows,
    monitoring_errors: mon.errors,
    alerts_recent: mon.alerts,
  };

  const outDir = join(process.cwd(), "..", "backups", "pilot");
  mkdirSync(outDir, { recursive: true });
  const stamp = at.replace(/[:.]/g, "-");
  const outPath = join(outDir, `pilot-snapshot-${stamp}.json`);
  writeFileSync(outPath, JSON.stringify(snapshot, null, 2) + "\n");

  console.log("\n=== KEYON Pilot Snapshot ===\n");
  console.log(`at: ${at}`);
  console.log(`worker heartbeat: ${mon.worker.ok ? "OK" : "DOWN"} (age_ms=${mon.worker.age_ms})`);
  console.log(`queues waiting_total: ${mon.queues.waiting_total}`);
  console.log(
    `reliability: paid+delivery≈${paidWithDelivery} · paid/fulfilling w/o delivery=${paidWithoutDelivery} · pct≈${deliverySuccessRate ?? "n/a"}%`,
  );
  console.log(`support: resends=${resendCount} replace_audits=${replaceAudits}`);
  console.log(`reconcile sample rows: ${reconcileRows.length}`);
  console.log(`\nWrote ${outPath}`);
  console.log("\nPL3: npm run test:backup · RUNBOOK dry-run");
  console.log("Attach this JSON (or summary) to Pilot Review PL1/PL2/PL5.\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
