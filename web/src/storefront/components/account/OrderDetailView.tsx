"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { AccountCopy } from "@/storefront/lib/account-cms";
import { CopyButton } from "@/storefront/components/CopyButton";
import { LicenseKeyReveal } from "@/storefront/components/checkout/LicenseKeyReveal";
import { formatCheckoutVnd } from "@/storefront/components/checkout/CheckoutView";
import {
  IconHeadset,
  IconShieldCheck,
} from "@/storefront/components/icons/StoreIcons";
import type { OrderTimelineStep } from "@/storefront/lib/order-timeline";
import {
  BADGE_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  FIELD_VALUE_CLASS,
  FORM_LABEL_CLASS,
  INLINE_PRICE_CLASS,
  LINK_ACCENT_CLASS,
  MONO_VALUE_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SUBSECTION_TITLE_CLASS,
  SUMMARY_TOTAL_CLASS,
} from "@/storefront/typography";
import {
  CARD_PORTAL,
  CTA_PRIMARY_EFFECT,
  ELEVATION_CTA_HOVER,
  ELEVATION_NONE,
  HOVER_LINK_ACCENT,
  HOVER_OUTLINE_FILL,
  TRANSITION_UI,
} from "@/storefront/effects";

const CARD = CARD_PORTAL;

/** Matches CheckoutSuccessView primary CTA. */
const BTN_PRIMARY = `inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-navy px-5 ${CTA_LABEL_CLASS} text-white ${CTA_PRIMARY_EFFECT}`;

/** Matches CheckoutSuccessView secondary CTA. */
const BTN_SECONDARY = `inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} ${HOVER_OUTLINE_FILL}`;

const CHIP = `rounded-full bg-surface px-2.5 py-0.5 ${BADGE_CLASS} text-navy`;

export type OrderDetailLine = {
  id: string;
  productName: string;
  variantName: string;
  brandName: string;
  imageUrl: string | null;
  unitPriceVnd: number;
  quantity: number;
  licensePlain: string | null;
};

export type OrderDetailViewProps = {
  cms: AccountCopy;
  order: {
    id: string;
    code: string;
    createdAtLabel: string;
    paymentMethodTitle: string;
    paymentRef: string | null;
    paidAtLabel: string | null;
    paymentSucceeded: boolean;
  };
  overallStatus: "completed" | "processing" | "pending_pay";
  overallStatusLabel: string;
  money: {
    listTotal: number | null;
    discount: number;
    discountPct: number;
    pay: number;
  };
  timeline: OrderTimelineStep[];
  lines: OrderDetailLine[];
};

