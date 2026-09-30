"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
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
  SUMMARY_TOTAL_CLASS,
  TAB_ACTIVE_CLASS,
  TAB_CLASS,
} from "@/storefront/typography";
import { QUOTE_HREF } from "@/storefront/lib/cta";
import { trackViewItem } from "@/storefront/lib/analytics";
import type { PdpProductData, PdpTabId, PdpVariantOption } from "./types";
import {
  catalogDescriptionFallback,
  guideEmptyCopy,
  guidePdpHeading,
  guidePdpLabel,
  licenseFactsTitle,
  systemSpecsTitle,
  type OfferingProfile,
} from "@/storefront/lib/offering-profile";
import {
  LICENSE_REGION_LABELS,
  LICENSE_REGIONS,
  LICENSE_TERM_LABELS,
  LICENSE_TERMS,
  resolveLicensePresentation,
  type LicenseRegion,
  type LicenseTermCode,
} from "@/storefront/lib/license-catalog";
import { StaticPageHtml } from "@/storefront/components/StaticPageHtml";
import { stripHtml } from "@/server/cms/blog-utils";
import {
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  ELEVATION_MODAL,
  ELEVATION_STICKY_UP,
  HOVER_LIFT_CARD,
  Z_STICKY,
  MOTION_NORMAL,
  TRANSITION_UI,
  Z_BANNER,
  Z_MODAL,
  Z_OVERLAY,
} from "@/storefront/effects";

const PDP_QUOTE_LABEL = "Tư vấn license" as const;
const LICENSE_WARNING_COPY =
  "License được kích hoạt theo chính sách của nhà phát hành. Vui lòng kiểm tra loại license, thời hạn và điều kiện sử dụng trước khi thanh toán." as const;

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

