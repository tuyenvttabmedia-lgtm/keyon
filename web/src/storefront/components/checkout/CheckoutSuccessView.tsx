"use client";

import Image from "next/image";
import Link from "next/link";
import type { CmsCheckout } from "@/server/cms/types";
import type { ShopProduct } from "@/storefront/components/shop/types";
import { formatVnd } from "@/storefront/components/shop/shop-utils";
import {
  IconBadgeCheck,
  IconHeadset,
  IconShieldCheck,
  IconTruck,
} from "@/storefront/components/icons/StoreIcons";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_PRICE_CLASS,
  CARD_TITLE_CLASS,
  COMPARE_PRICE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  FIELD_CAPTION_CLASS,
  FONT_DISPLAY,
  INLINE_PRICE_CLASS,
  LINK_ACCENT_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
  SUBSECTION_TITLE_CLASS,
  SUMMARY_TOTAL_CLASS,
} from "@/storefront/typography";
import {
  CTA_PRIMARY_EFFECT,
  ELEVATION_HAIRLINE,
  ELEVATION_NONE,
  HOVER_LINK_ACCENT,
  HOVER_OUTLINE_FILL,
  TRANSITION_UI,
} from "@/storefront/effects";
import {
  CheckoutStepper,
  checkoutMoney,
  formatCheckoutVnd,
  type CheckoutItemInfo,
  type CheckoutOrderInfo,
} from "./CheckoutView";
import { LicenseKeyReveal } from "./LicenseKeyReveal";

const CARD = `rounded-2xl border border-border bg-white p-5 ${ELEVATION_NONE} sm:p-6`;

const SUCCESS_TRUST_ICONS = [
  IconBadgeCheck,
  IconTruck,
  IconShieldCheck,
  IconHeadset,
] as const;

const BTN_PRIMARY = `inline-flex h-11 items-center justify-center rounded-xl bg-navy px-5 ${CTA_LABEL_CLASS} text-white ${CTA_PRIMARY_EFFECT}`;

const BTN_SECONDARY = `inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} ${HOVER_OUTLINE_FILL}`;

export type CheckoutSuccessViewProps = {
  cms: CmsCheckout;
  order: CheckoutOrderInfo;
  item: CheckoutItemInfo | null;
  paidAtLabel: string;
  methodTitle: string;
  isLoggedIn: boolean;
  orderDetailHref: string;
  licensePlain: string | null;
  recommended: ShopProduct[];
};

