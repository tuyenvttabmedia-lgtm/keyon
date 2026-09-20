import Image from "next/image";
import Link from "next/link";
import type { HomeContent, NewsItem } from "@/storefront/content/types";
import { HomeSectionHeading } from "../HomeSectionHeading";
import {
  BADGE_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  LINK_MICRO_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  MOTION_NORMAL,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";

type News = HomeContent["news"];

const tagClass: Record<NonNullable<NewsItem["tagTone"]>, string> = {
  win: "bg-sky-100 text-sky-700",
  ms: "bg-orange-100 text-orange-700",
  sec: "bg-emerald-100 text-emerald-700",
  adobe: "bg-rose-100 text-rose-700",
};

const thumbClass = [
  "bg-gradient-to-br from-sky-400 to-blue-700",
  "bg-gradient-to-br from-orange-400 to-red-600",
  "bg-gradient-to-br from-emerald-400 to-teal-700",
  "bg-gradient-to-br from-rose-400 to-pink-700",
];

export function NewsSection({ data }: { data: News }) {
  if (!data.visible) return null;

  const mobileItems = data.items.slice(0, 4);
  const tabletItems = data.items.slice(0, 3);
  const desktopItems = data.items.slice(0, 4);

  return (
    <section className="py-5 md:py-4 lg:py-6">
      <div className="home-container">
        <HomeSectionHeading
          title={data.title}
          viewAllHref={data.viewAllHref}
          viewAllLabel={data.viewAllLabel}
          align="end"
        />

        {/* Mobile: compact list rows */}
        <div className="flex flex-col gap-2.5 md:hidden">
          {mobileItems.map((item, i) => (
            <NewsListRow key={item.id} item={item} thumb={thumbClass[i % thumbClass.length]!} />
          ))}
        </div>

        {/* Tablet: 3 compact cards */}
        <div className="hidden gap-3 md:grid md:grid-cols-3 lg:hidden">
          {tabletItems.map((item, i) => (
            <NewsCard
              key={item.id}
              item={item}
              thumb={thumbClass[i % thumbClass.length]!}
              compact
            />
          ))}
        </div>

        {/* Desktop: 4 cards */}
        <div className="hidden gap-3.5 lg:grid lg:grid-cols-4">
          {desktopItems.map((item, i) => (
            <NewsCard key={item.id} item={item} thumb={thumbClass[i % thumbClass.length]!} />
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsThumb({
  item,
  thumb,
  className,
}: {
  item: NewsItem;
  thumb: string;
  className: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className} ${item.imageUrl ? "bg-surface" : thumb}`}>
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={item.imageAlt || item.title}
          fill
          className={`object-cover ${MOTION_NORMAL}`}
          sizes="(max-width: 768px) 72px, (max-width: 1024px) 33vw, 25vw"
          unoptimized
        />
      ) : null}
      {item.tag ? (
        <span
          className={`absolute left-1 top-1 z-[1] rounded px-1 py-0.5 sm:left-3 sm:top-3 sm:rounded-md sm:px-2 sm:py-0.5 ${BADGE_CLASS} ${
            item.tagTone ? tagClass[item.tagTone] : "bg-white/90 text-navy"
          }`}
        >
          {item.tag}
        </span>
      ) : null}
    </div>
  );
}

function NewsListRow({ item, thumb }: { item: NewsItem; thumb: string }) {
  return (
    <article className={`flex gap-2.5 overflow-hidden rounded-xl border border-border/80 bg-white p-2 ${ELEVATION_HAIRLINE} ${TRANSITION_UI} active:bg-surface`}>
      <NewsThumb
        item={item}
        thumb={thumb}
        className="h-14 w-[72px] shrink-0 rounded-lg"
      />
      <div className="min-w-0 flex-1 self-center">
        <div className={CARD_META_CLASS}>{item.dateLabel}</div>
        <h3 className={`mt-0.5 line-clamp-1 ${CARD_TITLE_CLASS}`}>
          {item.title}
        </h3>
        <Link
          href={item.href}
          className={`mt-1 inline-flex items-center gap-1 ${LINK_MICRO_CLASS}`}
        >
          Đọc thêm
          <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}

function NewsCard({
  item,
  thumb,
  compact = false,
}: {
  item: NewsItem;
  thumb: string;
  compact?: boolean;
}) {
  return (
    <article className={`overflow-hidden rounded-[18px] border border-border/80 bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-border ${ELEVATION_CARD_HOVER}`}>
      <NewsThumb
        item={item}
        thumb={thumb}
        className={compact ? "aspect-[16/9]" : "aspect-[16/10]"}
      />
      <div className={compact ? "p-3" : "p-3.5"}>
        <div className={`text-date ${CARD_META_CLASS}`}>{item.dateLabel}</div>
        <h3 className={`mt-1.5 line-clamp-2 ${CARD_TITLE_CLASS}`}>
          {item.title}
        </h3>
        <Link
          href={item.href}
          className={`group mt-1.5 inline-flex items-center gap-1 ${CTA_COMPACT_CLASS} text-accent ${TRANSITION_UI} hover:text-navy`}
        >
          <span className="underline-offset-[3px] group-hover:underline">Đọc thêm</span>
          <span className={`${MOTION_NORMAL} transition-transform group-hover:translate-x-0.5`} aria-hidden>
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