export function OrderDetailView({
  cms,
  order,
  overallStatus,
  overallStatusLabel,
  money,
  timeline,
  lines,
}: OrderDetailViewProps) {
  const [invoiceMsg, setInvoiceMsg] = useState<string | null>(null);

  function downloadInvoice() {
    setInvoiceMsg("Hóa đơn điện tử sẽ gửi qua email / Tài khoản khi sẵn sàng.");
    window.setTimeout(() => setInvoiceMsg(null), 4000);
  }

  const statusColor =
    overallStatus === "completed"
      ? "text-emerald-600"
      : overallStatus === "processing"
        ? "text-sky-700"
        : "text-amber-700";

  const statusRing =
    overallStatus === "completed"
      ? "bg-emerald-50 ring-emerald-100"
      : overallStatus === "processing"
        ? "bg-sky-50 ring-sky-100"
        : "bg-amber-50 ring-amber-100";

  const statusDot =
    overallStatus === "completed"
      ? "bg-emerald-500"
      : overallStatus === "processing"
        ? "bg-sky-500"
        : "bg-amber-500";

  return (
    <div className="space-y-5">
      <nav className={`flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
        <Link
          href="/account"
          className={HOVER_LINK_ACCENT}
        >
          Tài khoản
        </Link>
        <span aria-hidden>›</span>
        <Link
          href="/account/orders"
          className={HOVER_LINK_ACCENT}
        >
          Đơn hàng của tôi
        </Link>
        <span aria-hidden>›</span>
        <span className={BREADCRUMB_CURRENT_CLASS}>{cms.orderPageTitle}</span>
      </nav>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/account/orders"
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-navy ${TRANSITION_UI} ${HOVER_OUTLINE_FILL}`}
            aria-label={cms.orderBackLabel}
          >
            ←
          </Link>
          <h1 className={PAGE_TITLE_CLASS}>{cms.orderPageTitle}</h1>
        </div>
        <button type="button" onClick={downloadInvoice} className={BTN_SECONDARY}>
          <DownloadIcon />
          {cms.orderInvoiceCta}
        </button>
      </div>
      {invoiceMsg ? (
        <p className={`${CARD_META_CLASS} !text-accent`}>{invoiceMsg}</p>
      ) : null}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(17rem,22rem)] lg:gap-5">
        <div className="space-y-5">
          {/* Status */}
          <section className={CARD}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span
                className={`mx-auto inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full ring-4 sm:mx-0 ${statusRing}`}
              >
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white ${statusDot}`}
                >
                  {overallStatus === "completed" ? "✓" : "!"}
                </span>
              </span>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <p className={`${SUBSECTION_TITLE_CLASS} ${statusColor}`}>
                  {overallStatusLabel}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <p className={CARD_TITLE_CLASS}>
                    {cms.orderCodeLabel} #{order.code}
                  </p>
                  <CopyButton value={order.code} label="Chép" />
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <MetaCell label={cms.orderTimeLabel} value={order.createdAtLabel} />
              <MetaCell
                label={cms.orderPaymentMethodLabel}
                value={order.paymentMethodTitle}
              />
            </div>
          </section>

          {/* Products + license */}
          <section className={CARD}>
            <h2 className={SUBSECTION_TITLE_CLASS}>{cms.productsTitle}</h2>
            <ul className="mt-4 divide-y divide-border">
              {lines.map((line) => (
                <li key={line.id} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex gap-3 sm:gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface sm:h-[4.5rem] sm:w-[4.5rem]">
                      {line.imageUrl ? (
                        <Image
                          src={line.imageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="72px"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs font-bold text-navy">
                          {line.brandName.slice(0, 3)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className={CARD_TITLE_CLASS}>
                            {line.productName}
                            {line.variantName ? ` – ${line.variantName}` : ""}
                          </p>
                          <ul className={`mt-1.5 space-y-0.5 ${CARD_META_CLASS}`}>
                            <li>Hình thức: {line.variantName}</li>
                            <li>Số lượng: {line.quantity}</li>
                          </ul>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <span className={CHIP}>x{line.quantity}</span>
                            <span
                              className={`rounded-full bg-accent-soft px-2.5 py-0.5 ${BADGE_CLASS} text-accent`}
                            >
                              {cms.warrantyBadge}
                            </span>
                          </div>
                        </div>
                        <p className={`shrink-0 ${INLINE_PRICE_CLASS}`}>
                          {formatCheckoutVnd(line.unitPriceVnd)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {line.licensePlain ? (
                    <div className="mt-4 space-y-3">
                      <LicenseKeyReveal
                        value={line.licensePlain}
                        label={cms.licenseKeyLabel}
                        showLabel="Hiện"
                        hideLabel="Ẩn"
                        copyLabel="Sao chép"
                      />
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p
                          className={`inline-flex items-start gap-1.5 ${CARD_META_CLASS}`}
                        >
                          <IconShieldCheck size={14} className="mt-0.5 shrink-0" />
                          {cms.licenseSecurityNote}
                        </p>
                        <Link
                          href={cms.activationGuideHref}
                          className={`${BTN_SECONDARY} shrink-0`}
                        >
                          {cms.activationGuideCta} →
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p
                      className={`mt-4 rounded-xl border border-amber-100 bg-amber-50 px-3.5 py-3 ${SECTION_LEAD_CLASS} !text-amber-900`}
                    >
                      License chưa sẵn sàng — KEYON đang xử lý giao hàng.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* History */}
          <section className={CARD}>
            <h2 className={SUBSECTION_TITLE_CLASS}>{cms.timelineTitle}</h2>
            <ol className="relative mt-5">
              {timeline.map((step, i) => {
                const last = i === timeline.length - 1;
                const done = step.state === "done" || step.state === "current";
                return (
                  <li
                    key={step.id}
                    className="relative flex gap-3 pb-5 last:pb-0"
                  >
                    {!last ? (
                      <span
                        className={`absolute left-[15px] top-8 h-[calc(100%-1.25rem)] w-px ${
                          step.state === "done" ? "bg-accent" : "bg-border"
                        }`}
                        aria-hidden
                      />
                    ) : null}
                    <span
                      className={`relative z-[1] mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${TRANSITION_UI} ${
                        done
                          ? "bg-accent text-white"
                          : "bg-surface text-muted ring-1 ring-border"
                      }`}
                    >
                      {done ? "✓" : i + 1}
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      {step.at ? (
                        <p className={CARD_META_CLASS}>
                          {step.at.toLocaleString("vi-VN")}
                        </p>
                      ) : null}
                      <p className={`mt-0.5 ${CARD_TITLE_CLASS}`}>{step.title}</p>
                      {step.detail ? (
                        <p className={`mt-1 ${SECTION_LEAD_CLASS}`}>
                          {step.detail}
                        </p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <section className={CARD}>
            <h2 className={SUBSECTION_TITLE_CLASS}>{cms.summaryTitle}</h2>
            <dl className={`mt-4 space-y-2.5 ${SECTION_LEAD_CLASS}`}>
              <div className="flex justify-between gap-3">
                <dt>Tạm tính</dt>
                <dd className={INLINE_PRICE_CLASS}>
                  {formatCheckoutVnd(money.listTotal ?? money.pay)}
                </dd>
              </div>
              {money.discount > 0 ? (
                <div className="flex justify-between gap-3">
                  <dt className="inline-flex items-center gap-2">
                    Giảm giá
                    {money.discountPct > 0 ? (
                      <span
                        className={`rounded-md bg-accent-soft px-1.5 py-0.5 ${BADGE_CLASS} text-accent`}
                      >
                        −{money.discountPct}%
                      </span>
                    ) : null}
                  </dt>
                  <dd className={INLINE_PRICE_CLASS}>
                    −{formatCheckoutVnd(money.discount)}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-3">
                <dt>{cms.feeLabel}</dt>
                <dd className={`font-semibold text-accent`}>{cms.feeValue}</dd>
              </div>
              <div className="flex items-end justify-between gap-3 border-t border-border pt-3">
                <div>
                  <dt className={CARD_TITLE_CLASS}>Tổng thanh toán</dt>
                  <p className={`mt-0.5 ${CARD_META_CLASS}`}>
                    {cms.vatIncludedNote}
                  </p>
                </div>
                <dd className={SUMMARY_TOTAL_CLASS}>
                  {formatCheckoutVnd(money.pay)}
                </dd>
              </div>
            </dl>
          </section>

          <section className={CARD}>
            <h2 className={SUBSECTION_TITLE_CLASS}>{cms.paymentInfoTitle}</h2>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className={FORM_LABEL_CLASS}>{cms.orderPaymentMethodLabel}</dt>
                <dd className={`mt-1 ${FIELD_VALUE_CLASS}`}>
                  {order.paymentMethodTitle}
                </dd>
              </div>
              {order.paymentRef ? (
                <div>
                  <dt className={FORM_LABEL_CLASS}>{cms.transactionIdLabel}</dt>
                  <dd className={`mt-1 ${MONO_VALUE_CLASS}`}>
                    {order.paymentRef}
                  </dd>
                </div>
              ) : null}
              {order.paidAtLabel ? (
                <div>
                  <dt className={FORM_LABEL_CLASS}>{cms.paymentTimeLabel}</dt>
                  <dd className={`mt-1 ${FIELD_VALUE_CLASS}`}>
                    {order.paidAtLabel}
                  </dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-2">
                <dt className={FORM_LABEL_CLASS}>{cms.paymentStatusLabel}</dt>
                <dd
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${BADGE_CLASS} ${
                    order.paymentSucceeded
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-800"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      order.paymentSucceeded ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {order.paymentSucceeded ? "Thành công" : "Chờ thanh toán"}
                </dd>
              </div>
            </dl>
          </section>

          <section className={CARD}>
            <h2 className={SUBSECTION_TITLE_CLASS}>{cms.supportCardTitle}</h2>
            <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>{cms.supportCardBody}</p>
            <Link
              href={`/account/tickets?orderId=${order.id}`}
              className={`mt-4 ${BTN_PRIMARY}`}
            >
              <IconHeadset size={16} />
              {cms.supportCardCta}
            </Link>
          </section>

          <section className="overflow-hidden rounded-2xl bg-navy p-5 text-white sm:p-6">
            <p className={`${SUBSECTION_TITLE_CLASS} text-white`}>
              {cms.promoTitle}
            </p>
            <p className={`mt-2 ${SECTION_LEAD_CLASS} text-white/75`}>
              {cms.promoBody}
            </p>
            <Link
              href={cms.promoHref}
              className={`mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-white px-4 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:bg-accent hover:text-white ${ELEVATION_CTA_HOVER}`}
            >
              {cms.promoCta}
            </Link>
          </section>
        </aside>
      </div>

      <div className={`rounded-2xl border border-border bg-white px-4 py-3.5 text-center sm:px-6 ${ELEVATION_NONE}`}>
        <p className={SECTION_LEAD_CLASS}>
          {cms.contactBarLead}{" "}
          <a
            href={`tel:${cms.contactPhone.replace(/\s/g, "")}`}
            className={LINK_ACCENT_CLASS}
          >
            {cms.contactPhone}
          </a>
          {" · "}
          <a href={`mailto:${cms.contactEmail}`} className={LINK_ACCENT_CLASS}>
            {cms.contactEmail}
          </a>
        </p>
      </div>
    </div>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface/80 px-3.5 py-3 text-center sm:text-left">
      <p className={FORM_LABEL_CLASS}>{label}</p>
      <p className={`mt-1 break-all ${FIELD_VALUE_CLASS}`}>{value}</p>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4v10M8 10l4 4 4-4M5 18h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
