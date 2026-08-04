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
      label: "Tiến trình giao hàng",
      value: snap.worker.ok ? "OK" : "DOWN",
      sub: snap.worker.ok
        ? `Nhịp sống ${formatAge(snap.worker.age_ms)} trước`
        : "Không có nhịp sống",
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
  const host = snap.host;
  const security = snap.security;
  const incidents = snap.incidents ?? [];

  const hostTone =
    !host || !host.fresh
      ? "text-amber-800"
      : host.status === "critical"
        ? "text-red-700"
        : host.status === "warn"
          ? "text-amber-800"
          : "text-emerald-700";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className={ADMIN_PAGE_TITLE_CLASS}>Monitoring</h1>
          <p className={SECTION_LEAD_CLASS}>
            App · máy chủ · bảo mật lite · hàng đợi · sự cố gần đây
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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted">Máy chủ (watchdog)</p>
          <p className={`mt-1 text-2xl font-bold tabular-nums ${hostTone}`}>
            {!host
              ? "—"
              : !host.fresh
                ? "STALE"
                : host.status.toUpperCase()}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {!host
              ? "Chưa có host-status.json (cài ops/watchdog)"
              : !host.fresh
                ? `Snapshot cũ · ${formatVi(host.at)}`
                : `Load ${host.metrics.load1} · RAM ${host.metrics.mem_avail_mb}MB · ${formatVi(host.at)}`}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-navy">Sức khỏe máy chủ</h2>
          {!host ? (
            <p className="mt-3 text-sm text-muted">
              Chưa có dữ liệu. Cài{" "}
              <code className="text-navy">ops/install-host-watchdog.sh</code> trên
              VPS.
            </p>
          ) : (
            <dl className="mt-3 grid gap-2 text-sm">
              <Row label="Host" value={host.host} />
              <Row label="CPU ~" value={`${host.metrics.cpu_used_pct}%`} />
              <Row
                label="Load / limit"
                value={`${host.metrics.load1} / ${host.metrics.load_limit}`}
              />
              <Row
                label="RAM available"
                value={`${host.metrics.mem_avail_mb} / ${host.metrics.mem_total_mb} MB`}
              />
              <Row
                label="Disk /"
                value={`${host.metrics.disk_used_pct}% (còn ${host.metrics.disk_avail})`}
              />
              <Row
                label="PM2 web"
                value={`${host.metrics.pm2_web_status} · rst ${host.metrics.pm2_web_restarts}`}
              />
              <Row
                label="PM2 worker"
                value={`${host.metrics.pm2_worker_status} · rst ${host.metrics.pm2_worker_restarts}`}
              />
              <Row
                label="Health local"
                value={`${host.metrics.health_http} · ${host.metrics.health_status} · ${host.metrics.health_ttfb_s.toFixed(2)}s`}
              />
            </dl>
          )}
          {host?.alerts?.length ? (
            <ul className="mt-3 space-y-1.5 border-t border-border pt-3 text-sm">
              {host.alerts.map((a) => (
                <li key={a.code + a.message}>
                  <span
                    className={
                      a.level === "error"
                        ? "font-medium text-red-700"
                        : "font-medium text-amber-800"
                    }
                  >
                    {a.level.toUpperCase()}
                  </span>{" "}
                  <span className="text-muted">{a.code}</span>
                  <p className="text-navy">{a.message}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-navy">Bảo mật lite</h2>
          {!security ? (
            <p className="mt-3 text-sm text-muted">
              Chưa có security-scan.json.
            </p>
          ) : (
            <>
              <p className="mt-2 text-sm text-muted">
                Mode <span className="font-medium text-navy">{security.mode}</span>{" "}
                · {formatVi(security.at)} ·{" "}
                {security.ok ? (
                  <span className="font-medium text-emerald-700">OK</span>
                ) : (
                  <span className="font-medium text-red-700">
                    {security.findings.length} findings
                  </span>
                )}
              </p>
              {security.findings.length === 0 ? (
                <p className="mt-3 text-sm text-muted">
                  Không phát hiện process/path lạ trong lần quét gần nhất.
                </p>
              ) : (
                <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto text-sm">
                  {security.findings.map((f, i) => (
                    <li
                      key={i}
                      className="rounded-lg border border-border bg-[#f8fafc] px-3 py-2"
                    >
                      <span className="font-medium text-amber-800">
                        {f.severity}
                      </span>{" "}
                      <span className="text-muted">{f.kind}</span>
                      <p className="break-all text-navy">{f.detail}</p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
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
        <h2 className="text-sm font-semibold text-navy">Sự cố phát sinh (watchdog)</h2>
        {incidents.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Chưa ghi nhận incident từ host watchdog.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-border">
            {incidents.map((inc, i) => (
              <li key={inc.at + String(i)} className="py-2.5 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={
                      inc.status === "critical"
                        ? "font-semibold text-red-700"
                        : inc.status === "warn"
                          ? "font-semibold text-amber-800"
                          : "font-semibold text-navy"
                    }
                  >
                    {inc.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-muted">{formatVi(inc.at)}</span>
                </div>
                <ul className="mt-1 space-y-0.5 text-muted">
                  {inc.alerts.slice(0, 4).map((a) => (
                    <li key={a.code + a.message}>
                      · {a.code}: {a.message}
                    </li>
                  ))}
                  {inc.findings.slice(0, 3).map((f, j) => (
                    <li key={j} className="break-all">
                      · [{f.kind}] {f.detail}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-navy">Cảnh báo gần đây (app)</h2>
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
