"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { StarRating } from "@/storefront/components/StarRating";
import { ShopProductCard } from "@/storefront/components/shop/ShopProductCard";
import { formatVnd } from "@/storefront/components/shop/shop-utils";
import { FaqAccordion } from "@/storefront/components/FaqAccordion";
import { useLiveSoldCount } from "@/storefront/hooks/use-live-sold-count";
import {
  BADGE_CLASS,
  BODY_CLASS,
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_PRICE_CLASS,
  CARD_TITLE_CLASS,
  COMPARE_PRICE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  FIELD_CAPTION_CLASS,
  FIELD_VALUE_NUM_CLASS,
  FORM_ERROR_CLASS,
  INLINE_PRICE_CLASS,
  INPUT_TEXT_CLASS,
  LINK_ACCENT_CLASS,
  LINK_CLASS,
  OVERLINE_CLASS,
  PDP_PRICE_CLASS,
  PDP_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
  SUBSECTION_TITLE_CLASS,
  TAB_ACTIVE_CLASS,
  TAB_CLASS,
} from "@/storefront/typography";
import { QUOTE_HREF } from "@/storefront/lib/cta";
import type { PdpProductData, PdpTabId, PdpVariantOption } from "./types";
import { resolveLicensePresentation } from "@/storefront/lib/license-catalog";
import { StaticPageHtml } from "@/storefront/components/StaticPageHtml";
import { stripHtml } from "@/server/cms/blog-utils";
import {
  ELEVATION_CTA_HOVER,
  ELEVATION_FLOAT,
  ELEVATION_MODAL,
  ELEVATION_STICKY_UP,
  HOVER_LIFT_CARD,
  MOTION_NORMAL,
  TRANSITION_UI,
  Z_BANNER,
  Z_MODAL,
  Z_OVERLAY,
} from "@/storefront/effects";

const PDP_QUOTE_LABEL = "Tư vấn license" as const;
const LICENSE_WARNING_COPY =
  "Quy tắc cấp phép có thể phụ thuộc vào số core, mô hình triển khai và môi trường sử dụng. Vui lòng kiểm tra nhu cầu trước khi mua hoặc liên hệ KEYON để được tư vấn loại license phù hợp." as const;

type LicensePresentation = ReturnType<typeof resolveLicensePresentation>;

/** One-line hero / sticky summary from variant+product license fields. */
function licenseSummaryParts(license: LicensePresentation): string[] {
  const parts: string[] = [];
  if (license.seats) parts.push(license.seats);
  if (license.channelLabel) parts.push(license.channelLabel);
  if (license.termLabel) parts.push(license.termLabel);
  return parts;
}
const TABS: { id: PdpTabId; label: string }[] = [
  { id: "description", label: "Mô tả sản phẩm" },
  { id: "details", label: "Thông tin chi tiết" },
  { id: "guide", label: "Hướng dẫn sử dụng" },
  { id: "reviews", label: "Đánh giá" },
  { id: "faq", label: "Câu hỏi thường gặp" },
];

const DEFAULT_GALLERY_SIDE: {
  title: string;
  icon: "shield" | "bolt" | "headset" | "badge";
  kind: "brand" | "delivery" | "support" | "digital";
}[] = [
  { title: "License chính hãng", kind: "brand", icon: "shield" },
  { title: "Giao key nhanh", kind: "delivery", icon: "bolt" },
  { title: "Hỗ trợ kích hoạt", kind: "support", icon: "headset" },
  { title: "Giao hàng kỹ thuật số", kind: "digital", icon: "badge" },
];

function gallerySideChips(data: PdpProductData, variant: PdpVariantOption) {
  return DEFAULT_GALLERY_SIDE.map((item) => {
    if (item.kind === "brand") {
      return {
        title: item.title,
        sub: `Nguồn ${data.brandName}`,
        icon: item.icon,
      };
    }
    if (item.kind === "delivery") {
      return {
        title: variant.fulfillmentInstant ? "Giao key nhanh" : "KEYON xử lý",
        sub:
          variant.slaPromise?.trim() ||
          (variant.fulfillmentInstant
            ? "Tự động sau thanh toán"
            : variant.deliveryLabel),
        icon: item.icon,
      };
    }
    if (item.kind === "digital") {
      return {
        title: item.title,
        sub: variant.receiveLabel,
        icon: item.icon,
      };
    }
    return {
      title: item.title,
      sub: "Ticket trong Tài khoản",
      icon: item.icon,
    };
  });
}

