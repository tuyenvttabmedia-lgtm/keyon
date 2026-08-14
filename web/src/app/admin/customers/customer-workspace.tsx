"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import type { CustomerWorkspaceData } from "@/server/admin/customer-detail";
import { customerInitials } from "@/lib/admin-customers";
import { emailDomain, isConsumerEmailDomain } from "@/lib/company-order-filter";
import { CopyTextButton } from "@/app/admin/orders/copy-button";
import { OrderNotesForm } from "@/app/admin/orders/order-notes-form";
import { DualStatus } from "@/storefront/components/account/AccountNav";
import {
  fulfillmentStatusForCustomer,
  paymentStatusForCustomer,
} from "@/storefront/lib/order-status";
import type { OrderStatus, PaymentStatus, FulfillmentJobStatus } from "@prisma/client";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  FIELD_CAPTION_CLASS,
  FIELD_VALUE_NUM_CLASS,
  INLINE_PRICE_CLASS,
  LINK_ACCENT_CLASS,
} from "@/storefront/typography";

function fmt(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN");
}

function Panel({
  id,
  title,
  children,
  action,
}: {
  id?: string;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section id={id} className="rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="font-semibold text-navy">{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function CustomerWorkspace({ data }: { data: CustomerWorkspaceData }) {
  const { user, kpi } = data;
  const initials = customerInitials(user.name, user.email);
  const orgDomain = emailDomain(user.email);
  const [orderQ, setOrderQ] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");

  const filteredOrders = useMemo(() => {
    const needle = orderQ.trim().toLowerCase();
    return data.orders.filter((o) => {
      if (orderStatus !== "all" && o.status !== orderStatus) return false;
      if (needle && !`${o.code} ${o.status}`.toLowerCase().includes(needle)) {
        return false;
      }
      return true;
    });
  }, [data.orders, orderQ, orderStatus]);

  const statuses = useMemo(() => {
    return [...new Set(data.orders.map((o) => o.status))];
  }, [data.orders]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent">
            {initials}
          </span>
          <div>
            <h1 className="text-xl font-semibold text-navy">
              {user.name || user.email}
            </h1>
            <p className="text-sm text-muted">{user.email}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span
                className={`rounded-full px-2 py-0.5 ${BADGE_CLASS} ${
                  user.emailVerifiedAt
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                }`}
              >
                {user.emailVerifiedAt ? "Verified" : "Unverified"}
              </span>
              {user.totpEnabledAt ? (
                <span
                  className={`rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 ring-1 ring-slate-200 ${BADGE_CLASS}`}
                >
                  2FA
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="#orders"
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-navy hover:bg-navy-soft"
          >
            Xem đơn
          </a>
          <a
            href="#licenses"
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-navy hover:bg-navy-soft"
          >
            Xem License
          </a>
          <CopyTextButton text={user.email} label="Copy Email" />
          <CopyTextButton text={user.id} label="Copy ID" />
          {orgDomain && !isConsumerEmailDomain(orgDomain) ? (
            <Link
              href={`/admin/orders?company=${encodeURIComponent(orgDomain)}`}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-navy hover:bg-navy-soft"
            >
              Đơn cùng domain
            </Link>
          ) : null}
        </div>
      </div>

      <nav className="flex flex-wrap gap-2 text-xs">
        {(
          [
            ["profile", "Profile"],
            ["licenses", "Licenses"],
            ["orders", "Orders"],
            ["payments", "Payments"],
            ["notes", "Notes"],
            ["timeline", "Timeline"],
          ] as const
        ).map(([hash, label]) => (
          <a
            key={hash}
            href={`#${hash}`}
            className="rounded-full border border-border bg-card px-2.5 py-1 font-medium text-navy hover:border-accent/40"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* KPI */}
      <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
        {(
          [
            ["Tổng đơn", kpi.orderCount, "text-navy"],
            ["Hoàn tất", kpi.completedCount, "text-emerald-700"],
            ["Đang chờ", kpi.awaitingCount, "text-amber-700"],
            [
              "Tổng chi tiêu",
              `${kpi.totalSpendVnd.toLocaleString("vi-VN")}đ`,
              "text-navy",
            ],
            [
              "TB / đơn",
              `${kpi.avgOrderVnd.toLocaleString("vi-VN")}đ`,
              "text-navy",
            ],
            ["Mua gần nhất", fmt(kpi.lastPurchaseAt), "text-navy"],
          ] as const
        ).map(([label, value, tone]) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-card px-3 py-2 ring-1 ring-slate-100"
          >
            <p className={FIELD_CAPTION_CLASS}>{label}</p>
            <p className={`mt-0.5 ${FIELD_VALUE_NUM_CLASS} ${tone}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel id="profile" title="Thông tin khách">
          <dl className="space-y-2 text-sm">
            {(
              [
                ["Họ tên", user.name || "—"],
                ["Email", user.email],
                ["Điện thoại", user.phone || "—"],
                ["Ngày tham gia", fmt(user.createdAt)],
                ["Email verified", user.emailVerifiedAt ? fmt(user.emailVerifiedAt) : "Chưa"],
                ["Last login / seen", fmt(user.lastSeenAt)],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right text-navy">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel id="tickets" title="Tickets">
          {data.tickets.length === 0 ? (
            <p className={`text-sm ${BODY_MUTED_CLASS}`}>Không có ticket.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {data.tickets.map((t) => (
                <li key={t.id} className="rounded-lg bg-[#f8fafc] px-3 py-2">
                  <div className="flex justify-between gap-2">
                    <p className="font-medium text-navy">{t.subject}</p>
                    <span className="text-xs text-muted">{t.status}</span>
                  </div>
                  <p className="text-xs text-muted">{fmt(t.createdAt)}</p>
                  {t.adminNote ? (
                    <p className="mt-1 text-xs text-muted">Note: {t.adminNote}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel
        id="licenses"
        title="License đang sở hữu"
        action={
          <span className="text-xs text-muted">{data.licenses.length} mục</span>
        }
      >
        {data.licenses.length === 0 ? (
          <p className={`text-sm ${BODY_MUTED_CLASS}`}>Chưa có deliverable.</p>
        ) : (
          <ul className="divide-y divide-border text-sm">
            {data.licenses.map((l) => (
              <li
                key={l.id}
                className="flex flex-wrap items-start justify-between gap-2 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-navy">{l.productName}</p>
                  <p className="text-muted">
                    {l.variantName} · {l.sku}
                  </p>
                  <p className="text-xs text-muted">
                    {l.receiveLabel} · {l.deliverableType}
                    {l.displayHint ? ` · ${l.displayHint}` : ""}
                    {l.resendCount > 0 ? ` · resend ${l.resendCount}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">{fmt(l.deliveredAt)}</p>
                  <Link
                    href={`/admin/orders/${l.orderId}`}
                    className={`${LINK_ACCENT_CLASS} text-xs`}
                  >
                    {l.orderCode}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel id="orders" title="Đơn hàng">
        <div className="mb-3 flex flex-wrap gap-2">
          <input
            className="min-w-[160px] flex-1 rounded-lg border border-border px-2.5 py-1.5 text-sm"
            placeholder="Tìm mã đơn…"
            value={orderQ}
            onChange={(e) => setOrderQ(e.target.value)}
          />
          <select
            className="rounded-lg border border-border px-2.5 py-1.5 text-sm"
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
          >
            <option value="all">Mọi status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        {filteredOrders.length === 0 ? (
          <p className={`text-sm ${BODY_MUTED_CLASS}`}>Không có đơn.</p>
        ) : (
          <ul className="divide-y divide-border">
            {filteredOrders.map((o) => (
              <li
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="font-medium text-navy hover:text-accent"
                  >
                    {o.code}
                  </Link>
                  <p className="text-xs text-muted">{fmt(o.createdAt)}</p>
                </div>
                <DualStatus
                  payment={paymentStatusForCustomer(
                    o.paymentStatus as PaymentStatus | null,
                    o.status as OrderStatus,
                  )}
                  fulfillment={fulfillmentStatusForCustomer({
                    orderStatus: o.status as OrderStatus,
                    hasDelivery: o.hasDelivery,
                    jobStatus: o.jobStatus as FulfillmentJobStatus | null,
                  })}
                />
                <span className={INLINE_PRICE_CLASS}>
                  {o.totalVnd.toLocaleString("vi-VN")}đ
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel id="payments" title="Thanh toán">
          {data.payments.length === 0 ? (
            <p className={`text-sm ${BODY_MUTED_CLASS}`}>Chưa có payment.</p>
          ) : (
            <ul className="divide-y divide-border text-sm">
              {data.payments.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-wrap justify-between gap-2 py-2.5 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-navy">
                      {p.provider} · {p.status}
                    </p>
                    <p className="font-mono text-xs text-muted">
                      {p.paymentReference}
                    </p>
                    <Link
                      href={`/admin/orders/${p.orderId}`}
                      className="text-xs text-accent hover:underline"
                    >
                      {p.orderCode}
                    </Link>
                  </div>
                  <div className="text-right">
                    <p className={INLINE_PRICE_CLASS}>
                      {p.amountVnd.toLocaleString("vi-VN")}đ
                    </p>
                    <p className="text-xs text-muted">
                      {fmt(p.succeededAt ?? p.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel id="notes" title="Internal Notes (theo đơn)">
          {data.noteOrderId ? (
            <div className="mb-3">
              <p className="mb-2 text-xs text-muted">
                Ghi chú gắn đơn gần nhất — dùng OrderNote API sẵn có.
              </p>
              <OrderNotesForm orderId={data.noteOrderId} />
            </div>
          ) : (
            <p className={`mb-3 text-sm ${BODY_MUTED_CLASS}`}>
              Chưa có đơn để ghi chú.
            </p>
          )}
          <ul className="space-y-2 border-t border-border pt-3 text-sm">
            {data.orderNotes.length === 0 ? (
              <li className={BODY_MUTED_CLASS}>Chưa có ghi chú.</li>
            ) : (
              data.orderNotes.map((n) => (
                <li key={n.id}>
                  <p className="whitespace-pre-wrap text-navy">{n.body}</p>
                  <p className="text-xs text-muted">
                    {n.authorLabel} · {n.orderCode} · {fmt(n.createdAt)}
                  </p>
                </li>
              ))
            )}
          </ul>
        </Panel>
      </div>

      <Panel id="timeline" title="Customer Timeline">
        <ol className="relative max-h-[28rem] space-y-3 overflow-y-auto border-l border-border pl-5">
          {data.timeline.map((t, i) => (
            <li key={`${t.at}-${i}`} className="relative text-sm">
              <span
                className={`absolute -left-[1.4rem] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-card ${
                  t.tone === "success"
                    ? "bg-emerald-500"
                    : t.tone === "warn"
                      ? "bg-amber-500"
                      : t.tone === "danger"
                        ? "bg-red-500"
                        : "bg-slate-400"
                }`}
              />
              <p className="font-medium text-navy">{t.title}</p>
              <p className="text-xs text-muted">{fmt(t.at)}</p>
              {t.detail ? (
                <p className="text-muted">{t.detail}</p>
              ) : null}
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}
