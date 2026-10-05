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
  FIELD_VALUE_CLASS,
  FONT_DISPLAY,
  INLINE_PRICE_CLASS,
  LINK_ACCENT_CLASS,
  LINK_FIELD_CLASS,
  MONO_VALUE_CLASS,
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
  planHeading,
  termQtyLine,
  type CheckoutItemInfo,
  type CheckoutOrderInfo,
} from "./CheckoutView";

const CARD =
  `rounded-2xl border border-border bg-white p-5 ${ELEVATION_NONE} sm:p-6`;

const CONFIRM_STEPS = [
  {
    id: "s1",
    title: "Quét mã QR",
    description: "Mở ứng dụng ngân hàng và quét mã VietQR bên cạnh.",
  },
  {
    id: "s2",
    title: "Kiểm tra & thanh toán",
    description: "Kiểm tra số tiền {{amount}} và hoàn tất giao dịch.",
  },
  {
    id: "s3",
    title: "Chờ xác nhận",
    description:
      "KEYON tự động kiểm tra thanh toán và gửi thông tin kích hoạt sau khi nhận được giao dịch.",
  },
] as const;

const CONFIRM_TRUST = [
  {
    id: "ct1",
    label: "Bảo mật thông tin",
    sub: "Thông tin đơn hàng được bảo vệ.",
  },
  {
    id: "ct2",
    label: "Thanh toán an toàn",
    sub: "Thanh toán qua VietQR.",
  },
  {
    id: "ct3",
    label: "Hỗ trợ tiếng Việt",
    sub: "Hỗ trợ trong giờ làm việc.",
  },
] as const;

function payField(value: string | null | undefined, placeholders: string[] = []) {
  const text = (value ?? "").trim();
  if (!text || placeholders.includes(text)) return null;
  return text;
}

const NEXT_STEP_ICONS = [IconQr, IconCard, IconKey] as const;
const CONFIRM_TRUST_ICONS = [IconShieldCheck, IconLock, IconHeadset] as const;

export type CheckoutConfirmViewProps = {
  cms: CmsCheckout;
  order: CheckoutOrderInfo;
  item: CheckoutItemInfo | null;
  /** HMAC poll token for /api/checkout/.../payment-status */
  pollToken: string;
  payment: {
    paymentReference: string;
    expiresAt: string | null;
    qrImageUrl?: string;
    canConfirm: boolean;
    notice?: string | null;
    bankName?: string | null;
    accountName?: string | null;
    accountNumber?: string | null;
  };
  methodTitle: string;
};

