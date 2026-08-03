"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { CmsCheckout } from "@/server/cms/types";
import { ConfirmPayButton } from "@/app/(storefront)/checkout/[orderId]/confirm-pay-button";
import { CopyButton } from "@/storefront/components/CopyButton";
import { ExpiryCountdown } from "@/storefront/components/ExpiryCountdown";
import {
  IconCard,
  IconHeadset,
  IconKey,
  IconLock,
  IconQr,
  IconShieldCheck,
} from "@/storefront/components/icons/StoreIcons";
import {
  BADGE_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  FIELD_CAPTION_CLASS,
  FONT_DISPLAY,
  INLINE_PRICE_CLASS,
  LINK_ACCENT_CLASS,
  LINK_FIELD_CLASS,
  MONO_VALUE_CLASS,
  OVERLINE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
  SUBSECTION_TITLE_CLASS,
  SUMMARY_TOTAL_CLASS,
} from "@/storefront/typography";
import { ELEVATION_NONE } from "@/storefront/effects";
import {
  CheckoutStepper,
  checkoutMoney,
  formatCheckoutVnd,
  type CheckoutItemInfo,
  type CheckoutOrderInfo,
} from "./CheckoutView";

const CARD =
  `rounded-2xl border border-border bg-white p-5 ${ELEVATION_NONE} sm:p-6`;

const NEXT_STEP_ICONS = [IconQr, IconCard, IconKey] as const;
const CONFIRM_TRUST_ICONS = [IconShieldCheck, IconLock, IconHeadset] as const;

export type CheckoutConfirmViewProps = {
  cms: CmsCheckout;
  order: CheckoutOrderInfo;
  item: CheckoutItemInfo | null;
  payment: {
    paymentReference: string;
    expiresAt: string | null;
    qrImageUrl?: string;
    canConfirm: boolean;
    notice?: string | null;
  };
  methodTitle: string;
};

