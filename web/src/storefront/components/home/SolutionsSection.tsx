import Link from "next/link";
import type { HomeContent, SolutionItem } from "@/storefront/content/types";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
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

const ART_THEME: Record<
  SolutionItem["art"],
  { panel: string; iconBg: string }
> = {
  bars: { panel: "from-cyan-50 to-teal-100/80", iconBg: "bg-accent" },
  trend: { panel: "from-sky-50 to-cyan-100/70", iconBg: "bg-sky-600" },
  cloud: { panel: "from-indigo-50 to-sky-100/70", iconBg: "bg-indigo-600" },
  shield: { panel: "from-emerald-50 to-teal-100/70", iconBg: "bg-emerald-700" },
  backup: { panel: "from-violet-50 to-fuchsia-100/60", iconBg: "bg-violet-700" },
  stack: { panel: "from-slate-50 to-slate-100/90", iconBg: "bg-navy" },
};

/**
 * Home solutions — mirrors mega-nav Giải pháp (6 items, clickable).
 * Source list lives in home.fixture; keep titles/hrefs in sync with ia.ts.
 */
export function SolutionsSection({ data }: { data: Solutions }) {
  if (!data.visible || data.items.length === 0) return null;

  return (
    <section id="solutions" className="scroll-mt-24 bg-white py-8 md:py-10 lg:py-12">
      <div className="home-container">
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>{data.title}</h2>
            {data.subtitle ? (
              <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>{data.subtitle}</p>
            ) : null}
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            {data.ctaLabel && data.ctaHref ? (
              <Link
                href={data.ctaHref}
                className={`inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER} sm:w-auto`}
              >
                {data.ctaLabel}
              </Link>
            ) : null}
            {data.secondaryCtaLabel && data.secondaryCtaHref ? (
              <Link
                href={data.secondaryCtaHref}
                className={`inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-white px-5 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent sm:w-auto`}
              >
                {data.secondaryCtaLabel}
              </Link>
            ) : null}
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {data.items.map((item, index) => (
            <li key={item.id}>
              <SolutionCard item={item} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SolutionCard({ item, index }: { item: SolutionItem; index: number }) {
  const theme = ART_THEME[item.art];

  return (
    <Link
      href={item.href}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-[#F7FAFC] ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} hover:border-accent/35`}
    >
      <div
        className={`relative flex h-[88px] items-center justify-center bg-gradient-to-br px-4 sm:h-[100px] ${theme.panel}`}
      >
        <span className="absolute left-3 top-2.5 text-[11px] font-semibold tabular-nums text-navy/25">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm transition group-hover:scale-105 ${theme.iconBg}`}
        >
          <SolutionIcon art={item.art} />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className={CARD_TITLE_CLASS}>{item.title}</h3>
        <p className={`mt-1.5 flex-1 ${BODY_MUTED_CLASS}`}>{item.description}</p>
        <span className="mt-3 text-[13px] font-semibold text-accent transition group-hover:underline">
          Tìm hiểu →
        </span>
      </div>
    </Link>
  );
}

function SolutionIcon({ art }: { art: SolutionItem["art"] }) {
  const props = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
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
