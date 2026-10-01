"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import type { CmsCheckout } from "@/server/cms/types";
import type { ShopProduct } from "@/storefront/components/shop/types";
import { ProductCard } from "@/storefront/components/ProductCard";
import { trackPurchase } from "@/storefront/lib/analytics";
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
  CARD_TITLE_CLASS,
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
  ELEVATION_NONE,
  HOVER_OUTLINE_FILL,
  TRANSITION_UI,
} from "@/storefront/effects";
import {
  CheckoutStepper,
  checkoutMoney,
  formatCheckoutVnd,
  planHeading,
  termLabel,
  type CheckoutItemInfo,
  type CheckoutOrderInfo,
} from "./CheckoutView";
import { LicenseKeyReveal } from "./LicenseKeyReveal";
import {
  successLead,
  successStatus,
  type SuccessPhase,
} from "@/storefront/lib/checkout-success-state";

const CARD = `rounded-2xl border border-border bg-white p-5 ${ELEVATION_NONE} sm:p-6`;

const SUCCESS_TRUST_ICONS = [
  IconBadgeCheck,
  IconTruck,
  IconShieldCheck,
  IconHeadset,
] as const;

const BTN_PRIMARY = `inline-flex h-11 items-center justify-center rounded-xl bg-navy px-5 ${CTA_LABEL_CLASS} text-white ${CTA_PRIMARY_EFFECT}`;

const BTN_SECONDARY = `inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} ${HOVER_OUTLINE_FILL}`;

const SUCCESS_TRUST = [
  { id: "t1", label: "Bản quyền chính hãng", sub: "Nguồn cung rõ ràng" },
  { id: "t2", label: "Giao license rõ ràng", sub: "Xem ghi chú giao hàng trên từng sản phẩm." },
  { id: "t3", label: "Thanh toán rõ ràng", sub: "VietQR / chuyển khoản" },
  { id: "t4", label: "Hỗ trợ tiếng Việt", sub: "Trong giờ làm việc" },
] as const;

const STATUS_TONE = {
  ready: "border-emerald-100 bg-emerald-50 text-emerald-900",
  wait: "border-sky-100 bg-sky-50 text-sky-900",
  hold: "border-amber-100 bg-amber-50 text-amber-900",
  fail: "border-amber-100 bg-amber-50 text-amber-900",
} as const;

export type CheckoutSuccessFulfillment = {
  phase: SuccessPhase;
  modelLabel: string;
  qtyLabel: string;
  guideTitle: string;
  guideSteps: string[];
  guideHref: string;
  licenseHref: string;
};

export type CheckoutSuccessViewProps = {
  cms: CmsCheckout;
  order: CheckoutOrderInfo;
  item: CheckoutItemInfo | null;
  paid: boolean;
  paidAtLabel: string;
  methodTitle: string;
  isLoggedIn: boolean;
  orderDetailHref: string;
  licensePlain: string | null;
  licenseAccess?: "ok" | "login" | "pending";
  fulfillment: CheckoutSuccessFulfillment;
  recommended: ShopProduct[];
};