function featureBarItems(
  features: string[],
  instant: boolean,
  brandName: string,
  receiveLabel: string,
): { title: string; desc: string }[] {
  if (features.length >= 4) {
    return features.slice(0, 4).map((f) => {
      const parts = f.split(/\s*[—–|]\s*/);
      const title = (parts[0] ?? f).trim();
      const desc = parts.slice(1).join(" — ").trim() || "Theo mô tả sản phẩm";
      return { title, desc };
    });
  }
  return [
    {
      title: "License chính hãng",
      desc: `Nguồn ${brandName}`,
    },
    {
      title: instant ? "Giao key nhanh" : "KEYON xử lý",
      desc: instant ? "Sau thanh toán thành công" : "Theo dõi trong đơn hàng",
    },
    {
      title: "Thanh toán an toàn",
      desc: "QR / chuyển khoản rõ",
    },
    {
      title: "Hỗ trợ kích hoạt",
      desc: receiveLabel || "Ticket trong Tài khoản",
    },
  ];
}
export function PdpView({ data }: { data: PdpProductData }) {
  const router = useRouter();
  const [variantId, setVariantId] = useState(data.initialVariantId);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<PdpTabId>("description");
  const [thumb, setThumb] = useState(0);
  const [email, setEmail] = useState(data.defaultEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const soldCount = useLiveSoldCount(data.slug);

  const variant = useMemo(
    () => data.variants.find((v) => v.id === variantId) ?? data.variants[0]!,
    [data.variants, variantId],
  );

  const license = useMemo(
    () =>
      resolveLicensePresentation({
        product: data.licenseDefaults,
        variant: {
          licenseChannel: variant.licenseChannel,
          licenseTerm: variant.licenseTerm,
          seatsLabel: variant.seatsLabel,
          regionCode: variant.regionCode,
          activationMethod: variant.activationMethod,
        },
      }),
    [data.licenseDefaults, variant],
  );

  const tabLabels = useMemo(
    () =>
      TABS.filter((t) => {
        if (t.id === "faq") return data.faqs.length > 0;
        if (t.id === "reviews")
          return Boolean(data.reviewCount && data.reviewCount > 0);
        return true;
      }).map((t) =>
        t.id === "reviews"
          ? {
              ...t,
              label: `Đánh giá (${data.reviewCount})`,
            }
          : t.id === "faq"
            ? { ...t, label: "Câu hỏi thường gặp" }
            : t,
      ),
    [data.reviewCount, data.faqs.length],
  );

  function selectVariant(id: string) {
    setVariantId(id);
    const url = `/products/${data.slug}?variant=${id}`;
    router.replace(url, { scroll: false });
  }

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: variant.id,
          email,
          quantity: qty,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Checkout failed");
      router.push(`/checkout/${body.orderId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  const compare = variant.compareAtPriceVnd;
  const disc = variant.discountPercent;

  return (
    <div className="bg-white pb-28">
      <div className="home-container py-6 md:py-8">
        <Breadcrumb data={data} variant={variant} />

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
          <Gallery
            data={data}
            variant={variant}
            thumb={thumb}
            onThumb={setThumb}
            discount={disc}
          />
          <PurchaseColumn
            data={data}
            variant={variant}
            license={license}
            qty={qty}
            onQty={setQty}
            onSelectVariant={selectVariant}
            email={email}
            onEmail={setEmail}
            loading={loading}
            error={error}
            onBuy={checkout}
            compare={compare}
            disc={disc}
            soldCount={soldCount}
          />
        </div>

        <FeatureBar
          features={data.features}
          instant={variant.fulfillmentInstant}
          brandName={data.brandName}
          receiveLabel={variant.receiveLabel}
        />

        <TabsSection
          data={data}
          variant={variant}
          license={license}
          tab={tab}
          tabs={tabLabels}
          onTab={setTab}
        />

        {data.related.length ? (
          <section className="mt-10 md:mt-12">
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className={SECTION_TITLE_CLASS}>Sản phẩm liên quan</h2>
              <Link
                href="/products"
                className={LINK_ACCENT_CLASS}
              >
                Xem tất cả →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-3.5">
              {data.related.slice(0, 4).map((item) => (
                <ShopProductCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <StickyBar
        data={data}
        variant={variant}
        license={license}
        qty={qty}
        loading={loading}
        canBuy={variant.canBuy}
        onBuy={checkout}
        compare={compare}
        disc={disc}
      />
    </div>
  );
}

function Breadcrumb({
  data,
  variant,
}: {
  data: PdpProductData;
  variant: PdpVariantOption;
}) {
  return (
    <nav className={`flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`} aria-label="Breadcrumb">
      <Link href="/" className="transition hover:text-accent" aria-label="Trang chủ">
        <HomeIcon />
      </Link>
      <Sep />
      <Link href="/products" className="transition hover:text-accent">
        Sản phẩm
      </Link>
      <Sep />
      <Link
        href={`/categories/${data.categoryId}`}
        className="transition hover:text-accent"
      >
        {data.categoryLabel}
      </Link>
      <Sep />
      <span className="text-muted">{data.brandName}</span>
      <Sep />
      <span className={BREADCRUMB_CURRENT_CLASS}>
        {data.name}
        {variant.name ? ` — ${variant.name}` : ""}
      </span>
    </nav>
  );
}

function Gallery({
  data,
  variant,
  thumb,
  onThumb,
  discount,
}: {
  data: PdpProductData;
  variant: PdpVariantOption;
  thumb: number;
  onThumb: (n: number) => void;
  discount?: number;
}) {
  const chips = gallerySideChips(data, variant);
  const gallery = data.galleryUrls?.length ? data.galleryUrls : null;
  const demoCount = 6;
  const thumbs = gallery ?? Array.from({ length: demoCount }, (_, i) => i);
  const visible = 4;
  const canSlide = thumbs.length > visible;
  const maxStart = Math.max(0, thumbs.length - visible);
  const [start, setStart] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [touchX, setTouchX] = useState<number | null>(null);

  const windowThumbs = thumbs.slice(start, start + visible);
  const activeIndex = Math.min(thumb, thumbs.length - 1);
  const activeUrl =
    typeof thumbs[activeIndex] === "string"
      ? (thumbs[activeIndex] as string)
      : null;
  const imageAlt = `${data.name}${variant.name ? ` — ${variant.name}` : ""}`;

  function goThumbs(dir: -1 | 1) {
    setStart((s) => Math.min(maxStart, Math.max(0, s + dir)));
  }

  function stepImage(dir: -1 | 1) {
    const next = Math.min(
      thumbs.length - 1,
      Math.max(0, activeIndex + dir),
    );
    onThumb(next);
  }

  useEffect(() => {
    if (activeIndex < start) setStart(activeIndex);
    else if (activeIndex >= start + visible) {
      setStart(Math.min(maxStart, activeIndex - visible + 1));
    }
  }, [activeIndex, start, maxStart]);

  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setLightbox(false);
        return;
      }
      if (e.key === "ArrowLeft") {
        onThumb(Math.max(0, activeIndex - 1));
      } else if (e.key === "ArrowRight") {
        onThumb(Math.min(thumbs.length - 1, activeIndex + 1));
      }
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox, activeIndex, thumbs.length, onThumb]);

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={() => setLightbox(true)}
        onTouchStart={(e) => setTouchX(e.changedTouches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          if (touchX == null) return;
          const dx = (e.changedTouches[0]?.clientX ?? touchX) - touchX;
          if (Math.abs(dx) > 48) stepImage(dx < 0 ? 1 : -1);
          setTouchX(null);
        }}
        className={`relative aspect-square w-full overflow-hidden rounded-2xl border border-border/80 text-left ${ELEVATION_FLOAT} ${TRANSITION_UI} hover:shadow-[0_16px_44px_rgba(15,23,42,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
        aria-label={`Xem ảnh lớn: ${imageAlt}`}
      >
        {gallery && activeUrl ? (
          <Image
            src={activeUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized
            priority
          />
        ) : (
          <ProductHeroArt data={data} tone={activeIndex % 4} fill />
        )}

        {discount ? (
          <span
            className={`absolute left-4 top-4 z-[3] inline-flex rounded-lg bg-accent px-2.5 py-1 ${BADGE_CLASS} text-white shadow-sm`}
          >
            -{discount}%
          </span>
        ) : null}

        <ul
          className="pointer-events-none absolute bottom-4 left-4 z-[2] hidden w-[10rem] flex-col gap-3 lg:flex"
          aria-hidden
        >
          {chips.map((item) => (
            <li key={item.title} className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center text-[#5EEAD4] drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]">
                <GalleryChipIcon name={item.icon} />
              </span>
              <span className="min-w-0 [text-shadow:0_1px_3px_rgba(0,0,0,0.75)]">
                <p
                  className={`${CARD_META_CLASS} font-bold leading-snug text-white`}
                >
                  {item.title}
                </p>
                <p
                  className={`mt-0.5 ${FIELD_CAPTION_CLASS} leading-snug text-white/85`}
                >
                  {item.sub}
                </p>
              </span>
            </li>
          ))}
        </ul>
      </button>

      <div className="mt-3 flex items-center gap-1.5">
        {canSlide ? (
          <button
            type="button"
            onClick={() => goThumbs(-1)}
            disabled={start <= 0}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-navy transition hover:border-accent hover:text-accent disabled:opacity-30"
            aria-label="Ảnh trước"
          >
            <ThumbArrow dir="prev" />
          </button>
        ) : null}

        <div className="grid min-w-0 flex-1 grid-cols-4 gap-2.5">
          {windowThumbs.map((item, localIdx) => {
            const i = start + localIdx;
            const url = typeof item === "string" ? item : null;
            return (
              <button
                key={url ?? i}
                type="button"
                onClick={() => onThumb(i)}
                className={`overflow-hidden rounded-xl border-2 ${MOTION_NORMAL} transition-[border-color,box-shadow,transform] ${HOVER_LIFT_CARD} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  activeIndex === i
                    ? "border-accent shadow-[0_6px_16px_rgba(14,165,164,0.2)]"
                    : "border-border hover:border-accent/40"
                }`}
                aria-label={`${imageAlt} — ảnh ${i + 1}`}
                aria-current={activeIndex === i}
              >
                <div className="relative aspect-square overflow-hidden bg-slate-900">
                  {url ? (
                    <Image
                      src={url}
                      alt={`${imageAlt} — thu nhỏ ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="120px"
                      loading="lazy"
                      unoptimized
                    />
                  ) : (
                    <ProductHeroArt
                      data={data}
                      tone={(i as number) % 4}
                      fill
                      compact
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {canSlide ? (
          <button
            type="button"
            onClick={() => goThumbs(1)}
            disabled={start >= maxStart}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-navy transition hover:border-accent hover:text-accent disabled:opacity-30"
            aria-label="Ảnh sau"
          >
            <ThumbArrow dir="next" />
          </button>
        ) : null}
      </div>

      {lightbox ? (
        <div
          className={`fixed inset-0 ${Z_OVERLAY} flex items-center justify-center bg-navy/80 p-4 backdrop-blur-sm`}
          role="dialog"
          aria-modal="true"
          aria-label={imageAlt}
          onClick={() => setLightbox(false)}
        >
          <div
            className={`relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-black ${ELEVATION_MODAL} ${Z_MODAL}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square max-h-[80vh] w-full sm:aspect-[4/3]">
              {gallery && activeUrl ? (
                <Image
                  src={activeUrl}
                  alt={imageAlt}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  unoptimized
                  priority
                />
              ) : (
                <ProductHeroArt data={data} tone={activeIndex % 4} fill />
              )}
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-white/10 px-3 py-2.5">
              <button
                type="button"
                onClick={() => stepImage(-1)}
                disabled={activeIndex <= 0}
                className={`rounded-lg px-3 py-1.5 ${CTA_COMPACT_CLASS} text-white/90 hover:bg-white/10 disabled:opacity-30`}
                aria-label="Ảnh trước"
              >
                ← Trước
              </button>
              <p className={`${CARD_META_CLASS} text-white/70`}>
                {activeIndex + 1} / {thumbs.length}
              </p>
              <button
                type="button"
                onClick={() => stepImage(1)}
                disabled={activeIndex >= thumbs.length - 1}
                className={`rounded-lg px-3 py-1.5 ${CTA_COMPACT_CLASS} text-white/90 hover:bg-white/10 disabled:opacity-30`}
                aria-label="Ảnh sau"
              >
                Sau →
              </button>
            </div>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
              aria-label="Đóng ảnh lớn"
            >
              ×
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PurchaseColumn({
  data,
  variant,
  license,
  qty,
  onQty,
  onSelectVariant,
  email,
  onEmail,
  loading,
  error,
  onBuy,
  compare,
  disc,
  soldCount,
}: {
  data: PdpProductData;
  variant: PdpVariantOption;
  license: LicensePresentation;
  qty: number;
  onQty: (n: number) => void;
  onSelectVariant: (id: string) => void;
  email: string;
  onEmail: (v: string) => void;
  loading: boolean;
  error: string | null;
  onBuy: () => void;
  compare?: number;
  disc?: number;
  soldCount: number | null;
}) {
  const hasReviews =
    typeof data.rating === "number" &&
    typeof data.reviewCount === "number" &&
    data.reviewCount > 0;
  const summaryParts = licenseSummaryParts(license);
  const shortPlain = data.shortDescription
    ? stripHtml(data.shortDescription) || data.shortDescription
    : "";
  const quoteHref = `${QUOTE_HREF}?product=${encodeURIComponent(data.slug)}&variant=${encodeURIComponent(variant.id)}`;

  return (
    <div className="min-w-0">
      <p className={`${OVERLINE_CLASS} text-accent`}>{data.brandName}</p>

      <h1 className={`mt-2 ${PDP_TITLE_CLASS}`}>{data.name}</h1>
      {variant.name ? (
        <p className={`mt-1 ${CARD_TITLE_CLASS} text-muted`}>{variant.name}</p>
      ) : null}

      {summaryParts.length ? (
        <p className={`mt-2 ${CARD_META_CLASS} font-medium text-navy`}>
          {summaryParts.join(" · ")}
        </p>
      ) : null}

      {hasReviews || soldCount != null ? (
        <div
          className={`mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 ${BODY_MUTED_CLASS}`}
        >
          {hasReviews ? (
            <>
              <StarRating rating={data.rating!} size="md" />
              <span className={`tabular-nums ${CARD_META_CLASS}`}>
                {data.rating!.toFixed(1)} (
                {data.reviewCount!.toLocaleString("vi-VN")} đánh giá)
              </span>
            </>
          ) : null}
          {soldCount != null ? (
            <>
              {hasReviews ? (
                <span className="hidden text-border sm:inline" aria-hidden>
                  |
                </span>
              ) : null}
              <span className={CARD_META_CLASS}>
                Đã bán:{" "}
                <span className="font-semibold tabular-nums text-navy">
                  {soldCount.toLocaleString("vi-VN")}
                </span>
              </span>
            </>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <p className={PDP_PRICE_CLASS}>{formatVnd(variant.priceVnd)}</p>
        {compare && compare > variant.priceVnd ? (
          <p className={`pb-1 ${COMPARE_PRICE_CLASS}`}>{formatVnd(compare)}</p>
        ) : null}
        {disc ? (
          <span
            className={`mb-1 inline-flex rounded-md bg-emerald-50 px-2 py-0.5 ${BADGE_CLASS} text-emerald-700`}
          >
            Tiết kiệm {disc}%
          </span>
        ) : null}
      </div>
      <p className={`mt-1 ${CARD_META_CLASS}`}>Đã bao gồm VAT</p>

      {shortPlain ? (
        <p className={`mt-4 line-clamp-3 ${SECTION_LEAD_CLASS}`}>{shortPlain}</p>
      ) : null}

      {summaryParts.length ||
      license.activationLabel ||
      license.platformLabels.length ||
      license.regionLabel ? (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tóm tắt license">
          {[
            license.channelLabel,
            license.termLabel,
            license.seats,
            license.activationLabel,
            license.platformLabels[0] ?? null,
            license.regionLabel,
          ]
            .filter((x): x is string => Boolean(x))
            .slice(0, 6)
            .map((chip) => (
              <li
                key={chip}
                className={`inline-flex items-center rounded-md border border-border bg-surface px-2 py-1 ${BADGE_CLASS} text-navy`}
              >
                {chip}
              </li>
            ))}
        </ul>
      ) : null}

      <div className="mt-6">
        <p className={`${OVERLINE_CLASS} text-muted-soft`}>Chọn gói</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {data.variants.map((v) => {
            const active = v.id === variant.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelectVariant(v.id)}
                className={
                  active
                    ? `rounded-xl border-2 border-accent bg-accent-soft px-3.5 py-3 text-left ${TRANSITION_UI}`
                    : `rounded-xl border border-border px-3.5 py-3 text-left ${TRANSITION_UI} hover:border-accent/50 hover:bg-surface`
                }
              >
                <p
                  className={`flex items-center gap-1.5 ${LINK_CLASS} ${
                    active ? "text-accent" : "text-navy"
                  }`}
                >
                  {active ? <span aria-hidden>✓</span> : null}
                  {v.name}
                </p>
                <p className={`mt-1 ${INLINE_PRICE_CLASS} !text-navy`}>
                  {formatVnd(v.priceVnd)}
                </p>
                <p className={`mt-0.5 ${CARD_META_CLASS}`}>
                  {v.receiveLabel} · {v.deliveryLabel}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="inline-flex h-11 items-center overflow-hidden rounded-xl border border-border bg-white">
          <button
            type="button"
            className="flex h-full w-10 items-center justify-center text-navy transition hover:bg-surface disabled:opacity-40"
            disabled={qty <= 1}
            onClick={() => onQty(Math.max(1, qty - 1))}
            aria-label="Giảm số lượng"
          >
            −
          </button>
          <span className={`min-w-10 text-center ${FIELD_VALUE_NUM_CLASS}`}>
            {qty}
          </span>
          <button
            type="button"
            className="flex h-full w-10 items-center justify-center text-navy transition hover:bg-surface disabled:opacity-40"
            disabled={qty >= 5}
            onClick={() => onQty(Math.min(5, qty + 1))}
            aria-label="Tăng số lượng"
          >
            +
          </button>
        </div>
        <p className={`sm:max-w-[16rem] ${CARD_META_CLASS}`}>
          Tối đa 5 sản phẩm cùng gói mỗi lần thanh toán.
        </p>
      </div>

      <div
        className={`mt-4 flex items-start gap-2.5 rounded-xl border border-sky-100 bg-sky-50/80 px-3.5 py-3 ${BODY_CLASS} !text-sky-900`}
      >
        <InfoIcon />
        <div>
          <p>
            {variant.fulfillmentInstant
              ? "Sản phẩm được giao / kích hoạt tự động sau khi thanh toán thành công."
              : "Đơn sẽ do KEYON xử lý sau thanh toán — theo dõi trong Đơn hàng / Tài sản."}
          </p>
          <p className={`mt-1 ${CARD_META_CLASS} !text-sky-800/80`}>
            Loại nhận:{" "}
            <span className="font-semibold">{variant.receiveLabel}</span>
            {" · "}
            {variant.deliveryLabel}
            {variant.slaPromise?.trim()
              ? ` · SLA: ${variant.slaPromise.trim()}`
              : ""}
          </p>
        </div>
      </div>

      {!data.loggedIn ? (
        <label className="mt-4 block">
          <span className="sr-only">Email nhận license</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => onEmail(e.target.value)}
            placeholder={
              variant.receiveKind === "activation" && !variant.fulfillmentInstant
                ? "Email nhận bàn giao"
                : "Email nhận license"
            }
            className={`w-full rounded-xl border border-border bg-white px-3.5 py-2.5 ${INPUT_TEXT_CLASS} outline-none transition focus:border-accent`}
          />
        </label>
      ) : null}

      {error ? <p className={`mt-3 ${FORM_ERROR_CLASS}`}>{error}</p> : null}

      {variant.canBuy ? (
        <button
          type="button"
          disabled={loading || !email}
          onClick={onBuy}
          className={`mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER} disabled:opacity-50`}
        >
          <BoltIcon />
          <span className="flex flex-col items-start leading-tight sm:flex-row sm:items-center sm:gap-2">
            <span>{loading ? "Đang tạo đơn…" : "Thanh toán ngay"}</span>
            {!loading ? (
              <span className={`${CTA_COMPACT_CLASS} font-medium text-white/85`}>
                {variant.fulfillmentInstant
                  ? "Kích hoạt tự động — Nhận key ngay"
                  : "KEYON xử lý sau thanh toán"}
              </span>
            ) : null}
          </span>
        </button>
      ) : (
        <div className="mt-4 rounded-xl bg-accent-soft p-4 text-sm text-accent">
          Gói này hiện cần báo giá / chưa mở mua tự phục vụ. Dùng tư vấn license bên dưới.
        </div>
      )}

      <Link
        href={quoteHref}
        className={`mt-3 inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-white px-5 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
      >
        {PDP_QUOTE_LABEL}
      </Link>

      <p className={`mt-4 border-t border-border pt-4 text-center ${CARD_META_CLASS} sm:text-left`}>
        Thanh toán an toàn · Giao hàng kỹ thuật số · Hỗ trợ sau bán hàng
      </p>
    </div>
  );
}

function FeatureBar({
  features,
  instant,
  brandName,
  receiveLabel,
}: {
  features: string[];
  instant: boolean;
  brandName: string;
  receiveLabel: string;
}) {
  const items = featureBarItems(features, instant, brandName, receiveLabel);

  return (
    <section className="mt-10 overflow-hidden rounded-2xl border border-border/80 bg-surface md:mt-12">
      <ul className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-border">
        {items.map((item, i) => (
          <li
            key={`${item.title}-${i}`}
            className={`flex items-start gap-3 px-3 py-4 sm:px-5 ${
              i < items.length - 1
                ? "border-b border-border sm:border-b lg:border-b-0"
                : ""
            } ${i % 2 === 0 ? "border-r border-border lg:border-r-0" : ""}`}
          >
            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
              <CheckIcon />
            </span>
            <div className="min-w-0">
              <p className={CARD_TITLE_CLASS}>{item.title}</p>
              <p className={`mt-0.5 ${CARD_META_CLASS}`}>{item.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TabsSection({
  data,
  variant,
  license,
  tab,
  tabs,
  onTab,
}: {
  data: PdpProductData;
  variant: PdpVariantOption;
  license: LicensePresentation;
  tab: PdpTabId;
  tabs: { id: PdpTabId; label: string }[];
  onTab: (id: PdpTabId) => void;
}) {
  const quoteHref = `${QUOTE_HREF}?product=${encodeURIComponent(data.slug)}&intent=activation`;

  return (
    <section className="mt-10 md:mt-12">
      <div className="flex gap-1 overflow-x-auto border-b border-border pb-px">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTab(t.id)}
            className={`shrink-0 border-b-2 px-3 py-2.5 transition sm:px-4 ${
              tab === t.id
                ? `border-accent ${TAB_ACTIVE_CLASS} !text-accent`
                : `border-transparent ${TAB_CLASS}`
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "description" ? (
          <div className="space-y-8">
            <div className="min-w-0">
              <h2 className={SUBSECTION_TITLE_CLASS}>Tổng quan sản phẩm</h2>
              {data.description?.trim() ? (
                <StaticPageHtml
                  body={data.description}
                  className="blog-prose pdp-prose mt-4 max-w-none"
                />
              ) : (
                <p className={`mt-4 ${BODY_MUTED_CLASS}`}>
                  {`${data.name} — giấy phép bản quyền số phân phối trên KEYON. Chọn gói, thanh toán rõ, nhận trong Tài sản.`}
                </p>
              )}
            </div>

            {data.features.length ? (
              <section>
                <h3 className={SUBSECTION_TITLE_CLASS}>Điểm nổi bật</h3>
                <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                  {data.features.map((f) => (
                    <li
                      key={f}
                      className={`flex items-start gap-2.5 ${BODY_CLASS}`}
                    >
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <CheckIcon small />
                      </span>
                      <span className="min-w-0 leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {data.specs.length || data.systemSpecs.length ? (
              <section>
                <h3 className={`mb-4 ${SUBSECTION_TITLE_CLASS}`}>
                  Thông số kỹ thuật
                </h3>
                <div
                  className={`grid gap-4 ${
                    data.specs.length && data.systemSpecs.length
                      ? "lg:grid-cols-2"
                      : ""
                  }`}
                >
                  <SpecsCard title="Thông số" specs={data.specs} />
                  <SpecsCard
                    title="Yêu cầu hệ thống"
                    specs={data.systemSpecs}
                  />
                </div>
              </section>
            ) : null}

            <LicenseInfoBlock license={license} />
            <LicenseWarningBlock />
          </div>
        ) : null}

        {tab === "details" ? (
          <div className="space-y-6">
            {data.specs.length || data.systemSpecs.length ? (
              <div>
                <h2 className={`mb-4 ${SUBSECTION_TITLE_CLASS}`}>
                  Thông số kỹ thuật
                </h2>
                <div
                  className={`grid gap-4 ${
                    data.specs.length && data.systemSpecs.length
                      ? "lg:grid-cols-2"
                      : ""
                  }`}
                >
                  {data.specs.length ? (
                    <div className="overflow-x-auto rounded-2xl border border-border/80 bg-surface p-4 sm:p-5 md:p-6">
                      <p className={CARD_TITLE_CLASS}>Thông số chi tiết</p>
                      <dl className="mt-4 space-y-0">
                        {data.specs.map((s) => (
                          <div
                            key={s.label}
                            className={`grid grid-cols-1 gap-1 border-b border-border/70 py-3 sm:grid-cols-[minmax(7rem,0.38fr)_minmax(0,0.62fr)] sm:items-start sm:gap-3 ${BODY_CLASS}`}
                          >
                            <dt className="text-muted-soft">{s.label}</dt>
                            <dd className="min-w-0 break-words font-semibold text-navy">
                              {s.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ) : null}
                  {data.systemSpecs.length ? (
                    <div className="overflow-x-auto rounded-2xl border border-border/80 bg-surface p-4 sm:p-5 md:p-6">
                      <p className={CARD_TITLE_CLASS}>Yêu cầu hệ thống</p>
                      <dl className="mt-4 space-y-0">
                        {data.systemSpecs.map((s) => (
                          <div
                            key={s.label}
                            className={`grid grid-cols-1 gap-1 border-b border-border/70 py-3 sm:grid-cols-[minmax(7rem,0.38fr)_minmax(0,0.62fr)] sm:items-start sm:gap-3 ${BODY_CLASS}`}
                          >
                            <dt className="text-muted-soft">{s.label}</dt>
                            <dd className="min-w-0 break-words font-semibold text-navy">
                              {s.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
            <LicenseInfoBlock license={license} />
            <LicenseWarningBlock />
          </div>
        ) : null}

        {tab === "guide" ? (
          <div className="space-y-5">
            <h2 className={SUBSECTION_TITLE_CLASS}>Hướng dẫn mua & nhận license</h2>
            <ol className="grid gap-3 sm:grid-cols-2">
              {data.guides.map((g, i) => (
                <li
                  key={g}
                  className={`flex gap-3 rounded-xl border border-border/80 bg-surface px-4 py-3.5 ${BODY_CLASS} ${TRANSITION_UI} hover:border-accent/30`}
                >
                  <span
                    className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent ${BADGE_CLASS} text-white`}
                  >
                    {i + 1}
                  </span>
                  {g}
                </li>
              ))}
            </ol>
            <p className={BODY_MUTED_CLASS}>
              Cần hướng dẫn kích hoạt theo sản phẩm cụ thể?{" "}
              <Link href={quoteHref} className={LINK_ACCENT_CLASS}>
                Liên hệ KEYON để được hướng dẫn kích hoạt
              </Link>
              .
            </p>
          </div>
        ) : null}

        {tab === "reviews" ? (
          <div className="rounded-2xl border border-border bg-surface px-5 py-10 text-center">
            {typeof data.rating === "number" &&
            typeof data.reviewCount === "number" &&
            data.reviewCount > 0 ? (
              <div className="inline-flex flex-col items-center">
                <StarRating rating={data.rating} reviewCount={data.reviewCount} />
                <p className={`mt-3 ${SECTION_LEAD_CLASS}`}>
                  Điểm trung bình {data.rating.toFixed(1)}/5 từ{" "}
                  {data.reviewCount.toLocaleString("vi-VN")} đánh giá.
                </p>
              </div>
            ) : (
              <p className={SECTION_LEAD_CLASS}>
                Chưa có đánh giá công khai cho sản phẩm này. Sau khi mua, bạn có thể gửi
                phản hồi qua ticket hỗ trợ.
              </p>
            )}
          </div>
        ) : null}

        {tab === "faq" ? (
          <div>
            <h2 className={`mb-4 ${SUBSECTION_TITLE_CLASS}`}>
              Câu hỏi thường gặp
            </h2>
            <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
              <FaqAccordion
                items={data.faqs.slice(0, Math.ceil(data.faqs.length / 2))}
              />
              <FaqAccordion
                items={data.faqs.slice(Math.ceil(data.faqs.length / 2))}
              />
            </div>
          </div>
        ) : null}

        {tab === "description" || tab === "details" ? (
          <p className={`mt-4 ${CARD_META_CLASS}`}>
            Gói đang chọn:{" "}
            <span className="font-semibold text-navy">{variant.name}</span> · Loại
            nhận: {variant.receiveLabel} · {variant.deliveryLabel}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function LicenseWarningBlock() {
  return (
    <aside
      className="rounded-xl border border-amber-200/80 bg-amber-50/70 px-4 py-3.5"
      role="note"
    >
      <p className={`${OVERLINE_CLASS} text-amber-800`}>Lưu ý về cấp phép</p>
      <p className={`mt-1.5 ${BODY_CLASS} !text-amber-950/90`}>
        {LICENSE_WARNING_COPY}
      </p>
    </aside>
  );
}

function LicenseInfoBlock({
  license,
}: {
  license: LicensePresentation;
}) {
  type Row = { label: string; value: string };

  const facts: Row[] = [];
  if (license.channelLabel)
    facts.push({ label: "Loại bản quyền", value: license.channelLabel });
  if (license.termLabel)
    facts.push({ label: "Thời hạn", value: license.termLabel });
  if (license.seats)
    facts.push({ label: "Thiết bị / Core", value: license.seats });
  if (license.regionLabel)
    facts.push({ label: "Khu vực", value: license.regionLabel });
  if (license.activationLabel)
    facts.push({ label: "Kích hoạt", value: license.activationLabel });
  if (license.platformLabels.length)
    facts.push({
      label: "Nền tảng",
      value: license.platformLabels.join(", "),
    });
  if (license.languageLabel)
    facts.push({ label: "Ngôn ngữ", value: license.languageLabel });

  const policies: Row[] = [];
  if (license.accountRequired)
    policies.push({ label: "Tài khoản", value: license.accountRequired });
  if (license.transferPolicy)
    policies.push({ label: "Chuyển nhượng", value: license.transferPolicy });
  if (license.upgradePolicy)
    policies.push({ label: "Nâng cấp", value: license.upgradePolicy });

  if (!facts.length && !policies.length) return null;

  return (
    <div className="space-y-4">
      {facts.length ? (
        <div className="overflow-x-auto rounded-2xl border border-border/80 bg-surface p-4 sm:p-5">
          <h3 className={SUBSECTION_TITLE_CLASS}>Thông tin bản quyền</h3>
          <dl className="mt-3 grid gap-x-8 sm:grid-cols-2">
            {facts.map((r) => (
              <div
                key={r.label}
                className={`flex items-baseline justify-between gap-3 border-b border-border/60 py-2.5 ${BODY_CLASS}`}
              >
                <dt className="shrink-0 text-muted-soft">{r.label}</dt>
                <dd className="min-w-0 text-right font-semibold text-navy">
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
      {policies.length ? (
        <div className="overflow-x-auto rounded-2xl border border-border/80 bg-surface p-4 sm:p-5">
          <h3 className={SUBSECTION_TITLE_CLASS}>Điều kiện sử dụng</h3>
          <dl className="mt-3 space-y-0">
            {policies.map((r) => (
              <div
                key={r.label}
                className={`grid gap-1 border-b border-border/60 py-3 last:border-b-0 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-4 ${BODY_CLASS}`}
              >
                <dt className="text-muted-soft">{r.label}</dt>
                <dd className="min-w-0 whitespace-pre-line font-medium leading-relaxed text-navy">
                  {r.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </div>
  );
}

function SpecsCard({
  title = "Thông số",
  specs,
}: {
  title?: string;
  specs: { label: string; value: string }[];
}) {
  if (!specs.length) return null;
  return (
    <div className="rounded-2xl border border-border/80 bg-surface p-4 sm:p-5">
      <p className={CARD_TITLE_CLASS}>{title}</p>
      <dl className="mt-3 space-y-0">
        {specs.map((s) => (
          <div
            key={s.label}
            className={`flex items-baseline justify-between gap-3 border-b border-border/70 py-2.5 ${BODY_CLASS} last:border-b-0`}
          >
            <dt className="shrink-0 text-muted-soft">{s.label}</dt>
            <dd className="min-w-0 break-words text-right font-semibold text-navy">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function StickyBar({
  data,
  variant,
  license,
  qty,
  loading,
  canBuy,
  onBuy,
  compare,
  disc,
}: {
  data: PdpProductData;
  variant: PdpVariantOption;
  license: LicensePresentation;
  qty: number;
  loading: boolean;
  canBuy: boolean;
  onBuy: () => void;
  compare?: number;
  disc?: number;
}) {
  if (!canBuy) return null;
  const summary = licenseSummaryParts(license).join(" · ");
  const thumbSrc = data.imageUrl || data.galleryUrls[0] || null;
  const thumbAlt = `${data.name}${variant.name ? ` — ${variant.name}` : ""}`;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 ${Z_BANNER} border-t border-border bg-white/95 ${ELEVATION_STICKY_UP} backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))] `}
    >
      <div className="home-container flex items-center justify-between gap-3 py-2.5 md:gap-4 md:py-3">
        <div className="hidden min-w-0 items-center gap-3 sm:flex">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface">
            {thumbSrc ? (
              <Image
                src={thumbSrc}
                alt={thumbAlt}
                fill
                className="object-cover"
                sizes="48px"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center p-1">
                <ProductHeroArt data={data} tone={0} compact />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className={`truncate ${CARD_TITLE_CLASS}`}>{data.name}</p>
            <p className={`mt-0.5 truncate ${CARD_META_CLASS}`}>
              {summary || variant.name || `Số lượng: ${qty}`}
            </p>
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-4">
          <div className="text-left sm:text-right">
            <p className={CARD_PRICE_CLASS}>
              {formatVnd(variant.priceVnd * qty)}
            </p>
            <div className="mt-0.5 flex items-center gap-2 sm:justify-end">
              {compare && compare > variant.priceVnd ? (
                <span className={COMPARE_PRICE_CLASS}>
                  {formatVnd(compare * qty)}
                </span>
              ) : null}
              {disc ? (
                <span className={`${BADGE_CLASS} text-rose-500`}>-{disc}%</span>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={onBuy}
            className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover disabled:opacity-50`}
          >
            <BoltIcon />
            {loading ? "Đang tạo đơn…" : "Thanh toán ngay"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductHeroArt({
  data,
  tone,
  compact,
  fill,
}: {
  data: PdpProductData;
  tone: number;
  compact?: boolean;
  /** Fill parent frame (main gallery / thumbs). */
  fill?: boolean;
}) {
  const scenes = [
    "from-[#0B1F3A] via-[#123A6B] to-[#0EA5A4]",
    "from-[#0F172A] via-[#1E3A5F] to-[#2563EB]",
    "from-[#0C4A6E] via-[#155E75] to-[#14B8A6]",
    "from-[#1E1B4B] via-[#312E81] to-[#6366F1]",
  ];
  const boxTone = [
    "from-sky-400 to-blue-700",
    "from-indigo-400 to-slate-800",
    "from-cyan-400 to-teal-700",
    "from-violet-400 to-slate-900",
  ];
  const label =
    data.mark === "windows"
      ? data.name.toLowerCase().includes("10")
        ? "W10"
        : "W11"
      : data.mark === "office"
        ? "Off"
        : data.mark === "adobe"
          ? "Aa"
          : data.mark === "security"
            ? "Sec"
            : data.brandName.slice(0, 2).toUpperCase();

  if (fill) {
    return (
      <div
        className={`absolute inset-0 bg-gradient-to-br ${scenes[tone % scenes.length]}`}
        aria-hidden
      >
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 55% 40%, #fff 0, transparent 42%), radial-gradient(circle at 15% 85%, #0ea5a4 0, transparent 38%)",
          }}
        />
        {/* Full khung — ảnh thật sau này tự lệch phải; demo vuông fill */}
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            compact ? "p-1.5" : "p-4 sm:p-5"
          }`}
        >
          <div
            className={`aspect-square h-full max-h-full w-auto max-w-full flex-col justify-between rounded-xl bg-gradient-to-br ${
              boxTone[tone % boxTone.length]
            } text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] ${
              compact ? "flex p-2" : "flex p-5 sm:p-6 md:p-7"
            }`}
          >
            <span
              className={`font-semibold opacity-85 ${compact ? "text-[9px]" : "text-sm"}`}
            >
              {data.brandName}
            </span>
            <div>
              <span
                className={`block font-extrabold tracking-tight ${
                  compact ? "text-xl" : "text-5xl sm:text-6xl md:text-7xl"
                }`}
              >
                {label}
              </span>
              {!compact ? (
                <span className="mt-2 line-clamp-2 text-sm font-semibold text-white/90 sm:text-base md:text-lg">
                  {data.name}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col justify-between rounded-lg bg-gradient-to-br ${boxTone[tone % boxTone.length]} text-white shadow-lg ${
        compact ? "h-full w-full p-1.5" : "h-36 w-28 p-3 sm:h-44 sm:w-32"
      }`}
      aria-hidden
    >
      <span className={`font-semibold opacity-80 ${compact ? "text-[8px]" : "text-[10px]"}`}>
        {data.brandName}
      </span>
      <span className={`font-extrabold tracking-tight ${compact ? "text-sm" : "text-2xl"}`}>
        {label}
      </span>
    </div>
  );
}

function Sep() {
  return <span aria-hidden>/</span>;
}

function HomeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

function ThumbArrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      {dir === "prev" ? <path d="M15 6 9 12l6 6" /> : <path d="m9 6 6 6-6 6" />}
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  );
}

function GalleryChipIcon({ name }: { name: "shield" | "bolt" | "headset" | "badge" }) {
  const props = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    "aria-hidden": true as const,
  };
  if (name === "bolt") return <svg {...props} fill="currentColor" stroke="none"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>;
  if (name === "shield") return <svg {...props}><path d="M12 3 4.5 6v5.5c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Z" /><path d="m9 12 2 2 4-4" /></svg>;
  if (name === "headset") {
    return (
      <svg {...props}>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <path d="M4 14a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2v1Z" />
        <path d="M20 14a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2v1Z" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M12 3 14.5 8.5 20.5 9.3 16.2 13.4 17.4 19.3 12 16.4 6.6 19.3 7.8 13.4 3.5 9.3 9.5 8.5 12 3Z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="mt-0.5 shrink-0 text-sky-600" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v5h1" />
    </svg>
  );
}

function CheckIcon({ small }: { small?: boolean }) {
  const s = small ? 12 : 16;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