export function CheckoutConfirmView({
  cms,
  order,
  item,
  pollToken,
  payment,
  methodTitle,
}: CheckoutConfirmViewProps) {
  const router = useRouter();
  const [reloading, setReloading] = useState(false);
  const [polling, setPolling] = useState(true);
  const money = checkoutMoney(item, order.totalVnd);
  const payLabel = formatCheckoutVnd(money.pay);
  const payCardTitle = /viet\s*qr/i.test(methodTitle)
    ? "Thanh toán VietQR"
    : methodTitle;
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
          `/api/checkout/${order.id}/payment-status?token=${encodeURIComponent(pollToken)}`,
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
  }, [order.id, pollToken, router]);

  async function reloadQr() {
    setReloading(true);
    router.refresh();
    window.setTimeout(() => setReloading(false), 600);
  }

  return (
    <div className="bg-surface/40 pb-10">
      <div className="home-container home-section">
        <CheckoutStepper current={3} />

        <header className="mx-auto mt-8 max-w-3xl text-center">
          <p
            className={`inline-flex items-center rounded-full bg-accent-soft px-3 py-1 ${BADGE_CLASS} text-accent`}
          >
            Đang chờ thanh toán
          </p>
          <h1 className={`mt-3 ${SECTION_TITLE_CLASS}`}>
            Hoàn tất thanh toán để nhận thông tin kích hoạt
          </h1>
          <p className={`mx-auto mt-2 max-w-2xl ${SECTION_LEAD_CLASS}`}>
            Quét mã VietQR bên dưới để thanh toán {payLabel}. Hệ thống sẽ tự động xác
            nhận giao dịch và gửi thông tin kích hoạt sau khi nhận được thanh toán.
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
          <section className={`${CARD} flex h-full flex-col`}>
            <h2 className={SUBSECTION_TITLE_CLASS}>{cms.orderInfoTitle}</h2>
            {item ? (
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
                  <p className={CARD_TITLE_CLASS}>{planHeading(item)}</p>
                  <p className={`mt-0.5 ${CARD_META_CLASS}`}>{termQtyLine(item)}</p>
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
                <dt>VAT</dt>
                <dd className={CARD_META_CLASS}>Đã bao gồm</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Phí thanh toán</dt>
                <dd className={INLINE_PRICE_CLASS}>{cms.feeValue}</dd>
              </div>
              <div className="flex items-end justify-between gap-3 border-t border-border pt-3">
                <dt className={CARD_TITLE_CLASS}>Tổng thanh toán</dt>
                <dd className={SUMMARY_TOTAL_CLASS}>{payLabel}</dd>
              </div>
            </dl>

            <div className="mt-5 border-t border-border pt-4">
              <p className={FIELD_CAPTION_CLASS}>Nhận thông tin</p>
              <dl className="mt-3 space-y-3">
                <div>
                  <dt className={FIELD_CAPTION_CLASS}>Mã đơn</dt>
                  <dd className={`mt-0.5 ${MONO_VALUE_CLASS}`}>{order.code}</dd>
                </div>
                <div>
                  <dt className={FIELD_CAPTION_CLASS}>Email nhận</dt>
                  <dd className={`mt-0.5 break-all ${FIELD_VALUE_CLASS}`}>{order.email}</dd>
                </div>
                <div>
                  <dt className={FIELD_CAPTION_CLASS}>Nội dung gửi</dt>
                  <dd className={`mt-0.5 ${FIELD_VALUE_CLASS}`}>
                    {item ? receiveLine(item) : "Thông tin kích hoạt"}
                  </dd>
                </div>
                <div>
                  <dt className={FIELD_CAPTION_CLASS}>Thời điểm</dt>
                  <dd className={`mt-0.5 ${FIELD_VALUE_CLASS}`}>
                    {item?.fulfillmentInstant
                      ? "Ngay sau khi thanh toán được xác nhận"
                      : "Sau khi KEYON xác nhận thanh toán"}
                  </dd>
                </div>
              </dl>
              <p className={`mt-3 ${CARD_META_CLASS}`}>
                Thông tin được gửi tới email này và lưu trong đơn hàng của bạn.
              </p>
            </div>
          </section>

          {/* QR — focal point */}
          <section className={`${CARD} h-full`}>
            <h2 className={SUBSECTION_TITLE_CLASS}>Thanh toán bằng VietQR</h2>
            <p className={`mt-1.5 ${CARD_META_CLASS}`}>
              Quét mã QR bằng ứng dụng ngân hàng để thanh toán.
            </p>

            <div className="mx-auto mt-5 flex h-[220px] w-[220px] items-center justify-center rounded-xl border border-border bg-white p-2">
              {payment.qrImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={payment.qrImageUrl}
                  alt="Mã VietQR thanh toán"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className={`p-3 text-center ${CARD_META_CLASS}`}>
                  QR chưa sẵn sàng
                </div>
              )}
            </div>

            <dl className="mt-5 space-y-4">
              {payField(payment.bankName, ["Ngân hàng"]) ? (
                <div className="flex items-start justify-between gap-3">
                  <dt className={`shrink-0 ${FIELD_CAPTION_CLASS}`}>Ngân hàng</dt>
                  <dd className={`min-w-0 text-right break-words ${FIELD_VALUE_CLASS}`}>
                    {payField(payment.bankName, ["Ngân hàng"])}
                  </dd>
                </div>
              ) : null}
              {payField(payment.accountName) ? (
                <div className="flex items-start justify-between gap-3">
                  <dt className={`shrink-0 ${FIELD_CAPTION_CLASS}`}>Người nhận</dt>
                  <dd className={`min-w-0 text-right break-words ${FIELD_VALUE_CLASS}`}>
                    {payField(payment.accountName)}
                  </dd>
                </div>
              ) : null}
              {payField(payment.accountNumber, ["—"]) ? (
                <div>
                  <dt className={FIELD_CAPTION_CLASS}>Số tài khoản</dt>
                  <dd className="mt-1 flex items-center gap-2 rounded-lg bg-surface px-3 py-2">
                    <code className={`min-w-0 flex-1 break-all ${MONO_VALUE_CLASS}`}>
                      {payField(payment.accountNumber, ["—"])}
                    </code>
                    <CopyButton
                      value={payField(payment.accountNumber, ["—"]) ?? ""}
                      label="Sao chép"
                      copiedLabel="✓ Đã sao chép"
                    />
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className={FIELD_CAPTION_CLASS}>Số tiền</dt>
                <dd className={`mt-0.5 ${SUMMARY_TOTAL_CLASS}`}>{payLabel}</dd>
              </div>
              <div>
                <dt className={FIELD_CAPTION_CLASS}>Nội dung chuyển khoản</dt>
                <dd className="mt-1 flex items-center gap-2 rounded-lg bg-surface px-3 py-2">
                  <code className={`min-w-0 flex-1 ${MONO_VALUE_CLASS}`}>
                    {payment.paymentReference}
                  </code>
                  <CopyButton
                    value={payment.paymentReference}
                    label="Sao chép"
                    copiedLabel="✓ Đã sao chép"
                  />
                </dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={reloadQr}
              disabled={reloading}
              className={`mt-3 inline-flex items-center gap-1.5 ${LINK_FIELD_CLASS} disabled:opacity-50`}
            >
              <RefreshMini />
              {reloading ? "Đang tải…" : "Làm mới mã QR"}
            </button>

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
              <div className={`mt-5 border-t border-border pt-4`}>
                <p className={CARD_TITLE_CLASS}>Đang chờ xác nhận thanh toán...</p>
                <p className={`mt-1 ${CARD_META_CLASS}`}>
                  {polling
                    ? "Trang sẽ tự động cập nhật khi thanh toán được xác nhận."
                    : "Sau khi chuyển khoản đúng, hệ thống sẽ cập nhật trạng thái tự động."}
                </p>
              </div>
            )}
          </section>

          {/* Steps */}
          <section className={`${CARD} flex h-full flex-col`}>
            <h2 className={SUBSECTION_TITLE_CLASS}>Thanh toán theo 3 bước</h2>
            <ol className="mt-5 grid flex-1 gap-0 sm:grid-cols-3 sm:divide-x sm:divide-border">
              {CONFIRM_STEPS.map((s, i) => {
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
                        {String(i + 1).padStart(2, "0")}
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
              Sau khi nhận được thanh toán, KEYON sẽ tự động xử lý đơn hàng và gửi thông
              tin kích hoạt theo sản phẩm.
            </p>
          </section>

          {/* Hold window */}
          <section className={CARD}>
            <h2 className={SUBSECTION_TITLE_CLASS}>{payCardTitle}</h2>
            <dl className="mt-4 space-y-3">
              <div className="flex items-end justify-between gap-3">
                <dt className={SECTION_LEAD_CLASS}>Số tiền thanh toán</dt>
                <dd className={SUMMARY_TOTAL_CLASS}>{payLabel}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className={SECTION_LEAD_CLASS}>Phí thanh toán</dt>
                <dd className={INLINE_PRICE_CLASS}>{cms.feeValue}</dd>
              </div>
              {payment.expiresAt ? (
                <div className="flex justify-between gap-3">
                  <dt className={SECTION_LEAD_CLASS}>Thời gian giữ đơn</dt>
                  <dd>
                    <ExpiryCountdown expiresAt={payment.expiresAt} variant="compact" />
                  </dd>
                </div>
              ) : null}
            </dl>
            <p
              className={`mt-4 rounded-xl border border-sky-100 bg-sky-50/90 px-3.5 py-2.5 ${SECTION_LEAD_CLASS} !text-sky-900`}
            >
              Đơn hàng được giữ trong thời gian này. Sau khi hết thời gian, bạn có thể tạo
              lại yêu cầu thanh toán.
            </p>
          </section>
        </div>

        <ul className="mt-8 grid gap-5 border-t border-border pt-6 sm:grid-cols-3">
          {CONFIRM_TRUST.map((t, i) => {
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

function receiveLine(item: CheckoutItemInfo): string {
  switch (item.receiveLabel) {
    case "Tài khoản":
      return "Thông tin tài khoản";
    case "Hồ sơ bàn giao":
      return "Hồ sơ bàn giao";
    case "Kích hoạt":
      return "Thông tin kích hoạt";
    case "Key":
      return "Mã kích hoạt";
    default:
      return "Thông tin kích hoạt";
  }
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