export function CheckoutSuccessView({
  cms,
  order,
  item,
  paidAtLabel,
  methodTitle,
  isLoggedIn,
  orderDetailHref,
  licensePlain,
  recommended,
}: CheckoutSuccessViewProps) {
  const money = checkoutMoney(item, order.totalVnd);
  const discountPct =
    money.listTotal && money.discount > 0
      ? Math.round((money.discount / money.listTotal) * 100)
      : 0;

  return (
    <div className="bg-surface/40 pb-10">
      <div className="home-container py-6 md:py-8">
        <CheckoutStepper current={4} />

        <div className="mt-8 grid items-start gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-6">
          <div className="space-y-5">
            {/* Success hero */}
            <section className={CARD}>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="mx-auto flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100 sm:mx-0">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-2xl font-bold text-white">
                    ✓
                  </span>
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <h1 className={SECTION_TITLE_CLASS}>{cms.successTitle}</h1>
                  <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>{cms.successLead}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <MetaCell
                  label={cms.successOrderCodeLabel}
                  value={`#${order.code}`}
                />
                <MetaCell label={cms.successTimeLabel} value={paidAtLabel} />
                <MetaCell label={cms.successMethodLabel} value={methodTitle} />
              </div>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <Link href={orderDetailHref} className={BTN_PRIMARY}>
                  {cms.successViewOrderCta}
                </Link>
                <Link href="/" className={BTN_SECONDARY}>
                  {cms.successHomeCta}
                </Link>
              </div>
            </section>

            {/* License */}
            <section className={CARD}>
              <h2 className={SUBSECTION_TITLE_CLASS}>{cms.licenseSectionTitle}</h2>
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
                    <div className="flex flex-wrap items-start gap-2">
                      <p className={CARD_TITLE_CLASS}>
                        {item.productName}
                        {item.variantName ? ` – ${item.variantName}` : ""}
                      </p>
                      {licensePlain ? (
                        <span
                          className={`rounded-full bg-accent-soft px-2.5 py-0.5 ${BADGE_CLASS} text-accent`}
                        >
                          {cms.licenseReadyBadge}
                        </span>
                      ) : null}
                    </div>
                    <ul className={`mt-2 space-y-0.5 ${CARD_META_CLASS}`}>
                      <li>Phiên bản: {item.productName}</li>
                      <li>Hình thức: {item.variantName}</li>
                      <li>Số lượng: {item.quantity}</li>
                      <li>{cms.warrantyBadge}</li>
                    </ul>
                  </div>
                </div>
              ) : null}

              <div className="mt-5">
                {licensePlain ? (
                  <LicenseKeyReveal
                    value={licensePlain}
                    label={cms.licenseKeyLabel}
                    showLabel={cms.licenseShowLabel}
                    hideLabel={cms.licenseHideLabel}
                    copyLabel={cms.licenseCopyLabel}
                  />
                ) : (
                  <p className="rounded-xl border border-amber-100 bg-amber-50 px-3.5 py-3 text-sm text-amber-900">
                    {cms.licensePendingNote}
                  </p>
                )}
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <h3 className={CARD_TITLE_CLASS}>{cms.activationStepsTitle}</h3>
                <ol className={`mt-3 space-y-2 ${SECTION_LEAD_CLASS}`}>
                  {cms.activationSteps.map((s, i) => (
                    <li key={s.id} className="flex gap-2.5">
                      <span
                        className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft ${FONT_DISPLAY} ${BADGE_CLASS} text-accent`}
                      >
                        {i + 1}
                      </span>
                      <span>{s.text}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 flex justify-end">
                  <Link href={cms.activationGuideHref} className={BTN_SECONDARY}>
                    {cms.activationGuideCta} →
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <section className={CARD}>
              <h2 className={SUBSECTION_TITLE_CLASS}>Tóm tắt đơn hàng</h2>
              {item ? (
                <div className="mt-4 flex gap-3 border-b border-border pb-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="56px"
                        unoptimized
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className={`truncate ${CARD_TITLE_CLASS}`}>{item.productName}</p>
                    <p className={CARD_META_CLASS}>{item.variantName}</p>
                    <p className={`mt-0.5 ${CARD_META_CLASS}`}>x {item.quantity}</p>
                  </div>
                </div>
              ) : null}

              <dl className={`mt-4 space-y-2.5 ${SECTION_LEAD_CLASS}`}>
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
                  <dt className={CARD_TITLE_CLASS}>Tổng thanh toán</dt>
                  <dd className={SUMMARY_TOTAL_CLASS}>{formatCheckoutVnd(money.pay)}</dd>
                </div>
              </dl>

              <p
                className={`mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 ${BADGE_CLASS} font-semibold text-emerald-800`}
              >
                <span aria-hidden>✓</span>
                {cms.summaryPaidBanner}
              </p>
            </section>

            <section className={CARD}>
              <h2 className={SUBSECTION_TITLE_CLASS}>{cms.successSupportTitle}</h2>
              <ul className="mt-3 grid grid-cols-2 gap-2.5">
                {cms.successSupportLinks.map((l) => (
                  <li key={l.id}>
                    <Link
                      href={l.href}
                      className={`flex h-full min-h-[4.5rem] flex-col items-center justify-center rounded-xl border border-border bg-surface/60 px-2 py-3 text-center ${TRANSITION_UI} ${HOVER_OUTLINE_FILL}`}
                    >
                      <span className={`${CTA_COMPACT_CLASS} leading-snug`}>
                        {l.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {!isLoggedIn ? (
              <section className={`rounded-2xl bg-navy p-5 text-white ${ELEVATION_NONE} sm:p-6`}>
                <p className={`${SUBSECTION_TITLE_CLASS} text-white`}>
                  {cms.accountUpsellTitle}
                </p>
                <p className={`mt-2 ${BODY_MUTED_CLASS} !text-white/75`}>
                  {cms.accountUpsellBody}
                </p>
                <Link
                  href={cms.accountUpsellHref}
                  className={`mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/40 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:border-accent hover:bg-accent`}
                >
                  {cms.accountUpsellCta}
                </Link>
              </section>
            ) : (
              <section className={CARD}>
                <p className={CARD_TITLE_CLASS}>License của tôi</p>
                <p className={`mt-1 ${CARD_META_CLASS}`}>
                  Xem lại, gửi lại và quản lý giấy phép đã nhận.
                </p>
                <Link href="/account/assets" className={`mt-4 ${BTN_PRIMARY} w-full`}>
                  Vào License của tôi
                </Link>
              </section>
            )}
          </aside>
        </div>

        {/* Recommended */}
        {recommended.length > 0 ? (
          <section className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className={SUBSECTION_TITLE_CLASS}>{cms.recommendedTitle}</h2>
              <Link href="/products" className={LINK_ACCENT_CLASS}>
                {cms.recommendedViewAllLabel} →
              </Link>
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recommended.map((p) => (
                <li key={p.id}>
                  <SuccessRecoCard item={p} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <div className="mt-6 border-t border-border bg-white">
        <ul className="home-container grid grid-cols-2 gap-5 py-6 md:grid-cols-4 md:gap-6">
          {cms.trustBar.map((t, i) => {
            const Icon = SUCCESS_TRUST_ICONS[i] ?? IconShieldCheck;
            return (
              <li
                key={t.id}
                className="flex flex-col items-center text-center md:flex-row md:items-start md:gap-3 md:text-left"
              >
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Icon size={22} />
                </span>
                <div className="mt-2 md:mt-0">
                  <p className={CARD_TITLE_CLASS}>{t.label}</p>
                  <p className={`mt-0.5 ${CARD_META_CLASS}`}>{t.sub}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface/80 px-3.5 py-3 text-center sm:text-left">
      <p className={FIELD_CAPTION_CLASS}>{label}</p>
      <p className={`mt-1 break-all ${CARD_TITLE_CLASS}`}>{value}</p>
    </div>
  );
}

function SuccessRecoCard({ item }: { item: ShopProduct }) {
  const compare = item.compareAtPriceVnd;
  const discount = item.discountPercent;
  return (
    <article className={`flex h-full flex-col rounded-2xl border border-border bg-white p-3 ${ELEVATION_HAIRLINE}`}>
      <Link
        href={item.href}
        className="relative flex aspect-[4/3] items-center justify-center rounded-xl bg-surface"
      >
        {discount ? (
          <span
            className={`absolute left-2 top-2 rounded-full bg-rose-500 px-2 py-0.5 ${BADGE_CLASS} text-white`}
          >
            −{discount}%
          </span>
        ) : null}
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt=""
            width={120}
            height={90}
            className="max-h-[90px] w-auto object-contain"
            unoptimized
          />
        ) : (
          <span className={`${BADGE_CLASS} text-navy`}>
            {item.brandName.slice(0, 3)}
          </span>
        )}
      </Link>
      <Link href={item.href} className="mt-2.5">
        <h3 className={`line-clamp-2 ${CARD_TITLE_CLASS} ${HOVER_LINK_ACCENT}`}>
          {item.productName}
        </h3>
      </Link>
      <p className={`mt-0.5 line-clamp-1 ${CARD_META_CLASS}`}>{item.packageName}</p>
      <div className="mt-2 flex flex-wrap items-baseline gap-2">
        <p className={CARD_PRICE_CLASS}>{formatVnd(item.priceVnd)}</p>
        {compare && compare > item.priceVnd ? (
          <p className={COMPARE_PRICE_CLASS}>{formatVnd(compare)}</p>
        ) : null}
      </div>
      <Link
        href={item.href}
        className={`mt-3 inline-flex h-10 w-full items-center justify-center rounded-xl bg-accent-soft ${CTA_COMPACT_CLASS} text-accent ${TRANSITION_UI} hover:bg-accent hover:text-white`}
      >
        Xem sản phẩm
      </Link>
    </article>
  );
}
