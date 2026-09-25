import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/storefront/components/home/Reveal";
import { ProductCard } from "@/storefront/components/ProductCard";
import type { FeaturedProduct } from "@/storefront/content/types";
import {
  BODY_CLASS,
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  OVERLINE_CLASS,
  PAGE_LEAD_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LINK_ACCENT,
  TRANSITION_UI,
} from "@/storefront/effects";

export type BrandDetailProduct = FeaturedProduct;

export type BrandDetailData = {
  name: string;
  slug: string;
  logoUrl: string | null;
  shortDescription: string | null;
  description: string | null;
  featured: boolean;
  bannerDesktopUrl: string | null;
  bannerMobileUrl: string | null;
  products: BrandDetailProduct[];
};

export function BrandDetailView({ brand }: { brand: BrandDetailData }) {
  const hasBanner = Boolean(brand.bannerDesktopUrl || brand.bannerMobileUrl);
  const count = brand.products.length;
  const countLabel =
    count === 0
      ? "Đang cập nhật sản phẩm"
      : count === 1
        ? "1 sản phẩm đang bán"
        : `${count} sản phẩm đang bán`;

  return (
    <div className="bg-white">
      {hasBanner ? (
        <section className="relative overflow-hidden bg-navy">
          {brand.bannerDesktopUrl ? (
            <div className="relative hidden aspect-[21/7] w-full md:block">
              <Image
                src={brand.bannerDesktopUrl}
                alt=""
                fill
                className="object-cover"
                priority
                unoptimized
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/35 to-navy/10"
                aria-hidden
              />
            </div>
          ) : null}
          {brand.bannerMobileUrl || brand.bannerDesktopUrl ? (
            <div className="relative aspect-[16/10] w-full md:hidden">
              <Image
                src={
                  brand.bannerMobileUrl || brand.bannerDesktopUrl || ""
                }
                alt=""
                fill
                className="object-cover"
                priority
                unoptimized
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/40 to-transparent"
                aria-hidden
              />
            </div>
          ) : null}

          <div className="absolute inset-x-0 bottom-0">
            <div className="home-container pb-6 pt-16 md:pb-8 md:pt-20">
              <BrandIdentity
                brand={brand}
                countLabel={countLabel}
                onDark
              />
            </div>
          </div>
        </section>
      ) : (
        <section className="relative overflow-x-clip border-b border-border bg-[#F7FAFC]">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_86%_16%,rgba(14,165,164,0.09),transparent_42%),radial-gradient(ellipse_at_10%_90%,rgba(14,165,233,0.05),transparent_48%)]"
            aria-hidden
          />
          <div className="home-container relative py-8 md:py-10">
            <BrandIdentity brand={brand} countLabel={countLabel} />
          </div>
        </section>
      )}

      {brand.description ? (
        <section className="border-b border-border bg-white py-8 md:py-10">
          <div className="home-container">
            <div className="mx-auto max-w-3xl">
              <h2 className={SECTION_TITLE_CLASS}>Giới thiệu</h2>
              <div
                className={`mt-4 whitespace-pre-wrap ${BODY_CLASS} leading-relaxed text-navy/90`}
              >
                {brand.description}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section
        id="san-pham"
        className="scroll-mt-24 bg-white py-8 md:py-10 lg:py-12"
      >
        <div className="home-container">
          <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className={SECTION_TITLE_CLASS}>Sản phẩm {brand.name}</h2>
              <p className={`mt-1.5 ${SECTION_LEAD_CLASS}`}>{countLabel}</p>
            </div>
            <Link
              href="/products"
              className={`inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-4 ${CTA_COMPACT_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
            >
              Xem toàn bộ cửa hàng
            </Link>
          </header>

          {count === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-[#F7FAFC] px-6 py-12 text-center">
              <p className={CARD_TITLE_CLASS}>
                Chưa có sản phẩm đang bán
              </p>
              <p className={`mx-auto mt-2 max-w-md ${BODY_MUTED_CLASS}`}>
                Sản phẩm của {brand.name} sẽ xuất hiện tại đây khi được mở bán
                trên KEYON.
              </p>
              <Link
                href="/brands"
                className={`mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-accent px-4 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover`}
              >
                Xem thương hiệu khác
              </Link>
            </div>
          ) : (
            <>
              <div className="-mx-4 px-4 lg:hidden">
                <div className="home-snap-x gap-2.5 pb-1">
                  {brand.products.map((item, i) => (
                    <div
                      key={item.id}
                      className="w-[calc(50vw-1.35rem)] max-w-[200px] md:w-[calc(38vw-1rem)] md:max-w-[210px]"
                    >
                      <ProductCard
                        item={item}
                        compact
                        priority={i < 2}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <Reveal
                stagger
                className="hidden lg:grid lg:grid-cols-4 lg:gap-3.5 xl:grid-cols-5"
              >
                {brand.products.map((item, i) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    priority={i < 2}
                  />
                ))}
              </Reveal>
            </>
          )}
        </div>
      </section>

      <section className="pb-8 pt-2 md:pb-10 md:pt-3">
        <div className="home-container">
          <div className="flex flex-col items-stretch gap-4 rounded-2xl bg-footer px-5 py-6 text-white sm:px-6 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <h3 className={`${SECTION_TITLE_CLASS} !text-white`}>
                Cần gói {brand.name} cho tổ chức?
              </h3>
              <p
                className={`mt-2 max-w-xl ${SECTION_LEAD_CLASS} !text-slate-300`}
              >
                Gửi yêu cầu báo giá volume hoặc subscription — đội KEYON hỗ trợ
                triển khai.
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

function BrandIdentity({
  brand,
  countLabel,
  onDark = false,
}: {
  brand: BrandDetailData;
  countLabel: string;
  onDark?: boolean;
}) {
  return (
    <div>
      <nav
        className={`mb-5 flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS} ${
          onDark ? "!text-white/70" : ""
        }`}
        aria-label="Breadcrumb"
      >
        <Link
          href="/"
          className={
            onDark
              ? "text-white/80 transition hover:text-white"
              : HOVER_LINK_ACCENT
          }
        >
          Trang chủ
        </Link>
        <span aria-hidden>›</span>
        <Link
          href="/brands"
          className={
            onDark
              ? "text-white/80 transition hover:text-white"
              : HOVER_LINK_ACCENT
          }
        >
          Thương hiệu
        </Link>
        <span aria-hidden>›</span>
        <span
          className={
            onDark
              ? "font-semibold text-white"
              : BREADCRUMB_CURRENT_CLASS
          }
        >
          {brand.name}
        </span>
      </nav>

      <div className="flex flex-wrap items-start gap-4 md:gap-5">
        <div
          className={`relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-white sm:h-20 sm:w-20 ${
            onDark ? "border-white/20" : `border-border/80 ${ELEVATION_HAIRLINE}`
          }`}
        >
          {brand.logoUrl ? (
            <Image
              src={brand.logoUrl}
              alt={brand.name}
              fill
              className="object-contain p-2"
              unoptimized
              priority
            />
          ) : (
            <span className="text-xl font-bold text-navy" aria-hidden>
              {(brand.name[0] || "?").toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p
            className={`${OVERLINE_CLASS} tracking-[0.16em] ${
              onDark ? "text-teal-200" : "text-accent"
            }`}
          >
            Thương hiệu
            {brand.featured ? " · Nổi bật" : ""}
          </p>
          <h1
            className={`mt-2 ${PAGE_TITLE_CLASS} ${
              onDark ? "!text-white" : ""
            }`}
          >
            {brand.name}
          </h1>
          {brand.shortDescription ? (
            <p
              className={`mt-3 max-w-2xl ${PAGE_LEAD_CLASS} ${
                onDark ? "!text-slate-200" : ""
              }`}
            >
              {brand.shortDescription}
            </p>
          ) : (
            <p
              className={`mt-3 ${CARD_META_CLASS} ${
                onDark ? "!text-white/70" : ""
              }`}
            >
              {countLabel}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {brand.products.length > 0 ? (
              <a
                href="#san-pham"
                className={`inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                Xem sản phẩm →
              </a>
            ) : null}
            <Link
              href="/brands"
              className={`inline-flex h-11 items-center justify-center rounded-xl border px-5 ${CTA_LABEL_CLASS} ${TRANSITION_UI} ${
                onDark
                  ? "border-white/30 bg-white/10 text-white hover:bg-white/15"
                  : "border-border bg-white text-navy hover:border-accent hover:text-accent"
              }`}
            >
              Tất cả thương hiệu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
