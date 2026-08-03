import Link from "next/link";
import { loadDashboardView } from "@/server/dashboard-read-model";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  LINK_ACCENT_CLASS,
} from "@/storefront/typography";
import { AdminPageHeader } from "./ui/AdminPageHeader";
import { AdminStatCard } from "./ui/AdminStatCard";
import { ADMIN_BTN_GHOST, ADMIN_PANEL_PAD } from "./ui/tokens";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const { inventory: inv, monitoring: mon } = await loadDashboardView();

  const cards = [
    {
      label: "Đơn hôm nay",
      value: mon.ops.orders_today,
      href: "/admin/orders",
      hint: "Orders created today",
    },
    {
      label: "Doanh thu hôm nay",
      value: mon.ops.revenue_today_vnd.toLocaleString("vi-VN") + " đ",
      href: "/admin/orders",
      hint: "Đã ghi nhận thanh toán",
    },
    {
      label: "Chờ giao / xử lý",
      value: mon.ops.pending_orders,
      href: "/admin/inbox",
      hint: "Cần attention",
    },
    {
      label: "Inbox Instant",
      value: mon.ops.instant_queue,
      href: "/admin/inbox",
    },
    {
      label: "Inbox Manual",
      value: mon.ops.manual_queue,
      href: "/admin/inbox",
    },
    {
      label: "License available",
      value: inv.available,
      href: "/admin/inventory",
    },
    {
      label: "Low stock SKU",
      value: inv.low_stock_skus,
      href: "/admin/inventory",
      warn: inv.low_stock_skus > 0,
      hint: inv.low_stock_skus > 0 ? "Cần nhập kho" : "OK",
    },
    {
      label: "Worker",
      value: mon.worker.ok ? "OK" : "DOWN",
      href: "/admin/monitoring",
      warn: !mon.worker.ok,
      hint: "Fulfillment queue worker",
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Dashboard"
        lead="Tổng quan vận hành hôm nay — đơn, kho, hàng đợi."
        actions={
          <>
            <Link href="/admin/inbox" className={ADMIN_BTN_GHOST}>
              Mở Inbox
            </Link>
            <Link href="/admin/orders" className={ADMIN_BTN_GHOST}>
              Đơn hàng
            </Link>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <AdminStatCard
            key={c.label}
            label={c.label}
            value={c.value}
            href={c.href}
            warn={c.warn}
            hint={c.hint}
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className={ADMIN_PANEL_PAD}>
          <div className="flex items-center justify-between gap-2">
            <p className={CARD_TITLE_CLASS}>Tồn kho License</p>
            <Link href="/admin/inventory" className={LINK_ACCENT_CLASS}>
              Chi tiết →
            </Link>
          </div>
          <p className={`mt-2 ${BODY_MUTED_CLASS}`}>
            Available {inv.available} · Reserved {inv.reserved} · Consumed{" "}
            {inv.consumed} · Disabled {inv.disabled}
          </p>
          <ul className="mt-4 space-y-2">
            {inv.skus
              .filter((s) => s.stock_status !== "OK")
              .slice(0, 8)
              .map((s) => (
                <li
                  key={s.sku}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/80 bg-surface/60 px-3 py-2"
                >
                  <Link
                    href={`/admin/inventory/${encodeURIComponent(s.sku)}`}
                    className="font-mono text-xs font-semibold text-accent hover:underline"
                  >
                    {s.sku}
                  </Link>
                  <span className="text-xs text-muted">
                    {s.stock_status} · {s.available}
                  </span>
                </li>
              ))}
            {inv.skus.every((s) => s.stock_status === "OK") && (
              <li className={`rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800`}>
                Không có LOW_STOCK / OUT_OF_STOCK
              </li>
            )}
          </ul>
        </section>

        <section className={ADMIN_PANEL_PAD}>
          <div className="flex items-center justify-between gap-2">
            <p className={CARD_TITLE_CLASS}>Hàng đợi / Payment</p>
            <Link href="/admin/monitoring" className={LINK_ACCENT_CLASS}>
              Monitoring →
            </Link>
          </div>
          <ul className={`mt-4 space-y-3 ${BODY_MUTED_CLASS}`}>
            <li className="flex items-center justify-between rounded-lg border border-border/80 bg-surface/60 px-3 py-2.5">
              <span>Queue waiting</span>
              <strong className="tabular-nums text-navy">
                {mon.queues.waiting_total}
              </strong>
            </li>
            <li className="flex items-center justify-between rounded-lg border border-border/80 bg-surface/60 px-3 py-2.5">
              <span>Webhook avg</span>
              <strong className="tabular-nums text-navy">
                {mon.payment.avg_webhook_ms != null
                  ? `${mon.payment.avg_webhook_ms.toFixed(0)}ms`
                  : "—"}
              </strong>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
