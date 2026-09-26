import Link from "next/link";
import type { HomeContent, SolutionItem } from "@/storefront/content/types";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  LINK_ACCENT_CLASS,
  OVERLINE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";

type Solutions = HomeContent["solutions"];

/**
 * Home Giải pháp — editorial layout: one featured topic + compact grid.
 * Neutral surfaces (no rainbow pastels); unified accent icon language.
 */
export function SolutionsSection({ data }: { data: Solutions }) {
  if (!data.visible || data.items.length === 0) return null;

  const [featured, ...rest] = data.items;

  return (
    <section
      id="solutions"
      className="scroll-mt-24 border-y border-border/70 bg-slate-50/60 py-10 md:py-12 lg:py-14"
    >
      <div className="home-container">
        <div className="mb-8 max-w-2xl md:mb-10">
          <p className={`${OVERLINE_CLASS} text-accent`}>Giải pháp</p>
          <h2 className={`mt-2 ${SECTION_TITLE_CLASS}`}>{data.title}</h2>
          {data.subtitle ? (
            <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>{data.subtitle}</p>
          ) : null}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            {data.ctaLabel && data.ctaHref ? (
              <Link
                href={data.ctaHref}
                className={`inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                {data.ctaLabel}
              </Link>
            ) : null}
            {data.secondaryCtaLabel && data.secondaryCtaHref ? (
              <Link
                href={data.secondaryCtaHref}
                className={LINK_ACCENT_CLASS}
              >
                {data.secondaryCtaLabel} →
              </Link>
            ) : null}
          </div>
        </div>

        {featured ? <FeaturedSolutionCard item={featured} /> : null}

        {rest.length > 0 ? (
          <ul
            className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4 ${
              featured ? "mt-4 md:mt-5" : ""
            }`}
          >
            {rest.map((item) => (
              <li key={item.id}>
                <SolutionTopicCard item={item} />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

/** Compact grid used by hub-style listings (same visual language as Home rest cards). */
export function SolutionTopicGrid({ items }: { items: SolutionItem[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
      {items.map((item) => (
        <li key={item.id}>
          <SolutionTopicCard item={item} />
        </li>
      ))}
    </ul>
  );
}

function FeaturedSolutionCard({ item }: { item: SolutionItem }) {
  return (
    <Link
      href={item.href}
      className={`group grid overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} hover:border-accent/40 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]`}
    >
      <div className="relative flex min-h-[160px] items-center justify-center overflow-hidden bg-navy px-6 py-10 md:min-h-[220px] md:py-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #2dd4bf 0%, transparent 42%), radial-gradient(circle at 85% 75%, #38bdf8 0%, transparent 40%)",
          }}
        />
        <div className="relative flex flex-col items-center text-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-sm transition group-hover:scale-[1.03] motion-safe:transition-transform">
            <SolutionIcon art={item.art} size={28} />
          </span>
          <span className={`mt-4 ${OVERLINE_CLASS} tracking-[0.14em] text-teal-200/90`}>
            Nổi bật
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        <h3 className={SUBSECTION_TITLE_CLASS}>{item.title}</h3>
        <p className={`mt-3 max-w-xl ${SECTION_LEAD_CLASS}`}>{item.description}</p>
        <span
          className={`mt-6 inline-flex items-center gap-1.5 ${LINK_ACCENT_CLASS}`}
        >
          Tìm hiểu
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

function SolutionTopicCard({ item }: { item: SolutionItem }) {
  return (
    <Link
      href={item.href}
      className={`group flex h-full gap-4 rounded-2xl border border-border bg-white p-4 sm:p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} hover:border-accent/40`}
    >
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
        <SolutionIcon art={item.art} size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className={CARD_TITLE_CLASS}>{item.title}</h3>
        <p className={`mt-1 line-clamp-2 ${BODY_MUTED_CLASS}`}>{item.description}</p>
        <span className={`mt-3 inline-flex items-center gap-1 ${LINK_ACCENT_CLASS}`}>
          Tìm hiểu
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
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
