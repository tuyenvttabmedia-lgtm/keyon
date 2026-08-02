import Link from "next/link";
import { loadDashboardView } from "@/server/dashboard-read-model";
import {
  ADMIN_PAGE_TITLE_CLASS,
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  FORM_LABEL_CLASS,
  LINK_ACCENT_CLASS,
  LINK_MICRO_CLASS,
  SECTION_LEAD_CLASS,
  STAT_VALUE_CLASS,
} from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const { inventory: inv, monitoring: mon } = await loadDashboardView();

  const cards = [
    {
      label: "Đơn hôm nay",
      value: mon.ops.orders_today,
      href: "/admin/orders",
      hint: "Orders today",
    },
    {
      label: "Doanh thu hôm nay",
      value: mon.ops.revenue_today_vnd.toLocaleString("vi-VN") + " đ",
      href: "/admin/orders",
    },
    {
      label: "Chờ giao / xử lý",
      value: mon.ops.pending_orders,
      href: "/admin/inbox",
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
    },
    {
      label: "Tiến trình giao hàng",
      value: mon.worker.ok ? "OK" : "DOWN",
      href: "/admin/monitoring",
      warn: !mon.worker.ok,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>Dashboard</h1>
        <p className={`mt-1 ${SECTION_LEAD_CLASS}`}>
          Tổng quan vận hành hôm nay
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`rounded-2xl border bg-card p-5 transition hover:border-accent ${
              c.warn ? "border-amber-300" : "border-border"
            }`}
          >
            <p className={FORM_LABEL_CLASS}>{c.label}</p>
            <p
              className={`mt-2 ${STAT_VALUE_CLASS} ${
                c.warn ? "text-amber-700" : ""
              }`}
            >
              {c.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className={CARD_TITLE_CLASS}>Tồn kho License</p>
          <p className={`mt-2 ${BODY_MUTED_CLASS}`}>
            Available {inv.available} · Reserved {inv.reserved} · Consumed {inv.consumed} ·
            Disabled {inv.disabled}
          </p>
          <ul className="mt-3 space-y-1">
            {inv.skus
              .filter((s) => s.stock_status !== "OK")
              .slice(0, 8)
              .map((s) => (
                <li key={s.sku}>
                  <Link
                    href={`/admin/inventory/${encodeURIComponent(s.sku)}`}
                    className={`font-mono ${LINK_MICRO_CLASS}`}
                  >
                    {s.sku}
                  </Link>
                  <span className={BODY_MUTED_CLASS}>
                    {" "}
                    · {s.stock_status} · avail={s.available}
                  </span>
                </li>
              ))}
            {inv.skus.every((s) => s.stock_status === "OK") && (
              <li className={BODY_MUTED_CLASS}>Không có LOW_STOCK / OUT_OF_STOCK</li>
            )}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className={CARD_TITLE_CLASS}>Hàng đợi / Payment</p>
          <ul className={`mt-3 space-y-2 ${BODY_MUTED_CLASS}`}>
            <li>
              Queue waiting: <strong className="text-navy">{mon.queues.waiting_total}</strong>
            </li>
            <li>
              Webhook avg:{" "}
              <strong className="text-navy">
                {mon.payment.avg_webhook_ms != null
                  ? `${mon.payment.avg_webhook_ms.toFixed(0)}ms`
                  : "—"}
              </strong>
            </li>
            <li>
              <Link href="/admin/monitoring" className={LINK_ACCENT_CLASS}>
                Xem monitoring →
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