export function CheckoutConfirmView({
  cms,
  order,
  item,
  payment,
  methodTitle,
}: CheckoutConfirmViewProps) {
  const router = useRouter();
  const [reloading, setReloading] = useState(false);
  const [polling, setPolling] = useState(true);
  const money = checkoutMoney(item, order.totalVnd);
  const payLabel = formatCheckoutVnd(money.pay);
  const discountPct =
    money.listTotal && money.discount > 0
      ? Math.round((money.discount / money.listTotal) * 100)
      : 0;

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function tick() {
      try {
        const res = await fetch(
          `/api/checkout/${order.id}/payment-status`,
          { cache: "no-store" },
        );
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as {
          paid?: boolean;
          redirectTo?: string | null;
        };
        if (data.paid && data.redirectTo) {
          setPolling(false);
          router.replace(data.redirectTo);
          return;
        }
      } catch {
        /* keep polling */
      }
      if (!cancelled) {
        timer = setTimeout(tick, 3000);
      }
    }

    timer = setTimeout(tick, 2500);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [order.id, router]);

  async function reloadQr() {
    setReloading(true);
    router.refresh();
    window.setTimeout(() => setReloading(false), 600);
  }

  return (
    <div className="bg-surface/40 pb-10">
      <div className="home-container py-6 md:py-8">
        <CheckoutStepper current={3} />

        <header className="mx-auto mt-8 max-w-3xl text-center">
          <h1 className={SECTION_TITLE_CLASS}>{cms.confirmTitle}</h1>
          <p className={`mx-auto mt-2 max-w-2xl ${SECTION_LEAD_CLASS}`}>
            {cms.confirmLead}
          </p>
          {payment.notice ? (
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
              {payment.notice}
            </p>
          ) : null}
          <p
            className={`mt-3 inline-flex items-center justify-center gap-1.5 ${FIELD_CAPTION_CLASS} text-accent`}
          >
            <ShieldMini />
            {cms.securityLine}
          </p>
        </header>

        <div className="mt-8 grid items-stretch gap-4 lg:grid-cols-2 lg:gap-5">
          {/* A — Order info */}
          <section className={CARD}>
            <h2 className={SUBSECTION_TITLE_CLASS}>{cms.orderInfoTitle}</h2>
            {item ? (
              <div className="mt-4 flex gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized
                    />
                  ) : (
                    <div
                      className={`flex h-full items-center justify-center ${BADGE_CLASS} text-navy`}
                    >
                      {item.brandName.slice(0, 3)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={CARD_TITLE_CLASS}>
                    {item.productName}
                    {item.variantName ? ` - ${item.variantName}` : ""}
                  </p>
                  <p className={`mt-0.5 ${CARD_META_CLASS}`}>
                    {item.variantName} · {item.productName}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`rounded-lg bg-surface px-2.5 py-1 ${BADGE_CLASS} font-semibold text-navy`}
                    >
                      Số lượng: {item.quantity}
                    </span>
                    <span
                      className={`rounded-lg bg-surface px-2.5 py-1 ${BADGE_CLASS} font-semibold text-navy`}
                    >
                      {cms.warrantyBadge}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            <dl className={`mt-5 space-y-2.5 border-t border-border pt-4 ${SECTION_LEAD_CLASS}`}>
              <div className="flex justify-between gap-3">
                <dt>Tạm tính</dt>
                <dd className={`${INLINE_PRICE_CLASS} !text-navy`}>
                  {formatCheckoutVnd(money.listTotal ?? money.pay)}
                </dd>
              </div>
              {money.discount > 0 ? (
                <div className="flex justify-between gap-3">
                  <dt className="inline-flex items-center gap-2">
                    Giảm giá
                    {discountPct > 0 ? (
                      <span
                        className={`rounded-md bg-accent-soft px-1.5 py-0.5 ${BADGE_CLASS} text-accent`}
                      >
                        −{discountPct}%
                      </span>
                    ) : null}
                  </dt>
                  <dd className={INLINE_PRICE_CLASS}>
                    −{formatCheckoutVnd(money.discount)}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-3">
                <dt>{cms.vatLabel}</dt>
                <dd className={`${INLINE_PRICE_CLASS} !text-navy`}>0đ</dd>
              </div>
              <div className="flex items-end justify-between gap-3 border-t border-border pt-3">
                <div>
                  <dt className={CARD_TITLE_CLASS}>Tổng thanh toán</dt>
                  <p className={`mt-0.5 ${CARD_META_CLASS}`}>{cms.vatIncludedNote}</p>
                </div>
                <dd className={SUMMARY_TOTAL_CLASS}>{payLabel}</dd>
              </div>
            </dl>
          </section>

          {/* B — Payment method + timer */}
          <section className={CARD}>
            <h2 className={SUBSECTION_TITLE_CLASS}>{cms.paymentMethodCardTitle}</h2>
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-accent/30 bg-accent-soft/40 px-3.5 py-3">
              <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-accent ${ELEVATION_NONE}`}>
                <WalletMini />
              </span>
              <p className={`min-w-0 flex-1 ${CARD_TITLE_CLASS}`}>{methodTitle}</p>
              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-2.5 py-1 ${BADGE_CLASS} text-white`}
              >
                ✓ {cms.selectedMethodBadge}
              </span>
            </div>

            <dl className="mt-5 space-y-3">
              <div className="flex items-end justify-between gap-3">
                <dt className={SECTION_LEAD_CLASS}>{cms.payAmountLabel}</dt>
                <dd className={SUMMARY_TOTAL_CLASS}>{payLabel}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className={SECTION_LEAD_CLASS}>{cms.feeLabel}</dt>
                <dd className={INLINE_PRICE_CLASS}>{cms.feeValue}</dd>
              </div>
              {payment.expiresAt ? (
                <div className="flex justify-between gap-3">
                  <dt className={SECTION_LEAD_CLASS}>{cms.timerLabel}</dt>
                  <dd>
                    <ExpiryCountdown expiresAt={payment.expiresAt} variant="compact" />
                  </dd>
                </div>
              ) : null}
            </dl>

            <p
              className={`mt-5 rounded-xl border border-sky-100 bg-sky-50/90 px-3.5 py-2.5 ${SECTION_LEAD_CLASS} !text-sky-900`}
            >
              {cms.expireHint}
            </p>
          </section>

          {/* C — Next steps */}
          <section className={`${CARD} flex h-full flex-col`}>
            <h2 className={SUBSECTION_TITLE_CLASS}>{cms.nextStepsTitle}</h2>
            <ol className="mt-5 grid flex-1 gap-0 sm:grid-cols-3 sm:divide-x sm:divide-border">
              {cms.nextSteps.map((s, i) => {
                const StepIcon = NEXT_STEP_ICONS[i] ?? IconQr;
                return (
                  <li
                    key={s.id}
                    className="flex flex-col border-b border-border py-4 last:border-b-0 sm:border-b-0 sm:px-4 sm:py-1 first:sm:pl-0 last:sm:pr-0"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent ${FONT_DISPLAY} ${BADGE_CLASS} text-white`}
                      >
                        {i + 1}
                      </span>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                        <StepIcon size={20} />
                      </span>
                    </div>
                    <p className={`mt-3 ${CARD_TITLE_CLASS}`}>{s.title}</p>
                    <p className={`mt-1.5 flex-1 ${CARD_META_CLASS} leading-relaxed`}>
                      {s.description.replace(/\{\{amount\}\}/g, payLabel)}
                    </p>
                  </li>
                );
              })}
            </ol>
            <p className={`mt-auto border-t border-border pt-4 ${SECTION_LEAD_CLASS}`}>
              {cms.paidNote}
            </p>
          </section>

          {/* D — QR */}
          <section className={`${CARD} h-full`}>
            <div className="flex items-start justify-between gap-3">
              <h2 className={SUBSECTION_TITLE_CLASS}>{cms.qrCardTitle}</h2>
              <span className={`${OVERLINE_CLASS} text-muted`}>
                {cms.qrNetworkLabel}
              </span>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,180px)_1fr] sm:items-start">
              <div className="mx-auto flex h-[180px] w-[180px] items-center justify-center rounded-xl border border-border bg-white p-2">
                {payment.qrImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={payment.qrImageUrl}
                    alt="VietQR thanh toán"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className={`p-3 text-center ${CARD_META_CLASS}`}>
                    QR chưa sẵn sàng
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <p className={FIELD_CAPTION_CLASS}>{cms.amountFieldLabel}</p>
                  <p className={`mt-0.5 ${SUMMARY_TOTAL_CLASS}`}>{payLabel}</p>
                </div>
                <div>
                  <p className={`mb-1 ${FIELD_CAPTION_CLASS}`}>{cms.contentFieldLabel}</p>
                  <div className="flex items-center gap-2 rounded-lg bg-surface px-3 py-2">
                    <code className={`min-w-0 flex-1 ${MONO_VALUE_CLASS}`}>
                      {payment.paymentReference}
                    </code>
                    <CopyButton value={payment.paymentReference} label="Chép" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={reloadQr}
                  disabled={reloading}
                  className={`inline-flex items-center gap-1.5 ${LINK_FIELD_CLASS} disabled:opacity-50`}
                >
                  <RefreshMini />
                  {reloading ? "Đang tải…" : cms.reloadQrLabel}
                </button>
              </div>
            </div>

            {payment.canConfirm ? (
              <div className="mt-5 border-t border-border pt-4">
                <ConfirmPayButton
                  paymentReference={payment.paymentReference}
                  orderId={order.id}
                  label={cms.payCtaLabel}
                  hint={cms.payCtaHint}
                />
              </div>
            ) : (
              <p className={`mt-5 border-t border-border pt-4 text-sm text-muted`}>
                {polling
                  ? "Đang chờ xác nhận thanh toán… trang sẽ tự chuyển khi nhận được IPN."
                  : cms.payCtaHint ||
                    "Sau khi chuyển khoản đúng, hệ thống sẽ cập nhật trạng thái tự động. Bạn không cần bấm xác nhận thủ công."}
              </p>
            )}
          </section>
        </div>

        <ul className="mt-8 grid gap-5 border-t border-border pt-6 sm:grid-cols-3">
          {cms.confirmTrustBar.map((t, i) => {
            const Icon = CONFIRM_TRUST_ICONS[i] ?? IconShieldCheck;
            return (
              <li key={t.id} className="flex flex-col items-center text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Icon size={22} />
                </span>
                <p className={`mt-2.5 ${CARD_TITLE_CLASS}`}>{t.label}</p>
                <p className={`mt-0.5 ${CARD_META_CLASS}`}>{t.sub}</p>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-center">
          <Link
            href={`/checkout/${order.id}`}
            className={`inline-flex items-center gap-1.5 ${LINK_ACCENT_CLASS}`}
          >
            ← {cms.backToMethodLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}

function ShieldMini() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WalletMini() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );
}

function RefreshMini() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12a8 8 0 0 1 13.5-5.7M20 12a8 8 0 0 1-13.5 5.7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M17 4v4h4M7 20v-4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
