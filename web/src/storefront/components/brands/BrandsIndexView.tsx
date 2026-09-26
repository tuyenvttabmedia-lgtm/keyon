"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Reveal } from "@/storefront/components/home/Reveal";
import {
  LANDING_HERO_PAD,
} from "@/storefront/components/marketing/hero-shell";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  INPUT_TEXT_CLASS,
  OVERLINE_CLASS,
  PAGE_LEAD_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  HOVER_LINK_ACCENT,
  MOTION_NORMAL,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";

export type BrandListItem = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  shortDescription: string | null;
  featured: boolean;
  productCount: number;
};

type Props = {
  brands: BrandListItem[];
};

export function BrandsIndexView({ brands }: Props) {
  const [query, setQuery] = useState("");
  const featured = useMemo(
    () => brands.filter((b) => b.featured),
    [brands],
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.shortDescription?.toLowerCase().includes(q) ?? false),
    );
  }, [brands, query]);

  return (
    <div className="bg-white">
      <section className="relative overflow-x-clip border-b border-border bg-[#F7FAFC]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_18%,rgba(14,165,164,0.09),transparent_42%),radial-gradient(ellipse_at_8%_88%,rgba(14,165,233,0.05),transparent_48%)]"
          aria-hidden
        />
        <div className={`home-container relative ${LANDING_HERO_PAD}`}>
          <nav
            className={`mb-5 flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}
            aria-label="Breadcrumb"
          >
            <Link href="/" className={HOVER_LINK_ACCENT}>
              Trang chủ
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <span className={BREADCRUMB_CURRENT_CLASS}>Thương hiệu</span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
            <div className="min-w-0 max-w-[560px]">
              <p className={`${OVERLINE_CLASS} tracking-[0.18em] text-accent`}>
                Thương hiệu
              </p>
              <h1 className={`mt-3 ${PAGE_TITLE_CLASS}`}>
                Bản quyền chính hãng từ các thương hiệu bạn tin dùng
              </h1>
              <p className={`mt-4 ${PAGE_LEAD_CLASS}`}>
                Chọn thương hiệu để xem sản phẩm đang bán trên KEYON — giao
                nhanh, quản lý license trong Tài khoản.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/products"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Xem cửa hàng →
                </Link>
                <Link
                  href="/contact/quote?intent=business"
                  className={`inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  Báo giá doanh nghiệp
                </Link>
              </div>
            </div>

            <BrandsHeroArt
              logos={brands
                .filter((b) => b.logoUrl)
                .slice(0, 6)
                .map((b) => ({ name: b.name, logoUrl: b.logoUrl! }))}
              count={brands.length}
            />
          </div>
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="border-b border-border bg-white py-8 md:py-10">
          <div className="home-container">
            <header className="mb-5">
              <h2 className={SECTION_TITLE_CLASS}>Nổi bật</h2>
              <p className={`mt-1.5 ${SECTION_LEAD_CLASS}`}>
                Thương hiệu được ưu tiên trên KEYON
              </p>
            </header>
            <Reveal
              stagger
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {featured.map((b) => (
                <BrandCard key={b.id} brand={b} />
              ))}
            </Reveal>
          </div>
        </section>
      ) : null}

      <section className="bg-white py-8 md:py-10 lg:py-12">
        <div className="home-container">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className={SECTION_TITLE_CLASS}>Tất cả thương hiệu</h2>
              <p className={`mt-1.5 ${SECTION_LEAD_CLASS}`}>
                {filtered.length === brands.length
                  ? `${brands.length} thương hiệu đang bán`
                  : `${filtered.length} / ${brands.length} thương hiệu`}
              </p>
            </div>
            <label className="relative block w-full sm:max-w-[280px]">
              <span className="sr-only">Tìm thương hiệu</span>
              <span
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft"
                aria-hidden
              >
                <SearchIcon />
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm thương hiệu…"
                className={`h-11 w-full rounded-xl border border-border bg-white pl-10 pr-3 ${INPUT_TEXT_CLASS} text-navy outline-none ${TRANSITION_UI} placeholder:text-muted-soft focus:border-accent`}
                autoComplete="off"
              />
            </label>
          </div>

          {brands.length === 0 ? (
            <EmptyState
              title="Chưa có thương hiệu"
              body="Catalog thương hiệu sẽ xuất hiện tại đây khi được kích hoạt."
              href="/products"
              cta="Xem cửa hàng"
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="Không tìm thấy thương hiệu"
              body={`Không có kết quả cho “${query.trim()}”. Thử từ khóa khác hoặc xem toàn bộ catalog.`}
              href="/products"
              cta="Xem cửa hàng"
              onClear={() => setQuery("")}
            />
          ) : (
            <Reveal
              stagger
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filtered.map((b) => (
                <BrandCard key={b.id} brand={b} />
              ))}
            </Reveal>
          )}
        </div>
      </section>

      <section className="pb-8 pt-2 md:pb-10 md:pt-3">
        <div className="home-container">
          <div className="flex flex-col items-stretch gap-4 rounded-2xl bg-footer px-5 py-6 text-white sm:px-6 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <h3 className={`${SECTION_TITLE_CLASS} !text-white`}>
                Cần license theo gói doanh nghiệp?
              </h3>
              <p
                className={`mt-2 max-w-xl ${SECTION_LEAD_CLASS} !text-slate-300`}
              >
                Gửi yêu cầu báo giá — đội KEYON hỗ trợ volume, subscription và
                gia hạn.
              </p>
            </div>
            <Link
              href="/contact/quote?intent=business"
              className={`inline-flex h-12 w-full shrink-0 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover md:w-auto`}
            >
              Yêu cầu báo giá
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function BrandCard({ brand }: { brand: BrandListItem }) {
  const countLabel =
    brand.productCount === 0
      ? "Đang cập nhật"
      : brand.productCount === 1
        ? "1 sản phẩm"
        : `${brand.productCount} sản phẩm`;

  return (
    <Link
      href={`/brands/${brand.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`}
    >
      <div className="relative flex aspect-[5/3] shrink-0 items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        {brand.logoUrl ? (
          <Image
            src={brand.logoUrl}
            alt=""
            width={140}
            height={64}
            className="h-12 w-auto max-w-[70%] object-contain md:h-14"
          />
        ) : (
          <BrandInitial name={brand.name} />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`line-clamp-2 ${CARD_TITLE_CLASS}`}>{brand.name}</h3>
          {brand.featured ? (
            <span
              className={`shrink-0 rounded-full bg-accent-soft px-2 py-0.5 ${BADGE_CLASS} text-accent`}
            >
              Nổi bật
            </span>
          ) : null}
        </div>
        <p className={`mt-1 ${CARD_META_CLASS}`}>{countLabel}</p>
        {brand.shortDescription ? (
          <p className={`mt-2 line-clamp-2 ${BODY_MUTED_CLASS}`}>
            {brand.shortDescription}
          </p>
        ) : null}
        <span
          className={`mt-auto inline-flex items-center gap-1 pt-3 ${CTA_COMPACT_CLASS} text-accent ${MOTION_NORMAL} transition-colors group-hover:text-accent-hover`}
        >
          Xem sản phẩm
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

function BrandInitial({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span
      className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-soft text-lg font-bold text-navy"
      aria-hidden
    >
      {initials || "?"}
    </span>
  );
}

function BrandsHeroArt({
  logos,
  count,
}: {
  logos: { name: string; logoUrl: string }[];
  count: number;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[420px] lg:mx-0 lg:max-w-none">
      <div
        className={`rounded-2xl border border-border/80 bg-white p-4 sm:p-5 ${ELEVATION_HAIRLINE}`}
      >
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {(logos.length
            ? logos
            : Array.from({ length: 6 }, (_, i) => ({
                name: `Brand ${i + 1}`,
                logoUrl: "",
              }))
          ).map((item, i) => (
            <div
              key={`${item.name}-${i}`}
              className="flex aspect-[5/4] items-center justify-center rounded-xl border border-border/70 bg-slate-50/80 px-2"
            >
              {item.logoUrl ? (
                <Image
                  src={item.logoUrl}
                  alt={item.name}
                  width={96}
                  height={40}
                  className="h-7 w-auto max-w-full object-contain sm:h-8"
                />
              ) : (
                <span className="h-8 w-8 rounded-lg bg-navy-soft" aria-hidden />
              )}
            </div>
          ))}
        </div>
        <p className={`mt-4 text-center ${CARD_META_CLASS}`}>
          {count > 0
            ? `${count} thương hiệu trên KEYON`
            : "Catalog thương hiệu KEYON"}
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  body,
  href,
  cta,
  onClear,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
  onClear?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-[#F7FAFC] px-6 py-12 text-center">
      <p className={CARD_TITLE_CLASS}>{title}</p>
      <p className={`mx-auto mt-2 max-w-md ${BODY_MUTED_CLASS}`}>{body}</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            className={`inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-4 ${CTA_COMPACT_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
          >
            Xóa bộ lọc
          </button>
        ) : null}
        <Link
          href={href}
          className={`inline-flex h-10 items-center justify-center rounded-xl bg-accent px-4 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover`}
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
