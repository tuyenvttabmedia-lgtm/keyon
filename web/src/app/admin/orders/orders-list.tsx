"use client";

import Link from "next/link";
import type { AdminOrderListRow } from "@/lib/admin-orders";
import { formatOrderAge } from "@/lib/admin-orders";
import type { OrderStatus, PaymentStatus } from "@prisma/client";
import {
  fulfillmentStatusForCustomer,
  paymentStatusForCustomer,
  statusBadgeClass,
  type CustomerStatus,
} from "@/storefront/lib/order-status";
import { OrderQuickMenu } from "./order-quick-menu";
import { OrderTimelinePreviewTip } from "./order-timeline-preview";
import {
  BADGE_CLASS,
  CARD_META_CLASS,
  EMPTY_BODY_CLASS,
  EMPTY_TITLE_CLASS,
  INLINE_PRICE_CLASS,
} from "@/storefront/typography";

function Icon({
  name,
  className = "h-3.5 w-3.5",
}: {
  name: "order" | "product" | "user" | "time" | "pay" | "box" | "brand" | "age";
  className?: string;
}) {
  const common = `${className} shrink-0 text-muted`;
  switch (name) {
    case "order":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 4h10l1 4H6l1-4Z" />
          <path d="M6 8h12v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8Z" />
          <path d="M9 12h6M9 16h4" />
        </svg>
      );
    case "product":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
          <path d="M12 12 4 7.5M12 12l8-4.5M12 12v9" />
        </svg>
      );
    case "user":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 19a7 7 0 0 1 14 0" />
        </svg>
      );
    case "time":
    case "age":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l2.5 2.5" />
        </svg>
      );
    case "pay":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 10h18" />
        </svg>
      );
    case "box":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 8h16v11H4z" />
          <path d="M4 8 12 4l8 4" />
          <path d="M12 4v15" />
        </svg>
      );
    case "brand":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3 4 7v5c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V7l-8-4Z" />
        </svg>
      );
  }
}

function OpsBadge({
  status,
  emphasize,
}: {
  status: CustomerStatus;
  emphasize?: boolean;
}) {
  const hot =
    emphasize ||
    status.tone === "warning" ||
    status.tone === "danger" ||
    status.tone === "info";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 leading-none ${BADGE_CLASS} ${statusBadgeClass(status.tone)} ${
        hot ? "ring-1" : "opacity-90"
      }`}
    >
      {status.label}
    </span>
  );
}

function formatTime(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrdersList({ rows }: { rows: AdminOrderListRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
        <p className={EMPTY_TITLE_CLASS}>Không có đơn phù hợp</p>
        <p className={`mt-1 ${EMPTY_BODY_CLASS}`}>Đổi bộ lọc hoặc khoảng thời gian.</p>
      </div>
    );
  }

  return (
    <div className="admin-panel overflow-hidden rounded-2xl border border-border bg-card">
      <ul className="divide-y divide-border">
        {rows.map((o) => {
          const payment = {
            ...paymentStatusForCustomer(
              o.paymentStatus as PaymentStatus | null,
              o.status as OrderStatus,
            ),
          };
          let fulfillment = fulfillmentStatusForCustomer({
            orderStatus: o.status as OrderStatus,
            hasDelivery: o.hasDelivery,
            jobStatus: o.jobStatus as never,
          });
          if (o.paymentExpired && o.status === "PENDING_PAYMENT") {
            payment.label = "Hết hạn";
            payment.tone = "danger";
          }
          if (o.waitingInbox) {
            fulfillment = { label: "Cần xử lý", tone: "warning" };
          } else if (
            o.jobStatus === "PROCESSING" ||
            o.jobStatus === "QUEUED" ||
            o.status === "FULFILLING"
          ) {
            fulfillment = { label: "Đang giao", tone: "warning" };
          }

          const productLine = o.productName ?? o.itemTitles[0] ?? "—";
          const age = formatOrderAge(o.createdAt);
          const ageHot =
            o.waitingInbox ||
            o.status === "PENDING_PAYMENT" ||
            o.status === "FULFILLING" ||
            o.status === "PAID";

          return (
            <li
              key={o.id}
              className="group/order relative px-3 py-2 hover:bg-[#f8fafc]"
            >
              <div className="flex items-center gap-3">
                <div className="relative min-w-0 flex-[1.4]">
                  <div className="flex items-center gap-1.5">
                    <Icon name="order" />
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="font-bold tracking-tight text-navy hover:text-accent"
                    >
                      {o.code}
                    </Link>
                    <span
                      className={`ml-1 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
                        ageHot
                          ? "bg-amber-50 text-amber-900"
                          : "bg-slate-100 text-slate-600"
                      }`}
                      title={formatTime(o.createdAt)}
                    >
                      <Icon name="age" className="h-3 w-3" />
                      {age}
                    </span>
                  </div>
                  <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
                    <Icon name="product" className="h-3 w-3" />
                    <p className="truncate text-[13px] font-medium text-navy/90">
                      {productLine}
                    </p>
                  </div>
                  <div
                    className={`mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 ${CARD_META_CLASS}`}
                  >
                    <span className="inline-flex items-center gap-1">
                      <Icon name="user" className="h-3 w-3" />
                      <span className="max-w-[180px] truncate">{o.email}</span>
                    </span>
                    {o.companyLabel ? (
                      <span className="max-w-[160px] truncate" title={o.companyLabel}>
                        {o.companyLabel}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1">
                      <Icon name="time" className="h-3 w-3" />
                      {formatTime(o.createdAt)}
                    </span>
                    {o.brandName ? (
                      <span className="inline-flex items-center gap-1">
                        <Icon name="brand" className="h-3 w-3" />
                        {o.brandName}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1">
                      <Icon name="box" className="h-3 w-3" />
                      {o.receiveLabel}
                    </span>
                    {o.paymentProvider ? (
                      <span className="text-muted">{o.paymentProvider}</span>
                    ) : null}
                  </div>
                  <OrderTimelinePreviewTip timeline={o.timeline} />
                </div>

                <div className="hidden w-[148px] shrink-0 flex-col gap-1 sm:flex">
                  <span className="inline-flex items-center gap-1">
                    <Icon name="pay" className="h-3 w-3" />
                    <OpsBadge
                      status={payment}
                      emphasize={
                        payment.tone === "warning" || payment.tone === "danger"
                      }
                    />
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Icon name="box" className="h-3 w-3" />
                    <OpsBadge
                      status={fulfillment}
                      emphasize={
                        fulfillment.tone === "warning" ||
                        fulfillment.tone === "info" ||
                        fulfillment.tone === "danger"
                      }
                    />
                  </span>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className={`${INLINE_PRICE_CLASS} text-navy`}>
                    {o.totalVnd.toLocaleString("vi-VN")}đ
                  </span>
                  <OrderQuickMenu row={o} />
                </div>
              </div>

              <div className="mt-1.5 flex flex-wrap gap-1 sm:hidden">
                <OpsBadge status={payment} emphasize />
                <OpsBadge status={fulfillment} emphasize />
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                  {age}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
