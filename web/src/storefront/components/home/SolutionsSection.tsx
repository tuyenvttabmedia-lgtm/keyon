import Link from "next/link";
import type { HomeContent, SolutionItem } from "@/storefront/content/types";
import {
  BADGE_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  OVERLINE_CLASS,
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
  { panel: string; iconBg: string; iconFg: string }
> = {
  bars: {
    panel: "from-cyan-50 to-teal-100/80",
    iconBg: "bg-accent",
    iconFg: "text-white",
  },
  trend: {
    panel: "from-sky-50 to-cyan-100/70",
    iconBg: "bg-sky-600",
    iconFg: "text-white",
  },
  shield: {
    panel: "from-emerald-50 to-teal-100/70",
    iconBg: "bg-emerald-700",
    iconFg: "text-white",
  },
  stack: {
    panel: "from-slate-50 to-slate-100/90",
    iconBg: "bg-navy",
    iconFg: "text-white",
  },
};

export function SolutionsSection({ data }: { data: Solutions }) {
  if (!data.visible) return null;

  return (
    <section id="solutions" className="scroll-mt-24 bg-surface py-5 md:py-4 lg:py-7">
      <div className="home-container">
        <div className="mb-4 flex flex-col gap-4 md:mb-5 md:flex-row md:items-end md:justify-between lg:mb-6">
          <div className="max-w-2xl">
            {data.kicker ? (
              <p className={`${OVERLINE_CLASS} text-accent`}>{data.kicker}</p>
            ) : null}
            <h2 className={`mt-1.5 ${SECTION_TITLE_CLASS}`}>{data.title}</h2>
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

        <div className="-mx-4 px-4 sm:hidden">
          <div className="home-snap-x gap-2.5 pb-1">
            {data.items.map((item, index) => (
              <div key={item.id} className="w-[calc(50vw-1.35rem)] max-w-[200px]">
                <SolutionCard item={item} index={index} compact />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden gap-3.5 sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {data.items.map((item, index) => (
            <SolutionCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionCard({
  item,
  index,
  compact = false,
}: {
  item: SolutionItem;
  index: number;
  compact?: boolean;
}) {
  const theme = ART_THEME[item.art];

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-border ${ELEVATION_CARD_HOVER}`}
    >
      <div
        className={`relative flex items-center justify-center bg-gradient-to-br ${theme.panel} px-3 ${
          compact ? "h-[72px]" : "h-[108px] px-4"
        }`}
      >
        <span className={`absolute left-3 top-2.5 tabular-nums text-navy/25 ${BADGE_CLASS}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`inline-flex items-center justify-center rounded-2xl ${theme.iconBg} ${theme.iconFg} shadow-sm transition group-hover:scale-105 ${
            compact ? "h-9 w-9" : "h-12 w-12"
          }`}
        >
          <SolutionIcon art={item.art} />
        </span>
        {!compact ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 opacity-70">
            <SolutionMiniChart art={item.art} />
          </div>
        ) : null}
      </div>

      <div className={`flex flex-1 flex-col ${compact ? "p-3" : "p-4"}`}>
        <h3 className={`line-clamp-2 ${CARD_TITLE_CLASS}`}>{item.title}</h3>
        <p className={`mt-1.5 line-clamp-3 leading-relaxed ${CARD_META_CLASS}`}>
          {item.description}
        </p>
      </div>
    </article>
  );
}

function SolutionIcon({ art }: { art: SolutionItem["art"] }) {
  const props = {
    width: 22,
    height: 22,
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
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 3 4.5 6v5.5c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Z" />
          <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
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

function SolutionMiniChart({ art }: { art: SolutionItem["art"] }) {
  switch (art) {
    case "bars":
      return (
        <svg className="h-full w-full" viewBox="0 0 160 40" preserveAspectRatio="none" aria-hidden>
          <rect x="18" y="18" width="22" height="22" rx="3" fill="#0EA5A4" opacity="0.35" />
          <rect x="52" y="8" width="22" height="32" rx="3" fill="#0EA5A4" opacity="0.55" />
          <rect x="86" y="14" width="22" height="26" rx="3" fill="#0EA5A4" opacity="0.4" />
          <rect x="120" y="4" width="22" height="36" rx="3" fill="#0EA5A4" opacity="0.65" />
        </svg>
      );
    case "trend":
      return (
        <svg className="h-full w-full" viewBox="0 0 160 40" preserveAspectRatio="none" aria-hidden>
          <path
            d="M8 32 40 22 68 26 100 12 152 6"
            fill="none"
            stroke="#0284C7"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
      );
    case "shield":
      return (
        <svg className="h-full w-full" viewBox="0 0 160 40" fill="none" aria-hidden>
          <path
            d="M80 6 48 16v10c0 18 14 28 32 32 18-4 32-14 32-32V16L80 6Z"
            stroke="#047857"
            strokeWidth="2"
            opacity="0.45"
          />
        </svg>
      );
    case "stack":
      return (
        <svg className="h-full w-full" viewBox="0 0 160 40" fill="none" aria-hidden>
          <rect x="24" y="10" width="112" height="8" rx="2" fill="#0F172A" opacity="0.2" />
          <rect x="24" y="22" width="88" height="8" rx="2" fill="#0EA5A4" opacity="0.45" />
        </svg>
      );
  }
}