export function CheckoutSuccessView({
  cms,
  order,
  item,
  paid,
  paidAtLabel,
  methodTitle,
  isLoggedIn,
  orderDetailHref,
  licensePlain,
  licenseAccess = "pending",
  fulfillment,
  recommended,
}: CheckoutSuccessViewProps) {
  const money = checkoutMoney(item, order.totalVnd);
  const lead = successLead(order.code, fulfillment.phase, paid);
  const status = successStatus(fulfillment.phase, paid);
  const licenseReady = paid && fulfillment.phase === "ready";
  const licenseTitle = item ? licenseTitleParts(item) : null;
  const discountPct =
    money.listTotal && money.discount > 0
      ? Math.round((money.discount / money.listTotal) * 100)
      : 0;

  useEffect(() => {
    if (!paid || !item) return;
    trackPurchase({
      transactionId: order.code || order.id,
      value: order.totalVnd,
      items: [
        {
          item_id: `${order.code}:${item.variantName}`,
          item_name: item.productName,
          item_brand: item.brandName,
          item_variant: item.variantName,
          price: item.unitPriceVnd,
          quantity: item.quantity,
        },
      ],
    });
  }, [paid, order.code, order.id, order.totalVnd, item]);

  return (
    <div className="bg-surface/40 pb-10">
      <div className="home-container home-section">
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
                  <h1 className={SECTION_TITLE_CLASS}>
                    {paid ? "Thanh toán thành công!" : "Đơn hàng chưa thanh toán"}
                  </h1>
                  <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>{lead}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <MetaCell label="Mã đơn hàng" value={`#${order.code}`} />
                <MetaCell label="Thời gian" value={paidAtLabel} />
                <MetaCell label="Thanh toán" value={methodTitle} />
              </div>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                {licenseReady ? (
                  <a href={fulfillment.licenseHref} className={BTN_PRIMARY}>
                    Xem license & kích hoạt →
                  </a>
                ) : (
                  <Link href={orderDetailHref} className={BTN_PRIMARY}>
                    Theo dõi đơn hàng →
                  </Link>
                )}
                {licenseReady ? (
                  <Link href={orderDetailHref} className={BTN_SECONDARY}>
                    Xem chi tiết đơn hàng
                  </Link>
                ) : (
                  <Link href="/products" className={BTN_SECONDARY}>
                    Tiếp tục mua sắm
                  </Link>
                )}
              </div>
              {licenseReady ? (
                <p className="mt-3 text-center sm:text-left">
                  <Link href="/products" className={LINK_ACCENT_CLASS}>
                    Tiếp tục mua sắm →
                  </Link>
                </p>
              ) : null}
            </section>

            {/* License */}
            <section id="license-cua-ban" className={CARD}>
              <h2 className={SUBSECTION_TITLE_CLASS}>License của bạn</h2>
              {item && licenseTitle ? (
                <div className="mt-4 flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill
                        className="object-contain p-1"
                        sizes="64px"
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
                    <p className={CARD_TITLE_CLASS}>{licenseTitle.title}</p>
                    {licenseTitle.sub ? (
                      <p className={`mt-0.5 ${CARD_META_CLASS}`}>{licenseTitle.sub}</p>
                    ) : null}
                    <p className={`mt-1 ${CARD_META_CLASS}`}>
                      {[fulfillment.modelLabel, fulfillment.qtyLabel]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </div>
              ) : null}

              <div className={`mt-5 rounded-xl border px-3.5 py-3 ${STATUS_TONE[status.tone]}`}>
                <p className={CARD_TITLE_CLASS}>
                  {status.tone === "ready" ? "✓ " : ""}
                  {status.badge}
                </p>
                <p className="mt-1 text-sm leading-relaxed">{status.detail}</p>
                {!licenseReady ? (
                  <Link href={orderDetailHref} className={`mt-3 inline-flex ${LINK_ACCENT_CLASS}`}>
                    Theo dõi đơn hàng →
                  </Link>
                ) : licenseAccess !== "ok" ? (
                  <a href={fulfillment.licenseHref} className={`mt-3 inline-flex ${LINK_ACCENT_CLASS}`}>
                    Xem license →
                  </a>
                ) : null}
              </div>

              <div className="mt-5">
                {licensePlain && licenseAccess === "ok" ? (
                  <LicenseKeyReveal
                    value={licensePlain}
                    label={cms.licenseKeyLabel}
                    showLabel={cms.licenseShowLabel}
                    hideLabel={cms.licenseHideLabel}
                    copyLabel={cms.licenseCopyLabel}
                  />
                ) : licenseAccess === "login" && licenseReady ? (
                  <p className={`rounded-xl border border-border bg-surface px-3.5 py-3 ${BODY_MUTED_CLASS}`}>
                    Đăng nhập bằng email trên đơn để xem license.{" "}
                    <a href={fulfillment.licenseHref} className={LINK_ACCENT_CLASS}>
                      Đăng nhập
                    </a>
                  </p>
                ) : null}
              </div>

              {fulfillment.guideSteps.length > 0 ? (
                <div className="mt-5 border-t border-border pt-4">
                  <h3 className={CARD_TITLE_CLASS}>{fulfillment.guideTitle}</h3>
                  <ol className={`mt-3 space-y-2 ${SECTION_LEAD_CLASS}`}>
                    {fulfillment.guideSteps.map((step, i) => (
                      <li key={`${i}-${step.slice(0, 24)}`} className="flex gap-2.5">
                        <span
                          className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft ${FONT_DISPLAY} ${BADGE_CLASS} text-accent`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-4 flex justify-end">
                    <Link href={fulfillment.guideHref} className={LINK_ACCENT_CLASS}>
                      Xem hướng dẫn chi tiết →
                    </Link>
                  </div>
                </div>
              ) : null}
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
                  <dt>VAT</dt>
                  <dd className={CARD_META_CLASS}>Đã bao gồm</dd>
                </div>
                <div className="flex items-end justify-between gap-3 border-t border-border pt-3">
                  <dt className={CARD_TITLE_CLASS}>Tổng thanh toán</dt>
                  <dd className={SUMMARY_TOTAL_CLASS}>{formatCheckoutVnd(money.pay)}</dd>
                </div>
              </dl>

              {paid ? (
                <p
                  className={`mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 ${BADGE_CLASS} font-semibold text-emerald-800`}
                >
                  <span aria-hidden>✓</span>
                  Đã thanh toán
                </p>
              ) : null}
            </section>

            <section className={CARD}>
              <h2 className={SUBSECTION_TITLE_CLASS}>{cms.successSupportTitle}</h2>
              <ul className="mt-3 grid grid-cols-2 gap-2.5">
                {[
                  { id: "h1", title: "Hướng dẫn kích hoạt", href: fulfillment.guideHref, primary: true },
                  { id: "h2", title: "Liên hệ hỗ trợ", href: "/contact", primary: true },
                  { id: "h3", title: "Gửi yêu cầu", href: "/account/tickets", primary: false },
                  { id: "h4", title: "Trung tâm trợ giúp", href: "/faq", primary: false },
                ].map((l) => (
                  <li key={l.id}>
                    <Link
                      href={l.href}
                      className={`flex h-full min-h-[4.5rem] flex-col items-center justify-center rounded-xl border px-2 py-3 text-center ${TRANSITION_UI} ${
                        l.primary
                          ? `border-accent/40 bg-accent-soft/50 ${HOVER_OUTLINE_FILL}`
                          : `border-border bg-surface/60 ${HOVER_OUTLINE_FILL}`
                      }`}
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
                  Quản lý license →
                </Link>
              </section>
            )}
          </aside>
        </div>

        {/* Recommended */}
        {recommended.length > 0 ? (
          <section className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className={SUBSECTION_TITLE_CLASS}>Có thể bạn cũng quan tâm</h2>
              <Link href="/products" className={LINK_ACCENT_CLASS}>
                {cms.recommendedViewAllLabel} →
              </Link>
            </div>
            <div className="-mx-4 mt-4 px-4 lg:hidden">
              <div className="home-snap-x gap-2.5 pb-1">
                {recommended.map((item, i) => (
                  <div
                    key={item.id}
                    className="w-[calc(50vw-1.35rem)] max-w-[200px] md:w-[calc(38vw-1rem)] md:max-w-[210px]"
                  >
                    <ProductCard
                      item={{ ...item, ctaLabel: "Xem sản phẩm" }}
                      compact
                      priority={i < 2}
                    />
                  </div>
                ))}
              </div>
            </div>
            <ul className="mt-4 hidden list-none lg:grid lg:grid-cols-5 lg:gap-3.5">
              {recommended.map((item) => (
                <li key={item.id}>
                  <ProductCard item={{ ...item, ctaLabel: "Xem sản phẩm" }} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <div className="mt-6 border-t border-border bg-white">
        <ul className="home-container grid grid-cols-2 gap-5 py-6 md:grid-cols-4 md:gap-6">
          {SUCCESS_TRUST.map((t, i) => {
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

function licenseTitleParts(item: CheckoutItemInfo): { title: string; sub: string } {
  const product = item.productName.trim();
  const variant = item.variantName.trim();
  const term = termLabel(item);
  if (variant.toLowerCase().startsWith(product.toLowerCase())) {
    const rest = variant.slice(product.length).replace(/^[\s–—-]+/u, "").trim();
    return {
      title: product,
      sub: [rest, term].filter(Boolean).join(" · "),
    };
  }
  return {
    title: planHeading(item),
    sub: [term].filter(Boolean).join(" · "),
  };
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface/80 px-3.5 py-3 text-center sm:text-left">
      <p className={FIELD_CAPTION_CLASS}>{label}</p>
      <p className={`mt-1 break-all ${CARD_TITLE_CLASS}`}>{value}</p>
    </div>
  );
}

