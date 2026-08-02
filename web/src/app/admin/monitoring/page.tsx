import Link from "next/link";
import { collectMonitoringSnapshot } from "@/server/monitoring";
import {
  ADMIN_PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
} from "@/storefront/typography";
import { MonitoringRefresh } from "./monitoring-refresh";

export const dynamic = "force-dynamic";

function formatAge(ms: number | null) {
  if (ms == null) return "—";
  if (ms < 1000) return `${ms} ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)} s`;
  return `${Math.round(ms / 60_000)} phút`;
}

function formatVi(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function pct(rate: number | null | undefined) {
  if (rate == null || !Number.isFinite(rate)) return "—";
  return `${(rate * 100).toFixed(0)}%`;
}

function ms(v: number | null | undefined) {
  if (v == null || !Number.isFinite(v)) return "—";
  return `${v.toFixed(0)} ms`;
}

export default async function AdminMonitoringPage() {
  const snap = await collectMonitoringSnapshot();
  const q = snap.queues;

  const kpi = [
    {
      label: "Worker",
      value: snap.worker.ok ? "OK" : "DOWN",
      sub: snap.worker.ok
        ? `Heartbeat ${formatAge(snap.worker.age_ms)} trước`
        : "Không có heartbeat",
      tone: snap.worker.ok ? "text-emerald-700" : "text-red-700",
    },
    {
      label: "Hàng đợi chờ",
      value: String(q.waiting_total),
      sub: "Payment + Fulfillment + Email",
      tone: q.waiting_total > 20 ? "text-amber-800" : "text-navy",
    },
    {
      label: "Webhook TB",
      value: ms(snap.payment.avg_webhook_ms),
      sub: `Tỷ lệ OK ${pct(snap.payment.success_rate)}`,
      tone: "text-navy",
    },
    {
      label: "Lỗi HTTP",
      value: String(snap.errors.total),
      sub: `5xx ${pct(snap.errors.error_rate_5xx)}`,
      tone: snap.errors.total > 0 ? "text-amber-800" : "text-navy",
    },
  ];

  const queueRows = [
    { name: "Payment", counts: q.payment },
    { name: "Fulfillment", counts: q.fulfillment },
    { name: "Email", counts: q.email },
  ] as const;

  const alerts = snap.alerts ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className={ADMIN_PAGE_TITLE_CLASS}>Monitoring</h1>
          <p className={SECTION_LEAD_CLASS}>
            Worker · hàng đợi · thanh toán · lỗi gần đây
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <MonitoringRefresh />
          <Link
            href="/admin/settings"
            className="text-sm font-medium text-accent hover:underline"
          >
            Cài đặt →
          </Link>
        </div>
      </div>

      <p className="text-xs text-muted">
        Snapshot lúc {formatVi(snap.at)} · API{" "}
        <code className="text-navy">/api/health</code> ·{" "}
        <code className="text-navy">/api/monitoring/metrics</code>
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpi.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-border bg-card px-4 py-3"
          >
            <p className="text-xs text-muted">{c.label}</p>
            <p className={`mt-1 text-2xl font-bold tabular-nums ${c.tone}`}>
              {c.value}
            </p>
            <p className="mt-0.5 text-xs text-muted">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-navy">Hàng đợi BullMQ</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase text-muted">
                <tr>
                  <th className="py-2 pr-3">Queue</th>
                  <th className="py-2 pr-3">Chờ</th>
                  <th className="py-2 pr-3">Chạy</th>
                  <th className="py-2 pr-3">Delay</th>
                  <th className="py-2 pr-3">Fail</th>
                  <th className="py-2">Xong</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {queueRows.map((row) => (
                  <tr key={row.name}>
                    <td className="py-2 pr-3 font-medium text-navy">
                      {row.name}
                    </td>
                    <td className="py-2 pr-3 tabular-nums">
                      {row.counts.wait ?? 0}
                    </td>
                    <td className="py-2 pr-3 tabular-nums">
                      {row.counts.active ?? 0}
                    </td>
                    <td className="py-2 pr-3 tabular-nums">
                      {row.counts.delayed ?? 0}
                    </td>
                    <td className="py-2 pr-3 tabular-nums text-amber-800">
                      {row.counts.failed ?? 0}
                    </td>
                    <td className="py-2 tabular-nums text-muted">
                      {row.counts.completed ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-navy">Thanh toán & giao</h2>
          <dl className="mt-3 grid gap-2 text-sm">
            <Row
              label="Tỷ lệ webhook thành công"
              value={pct(snap.payment.success_rate)}
            />
            <Row
              label="Latency webhook TB"
              value={ms(snap.payment.avg_webhook_ms)}
            />
            <Row
              label="Latency fulfillment TB"
              value={ms(snap.payment.avg_fulfillment_ms)}
            />
            <Row
              label="Đơn hôm nay (ops)"
              value={String(snap.ops?.orders_today ?? "—")}
            />
            <Row
              label="Chờ xử lý (ops)"
              value={String(snap.ops?.pending_orders ?? "—")}
            />
          </dl>
          <p className="mt-3 text-xs text-muted">
            Chi tiết đối soát tại{" "}
            <Link href="/admin/payments" className="text-accent hover:underline">
              Thanh toán
            </Link>
            {" · "}
            <Link href="/admin/inbox" className="text-accent hover:underline">
              Inbox
            </Link>
          </p>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-navy">Cảnh báo gần đây</h2>
        {alerts.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Không có alert trong bộ nhớ process.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {alerts.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-start justify-between gap-2 py-2 text-sm"
              >
                <div>
                  <span
                    className={
                      a.level === "error"
                        ? "font-medium text-red-700"
                        : a.level === "warn"
                          ? "font-medium text-amber-800"
                          : "font-medium text-navy"
                    }
                  >
                    {a.level.toUpperCase()}
                  </span>
                  <span className="ml-2 text-muted">{a.source}</span>
                  <p className="text-navy">{a.message}</p>
                </div>
                <span className="text-xs text-muted">{formatVi(a.at)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <details className="rounded-2xl border border-border bg-card p-4">
        <summary className="cursor-pointer text-sm font-medium text-navy">
          Snapshot JSON (debug)
        </summary>
        <pre className="mt-3 overflow-x-auto text-xs text-muted">
          {JSON.stringify(snap, null, 2)}
        </pre>
      </details>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-[#f8fafc] px-3 py-2">
      <dt className="text-muted">{label}</dt>
      <dd className="font-semibold tabular-nums text-navy">{value}</dd>
    </div>
  );
}
