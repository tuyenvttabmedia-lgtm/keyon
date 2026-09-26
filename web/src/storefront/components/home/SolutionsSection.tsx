import Link from "next/link";
import type { HomeContent, SolutionItem } from "@/storefront/content/types";
import { SOLUTION_PAGES } from "@/storefront/nav/ia-pages";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  LINK_ACCENT_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  TRANSITION_COLORS,
  TRANSITION_UI,
} from "@/storefront/effects";

type Solutions = HomeContent["solutions"];

/**
 * Home Giải pháp — one editorial panel:
 * featured row (content-dense) + divided topic list (no pastel / empty navy void).
 */
export function SolutionsSection({ data }: { data: Solutions }) {
  if (!data.visible || data.items.length === 0) return null;

  const [featured, ...rest] = data.items;
  const featuredPage = featured ? SOLUTION_PAGES[featured.id] : undefined;

  return (
    <section
      id="solutions"
      className="scroll-mt-24 border-t border-border bg-white py-10 md:py-12 lg:py-16"
    >
      <div className="home-container">
        <div className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="max-w-xl">
            <h2 className={SECTION_TITLE_CLASS}>{data.title}</h2>
            {data.subtitle ? (
              <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>{data.subtitle}</p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:shrink-0">
            {data.ctaLabel && data.ctaHref ? (
              <Link
                href={data.ctaHref}
                className={`inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                {data.ctaLabel}
              </Link>
            ) : null}
            {data.secondaryCtaLabel && data.secondaryCtaHref ? (
              <Link href={data.secondaryCtaHref} className={LINK_ACCENT_CLASS}>
                {data.secondaryCtaLabel} →
              </Link>
            ) : null}
          </div>
        </div>

        <div
          className={`overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_HAIRLINE}`}
        >
          {featured ? (
            <FeaturedSolutionRow
              item={featured}
              subtitle={featuredPage?.subtitle ?? featured.description}
              bullets={(featuredPage?.bullets ?? []).slice(0, 3)}
            />
          ) : null}

          {rest.length > 0 ? (
            <ul className="divide-y divide-border">
              {rest.map((item, i) => (
                <li key={item.id}>
                  <SolutionListRow item={item} index={i + 2} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Shared compact grid for other surfaces that still need a card grid. */
export function SolutionTopicGrid({ items }: { items: SolutionItem[] }) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
      {items.map((item, i) => (
        <li key={item.id}>
          <SolutionListRow item={item} index={i + 1} />
        </li>
      ))}
    </ul>
  );
}

function FeaturedSolutionRow({
  item,
  subtitle,
  bullets,
}: {
  item: SolutionItem;
  subtitle: string;
  bullets: string[];
}) {
  return (
    <Link
      href={item.href}
      className={`group grid border-b border-border md:grid-cols-[auto_minmax(0,1fr)] ${TRANSITION_COLORS} hover:bg-slate-50/80`}
    >
      <div className="flex items-center gap-4 border-b border-border bg-navy px-5 py-6 text-white md:w-[200px] md:flex-col md:items-start md:justify-center md:border-b-0 md:border-r md:px-6 md:py-8 lg:w-[220px]">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-teal-200">
          <SolutionIcon art={item.art} size={22} />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-200/90">
          Bắt đầu từ đây
        </p>
      </div>

      <div className="flex flex-col justify-center px-5 py-6 sm:px-7 sm:py-8 lg:px-8">
        <h3 className={`${SUBSECTION_TITLE_CLASS} transition-colors group-hover:text-accent`}>
          {item.title}
        </h3>
        <p className={`mt-2 max-w-2xl ${SECTION_LEAD_CLASS}`}>{subtitle}</p>
        {bullets.length > 0 ? (
          <ul className={`mt-4 grid gap-2 sm:grid-cols-1 ${BODY_MUTED_CLASS}`}>
            {bullets.map((b) => (
              <li key={b} className="flex gap-2.5">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <span
          className={`mt-5 inline-flex w-fit items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} group-hover:bg-accent-hover`}
        >
          Tìm hiểu giải pháp
          <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

function SolutionListRow({
  item,
  index,
}: {
  item: SolutionItem;
  index: number;
}) {
  const page = SOLUTION_PAGES[item.id];
  const lead = page?.subtitle ?? item.description;

  return (
    <Link
      href={item.href}
      className={`group flex items-start gap-3 px-5 py-4 sm:items-center sm:gap-4 sm:px-7 sm:py-5 ${TRANSITION_COLORS} hover:bg-slate-50/80`}
    >
      <span className="hidden w-7 shrink-0 pt-0.5 text-[12px] font-semibold tabular-nums text-muted/70 sm:block">
        {String(index).padStart(2, "0")}
      </span>
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-white">
        <SolutionIcon art={item.art} size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className={`${CARD_TITLE_CLASS} transition-colors group-hover:text-accent`}>
          {item.title}
        </h3>
        <p className={`mt-0.5 line-clamp-2 ${BODY_MUTED_CLASS}`}>{lead}</p>
      </div>
      <span
        className={`mt-1 hidden shrink-0 ${CTA_COMPACT_CLASS} text-accent sm:inline-flex sm:items-center sm:gap-1`}
        aria-hidden
      >
        Tìm hiểu
        <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </span>
    </Link>
  );
}

function SolutionIcon({
  art,
  size = 20,
}: {
  art: SolutionItem["art"];
  size?: number;
}) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    "aria-hidden": true as const,
  };
  switch (art) {
    case "bars":
      return (
        <svg {...props}>
          <path d="M4 20V10M10 20V4M16 20v-8M22 20V8" strokeLinecap="round" />
        </svg>
      );
    case "trend":
      return (
        <svg {...props}>
          <path d="M3 17 10 10l4 4 7-8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 6h7v7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...props}>
          <path
            d="M7 18h10a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.7 1.6A3.5 3.5 0 0 0 7 18Z"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 3 4.5 6v5.5c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Z" />
          <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "backup":
      return (
        <svg {...props}>
          <path d="M12 16V4" strokeLinecap="round" />
          <path d="m8 8 4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" />
        </svg>
      );
    case "stack":
      return (
        <svg {...props}>
          <path d="M4 8h16M4 12h16M4 16h16" strokeLinecap="round" />
          <path d="M8 6v12M16 6v12" strokeLinecap="round" opacity="0.35" />
        </svg>
      );
  }
}
