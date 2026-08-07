"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CmsCheckout } from "@/server/cms/types";
import {
  IconBadgeCheck,
  IconHeadset,
  IconShieldCheck,
  IconTruck,
} from "@/storefront/components/icons/StoreIcons";
import {
  BADGE_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  FIELD_CAPTION_CLASS,
  INLINE_PRICE_CLASS,
  INPUT_TEXT_CLASS,
  LINK_ACCENT_CLASS,
  MONO_VALUE_CLASS,
  PDP_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SUBSECTION_TITLE_CLASS,
  SUMMARY_TOTAL_CLASS,
} from "@/storefront/typography";
import {
  CTA_PRIMARY_EFFECT,
  ELEVATION_NONE,
  OPACITY_DISABLED,
  TRANSITION_UI,
} from "@/storefront/effects";
import { isPlaceholderHotline } from "@/storefront/components/support/shared";

export type CheckoutOrderInfo = {
  id: string;
  code: string;
  email: string;
  totalVnd: number;
  productHref: string;
};

export type CheckoutItemInfo = {
  title: string;
  productName: string;
  brandName: string;
  variantName: string;
  quantity: number;
  unitPriceVnd: number;
  compareAtUnitVnd: number | null;
  imageUrl: string | null;
  receiveLabel: string;
  deliveryLabel: string;
  fulfillmentInstant: boolean;
};

export type CheckoutViewProps = {
  cms: CmsCheckout;
  order: CheckoutOrderInfo;
  item: CheckoutItemInfo | null;
  supportEmail: string;
};

const STEPS = [
  { id: 1, label: "Xác nhận đơn hàng" },
  { id: 2, label: "Thanh toán" },
  { id: 3, label: "Xác nhận" },
  { id: 4, label: "Hoàn tất" },
] as const;

const CARD = `rounded-2xl border border-border bg-white p-4 ${ELEVATION_NONE} sm:p-5`;

const CTA_PRIMARY = `inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy px-5 ${CTA_LABEL_CLASS} text-white ${CTA_PRIMARY_EFFECT} disabled:cursor-not-allowed ${OPACITY_DISABLED} disabled:hover:bg-navy disabled:hover:shadow-none`;

const TRUST_ICONS = [
  IconBadgeCheck,
  IconTruck,
  IconShieldCheck,
  IconHeadset,
] as const;

export function formatCheckoutVnd(n: number) {
  return `${n.toLocaleString("vi-VN")}đ`;
}

export function checkoutMoney(
  item: CheckoutItemInfo | null,
  totalVnd: number,
) {
  if (!item) {
    return { listTotal: null as number | null, discount: 0, pay: totalVnd };
  }
  const listUnit =
    item.compareAtUnitVnd && item.compareAtUnitVnd > item.unitPriceVnd
      ? item.compareAtUnitVnd
      : null;
  const listTotal = listUnit ? listUnit * item.quantity : null;
  const pay = totalVnd;
  const discount = listTotal && listTotal > pay ? listTotal - pay : 0;
  return { listTotal, discount, pay };
}

