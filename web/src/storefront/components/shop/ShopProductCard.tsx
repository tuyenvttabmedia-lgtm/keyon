import Image from "next/image";
import Link from "next/link";
import { StarRating } from "../StarRating";
import { formatVnd } from "./shop-utils";
import type { ShopProduct } from "./types";
import {
  BADGE_CLASS,
  CARD_META_CLASS,
  CARD_PRICE_CLASS,
  CARD_TITLE_CLASS,
  COMPARE_PRICE_CLASS,
  CTA_COMPACT_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_FLOAT,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";

function ProductArt({ item }: { item: ShopProduct }) {
  const mark = item.mark ?? "generic";
  const title = item.productName;
  const fallback = item.brandName;
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
            : mark === "adobe"
              ? "Aa"
              : fallback.slice(0, 2).toUpperCase();

  const tone =
    mark === "windows" || mark === "server"
      ? "from-sky-500 to-blue-700"
      : mark === "office"
        ? "from-orange-500 to-red-600"
        : mark === "security"
          ? "from-emerald-500 to-teal-700"
          : mark === "adobe"
            ? "from-rose-500 to-red-800"
            : "from-slate-500 to-slate-800";

  return (
    <div
      className={`flex h-[120px] w-[88px] flex-col justify-between rounded-lg bg-gradient-to-br ${tone} p-2.5 text-white ${ELEVATION_FLOAT}`}
      aria-hidden
    >
      <span className="text-[10px] font-semibold opacity-80">{fallback}</span>
      <span className="text-xl font-extrabold tracking-tight">{label}</span>
    </div>
  );
}

/** Grid card — mockup Cửa hàng. */
export function ShopProductCard({ item }: { item: ShopProduct }) {
  const discount = item.discountPercent;
  const compare = item.compareAtPriceVnd;

  return (
    <article className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-border ${ELEVATION_CARD_HOVER}`}>
      <Link href={item.href} className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-b from-slate-50 to-white p-4">
        {discount ? (
          <span className={`absolute left-3 top-3 z-[1] inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 ${BADGE_CLASS} text-white shadow-sm`}>
            -{discount}%
          </span>
        ) : null}
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.productName}
            width={180}
            height={140}
            className="h-full max-h-[140px] w-auto object-contain"
            unoptimized
          />
        ) : (
          <ProductArt item={item} />
        )}
      </Link>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-1">
        <Link href={item.href}>
          <h3 className={`line-clamp-2 ${CARD_TITLE_CLASS} transition-colors group-hover:text-accent`}>
            {item.productName}
          </h3>
        </Link>
        <p className={`mt-1 line-clamp-1 ${CARD_META_CLASS}`}>{item.packageName}</p>
        {typeof item.rating === "number" &&
        typeof item.reviewCount === "number" &&
        item.reviewCount > 0 ? (
          <div className="mt-2">
            <StarRating
              rating={item.rating}
              reviewCount={item.reviewCount}
              size="sm"
            />
          </div>
        ) : null}
        <div className="mt-2.5 flex flex-wrap items-baseline gap-2">
          <p className={CARD_PRICE_CLASS}>{formatVnd(item.priceVnd)}</p>
          {compare && compare > item.priceVnd ? (
            <p className={COMPARE_PRICE_CLASS}>{formatVnd(compare)}</p>
          ) : null}
        </div>
        <Link
          href={item.href}
          className={`mt-3 inline-flex h-10 w-full items-center justify-center rounded-xl bg-accent-soft ${CTA_COMPACT_CLASS} text-accent ${TRANSITION_UI} hover:bg-accent hover:text-white`}
        >
          Thanh toán ngay
        </Link>
      </div>
    </article>
  );
}

/** List row — horizontal card. */
export function ShopProductListItem({ item }: { item: ShopProduct }) {
  const discount = item.discountPercent;
  const compare = item.compareAtPriceVnd;

  return (
    <article className={`flex gap-4 overflow-hidden rounded-2xl border border-border/80 bg-white p-3 ${ELEVATION_HAIRLINE} ${TRANSITION_UI} hover:border-border ${ELEVATION_CARD_HOVER} sm:p-4`}>
      <Link
        href={item.href}
        className="relative flex h-[110px] w-[110px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-slate-50 to-white sm:h-[120px] sm:w-[132px]"
      >
        {discount ? (
          <span className={`absolute left-2 top-2 z-[1] inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 ${BADGE_CLASS} text-white`}>
            -{discount}%
          </span>
        ) : null}
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.productName}
            width={120}
            height={100}
            className="max-h-[90px] w-auto object-contain"
            unoptimized
          />
        ) : (
          <div className="scale-90">
            <ProductArt item={item} />
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <Link href={item.href}>
          <h3 className={`line-clamp-2 ${CARD_TITLE_CLASS} hover:text-accent`}>
            {item.productName}
          </h3>
        </Link>
        <p className={`mt-1 line-clamp-1 ${CARD_META_CLASS}`}>{item.packageName}</p>
        {typeof item.rating === "number" &&
        typeof item.reviewCount === "number" &&
        item.reviewCount > 0 ? (
          <div className="mt-2">
            <StarRating
              rating={item.rating}
              reviewCount={item.reviewCount}
              size="sm"
            />
          </div>
        ) : null}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
          <div className="flex flex-wrap items-baseline gap-2">
            <p className={CARD_PRICE_CLASS}>{formatVnd(item.priceVnd)}</p>
            {compare && compare > item.priceVnd ? (
              <p className={COMPARE_PRICE_CLASS}>{formatVnd(compare)}</p>
            ) : null}
          </div>
          <Link
            href={item.href}
            className={`inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft px-4 ${CTA_COMPACT_CLASS} text-accent ${TRANSITION_UI} hover:bg-accent hover:text-white`}
          >
            Thanh toán ngay
          </Link>
        </div>
      </div>
    </article>
  );
}
