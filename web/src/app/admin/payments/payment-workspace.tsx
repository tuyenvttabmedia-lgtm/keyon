"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { PaymentWorkspaceData } from "@/server/admin/payment-detail";
import { CopyTextButton } from "@/app/admin/orders/copy-button";
import { StatusBadge } from "@/storefront/components/account/AccountNav";
import { paymentStatusForCustomer } from "@/storefront/lib/order-status";
import type { OrderStatus, PaymentStatus } from "@prisma/client";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
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
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="rounded-2xl border border-border bg-card">
      <h2 className="border-b border-border px-4 py-3 font-semibold text-navy">
        {title}
      </h2>
      <div className="p-4">{children}</div>
    </section>
  );
}

function hintClass(hint: PaymentWorkspaceData["payment"]["reconcileHint"]) {
  switch (hint) {
    case "matched":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "needs_review":
    case "mismatch":
      return "bg-amber-50 text-amber-800 ring-1 ring-amber-200";
    case "failed":
      return "bg-red-50 text-red-700 ring-1 ring-red-200";
    default:
      return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  }
}

export function PaymentWorkspace({ data }: { data: PaymentWorkspaceData }) {
  const { payment, order, customer } = data;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div>
          <p className="font-mono text-sm text-muted">{payment.paymentReference}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <StatusBadge
              status={paymentStatusForCustomer(
                payment.status as PaymentStatus,
                order.status as OrderStatus,
              )}
            />
            <span
              className={`rounded-full px-2 py-0.5 ${BADGE_CLASS} ${hintClass(payment.reconcileHint)}`}
            >
              {payment.reconcileLabel}
            </span>
            <span className="text-xs font-semibold text-navy">
              Age {payment.ageLabel}
            </span>
          </div>
          <p className={`mt-2 ${INLINE_PRICE_CLASS}`}>
            {payment.amountVnd.toLocaleString("vi-VN")} {payment.currency}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/orders/${order.id}`}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-navy hover:bg-navy-soft"
          >
            Xem Order
          </Link>
          {customer.id ? (
            <Link
              href={`/admin/customers/${customer.id}`}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-navy hover:bg-navy-soft"
            >
              Xem Customer
            </Link>
          ) : (
            <Link
              href={`/admin/customers?q=${encodeURIComponent(customer.email)}`}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-navy hover:bg-navy-soft"
            >
              Tìm Customer
            </Link>
          )}
          <CopyTextButton text={payment.paymentReference} label="Copy Reference" />
        </div>
      </div>

      <nav className="flex flex-wrap gap-2 text-xs">
        {(
          [
            ["payment", "Payment"],
            ["order", "Order"],
            ["customer", "Customer"],
            ["gateway", "Gateway"],
            ["timeline", "Timeline"],
            ["webhook", "Webhook"],
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

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel id="payment" title="Payment">
          <dl className="space-y-2 text-sm">
            {(
              [
                ["Reference", payment.paymentReference],
                ["Status", payment.status],
                ["Provider", payment.provider],
                ["Amount", `${payment.amountVnd.toLocaleString("vi-VN")} đ`],
                ["Created", fmt(payment.createdAt)],
                ["Succeeded", fmt(payment.succeededAt)],
                ["QR expires", fmt(payment.expiresAt)],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-mono text-xs text-navy">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel id="order" title="Order">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Code</dt>
              <dd>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className={LINK_ACCENT_CLASS}
                >
                  {order.code}
                </Link>
              </dd>
            </div>
            {(
              [
                ["Status", order.status],
                ["Total", `${order.totalVnd.toLocaleString("vi-VN")} đ`],
                ["Created", fmt(order.createdAt)],
                ["Paid", fmt(order.paidAt)],
                ["Completed", fmt(order.completedAt)],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right text-navy">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel id="customer" title="Customer">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Email</dt>
              <dd className="text-navy">
                {customer.id ? (
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className={LINK_ACCENT_CLASS}
                  >
                    {customer.email}
                  </Link>
                ) : (
                  customer.email
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Name</dt>
              <dd className="text-navy">{customer.name || "—"}</dd>
            </div>
          </dl>
        </Panel>

        <Panel id="gateway" title="Gateway">
          <dl className="space-y-2 text-sm">
            {(
              [
                ["Transaction ID", payment.providerTransactionId || "—"],
                ["Event ID", payment.providerEventId || "—"],
                ["Provider ref", payment.providerReference || "—"],
                ["Bank / Gateway", payment.rawGateway || "—"],
                ["Provider paid at", fmt(payment.providerPaidAt)],
                [
                  "Webhook amount",
                  payment.rawTransferAmount != null
                    ? `${payment.rawTransferAmount.toLocaleString("vi-VN")} đ`
                    : "—",
                ],
                ["Fee", "—"],
                ["Net Amount", "—"],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-muted">{k}</dt>
                <dd className="max-w-[60%] break-all text-right font-mono text-xs text-navy">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          {payment.rawTransferAmount != null &&
          payment.rawTransferAmount !== payment.amountVnd ? (
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Amount lệch: order {payment.amountVnd.toLocaleString("vi-VN")} ≠
              webhook {payment.rawTransferAmount.toLocaleString("vi-VN")}
            </p>
          ) : null}
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel id="timeline" title="Timeline">
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
                {t.detail ? <p className="text-muted">{t.detail}</p> : null}
              </li>
            ))}
          </ol>
        </Panel>

        <Panel id="webhook" title="Webhook">
          {data.webhooks.length === 0 ? (
            <p className={`text-sm ${BODY_MUTED_CLASS}`}>
              Chưa có webhook receipt cho reference này.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {data.webhooks.map((w) => (
                <li key={w.id} className="rounded-lg bg-[#f8fafc] px-3 py-2">
                  <p className="font-mono text-xs text-navy">
                    {w.providerEventId}
                  </p>
                  <p className="text-xs text-muted">
                    {w.provider} · {fmt(w.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {payment.rawPayload ? (
            <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-[#0f172a] p-3 text-[11px] text-slate-200">
              {JSON.stringify(payment.rawPayload, null, 2)}
            </pre>
          ) : null}
        </Panel>
      </div>
    </div>
  );
}
