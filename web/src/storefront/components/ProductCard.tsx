import Image from "next/image";
import Link from "next/link";
import type { FeaturedProduct } from "@/storefront/content/types";
import { StarRating } from "./StarRating";
import {
  CARD_META_CLASS,
  CARD_PRICE_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_FLOAT,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  TRANSITION_PANEL,
} from "@/storefront/effects";

type Props = {
  item: FeaturedProduct;
  /** Compact card for mobile/tablet carousels (show ~2 peeks). */
  compact?: boolean;
};

/**
 * Featured Home product card — mockup: art · title · package · stars · price · CTA.
 */
export function ProductCard({ item, compact = false }: Props) {
  const cta = item.ctaLabel?.trim() || "Thanh toán ngay";

  return (
    <article
      className={`flex h-full flex-col overflow-hidden border border-border/80 bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-border ${ELEVATION_CARD_HOVER} ${
        compact ? "rounded-xl" : "rounded-2xl"
      }`}
    >
      <Link href={item.href} className="flex flex-1 flex-col">
        <div
          className={`relative flex items-center justify-center bg-gradient-to-b from-slate-50 to-white ${
            compact ? "aspect-[5/4] p-2.5" : "aspect-[4/3] p-4"
          }`}
        >
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.productName}
              width={180}
              height={140}
              className={`h-full w-auto object-contain ${compact ? "max-h-[88px]" : "max-h-[140px]"}`}
              unoptimized
            />
          ) : (
            <ProductArt
              mark={item.mark}
              fallback={item.brandName}
              title={item.productName}
              compact={compact}
            />
          )}
        </div>

        <div className={`flex flex-1 flex-col ${compact ? "px-2.5 pb-2 pt-0.5" : "px-3.5 pb-3 pt-1"}`}>
          <h3 className={`line-clamp-2 ${CARD_TITLE_CLASS}`}>
            {item.productName}
          </h3>
          <p className={`${compact ? "mt-0.5" : "mt-1"} line-clamp-1 ${CARD_META_CLASS}`}>
            {item.packageName}
          </p>

          {typeof item.rating === "number" &&
          typeof item.reviewCount === "number" &&
          item.reviewCount > 0 ? (
            <div className={compact ? "mt-1.5 scale-90 origin-left" : "mt-2"}>
              <StarRating
                rating={item.rating}
                reviewCount={item.reviewCount}
                size="sm"
              />
            </div>
          ) : null}

          <p className={`${compact ? "mt-1.5" : "mt-2.5"} ${CARD_PRICE_CLASS}`}>
            {item.priceVnd.toLocaleString("vi-VN")} ₫
          </p>
        </div>
      </Link>

      <div className={compact ? "px-2.5 pb-2.5" : "px-3.5 pb-3.5"}>
        <Link
          href={item.href}
          className={`inline-flex w-full items-center justify-center rounded-xl bg-accent ${CTA_COMPACT_CLASS} text-white hover:bg-accent-hover ${
            compact ? "h-9" : "h-10"
          }`}
        >
          {cta}
        </Link>
      </div>
    </article>
  );
}

function ProductArt({
  mark,
  fallback,
  title,
  compact,
}: {
  mark?: FeaturedProduct["mark"];
  fallback: string;
  title: string;
  compact?: boolean;
}) {
  const label =
    mark === "windows"
      ? title.toLowerCase().includes("10")
        ? "W10"
        : "W11"
      : mark === "office"
        ? "Off"
        : mark === "server"
          ? "Srv"
          : mark === "security"
            ? "Sec"
            : mark === "defender"
              ? "MD"
              : mark === "adobe"
                ? "Aa"
                : fallback.slice(0, 2).toUpperCase();

  const tone =
    mark === "windows" || mark === "server"
      ? "from-sky-500 to-blue-700"
      : mark === "office"
        ? "from-orange-500 to-red-600"
        : mark === "security" || mark === "defender"
          ? "from-emerald-500 to-teal-700"
          : mark === "adobe"
            ? "from-rose-500 to-red-800"
            : "from-slate-500 to-slate-800";

  return (
    <div
      className={`flex flex-col justify-between rounded-lg bg-gradient-to-br ${tone} text-white ${ELEVATION_FLOAT} ${
        compact ? "h-[72px] w-[54px] p-1.5" : "h-[120px] w-[88px] p-2.5"
      }`}
      aria-hidden
    >
      <span className={`font-semibold opacity-80 ${compact ? "text-[8px]" : "text-[10px]"}`}>
        {fallback}
      </span>
      <span className={`font-extrabold tracking-tight ${compact ? "text-sm" : "text-xl"}`}>
        {label}
      </span>
    </div>
  );
}