export function CheckoutStepper({ current }: { current: number }) {
  return (
    <ol className="mx-auto flex max-w-2xl items-center justify-between gap-1 sm:gap-2">
      {STEPS.map((s, i) => {
        const done = s.id < current;
        const active = s.id === current;
        return (
          <li key={s.id} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full items-center">
              {i > 0 ? (
                <span
                  className={`h-0.5 flex-1 ${done || active ? "bg-accent" : "bg-border"}`}
                />
              ) : (
                <span className="flex-1" />
              )}
              <span
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${BADGE_CLASS} ${
                  done || active
                    ? "bg-accent text-white"
                    : "bg-border text-muted"
                }`}
              >
                {done ? "✓" : s.id}
              </span>
              {i < STEPS.length - 1 ? (
                <span
                  className={`h-0.5 flex-1 ${done ? "bg-accent" : "bg-border"}`}
                />
              ) : (
                <span className="flex-1" />
              )}
            </div>
            <span
              className={`text-center leading-tight ${BADGE_CLASS} ${
                active || done ? "text-navy" : "text-muted"
              }`}
            >
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function CheckoutSummaryAside({
  cms,
  item,
  totalVnd,
  supportEmail,
}: {
  cms: CmsCheckout;
  item: CheckoutItemInfo | null;
  totalVnd: number;
  supportEmail: string;
}) {
  const money = checkoutMoney(item, totalVnd);
  return (
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
              <p className={CARD_META_CLASS}>
                {item.variantName} · x{item.quantity}
              </p>
              <p className={`mt-0.5 ${CARD_META_CLASS}`}>
                {item.deliveryLabel}
                {item.fulfillmentInstant ? " · 1–5 phút" : ""}
              </p>
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
              <dt>Giảm giá</dt>
              <dd className={INLINE_PRICE_CLASS}>
                −{formatCheckoutVnd(money.discount)}
              </dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-3">
            <dt>{cms.vatLabel}</dt>
            <dd className={`${INLINE_PRICE_CLASS} !text-navy`}>0đ</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt>{cms.feeLabel}</dt>
            <dd className={INLINE_PRICE_CLASS}>{cms.feeValue}</dd>
          </div>
          <div className="flex items-end justify-between gap-3 border-t border-border pt-3">
            <dt className={CARD_TITLE_CLASS}>Tổng thanh toán</dt>
            <dd className={SUMMARY_TOTAL_CLASS}>{formatCheckoutVnd(money.pay)}</dd>
          </div>
        </dl>
        {money.discount > 0 ? (
          <p
            className={`mt-3 rounded-lg bg-accent-soft/60 px-3 py-2 text-center ${BADGE_CLASS} text-accent`}
          >
            Bạn tiết kiệm được {formatCheckoutVnd(money.discount)}
          </p>
        ) : null}
      </section>

      <section className={CARD}>
        <h2 className={SUBSECTION_TITLE_CLASS}>{cms.whyTitle}</h2>
        <ul className="mt-3 grid grid-cols-2 gap-3">
          {cms.whyItems.map((w) => (
            <li key={w.id} className="rounded-xl bg-surface/80 px-3 py-2.5">
              <p className={CARD_TITLE_CLASS}>{w.title}</p>
              <p className={`mt-0.5 ${CARD_META_CLASS}`}>{w.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={CARD}>
        <h2 className={SUBSECTION_TITLE_CLASS}>{cms.supportTitle}</h2>
        <div className={`mt-3 flex flex-col gap-2 ${SECTION_LEAD_CLASS}`}>
          <Link href={cms.supportLiveChatHref} className={LINK_ACCENT_CLASS}>
            {cms.supportLiveChatLabel}
          </Link>
          <a href={`mailto:${supportEmail}`} className={LINK_ACCENT_CLASS}>
            {cms.supportEmailLabel}: {supportEmail}
          </a>
          {cms.supportPhone.trim() && !isPlaceholderHotline(cms.supportPhone) ? (
            <a
              href={`tel:${cms.supportPhone.replace(/\s/g, "")}`}
              className={CTA_PRIMARY}
            >
              {cms.supportPhone}
            </a>
          ) : null}
        </div>
      </section>
    </aside>
  );
}

export function CheckoutTrustBar({ cms }: { cms: CmsCheckout }) {
  return (
    <div className="mt-4 border-t border-border bg-white">
      <ul className="home-container grid grid-cols-2 gap-5 py-6 md:grid-cols-4 md:gap-6">
        {cms.trustBar.map((t, i) => {
          const Icon = TRUST_ICONS[i] ?? IconShieldCheck;
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
  );
}

/** Step 2 — chọn phương thức (không hiện QR). */
export function CheckoutView({
  cms,
  order,
  item,
  supportEmail,
}: CheckoutViewProps) {
  const router = useRouter();
  const enabledMethods = useMemo(
    () => cms.paymentMethods.filter((m) => m.enabled),
    [cms.paymentMethods],
  );

  const defaultMethod =
    enabledMethods.find((m) => m.provider === "sepay_qr")?.id ??
    enabledMethods[0]?.id ??
    "";
  const [methodId, setMethodId] = useState(defaultMethod);

  const method = enabledMethods.find((m) => m.id === methodId) ?? enabledMethods[0];
  const canContinue = Boolean(method && method.provider === "sepay_qr");

  function continuePay() {
    if (!method || !canContinue) return;
    router.push(
      `/checkout/${order.id}/confirm?method=${encodeURIComponent(method.id)}`,
    );
  }

  return (
    <div className="bg-surface/40 pb-10">
      <div className="home-container py-6 md:py-8">
        <CheckoutStepper current={2} />
        <p className={`mt-3 text-center ${FIELD_CAPTION_CLASS} text-accent`}>
          {cms.securityLine}
        </p>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-8">
          <div className="space-y-5">
            {item ? (
              <section className={CARD}>
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface sm:h-24 sm:w-24">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="96px"
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
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h1 className={PDP_TITLE_CLASS}>
                          {item.productName}
                          {item.variantName ? ` – ${item.variantName}` : ""}
                        </h1>
                        <p className={`mt-1 ${CARD_META_CLASS}`}>
                          Hình thức: {item.variantName} · Loại nhận:{" "}
                          {item.receiveLabel}
                        </p>
                      </div>
                      <span
                        className={`inline-flex rounded-full bg-emerald-50 px-2.5 py-1 ${BADGE_CLASS} font-semibold text-emerald-700`}
                      >
                        {cms.warrantyBadge}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-end gap-3">
                      <p className={INLINE_PRICE_CLASS}>
                        {formatCheckoutVnd(item.unitPriceVnd)}
                      </p>
                      <p className={CARD_META_CLASS}>Số lượng: {item.quantity}</p>
                      <p className={`ml-auto ${CARD_META_CLASS}`}>
                        Đơn{" "}
                        <span className={MONO_VALUE_CLASS}>{order.code}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            ) : null}

            <section className={CARD}>
              <div className="flex flex-wrap items-end justify-between gap-2">
                <h2 className={SUBSECTION_TITLE_CLASS}>Thông tin nhận license</h2>
                <span className={CARD_META_CLASS}>{cms.emailHelp}</span>
              </div>
              <input
                type="email"
                readOnly
                value={order.email}
                className={`mt-3 w-full rounded-xl border border-border bg-surface/60 px-3.5 py-2.5 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`}
                aria-label="Email nhận license"
              />
            </section>

            <section className={CARD}>
              <h2 className={SUBSECTION_TITLE_CLASS}>Chọn phương thức thanh toán</h2>
              {enabledMethods.length === 0 ? (
                <p className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
                  Chưa có phương thức thanh toán nào được bật. Vào Admin → CMS → Checkout và
                  tick Enabled.
                </p>
              ) : (
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {enabledMethods.map((m) => {
                    const active = m.id === method?.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMethodId(m.id)}
                        className={`relative rounded-xl border-2 p-3.5 text-left ${TRANSITION_UI} ${
                          active
                            ? "border-accent bg-accent-soft/40"
                            : "border-border hover:border-accent hover:bg-accent-soft/25"
                        }`}
                      >
                        {m.badge ? (
                          <span
                            className={`absolute right-2 top-2 rounded-md bg-accent px-1.5 py-0.5 ${BADGE_CLASS} text-white`}
                          >
                            {m.badge}
                          </span>
                        ) : null}
                        <p className={`pr-14 ${CARD_TITLE_CLASS}`}>{m.title}</p>
                        <p className={`mt-1 ${CARD_META_CLASS}`}>{m.subtitle}</p>
                        {active ? (
                          <span className="absolute bottom-2 right-2 text-accent" aria-hidden>
                            ✓
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}

              <p
                className={`mt-3 rounded-xl border border-sky-100 bg-sky-50/80 px-3 py-2 ${SECTION_LEAD_CLASS} !text-sky-900`}
              >
                KEYON không lưu thông tin thẻ. Thanh toán qua cổng đối tác / chuyển khoản được cấu
                hình.
              </p>

              {method && method.provider === "coming_soon" ? (
                <p className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
                  {cms.comingSoonNote}
                </p>
              ) : null}

              <button
                type="button"
                disabled={!canContinue}
                onClick={continuePay}
                className={`mt-5 ${CTA_PRIMARY}`}
              >
                {cms.continueCtaLabel}
              </button>
              <p className={`mt-2 text-center ${CARD_META_CLASS}`}>
                {cms.continueCtaHint}
              </p>
            </section>

            <p className="text-center text-sm">
              <Link href={order.productHref} className={LINK_ACCENT_CLASS}>
                ← Quay lại sản phẩm
              </Link>
            </p>
          </div>

          <CheckoutSummaryAside
            cms={cms}
            item={item}
            totalVnd={order.totalVnd}
            supportEmail={supportEmail}
          />
        </div>
      </div>

      <CheckoutTrustBar cms={cms} />
    </div>
  );
}