function featureBarItems(
  features: string[],
  instant: boolean,
  brandName: string,
  receiveLabel: string,
  profile: OfferingProfile,
  activationLabel?: string | null,
): { title: string; desc: string }[] {
  if (profile === "SOFTWARE") {
    return [
      { title: "License chính hãng", desc: `Bản quyền ${brandName}` },
      {
        title: "Kích hoạt dễ",
        desc: activationLabel || receiveLabel || "Theo hướng dẫn kèm license",
      },
      { title: "Hỗ trợ từ KEYON", desc: "Trong quá trình sử dụng" },
      { title: "Đã gồm VAT", desc: "Giá hiển thị đã bao gồm VAT" },
    ];
  }
  if (features.length >= 4) {
    return features.slice(0, 4).map((f) => {
      const parts = f.split(/\s*[—–|]\s*/);
      const title = (parts[0] ?? f).trim();
      const desc = parts.slice(1).join(" — ").trim() || "Theo mô tả sản phẩm";
      return { title, desc };
    });
  }
  if (profile === "INFRASTRUCTURE") {
    return [
      { title: "Gói thuê rõ", desc: `Nguồn ${brandName}` },
      {
        title: "KEYON cấp phát",
        desc: "Theo dõi trong đơn hàng và Tài sản",
      },
      { title: "Thanh toán an toàn", desc: "QR / chuyển khoản rõ" },
      {
        title: "Hỗ trợ sử dụng",
        desc: receiveLabel || "Ticket trong Tài khoản",
      },
    ];
  }
  if (profile === "SERVICE") {
    return [
      { title: "Phạm vi bàn giao", desc: `Theo gói ${brandName}` },
      { title: "KEYON thực hiện", desc: "Theo dõi trong đơn hàng" },
      { title: "Thanh toán an toàn", desc: "QR / chuyển khoản rõ" },
      {
        title: "Hỗ trợ bàn giao",
        desc: receiveLabel || "Ticket trong Tài khoản",
      },
    ];
  }
  if (profile === "OTHER") {
    return [
      { title: "Mua trên KEYON", desc: `Nguồn ${brandName}` },
      { title: "KEYON xử lý", desc: "Theo dõi trong đơn hàng" },
      { title: "Thanh toán an toàn", desc: "QR / chuyển khoản rõ" },
      {
        title: "Hỗ trợ sau mua",
        desc: receiveLabel || "Ticket trong Tài khoản",
      },
    ];
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

  useEffect(() => {
    trackViewItem({
      value: variant.priceVnd,
      items: [
        {
          item_id: variant.id,
          item_name: data.name,
          item_brand: data.brandName,
          item_category: data.categoryLabel,
          item_variant: variant.name,
          price: variant.priceVnd,
          quantity: 1,
        },
      ],
    });
  }, [
    data.name,
    data.brandName,
    data.categoryLabel,
    variant.id,
    variant.name,
    variant.priceVnd,
  ]);

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
            : t.id === "guide"
              ? { ...t, label: guidePdpLabel(data.offeringProfile) }
              : t,
      ),
    [data.reviewCount, data.faqs.length, data.offeringProfile],
  );

  function selectVariant(id: string) {
    setVariantId(id);
    const url = `/products/${data.slug}?variant=${id}`;
    window.history.replaceState(window.history.state, "", url);
  }

  useEffect(() => {
    function onPop() {
      const id = new URLSearchParams(window.location.search).get("variant");
      if (id && data.variants.some((item) => item.id === id)) setVariantId(id);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [data.variants]);

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

  const planLayout = data.offeringProfile === "INFRASTRUCTURE";
  const softwareLayout = data.offeringProfile === "SOFTWARE";

  return (
    <div className="bg-white pb-28">
      <div className="home-container home-section">
        <Breadcrumb data={data} variant={variant} />

        <div
          className={
            planLayout
              ? "mt-6"
              : "mt-6 grid items-start gap-8 lg:grid-cols-2 lg:gap-10"
          }
        >
          {planLayout ? null : (
            <Gallery
              data={data}
              variant={variant}
              thumb={thumb}
              onThumb={setThumb}
              discount={disc}
            />
          )}
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
            planLayout={planLayout}
            softwareLayout={softwareLayout}
          />
        </div>

        {planLayout ? (
          <InfraProductStory data={data} variant={variant} />
        ) : softwareLayout ? (
          <>
            <FeatureBar
              features={data.features}
              instant={variant.fulfillmentInstant}
              brandName={data.brandName}
              receiveLabel={variant.receiveLabel}
              activationLabel={license.activationLabel}
              profile={data.offeringProfile}
            />
            <SoftwareProductStory data={data} variant={variant} license={license} />
          </>
        ) : (
          <>
            <FeatureBar
              features={data.features}
              instant={variant.fulfillmentInstant}
              brandName={data.brandName}
              receiveLabel={variant.receiveLabel}
              profile={data.offeringProfile}
            />
            <TabsSection
              data={data}
              variant={variant}
              license={license}
              tab={tab}
              tabs={tabLabels}
              onTab={setTab}
            />
          </>
        )}

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
        planLayout={planLayout}
        softwareLayout={softwareLayout}
        onQty={setQty}
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
  const vps = isVpsLinuxFamily(data);
  const hideBrand =
    data.brandName.trim().toLowerCase() === data.categoryLabel.trim().toLowerCase();
  const current = vps ? planDisplayName(variant.name) : data.name;
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
      {vps ? (
        <>
          <span className="text-muted">VPS</span>
          <Sep />
          <span className="text-muted">VPS Linux</span>
          <Sep />
        </>
      ) : hideBrand ? null : (
        <>
          <span className="text-muted">{data.brandName}</span>
          <Sep />
        </>
      )}
      <span className={BREADCRUMB_CURRENT_CLASS}>{current}</span>
    </nav>
  );
}

function Gallery({
  data,
  variant,
  thumb,
  onThumb,
  discount,
  frame = "square",
}: {
  data: PdpProductData;
  variant: PdpVariantOption;
  thumb: number;
  onThumb: (n: number) => void;
  discount?: number;
  frame?: "square" | "wide";
}) {
  const gallery = data.galleryUrls?.length ? data.galleryUrls : null;

  if (!gallery?.length) {
    return (
      <div className="min-w-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
            <p className={`font-semibold text-navy ${CARD_TITLE_CLASS}`}>
              {data.name}
            </p>
            <p className={BODY_MUTED_CLASS}>
              {data.brandName}
              {variant.name ? ` · ${variant.name}` : ""}
            </p>
          </div>
          {discount ? (
            <span
              className={`absolute left-3 top-3 rounded-md bg-rose-600 px-2 py-0.5 ${BADGE_CLASS} text-white`}
            >
              −{discount}%
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <GalleryImages
      data={data}
      variant={variant}
      gallery={gallery}
      thumb={thumb}
      onThumb={onThumb}
      discount={discount}
      frame={frame}
    />
  );
}

function GalleryImages({
  data,
  variant,
  gallery,
  thumb,
  onThumb,
  discount,
  frame = "square",
}: {
  data: PdpProductData;
  variant: PdpVariantOption;
  gallery: string[];
  thumb: number;
  onThumb: (n: number) => void;
  discount?: number;
  frame?: "square" | "wide";
}) {
  const thumbs = gallery;
  const visible = frame === "wide" ? Math.min(5, thumbs.length) : 4;
  const canSlide = thumbs.length > visible;
  const maxStart = Math.max(0, thumbs.length - visible);
  const [start, setStart] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [touchX, setTouchX] = useState<number | null>(null);

  const windowThumbs = frame === "square" ? thumbs : thumbs.slice(start, start + visible);
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
  }, [activeIndex, start, maxStart, visible]);

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
        className={`relative w-full overflow-hidden rounded-2xl border border-border/80 bg-white text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          frame === "wide"
            ? `h-[240px] sm:h-[320px] lg:h-[380px] ${ELEVATION_HAIRLINE}`
            : `aspect-square ${ELEVATION_HAIRLINE}`
        }`}
        aria-label={`Xem ảnh lớn: ${imageAlt}`}
      >
        {gallery && activeUrl ? (
          <Image
            src={activeUrl}
            alt={imageAlt}
            fill
            className={frame === "wide" ? "object-cover" : "object-contain scale-[1.18]"}
            sizes="(max-width: 1024px) 100vw, 50vw"
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
      </button>

      {thumbs.length > 1 ? (
      <div className={`flex items-center ${frame === "square" ? "mt-3 gap-3" : "mt-3 gap-1.5"}`}>
        {canSlide && frame !== "square" ? (
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

        <div
          className={
            frame === "square"
              ? "flex flex-wrap gap-3"
              : `grid min-w-0 flex-1 gap-2.5 ${
                  windowThumbs.length >= 5
                    ? "grid-cols-5"
                    : windowThumbs.length === 3
                      ? "grid-cols-3"
                      : windowThumbs.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-4"
                }`
          }
        >
          {windowThumbs.map((item, localIdx) => {
            const i = frame === "square" ? localIdx : start + localIdx;
            const url = typeof item === "string" ? item : null;
            return (
              <button
                key={url ?? i}
                type="button"
                onClick={() => onThumb(i)}
                className={`overflow-hidden border-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  frame === "square"
                    ? "h-16 w-16 shrink-0 rounded-lg"
                    : `rounded-xl ${MOTION_NORMAL} transition-[border-color,box-shadow,transform] ${HOVER_LIFT_CARD}`
                } ${
                  activeIndex === i
                    ? "border-accent"
                    : "border-border hover:border-accent/40"
                } ${frame === "square" || activeIndex !== i ? "" : "shadow-[0_6px_16px_rgba(14,165,164,0.2)]"}`}
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

        {canSlide && frame !== "square" ? (
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
      ) : null}

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

function planTermLabel(code: string | null | undefined): string | null {
  if (!code || !(LICENSE_TERMS as readonly string[]).includes(code)) return null;
  return LICENSE_TERM_LABELS[code as LicenseTermCode];
}

function isBareSpec(row: { label: string; value: string }) {
  const value = row.value.trim();
  return !value || value === "—" || value === "-" || value === "–";
}

function specFact(row: { label: string; value: string }) {
  return isBareSpec(row) ? row.label.trim() : row.value.trim();
}

const PACKAGE_HIGHLIGHTS = [
  { id: "cpu", title: "CPU", test: /cpu|vcpu/i },
  { id: "ram", title: "RAM", test: /\bram\b|bộ nhớ/i },
  { id: "storage", title: "Lưu trữ", test: /ssd|nvme|storage|ổ/i },
  { id: "network", title: "Mạng", test: /băng thông|network|mbps|mạng/i },
] as const;

function highlightFact(
  row: { label: string; value: string },
  slotId: (typeof PACKAGE_HIGHLIGHTS)[number]["id"],
) {
  const fact = specFact(row);
  if (slotId === "cpu" && /^\d+$/.test(fact)) return `${fact} vCPU`;
  if (slotId === "ram" && !/ram/i.test(fact)) return `${fact} RAM`;
  return fact;
}

function packageHighlights(rows: { label: string; value: string }[]) {
  const used = new Set<number>();
  const cards: { id: string; title: string; value: string }[] = [];
  for (const slot of PACKAGE_HIGHLIGHTS) {
    const index = rows.findIndex(
      (row, i) =>
        !used.has(i) &&
        (slot.test.test(row.label) ||
          (isBareSpec(row) && slot.test.test(specFact(row)))),
    );
    if (index < 0) continue;
    used.add(index);
    cards.push({
      id: slot.id,
      title: slot.title,
      value: highlightFact(rows[index]!, slot.id),
    });
  }
  return {
    cards,
    rest: rows.filter((_, index) => !used.has(index)),
  };
}

function benefitItems(features: string[]) {
  return features
    .map((feature) => {
      const parts = feature.split(/\s*[|]\s*/);
      const title = (parts[0] ?? "").trim();
      const desc = parts.slice(1).join(" | ").trim();
      return { title, desc };
    })
    .filter((item) => item.title);
}

function priceCycleSuffix(code: string | null | undefined) {
  if (code === "1_MONTH") return "/tháng";
  if (code === "1_YEAR") return "/năm";
  return "";
}

function guideSteps(html: string) {
  const steps: { title: string; body: string }[] = [];
  const re = /<h[23][^>]*>([\s\S]*?)<\/h[23]>([\s\S]*?)(?=<h[23][^>]*>|$)/gi;
  for (const match of html.matchAll(re)) {
    const title = stripHtml(match[1] ?? "")
      .replace(/^bước\s*\d+\s*[–—-]\s*/i, "")
      .trim();
    const body = stripHtml(match[2] ?? "").trim();
    if (title) steps.push({ title, body });
  }
  return steps;
}

function regionLabel(code: string | null | undefined): string | null {
  if (!code || !(LICENSE_REGIONS as readonly string[]).includes(code)) return null;
  return LICENSE_REGION_LABELS[code as LicenseRegion];
}

function selectedPackageRows(variant: PdpVariantOption): { label: string; value: string }[] {
  const rows = variant.planSpecs.map((row) => ({ ...row }));
  const region = regionLabel(variant.regionCode);
  const has = (pattern: RegExp) => rows.some((row) => pattern.test(row.label));
  const cloudTerm = cloudTermLabel(variant.licenseTerm);
  if (cloudTerm && !has(/thời hạn|chu kỳ/i)) rows.push({ label: "Thời hạn", value: cloudTerm });
  if (region && !has(/khu vực/i)) rows.push({ label: "Khu vực", value: region });
  if (variant.slaPromise?.trim() && !has(/hỗ trợ|sla/i)) {
    rows.push({ label: "Hỗ trợ", value: variant.slaPromise.trim() });
  }
  if (!has(/provisioning|khởi tạo/i)) {
    rows.push({ label: "Provisioning", value: "KEYON" });
  }
  return rows;
}

function planDisplayName(name: string) {
  return name.replace(/\s*·\s*.+$/u, "").trim() || name;
}

function planShortName(name: string) {
  return (
    planDisplayName(name).replace(/^(?:cloud server|vps linux)\s+/i, "").trim() ||
    planDisplayName(name)
  );
}

function isVpsLinuxFamily(data: PdpProductData) {
  return data.slug === "cloud-server" || /^vps linux\b/i.test(data.name);
}

function specValue(
  rows: { label: string; value: string }[],
  test: RegExp,
) {
  return rows.find((row) => test.test(row.label))?.value.trim() ?? "";
}

function planHeroLine(variant: PdpVariantOption) {
  const rows = variant.planSpecs;
  return [
    specValue(rows, /loại máy chủ/i),
    specValue(rows, /virtualization/i),
    specValue(rows, /cpu|vcpu/i),
    specValue(rows, /^ram$/i),
    specValue(rows, /^storage$/i),
  ]
    .filter(Boolean)
    .join(" · ");
}

function planHeroChips(variant: PdpVariantOption) {
  const rows = variant.planSpecs;
  const chips = [
    specValue(rows, /loại dịch vụ/i),
    specValue(rows, /virtualization/i),
    specValue(rows, /quản trị/i),
    cloudTermLabel(variant.licenseTerm) ?? "",
  ].filter(Boolean);
  return [...new Set(chips)];
}

function infraBuyLabel(productName: string) {
  if (/^vps\b/i.test(productName)) return "Đăng ký VPS";
  return `Đăng ký ${productName}`;
}

function planAudience(variant: PdpVariantOption) {
  const written = variant.planFit?.trim().replace(/\.$/, "");
  if (written) return written;
  const base = planDisplayName(variant.name);
  if (/basic/i.test(base)) return "Website và ứng dụng nhỏ";
  if (/standard/i.test(base)) return "Website doanh nghiệp và API";
  if (/business/i.test(base)) return "Ứng dụng và hệ thống doanh nghiệp";
  if (/\bpro\b/i.test(base)) return "Workload chuyên sâu và production";
  return "Nhu cầu đã chọn";
}

function metricPresentation(card: { id: string; value: string }) {
  if (card.id === "ram") {
    return { primary: card.value.replace(/\s*ram$/i, "").trim(), secondary: "" };
  }
  if (card.id === "storage") {
    const match = card.value.match(/^([\d.,]+\s*GB)\s*(.*)$/i);
    if (match) return { primary: match[1]!.trim(), secondary: match[2]!.trim() };
  }
  return { primary: card.value, secondary: "" };
}

function termMonths(code: string | null | undefined) {
  if (code === "3_MONTHS") return 3;
  if (code === "6_MONTHS") return 6;
  if (code === "1_YEAR") return 12;
  if (code === "2_YEARS") return 24;
  if (code === "3_YEARS") return 36;
  return 1;
}

function cloudTermLabel(code: string | null | undefined) {
  if (code === "1_YEAR") return "12 tháng";
  return planTermLabel(code);
}

function planIdentity(variant: PdpVariantOption) {
  const cards = packageHighlights(variant.planSpecs).cards;
  const bits = (["cpu", "ram", "storage"] as const).map(
    (id) => cards.find((card) => card.id === id)?.value ?? "",
  );
  if (bits.every(Boolean)) return bits.join("|");
  return planDisplayName(variant.name);
}

function planGroups(variants: PdpVariantOption[]) {
  const order: string[] = [];
  const map = new Map<string, PdpVariantOption[]>();
  for (const variant of variants) {
    const key = planIdentity(variant);
    const list = map.get(key);
    if (list) list.push(variant);
    else {
      map.set(key, [variant]);
      order.push(key);
    }
  }
  return order.map((key) => {
    const items = map.get(key)!;
    const monthly =
      items.find((item) => item.licenseTerm === "1_MONTH") ??
      items.slice().sort((a, b) => a.priceVnd - b.priceVnd)[0]!;
    return { key, monthly, items };
  });
}

function PlanBoard({
  variants,
  selectedId,
  onSelect,
}: {
  variants: PdpVariantOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [compareOpen, setCompareOpen] = useState(false);
  const groups = planGroups(variants);
  const cards = groups.map((group) => group.monthly);
  const selectedVariant = variants.find((item) => item.id === selectedId);
  const selectedKey = selectedVariant ? planIdentity(selectedVariant) : "";
  function choosePlan(monthly: PdpVariantOption) {
    const group = groups.find((item) => item.monthly.id === monthly.id);
    const next =
      group?.items.find((item) => item.licenseTerm === selectedVariant?.licenseTerm) ??
      monthly;
    onSelect(next.id);
  }
  const columns =
    cards.length >= 4
      ? "lg:grid-cols-4"
      : cards.length === 3
        ? "lg:grid-cols-3"
        : "lg:grid-cols-2";
  const compareLabels = cards.reduce<string[]>((labels, item) => {
    for (const row of item.planSpecs) {
      if (!labels.includes(row.label)) labels.push(row.label);
    }
    return labels;
  }, []);
  const sharedLabelCount = compareLabels.filter(
    (label) =>
      cards.filter((item) =>
        item.planSpecs.some((row) => row.label === label),
      ).length > 1,
  ).length;
  const compareByLabel =
    compareLabels.length > 0 && sharedLabelCount * 2 >= compareLabels.length;
  const maxSpecs = Math.max(0, ...cards.map((item) => item.planSpecs.length));
  const compareRows = compareByLabel
    ? compareLabels.map((label) => ({
        key: label,
        heading: label,
        cells: cards.map((item) => {
          const found = item.planSpecs.find((row) => row.label === label);
          return found ? specFact(found) : "—";
        }),
      }))
    : Array.from({ length: maxSpecs }, (_, index) => {
        const named = cards
          .map((item) => item.planSpecs[index])
          .find((row) => row && !isBareSpec(row));
        return {
          key: `row-${index}`,
          heading: named?.label ?? "",
          cells: cards.map((item) => {
            const row = item.planSpecs[index];
            return row ? specFact(row) : "—";
          }),
        };
      });

  return (
    <div className="mt-6">
      <p className={`${OVERLINE_CLASS} text-muted-soft`}>Chọn cấu hình phù hợp</p>
      <div
        className={`mt-2 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory lg:grid ${columns} lg:overflow-visible`}
      >
        {cards.map((item) => {
          const selected = planIdentity(item) === selectedKey;
          const term = planTermLabel(item.licenseTerm);
          const highlight = packageHighlights(item.planSpecs).cards.filter(
            (card) => card.id !== "network",
          );
          const popular = /standard/i.test(item.name);
          return (
            <article
              key={item.id}
              className={`flex w-[17rem] shrink-0 snap-start flex-col rounded-xl border-2 px-4 py-4 lg:w-auto ${
                selected
                  ? "border-accent bg-accent-soft"
                  : "border-border bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className={CARD_TITLE_CLASS}>{planDisplayName(item.name)}</p>
                {popular ? (
                  <span className={`shrink-0 rounded-md bg-accent px-2 py-0.5 ${BADGE_CLASS} text-white`}>
                    Phổ biến
                  </span>
                ) : null}
              </div>
              <p className={`mt-2 ${INLINE_PRICE_CLASS} !text-navy`}>
                {formatVnd(item.priceVnd)}
                {priceCycleSuffix(item.licenseTerm)}
              </p>
              {term ? <p className={`mt-0.5 ${CARD_META_CLASS}`}>{term}</p> : null}
              {item.compareAtPriceVnd &&
              item.compareAtPriceVnd > item.priceVnd ? (
                <p className={`mt-1 ${CARD_META_CLASS}`}>
                  <span className={COMPARE_PRICE_CLASS}>
                    {formatVnd(item.compareAtPriceVnd)}
                  </span>
                  {item.discountPercent ? (
                    <span className="ml-2 font-semibold text-emerald-700">
                      Tiết kiệm {item.discountPercent}%
                    </span>
                  ) : null}
                </p>
              ) : null}
              {highlight.length ? (
                <ul className="mt-3 space-y-1 border-t border-border pt-3">
                  {highlight.map((card) => (
                    <li
                      key={card.id}
                      className={`font-semibold text-navy ${CARD_META_CLASS}`}
                    >
                      {card.value}
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className={`mt-3 ${CARD_META_CLASS}`}>
                <span className="font-semibold text-navy">Phù hợp với </span>
                {planAudience(item)}
              </p>
              <button
                type="button"
                onClick={() => choosePlan(item)}
                className={`mt-4 inline-flex h-10 items-center justify-center rounded-xl px-3 ${CTA_COMPACT_CLASS} ${
                  selected
                    ? "bg-accent text-white"
                    : "border border-border bg-white text-navy"
                }`}
              >
                {selected ? "Đã chọn" : "Chọn gói"}
              </button>
            </article>
          );
        })}
      </div>
      <p className={`mt-2 ${CARD_META_CLASS}`}>Giá đã bao gồm VAT.</p>
      <p className={`mt-1 lg:hidden ${CARD_META_CLASS}`}>
        Trên điện thoại, vuốt ngang để xem hết các gói.
      </p>
      {cards.length > 1 && compareRows.length ? (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setCompareOpen((open) => !open)}
            className={`${LINK_ACCENT_CLASS} ${CTA_COMPACT_CLASS}`}
          >
            {compareOpen ? "Ẩn bảng so sánh" : "So sánh cấu hình"}
          </button>
          {compareOpen && !compareByLabel ? (
            <div className={`mt-3 grid gap-3 ${columns}`}>
              {cards.map((item) => {
                const selected = planIdentity(item) === selectedKey;
                return (
                <div
                  key={item.id}
                  className={`rounded-xl border px-3 py-3 ${
                    selected
                      ? "border-accent bg-accent-soft"
                      : "border-border bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => choosePlan(item)}
                    className={`${CARD_TITLE_CLASS} ${
                      selected ? "text-accent" : "text-navy"
                    }`}
                  >
                    {planDisplayName(item.name)}
                  </button>
                  <ul className="mt-2 space-y-1">
                    {item.planSpecs.map((row) => (
                      <li key={row.label} className={CARD_META_CLASS}>
                        {isBareSpec(row) ? row.label : `${row.label}: ${row.value}`}
                      </li>
                    ))}
                  </ul>
                  <p className={`mt-2 font-semibold text-navy ${BODY_CLASS}`}>
                    {formatVnd(item.priceVnd)}
                    {priceCycleSuffix(item.licenseTerm)}
                  </p>
                </div>
                );
              })}
            </div>
          ) : null}
          {compareOpen && compareByLabel ? (
            <div className="mt-3 overflow-x-auto rounded-xl border border-border">
              <table className="min-w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className={`px-3 py-2 ${CARD_META_CLASS}`}>Thông số</th>
                    {cards.map((item) => {
                      const selected = planIdentity(item) === selectedKey;
                      return (
                      <th key={item.id} className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => choosePlan(item)}
                          className={`${CARD_TITLE_CLASS} ${
                            selected ? "text-accent" : "text-navy"
                          }`}
                        >
                          {planDisplayName(item.name)}
                        </button>
                      </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row) => (
                    <tr key={row.key} className="border-b border-border/70">
                      <th className={`px-3 py-2 font-medium ${CARD_META_CLASS}`}>
                        {row.heading}
                      </th>
                      {cards.map((item, index) => (
                        <td
                          key={item.id}
                          className={`px-3 py-2 ${BODY_CLASS} ${
                            planIdentity(item) === selectedKey ? "bg-accent-soft" : ""
                          }`}
                        >
                          {row.cells[index]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <th className={`px-3 py-2 font-medium ${CARD_META_CLASS}`}>
                      Giá / tháng
                    </th>
                    {cards.map((item) => (
                      <td
                        key={item.id}
                        className={`px-3 py-2 font-semibold text-navy ${BODY_CLASS} ${
                          planIdentity(item) === selectedKey ? "bg-accent-soft" : ""
                        }`}
                      >
                        {formatVnd(item.priceVnd)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : null}
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
  planLayout,
  softwareLayout,
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
  planLayout: boolean;
  softwareLayout: boolean;
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
      <p className={`${OVERLINE_CLASS} text-accent`}>
        {isVpsLinuxFamily(data) ? "VPS Linux" : data.brandName}
      </p>

      <h1 className={`mt-2 ${PDP_TITLE_CLASS}`}>
        {planLayout ? planDisplayName(variant.name) : data.name}
      </h1>
      {planLayout && planHeroLine(variant) ? (
        <p className={`mt-2 ${CARD_META_CLASS} font-medium text-navy`}>
          {planHeroLine(variant)}
        </p>
      ) : null}
      {variant.name && !planLayout && !softwareLayout ? (
        <p className={`mt-1 ${CARD_TITLE_CLASS} text-muted`}>{variant.name}</p>
      ) : null}

      {summaryParts.length && !planLayout && !softwareLayout ? (
        <p className={`mt-2 ${CARD_META_CLASS} font-medium text-navy`}>
          {summaryParts.join(" · ")}
        </p>
      ) : null}

      {softwareLayout && shortPlain ? (
        <p className={`mt-3 line-clamp-2 ${SECTION_LEAD_CLASS}`}>{shortPlain}</p>
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

      {planLayout || softwareLayout ? null : (
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
      )}
      {planLayout || softwareLayout ? null : (
      <p className={`mt-1 ${CARD_META_CLASS}`}>Đã bao gồm VAT</p>
      )}

      {planLayout && variant.planSummary?.trim() ? (
        <p className={`mt-4 line-clamp-3 ${SECTION_LEAD_CLASS}`}>
          {variant.planSummary.trim()}
        </p>
      ) : shortPlain && !softwareLayout ? (
        <p className={`mt-4 line-clamp-3 ${SECTION_LEAD_CLASS}`}>{shortPlain}</p>
      ) : null}

      {planLayout && planHeroChips(variant).length ? (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tóm tắt gói">
          {planHeroChips(variant).map((chip) => (
            <li
              key={chip}
              className={`inline-flex items-center rounded-md border border-border bg-surface px-2 py-1 ${BADGE_CLASS} text-navy`}
            >
              {chip}
            </li>
          ))}
        </ul>
      ) : null}

      {softwareLayout ? (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tóm tắt license">
          {[
            license.channelLabel,
            license.termLabel,
            license.seats,
            license.platformLabels[0] ?? null,
          ]
            .filter((x): x is string => Boolean(x))
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

      {planLayout ? (
        <PlanBoard
          variants={data.variants}
          selectedId={variant.id}
          onSelect={onSelectVariant}
        />
      ) : null}

      {!planLayout &&
      !softwareLayout &&
      (summaryParts.length ||
      license.activationLabel ||
      license.platformLabels.length ||
      license.regionLabel) ? (
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

      {planLayout || softwareLayout ? null : (
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
      )}

      {planLayout ? (
        <div className={`mt-5 rounded-2xl border border-border bg-surface px-4 py-4 sm:px-5 ${ELEVATION_HAIRLINE}`}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className={CARD_TITLE_CLASS}>{planDisplayName(variant.name)}</p>
              <p className={`mt-1 ${INLINE_PRICE_CLASS} !text-navy`}>
                {formatVnd(variant.priceVnd * qty)}
                {termMonths(variant.licenseTerm) === 1
                  ? priceCycleSuffix(variant.licenseTerm)
                  : ""}
              </p>
              {termMonths(variant.licenseTerm) > 1 ? (
                <p className={`mt-1 ${CARD_META_CLASS}`}>
                  Thanh toán một lần cho {cloudTermLabel(variant.licenseTerm)}. Tương đương{" "}
                  {formatVnd(Math.round((variant.priceVnd * qty) / termMonths(variant.licenseTerm)))}
                  /tháng.
                </p>
              ) : null}
              <p className={`mt-1 ${CARD_META_CLASS}`}>Đã bao gồm VAT.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={CARD_META_CLASS}>Số lượng</span>
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
            </div>
          </div>
          {(() => {
            const group = planGroups(data.variants).find((item) =>
              item.items.some((choice) => choice.id === variant.id),
            );
            const choices = (group?.items ?? [])
              .slice()
              .sort(
                (a, b) =>
                  termMonths(a.licenseTerm) - termMonths(b.licenseTerm),
              );
            if (choices.length < 2 || !group) return null;
            const monthlyPrice = group.monthly.priceVnd;
            return (
              <div className="mt-4">
                <p className={CARD_META_CLASS}>Thời hạn</p>
                <div
                  className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4"
                  role="group"
                  aria-label="Thời hạn"
                >
                  {choices.map((choice) => {
                    const active = choice.id === variant.id;
                    const months = termMonths(choice.licenseTerm);
                    const perMonth = Math.round(choice.priceVnd / months / 1000) * 1000;
                    const save = (monthlyPrice * months - choice.priceVnd) * qty;
                    const base = monthlyPrice * months * qty;
                    const savePct = base > 0 && save > 0 ? Math.round((save / base) * 100) : 0;
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onSelectVariant(choice.id)}
                        className={`rounded-xl border-2 px-3 py-3 text-left ${TRANSITION_UI} ${
                          active
                            ? "border-accent bg-accent-soft"
                            : "border-border bg-white hover:border-accent/50"
                        }`}
                      >
                        <span className={`block ${CARD_META_CLASS} ${active ? "text-accent" : ""}`}>
                          {cloudTermLabel(choice.licenseTerm)}
                        </span>
                        <span className={`mt-1 block font-semibold text-navy ${BODY_CLASS}`}>
                          {formatVnd(perMonth)}
                          <span className={`font-medium ${CARD_META_CLASS}`}>/tháng</span>
                        </span>
                        <span className={`mt-1 block ${CARD_META_CLASS}`}>
                          Tổng {formatVnd(choice.priceVnd * qty)}
                        </span>
                        <span className={`mt-0.5 block min-h-4 font-semibold text-emerald-700 ${CARD_META_CLASS}`}>
                          {save > 0 ? `Tiết kiệm ${formatVnd(save)} · ${savePct}%` : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}
          {packageHighlights(variant.planSpecs).cards.length ? (
            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {packageHighlights(variant.planSpecs).cards.map((card) => (
                <div key={card.id}>
                  <dt className={CARD_META_CLASS}>{card.title}</dt>
                  <dd className={`mt-0.5 font-semibold text-navy ${BODY_CLASS}`}>
                    {card.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          {!data.loggedIn ? (
            <label className="mt-4 block">
              <span className="sr-only">Email nhận tài khoản</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => onEmail(e.target.value)}
                placeholder="Email nhận tài khoản"
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
              {loading ? "Đang tạo đơn…" : infraBuyLabel(data.name)}
            </button>
          ) : (
            <div className="mt-4 rounded-xl bg-accent-soft p-4 text-sm text-accent">
              Gói này hiện cần báo giá. Dùng tư vấn cấu hình bên dưới.
            </div>
          )}
          <p className={`mt-2 text-center ${CARD_META_CLASS}`}>
            {planShortName(variant.name)} · {qty} máy · {cloudTermLabel(variant.licenseTerm)} ·{" "}
            {formatVnd(variant.priceVnd * qty)}
          </p>
          <p className={`mt-2 ${CARD_META_CLASS}`}>
            KEYON xử lý provisioning sau khi thanh toán được xác nhận.
          </p>
          <Link
            href={quoteHref}
            className={`mt-3 inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-white px-5 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
          >
            Tư vấn cấu hình
          </Link>
        </div>
      ) : softwareLayout ? (
        <SoftwareBuyBox
          data={data}
          variant={variant}
          qty={qty}
          onQty={onQty}
          onSelectVariant={onSelectVariant}
          email={email}
          onEmail={onEmail}
          loading={loading}
          error={error}
          onBuy={onBuy}
          compare={compare}
          disc={disc}
          quoteHref={quoteHref}
        />
      ) : (
      <>
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
        {planLayout ? null : (
        <p className={`sm:max-w-[16rem] ${CARD_META_CLASS}`}>
          Tối đa 5 sản phẩm cùng gói mỗi lần thanh toán.
        </p>
        )}
      </div>

      {planLayout ? null : (
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
      )}

      {!data.loggedIn ? (
        <label className="mt-4 block">
          <span className="sr-only">
            {planLayout ? "Email nhận tài khoản" : "Email nhận license"}
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => onEmail(e.target.value)}
            placeholder={
              planLayout
                ? "Email nhận tài khoản"
                : variant.receiveKind === "activation" && !variant.fulfillmentInstant
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
            <span>
              {loading
                ? "Đang tạo đơn…"
                : planLayout
                  ? infraBuyLabel(data.name)
                  : "Thanh toán ngay"}
            </span>
            {!loading && !planLayout ? (
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

      {planLayout ? (
        <p className={`mt-4 text-center ${CARD_META_CLASS} sm:text-left`}>
          Cần cấu hình riêng?
        </p>
      ) : null}
      <Link
        href={quoteHref}
        className={`mt-3 inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-white px-5 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
      >
        {planLayout ? "Tư vấn cấu hình" : PDP_QUOTE_LABEL}
      </Link>

      <p className={`mt-4 border-t border-border pt-4 text-center ${CARD_META_CLASS} sm:text-left`}>
        Thanh toán an toàn · Giao hàng kỹ thuật số · Hỗ trợ sau bán hàng
      </p>
      </>
      )}
    </div>
  );
}

function FeatureBar({
  features,
  instant,
  brandName,
  receiveLabel,
  profile,
  activationLabel,
}: {
  features: string[];
  instant: boolean;
  brandName: string;
  receiveLabel: string;
  profile: OfferingProfile;
  activationLabel?: string | null;
}) {
  const items = featureBarItems(
    features,
    instant,
    brandName,
    receiveLabel,
    profile,
    activationLabel,
  );

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-border/80 bg-surface ${
        profile === "SOFTWARE" ? "mt-6 md:mt-8" : "mt-10 md:mt-12"
      }`}
    >
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
                <CollapsibleDescription body={data.description} />
              ) : (
                <p className={`mt-4 ${BODY_MUTED_CLASS}`}>
                  {catalogDescriptionFallback(data.offeringProfile, data.name)}
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
                    title={systemSpecsTitle(data.offeringProfile)}
                    specs={data.systemSpecs}
                  />
                </div>
              </section>
            ) : null}

            <LicenseInfoBlock
              license={license}
              title={licenseFactsTitle(data.offeringProfile)}
            />
            {data.offeringProfile === "SOFTWARE" ? <LicenseWarningBlock /> : null}
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
                      <p className={CARD_TITLE_CLASS}>
                        {systemSpecsTitle(data.offeringProfile)}
                      </p>
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
            <LicenseInfoBlock
              license={license}
              title={licenseFactsTitle(data.offeringProfile)}
            />
            {data.offeringProfile === "SOFTWARE" ? <LicenseWarningBlock /> : null}
          </div>
        ) : null}

        {tab === "guide" ? (
          <div className="space-y-5">
            <h2 className={SUBSECTION_TITLE_CLASS}>
              {guidePdpHeading(data.offeringProfile)}
            </h2>
            {stripHtml(data.usageGuideHtml).trim() ? (
              <div className="mt-4">
                <StaticPageHtml
                  body={data.usageGuideHtml}
                  className="blog-prose pdp-prose max-w-none"
                />
              </div>
            ) : (
              <p className={BODY_MUTED_CLASS}>
                {guideEmptyCopy(data.offeringProfile)}
              </p>
            )}
            <p className={BODY_MUTED_CLASS}>
              Cần hỗ trợ kích hoạt?{" "}
              <Link href={quoteHref} className={LINK_ACCENT_CLASS}>
                Liên hệ KEYON
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

function CollapsibleDescription({
  body,
  contentId = "pdp-full-description",
  collapsedMaxPx = 280,
  expandLabel = "Xem thêm",
  hiddenUntilOpen = false,
}: {
  body: string;
  contentId?: string;
  collapsedMaxPx?: number;
  expandLabel?: string;
  hiddenUntilOpen?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [needsClamp, setNeedsClamp] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    function measure() {
      if (!contentRef.current) return;
      setNeedsClamp(contentRef.current.scrollHeight > collapsedMaxPx + 12);
    }
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [body, collapsedMaxPx]);

  const clamped = !hiddenUntilOpen && needsClamp && !expanded;
  const folded = hiddenUntilOpen && !expanded;
  const showToggle = hiddenUntilOpen ? Boolean(stripHtml(body).trim()) : needsClamp;

  return (
    <div className="mt-4">
      <div className="relative">
        <div
          ref={contentRef}
          id={contentId}
          className={folded ? "hidden" : clamped ? "overflow-hidden" : undefined}
          style={clamped ? { maxHeight: collapsedMaxPx } : undefined}
        >
          <StaticPageHtml
            body={body}
            className="blog-prose pdp-prose max-w-none"
          />
        </div>
        {clamped ? (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent"
            aria-hidden
          />
        ) : null}
      </div>
      {showToggle ? (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border-2 border-accent bg-accent-soft px-5 ${CTA_LABEL_CLASS} text-accent ${TRANSITION_UI} hover:bg-accent hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}
            aria-expanded={expanded}
            aria-controls={contentId}
          >
            {expanded ? "Thu gọn" : expandLabel}
            <span aria-hidden className="text-base leading-none">
              {expanded ? "↑" : "↓"}
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

function PackageStoryLead({
  productName,
  variant,
}: {
  productName: string;
  variant: PdpVariantOption;
}) {
  const name = planDisplayName(variant.name);
  const short = planShortName(variant.name);
  const audience = planAudience(variant);
  const phrase = audience.charAt(0).toLowerCase() + audience.slice(1);
  const cards = packageHighlights(variant.planSpecs).cards;
  const cpu = cards.find((card) => card.id === "cpu")?.value;
  const ram = cards
    .find((card) => card.id === "ram")
    ?.value.replace(/\s*ram$/i, "")
    .trim();
  const storage = cards.find((card) => card.id === "storage")?.value;
  const specs = [cpu, ram ? `${ram} RAM` : "", storage].filter(Boolean).join(", ");
  return (
    <div className="mt-4 max-w-3xl">
      <p className={`text-navy ${CARD_TITLE_CLASS}`}>{productName}</p>
      <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
        {name} phù hợp cho {phrase}.
      </p>
      {specs ? (
        <p className={`mt-2 ${BODY_MUTED_CLASS}`}>
          Với {specs}, gói {short} dành cho nhu cầu của cấu hình này.
        </p>
      ) : null}
    </div>
  );
}

function LicenseInfoBlock({
  license,
  title,
  hidePolicies = false,
}: {
  license: LicensePresentation;
  title: string;
  hidePolicies?: boolean;
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

  if (!facts.length && (hidePolicies || !policies.length)) return null;

  return (
    <div className="space-y-4">
      {facts.length ? (
        <div className="overflow-x-auto rounded-2xl border border-border/80 bg-surface p-4 sm:p-5">
          <h3 className={SUBSECTION_TITLE_CLASS}>{title}</h3>
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
      {policies.length && !hidePolicies ? (
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

function isLeadSystemSpec(label: string) {
  const text = label.toLowerCase();
  const lead =
    /hệ điều hành|operating system|(^|[\s(])os($|[\s)])|cpu|bộ xử lý|processor|ram|bộ nhớ|ổ đĩa|ổ cứng|storage|dung lượng|ssd|\bdisk\b|gpu|vga|card đồ họa/;
  const extra =
    /khuyến nghị|recommended|tối đa|maximum|độ phân giải|display|màn hình|firmware|tpm|\.net|internet|mạng|network|secure boot/;
  if (!lead.test(text)) return false;
  if (extra.test(text) && !/tối thiểu|minimum/.test(text)) return false;
  return true;
}

function partitionSpecRows(
  rows: { label: string; value: string }[],
  mode: "system" | "product",
) {
  if (mode === "product") {
    return { visible: rows.slice(0, 6), rest: rows.slice(6) };
  }
  const visible = rows.filter((row) => isLeadSystemSpec(row.label)).slice(0, 6);
  if (!visible.length) {
    return { visible: rows.slice(0, 4), rest: rows.slice(4) };
  }
  const shown = new Set(visible.map((row) => row.label));
  return {
    visible,
    rest: rows.filter((row) => !shown.has(row.label)),
  };
}

function SoftwareSpecsCard({
  title,
  specs,
  mode,
  moreLabel,
}: {
  title: string;
  specs: { label: string; value: string }[];
  mode: "system" | "product";
  moreLabel: string;
}) {
  const [open, setOpen] = useState(false);
  if (!specs.length) return null;
  const { visible, rest } = partitionSpecRows(specs, mode);
  const rows = open ? specs : visible;
  return (
    <div className="rounded-2xl border border-border/80 bg-surface p-4 sm:p-5">
      <p className={CARD_TITLE_CLASS}>{title}</p>
      <dl className="mt-3 space-y-0">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex items-baseline justify-between gap-3 border-b border-border/70 py-2.5 ${BODY_CLASS} last:border-b-0`}
          >
            <dt className="shrink-0 text-muted-soft">{row.label}</dt>
            <dd className="min-w-0 break-words text-right font-semibold text-navy">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      {rest.length ? (
        <button
          type="button"
          className={`mt-3 ${TAB_CLASS} text-accent`}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Thu gọn" : moreLabel}
        </button>
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

function InfraGuide({ body }: { body: string }) {
  const steps = guideSteps(body);
  if (steps.length < 3) {
    return (
      <div className="mt-4">
        <StaticPageHtml body={body} className="blog-prose pdp-prose max-w-none" />
      </div>
    );
  }
  return (
    <ol className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className={`rounded-2xl border border-border bg-white px-4 py-4 ${ELEVATION_HAIRLINE}`}
        >
          <p className={`${OVERLINE_CLASS} text-accent`}>
            {String(index + 1).padStart(2, "0")}
          </p>
          <p className={`mt-2 text-navy ${CARD_TITLE_CLASS}`}>{step.title}</p>
          {step.body ? (
            <p className={`mt-1 ${CARD_META_CLASS}`}>{step.body}</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function InfraProductStory({
  data,
  variant,
}: {
  data: PdpProductData;
  variant: PdpVariantOption;
}) {
  const [thumb, setThumb] = useState(0);
  const rows = selectedPackageRows(variant);
  const quoteHref = `${QUOTE_HREF}?product=${encodeURIComponent(data.slug)}&variant=${encodeURIComponent(variant.id)}`;
  const guideHelp =
    data.offeringProfile === "INFRASTRUCTURE"
      ? "Cần hỗ trợ triển khai?"
      : "Cần hỗ trợ kích hoạt?";

  return (
    <div className="mt-10 space-y-10 md:mt-12 md:space-y-12">
      {rows.length ? (
        <section>
          <h2 className={SUBSECTION_TITLE_CLASS}>
            Cấu hình {planDisplayName(variant.name)}
          </h2>
          <div className="mt-4">
            {(() => {
              const summary = packageHighlights(rows);
              const detail = summary.cards.length ? summary.rest : rows;
              return (
                <>
                  {summary.cards.length ? (
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                      {summary.cards.map((card) => (
                        <div
                          key={card.id}
                          className={`rounded-2xl border border-border bg-white px-4 py-4 ${ELEVATION_HAIRLINE}`}
                        >
                          <p className={`${OVERLINE_CLASS} text-muted-soft`}>
                            {card.title}
                          </p>
                          {(() => {
                            const lines = metricPresentation(card);
                            return (
                              <>
                                <p className={`mt-2 ${SUMMARY_TOTAL_CLASS} !text-navy`}>
                                  {lines.primary}
                                </p>
                                {lines.secondary ? (
                                  <p className={`mt-0.5 ${CARD_META_CLASS}`}>{lines.secondary}</p>
                                ) : (
                                  <p className="mt-0.5 min-h-4" aria-hidden />
                                )}
                              </>
                            );
                          })()}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {detail.length ? (
                    <div className={summary.cards.length ? "mt-4" : ""}>
                      <h3 className={CARD_TITLE_CLASS}>Thông tin dịch vụ</h3>
                    <dl
                      className="mt-3 overflow-x-auto rounded-2xl border border-border/80 bg-surface px-4 sm:px-5"
                    >
                      {detail.map((row) => (
                        <div
                          key={`${row.label}-${row.value}`}
                          className={`flex items-baseline justify-between gap-3 border-b border-border/70 py-2.5 last:border-b-0 ${BODY_CLASS}`}
                        >
                          {isBareSpec(row) ? (
                            <dd className="font-semibold text-navy">{row.label}</dd>
                          ) : (
                            <>
                              <dt className="shrink-0 text-muted-soft">{row.label}</dt>
                              <dd className="min-w-0 text-right font-semibold text-navy">
                                {row.value}
                              </dd>
                            </>
                          )}
                        </div>
                      ))}
                    </dl>
                    </div>
                  ) : null}
                </>
              );
            })()}
          </div>
        </section>
      ) : null}

      {data.features.length ? (
        <section>
          <h2 className={SUBSECTION_TITLE_CLASS}>
            Bạn nhận được gì với {planDisplayName(variant.name)}?
          </h2>
          <p className={`mt-2 ${CARD_META_CLASS}`}>
            Áp dụng cho mọi cấu hình của sản phẩm này.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {benefitItems(data.features).map((item) => (
              <li
                key={item.title}
                className={`rounded-2xl border border-border bg-white px-4 py-4 ${ELEVATION_HAIRLINE}`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckIcon small />
                  </span>
                  <div className="min-w-0">
                    <p className={`text-navy ${CARD_TITLE_CLASS}`}>{item.title}</p>
                    {item.desc ? (
                      <p className={`mt-1 ${CARD_META_CLASS}`}>{item.desc}</p>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {stripHtml(data.description).trim() ? (
        <section>
          <h2 className={SUBSECTION_TITLE_CLASS}>Mô tả sản phẩm</h2>
          <PackageStoryLead productName={data.name} variant={variant} />
          <CollapsibleDescription
            body={data.description}
            collapsedMaxPx={160}
            expandLabel="Xem chi tiết"
            hiddenUntilOpen
          />
        </section>
      ) : null}

      {data.galleryUrls.length ? (
        <section>
          <h2 className={`mb-4 ${SUBSECTION_TITLE_CLASS}`}>
            Hình ảnh {data.name}
          </h2>
          <Gallery
            data={data}
            variant={variant}
            thumb={thumb}
            onThumb={setThumb}
            frame="wide"
          />
        </section>
      ) : null}

      <section>
        <h2 className={SUBSECTION_TITLE_CLASS}>
          Quy trình triển khai {data.name}
        </h2>
        <p className={`mt-2 ${CARD_META_CLASS}`}>
          Từ lúc đặt hàng đến khi nhận thông tin truy cập.
        </p>
        {stripHtml(data.usageGuideHtml).trim() ? (
          <InfraGuide body={data.usageGuideHtml} />
        ) : (
          <p className={`mt-4 ${BODY_MUTED_CLASS}`}>
            {guideEmptyCopy(data.offeringProfile)}
          </p>
        )}
        <p className={`mt-3 ${BODY_MUTED_CLASS}`}>
          {guideHelp}{" "}
          <Link href={quoteHref} className={LINK_ACCENT_CLASS}>
            Liên hệ KEYON
          </Link>
          .
        </p>
      </section>

      {data.faqs.length ? (
        <section>
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
        </section>
      ) : null}
    </div>
  );
}

function licenseChoiceTitle(variant: PdpVariantOption, choice: LicensePresentation) {
  const bits = [choice.channelLabel, choice.termLabel].filter(Boolean);
  return bits.join(" — ") || variant.name;
}

function licensePriceSuffix(code: string | null | undefined) {
  if (code === "1_MONTH") return "/tháng";
  if (code === "3_MONTHS") return "/3 tháng";
  if (code === "6_MONTHS") return "/6 tháng";
  if (code === "1_YEAR") return "/năm";
  if (code === "2_YEARS") return "/2 năm";
  if (code === "3_YEARS") return "/3 năm";
  return "";
}

function SoftwareBuyBox({
  data,
  variant,
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
  quoteHref,
}: {
  data: PdpProductData;
  variant: PdpVariantOption;
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
  quoteHref: string;
}) {
  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-end gap-3">
        <p className={PDP_PRICE_CLASS}>{formatVnd(variant.priceVnd * qty)}</p>
        {compare && compare > variant.priceVnd ? (
          <p className={`pb-1 ${COMPARE_PRICE_CLASS}`}>{formatVnd(compare * qty)}</p>
        ) : null}
        {disc ? (
          <span className={`mb-1 inline-flex rounded-md bg-emerald-50 px-2 py-0.5 ${BADGE_CLASS} text-emerald-700`}>
            Tiết kiệm {disc}%
          </span>
        ) : null}
      </div>
      <p className={`mt-1 ${CARD_META_CLASS}`}>Đã bao gồm VAT</p>

      <div className="mt-4">
        <p className={`${OVERLINE_CLASS} text-muted-soft`}>Chọn gói license</p>
        <div className={`mt-2 grid gap-2 ${data.variants.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {data.variants.map((choice) => {
            const active = choice.id === variant.id;
            const presented = resolveLicensePresentation({
              product: data.licenseDefaults,
              variant: choice,
            });
            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => onSelectVariant(choice.id)}
                className={`rounded-xl border-2 bg-white px-3.5 py-3 text-left ${TRANSITION_UI} ${
                  active ? "border-accent" : "border-border hover:border-accent/50"
                }`}
              >
                <p className={`${CARD_TITLE_CLASS} ${active ? "text-accent" : "text-navy"}`}>
                  {active ? "✓ " : ""}
                  {licenseChoiceTitle(choice, presented)}
                </p>
                <p className={`mt-1 ${INLINE_PRICE_CLASS} !text-navy`}>
                  {formatVnd(choice.priceVnd)}
                  {licensePriceSuffix(presented.term)}
                </p>
                {presented.seats ? (
                  <p className={`mt-1 ${CARD_META_CLASS}`}>{presented.seats}</p>
                ) : null}
                {presented.activationLabel ? (
                  <p className={`mt-1 ${CARD_META_CLASS}`}>{presented.activationLabel}</p>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className={CARD_META_CLASS}>Số lượng</span>
        <div className="inline-flex h-9 items-center overflow-hidden rounded-lg border border-border bg-white">
          <button
            type="button"
            className="flex h-full w-8 items-center justify-center text-navy transition hover:bg-surface disabled:opacity-40"
            disabled={qty <= 1}
            onClick={() => onQty(Math.max(1, qty - 1))}
            aria-label="Giảm số lượng"
          >
            −
          </button>
          <span className={`min-w-8 text-center ${FIELD_VALUE_NUM_CLASS}`}>{qty}</span>
          <button
            type="button"
            className="flex h-full w-8 items-center justify-center text-navy transition hover:bg-surface disabled:opacity-40"
            disabled={qty >= 5}
            onClick={() => onQty(Math.min(5, qty + 1))}
            aria-label="Tăng số lượng"
          >
            +
          </button>
        </div>
      </div>

      {!data.loggedIn ? (
        <label className="mt-3 block">
          <span className="sr-only">Email nhận license</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => onEmail(e.target.value)}
            placeholder="Email nhận license"
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
          className={`mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER} disabled:opacity-50`}
        >
          <BoltIcon />
          {loading ? "Đang tạo đơn…" : "Thanh toán ngay"}
        </button>
      ) : (
        <div className="mt-4 rounded-xl bg-accent-soft p-4 text-sm text-accent">
          Gói này hiện cần báo giá. Dùng tư vấn license bên dưới.
        </div>
      )}
      <Link
        href={quoteHref}
        className={`mt-3 inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-white px-5 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
      >
        {PDP_QUOTE_LABEL}
      </Link>
      <p className={`mt-4 text-center ${CARD_META_CLASS}`}>
        Thanh toán an toàn · Hỗ trợ kích hoạt
      </p>
    </div>
  );
}

function specGroup(label: string): "system" | "platform" | "license" | "product" {
  const text = label.toLowerCase();
  if (/cloud storage|onedrive/.test(text)) return "product";
  if (
    /cpu|ram|gpu|vga|ổ|storage|dung lượng|màn hình|display|độ phân giải|\.net|card đồ họa|đĩa|firmware|tpm|secure boot|internet|\bmạng\b|network/.test(
      text,
    )
  ) {
    return "system";
  }
  if (/hệ điều hành|kiến trúc|nền tảng|ngôn ngữ|\bbit\b/.test(text)) return "platform";
  if (/bản quyền|thời hạn|thiết bị|kích hoạt|người dùng|khu vực|license|seat/.test(text)) {
    return "license";
  }
  return "product";
}

function sellingFeatures(features: string[]) {
  const items = benefitItems(features);
  const product = items.filter(
    (item) =>
      !/subscription|thuê bao|thời hạn|vĩnh viễn|desktop|web|mobile|nền tảng|người dùng|license|kích hoạt|\bvat\b/i.test(
        item.title,
      ),
  );
  return (product.length ? product : items).slice(0, 6);
}

function purchaseFaqFirst(faqs: PdpProductData["faqs"]) {
  function rank(question: string) {
    const text = question.toLowerCase();
    if (/nhận (license|key|bản quyền)|sau khi (mua|thanh toán)/.test(text)) return 0;
    if (/tài khoản|kích hoạt/.test(text)) return 1;
    if (/hỗ trợ/.test(text) && /cài|kích hoạt/.test(text)) return 2;
    return 3;
  }
  return [...faqs].sort((a, b) => rank(a.question) - rank(b.question));
}

function softwareReceiveSteps(
  variant: PdpVariantOption,
  license: LicensePresentation,
  productName: string,
) {
  return [
    { title: "Đặt hàng", body: "Thanh toán đơn trên KEYON." },
    {
      title: "KEYON xử lý",
      body: variant.fulfillmentInstant
        ? "License được chuẩn bị sau khi thanh toán thành công."
        : "KEYON kiểm tra và chuẩn bị license.",
    },
    { title: "Nhận thông tin", body: "Thông tin license nằm trong email và mục Tài sản." },
    {
      title: "Kích hoạt",
      body: license.activationLabel
        ? `Kích hoạt theo hình thức ${license.activationLabel}.`
        : "Làm theo hướng dẫn kèm license.",
    },
    { title: "Bắt đầu sử dụng", body: `Cài đặt và bắt đầu dùng ${productName}.` },
  ];
}

function SoftwareProductStory({
  data,
  variant,
  license,
}: {
  data: PdpProductData;
  variant: PdpVariantOption;
  license: LicensePresentation;
}) {
  const productRows = data.specs.filter((row) => {
    const group = specGroup(row.label);
    return group === "product" || group === "platform";
  });
  const hardwareRows = data.specs.filter((row) => specGroup(row.label) === "system");
  const seen = new Set(data.systemSpecs.map((row) => row.label.toLowerCase()));
  const systemRows = [
    ...data.systemSpecs,
    ...hardwareRows.filter((row) => !seen.has(row.label.toLowerCase())),
  ];
  const osIndex = systemRows.findIndex((row) => /hệ điều hành|operating system/i.test(row.label));
  if (osIndex > 0) {
    const [os] = systemRows.splice(osIndex, 1);
    if (os) systemRows.unshift(os);
  } else if (osIndex < 0) {
    const osFromProduct = productRows.findIndex((row) =>
      /hệ điều hành|operating system/i.test(row.label),
    );
    if (osFromProduct >= 0) {
      const [os] = productRows.splice(osFromProduct, 1);
      if (os) systemRows.unshift(os);
    } else if (license.platformLabels.length) {
      systemRows.unshift({
        label: "Hệ điều hành",
        value: license.platformLabels.join(", "),
      });
    }
  }
  const featureCards = sellingFeatures(data.features);
  const faqs = purchaseFaqFirst(data.faqs);
  const hasLicense = Boolean(
    license.channelLabel ||
      license.termLabel ||
      license.seats ||
      license.activationLabel ||
      license.regionLabel ||
      license.platformLabels.length ||
      license.languageLabel ||
      license.accountRequired ||
      license.transferPolicy ||
      license.upgradePolicy,
  );
  const anchors = [
    { id: "tong-quan", label: "Tổng quan", show: Boolean(stripHtml(data.description).trim()) },
    { id: "tinh-nang", label: "Tính năng", show: featureCards.length > 0 },
    { id: "license", label: "Bản quyền", show: hasLicense },
    { id: "thong-so", label: "Thông số", show: productRows.length > 0 || systemRows.length > 0 },
    { id: "kich-hoat", label: "Kích hoạt", show: true },
    { id: "faq", label: "FAQ", show: data.faqs.length > 0 },
  ].filter((item) => item.show);

  return (
    <div className="mt-10 md:mt-12">
      {anchors.length > 1 ? (
        <nav
          className={`sticky top-16 ${Z_STICKY} -mx-1 flex gap-1 overflow-x-auto border-b border-border bg-white/95 py-1 backdrop-blur`}
          aria-label="Mục trang sản phẩm"
        >
          {anchors.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`shrink-0 rounded-lg px-3 py-2 ${TAB_CLASS} hover:text-accent`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}

      <div className="mt-8 space-y-10 md:space-y-12">
        {stripHtml(data.description).trim() ? (
          <section id="tong-quan" className="scroll-mt-32">
            <h2 className={SUBSECTION_TITLE_CLASS}>Tổng quan sản phẩm</h2>
            <CollapsibleDescription
              body={data.description}
              collapsedMaxPx={160}
              expandLabel="Xem thêm nội dung"
            />
          </section>
        ) : null}

        {featureCards.length ? (
          <section id="tinh-nang" className="scroll-mt-32">
            <h2 className={SUBSECTION_TITLE_CLASS}>Vì sao chọn {data.name}?</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featureCards.map((item) => (
                <li
                  key={item.title}
                  className={`rounded-2xl border border-border bg-white px-4 py-4 ${ELEVATION_HAIRLINE}`}
                >
                  <p className={`line-clamp-2 text-navy ${CARD_TITLE_CLASS}`}>{item.title}</p>
                  {item.desc ? (
                    <p className={`mt-1 line-clamp-2 ${CARD_META_CLASS}`}>{item.desc}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {hasLicense ? (
          <section id="license" className="scroll-mt-32">
            <LicenseInfoBlock license={license} title="Thông tin bản quyền" hidePolicies />
          </section>
        ) : null}

        {productRows.length || systemRows.length ? (
          <section id="thong-so" className="scroll-mt-32 space-y-4">
            <h2 className={SUBSECTION_TITLE_CLASS}>Thông số</h2>
            {productRows.length ? (
              <SoftwareSpecsCard
                title="Thông tin sản phẩm"
                specs={productRows}
                mode="product"
                moreLabel="Xem thêm thông tin"
              />
            ) : null}
            {systemRows.length ? (
              <SoftwareSpecsCard
                title="Yêu cầu hệ thống"
                specs={systemRows}
                mode="system"
                moreLabel="Xem thêm yêu cầu"
              />
            ) : null}
          </section>
        ) : null}

        <section id="kich-hoat" className="scroll-mt-32">
          <h2 className={SUBSECTION_TITLE_CLASS}>Nhận và kích hoạt license</h2>
          <ol className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {softwareReceiveSteps(variant, license, data.name).map((step, index) => (
              <li
                key={step.title}
                className={`rounded-2xl border border-border bg-white px-4 py-4 ${ELEVATION_HAIRLINE}`}
              >
                <p className={`${OVERLINE_CLASS} text-accent`}>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className={`mt-2 text-navy ${CARD_TITLE_CLASS}`}>{step.title}</p>
                {step.body ? <p className={`mt-1 ${CARD_META_CLASS}`}>{step.body}</p> : null}
              </li>
            ))}
          </ol>
          {stripHtml(data.usageGuideHtml).trim() ? (
            <CollapsibleDescription
              body={data.usageGuideHtml}
              contentId="pdp-activation-guide"
              collapsedMaxPx={160}
              expandLabel="Xem hướng dẫn kích hoạt"
              hiddenUntilOpen
            />
          ) : null}
        </section>

        {faqs.length ? (
          <section id="faq" className="scroll-mt-32">
            <h2 className={`mb-4 ${SUBSECTION_TITLE_CLASS}`}>Câu hỏi thường gặp</h2>
            <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
              <FaqAccordion items={faqs.slice(0, Math.ceil(faqs.length / 2))} />
              <FaqAccordion items={faqs.slice(Math.ceil(faqs.length / 2))} />
            </div>
          </section>
        ) : null}

        <LicenseNotes license={license} />
      </div>
    </div>
  );
}

function LicenseNotes({ license }: { license: LicensePresentation }) {
  const [open, setOpen] = useState(false);
  const policies = [
    license.accountRequired ? { label: "Tài khoản", value: license.accountRequired } : null,
    license.transferPolicy ? { label: "Chuyển nhượng", value: license.transferPolicy } : null,
    license.upgradePolicy ? { label: "Nâng cấp", value: license.upgradePolicy } : null,
  ].filter((row): row is { label: string; value: string } => Boolean(row));

  return (
    <section className="rounded-2xl border border-border bg-white">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={CARD_TITLE_CLASS}>Điều kiện và lưu ý bản quyền</span>
        <span aria-hidden className="text-muted">
          {open ? "▴" : "▾"}
        </span>
      </button>
      {open ? (
        <div className="border-t border-border px-4 py-4">
          {policies.length ? (
            <dl className="space-y-0">
              {policies.map((row) => (
                <div
                  key={row.label}
                  className={`grid gap-1 border-b border-border/60 py-3 last:border-b-0 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-4 ${BODY_CLASS}`}
                >
                  <dt className="text-muted-soft">{row.label}</dt>
                  <dd className="min-w-0 whitespace-pre-line font-medium text-navy">{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <p className={`flex items-start gap-2 ${policies.length ? "mt-3" : ""} ${BODY_CLASS}`}>
            <InfoIcon />
            <span>{LICENSE_WARNING_COPY}</span>
          </p>
        </div>
      ) : null}
    </section>
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
  planLayout,
  softwareLayout,
  onQty,
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
  planLayout?: boolean;
  softwareLayout?: boolean;
  onQty?: (n: number) => void;
}) {
  if (!canBuy) return null;
  const highlights = packageHighlights(variant.planSpecs).cards;
  const summary = planLayout
    ? (highlights.length
        ? highlights.slice(0, 3).map((card) => card.value)
        : variant.planSpecs
            .slice(0, 3)
            .map((row) => specFact(row))
            .filter((value) => value && value !== "—")
      ).join(" · ")
    : licenseSummaryParts(license).join(" · ");
  const thumbSrc = data.imageUrl || data.galleryUrls[0] || null;
  const thumbAlt = `${data.name}${variant.name ? ` — ${variant.name}` : ""}`;
  const term = planLayout ? cloudTermLabel(variant.licenseTerm) : null;

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
              />
            ) : (
              <div className="flex h-full items-center justify-center p-1">
                <ProductHeroArt data={data} tone={0} compact />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className={`truncate ${CARD_TITLE_CLASS}`}>
              {planLayout ? planDisplayName(variant.name) : data.name}
            </p>
            <p className={`mt-0.5 truncate ${CARD_META_CLASS}`}>
              {summary || variant.name || `Số lượng: ${qty}`}
            </p>
            {planLayout && term ? (
              <p className={`truncate ${CARD_META_CLASS}`}>
                {qty} máy · {term}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-4">
          <div className="text-left sm:text-right">
            <p className={CARD_PRICE_CLASS}>
              {formatVnd(variant.priceVnd * qty)}
              {planLayout && termMonths(variant.licenseTerm) === 1 && qty === 1
                ? priceCycleSuffix(variant.licenseTerm)
                : ""}
            </p>
            {planLayout && term ? (
              <p className={`sm:hidden ${CARD_META_CLASS}`}>
                {qty} máy · {term}
              </p>
            ) : null}
            <div className="mt-0.5 flex items-center gap-2 sm:justify-end">
              {softwareLayout ? (
                <span className={CARD_META_CLASS}>Đã gồm VAT</span>
              ) : null}
              {compare && compare > variant.priceVnd ? (
                <span className={COMPARE_PRICE_CLASS}>
                  {formatVnd(compare * qty)}
                </span>
              ) : null}
              {disc ? (
                <span className={`${BADGE_CLASS} text-emerald-700`}>
                  {planLayout ? `Tiết kiệm ${disc}%` : `-${disc}%`}
                </span>
              ) : null}
            </div>
          </div>
          {softwareLayout && onQty ? (
            <div className="inline-flex h-10 items-center overflow-hidden rounded-xl border border-border bg-white">
              <button
                type="button"
                className="flex h-full w-9 items-center justify-center text-navy disabled:opacity-40"
                disabled={qty <= 1}
                onClick={() => onQty(Math.max(1, qty - 1))}
                aria-label="Giảm số lượng"
              >
                −
              </button>
              <span className={`min-w-8 text-center ${FIELD_VALUE_NUM_CLASS}`}>{qty}</span>
              <button
                type="button"
                className="flex h-full w-9 items-center justify-center text-navy disabled:opacity-40"
                disabled={qty >= 5}
                onClick={() => onQty(Math.min(5, qty + 1))}
                aria-label="Tăng số lượng"
              >
                +
              </button>
            </div>
          ) : null}
          <button
            type="button"
            disabled={loading}
            onClick={onBuy}
            className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover disabled:opacity-50`}
          >
            <BoltIcon />
            {loading ? "Đang tạo đơn…" : planLayout ? infraBuyLabel(data.name) : "Thanh toán ngay"}
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
