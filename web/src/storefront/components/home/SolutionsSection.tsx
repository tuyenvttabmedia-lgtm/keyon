import Link from "next/link";
import type { HomeContent, SolutionItem } from "@/storefront/content/types";
import {
  BADGE_CLASS,
  CARD_META_CLASS,
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
  { panel: string; iconBg: string; iconFg: string }
> = {
  bars: {
    panel: "from-cyan-50 to-teal-100/80",
    iconBg: "bg-accent",
    iconFg: "text-white",
  },
  trend: {
    panel: "from-sky-50 to-blue-100/80",
    iconBg: "bg-sky-600",
    iconFg: "text-white",
  },
  api: {
    panel: "from-violet-50 to-indigo-100/70",
    iconBg: "bg-violet-600",
    iconFg: "text-white",
  },
  headset: {
    panel: "from-emerald-50 to-green-100/80",
    iconBg: "bg-emerald-600",
    iconFg: "text-white",
  },
};

export function SolutionsSection({ data }: { data: Solutions }) {
  if (!data.visible) return null;

  return (
    <section id="solutions" className="scroll-mt-24 bg-surface py-5 md:py-4 lg:py-6">
      <div className="home-container">
        <div className="mb-4 flex flex-col gap-3 md:mb-3.5 md:flex-row md:items-end md:justify-between lg:mb-5">
          <div className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>{data.title}</h2>
            {data.subtitle ? (
              <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
                {data.subtitle}
              </p>
            ) : null}
          </div>
        {data.ctaLabel && data.ctaHref ? (
            <Link
              href={data.ctaHref}
              className={`inline-flex h-11 w-full shrink-0 items-center justify-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER} sm:w-auto`}
            >
              {data.ctaLabel}
              <span className="ml-1.5" aria-hidden>
                →
              </span>
            </Link>
          ) : null}
        </div>

        {/* Mobile: snap carousel — ~2 cards visible */}
        <div className="-mx-4 px-4 sm:hidden">
          <div className="home-snap-x gap-2.5 pb-1">
            {data.items.map((item, index) => (
              <div key={item.id} className="w-[calc(50vw-1.35rem)] max-w-[200px]">
                <SolutionCard item={item} index={index} compact />
              </div>
            ))}
          </div>
        </div>

        {/* Tablet+ grid */}
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
    <article className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-border ${ELEVATION_CARD_HOVER}`}>
      <div
        className={`relative flex items-center justify-center bg-gradient-to-br ${theme.panel} px-3 ${
          compact ? "h-[72px]" : "h-[108px] px-4"
        }`}
      >
        <span
          className={`absolute left-3 top-2.5 tabular-nums text-navy/25 ${BADGE_CLASS}`}
        >
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
        <h3 className={`line-clamp-2 ${CARD_TITLE_CLASS}`}>
          {item.title}
        </h3>
        <p className={`mt-1.5 line-clamp-2 leading-relaxed ${CARD_META_CLASS}`}>
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
    case "api":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="7" height="7" rx="1.5" />
          <rect x="14" y="4" width="7" height="7" rx="1.5" />
          <rect x="8.5" y="13" width="7" height="7" rx="1.5" />
          <path d="M10 7.5h4M12 11v2" strokeLinecap="round" />
        </svg>
      );
    case "headset":
      return (
        <svg {...props}>
          <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
          <path d="M4 14a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2v1Z" />
          <path d="M20 14a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2v1Z" />
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
            stroke="#2563EB"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
      );
    case "api":
      return (
        <svg className="h-full w-full" viewBox="0 0 160 40" fill="none" aria-hidden>
          <circle cx="36" cy="22" r="8" stroke="#7C3AED" strokeWidth="2" opacity="0.45" />
          <circle cx="80" cy="22" r="8" stroke="#7C3AED" strokeWidth="2" opacity="0.45" />
          <circle cx="124" cy="22" r="8" stroke="#7C3AED" strokeWidth="2" opacity="0.45" />
          <path d="M44 22h28M88 22h28" stroke="#7C3AED" strokeWidth="2" opacity="0.4" />
        </svg>
      );
    case "headset":
      return (
        <svg className="h-full w-full" viewBox="0 0 160 40" fill="none" aria-hidden>
          <path
            d="M40 28v-4a40 40 0 0 1 80 0v4"
            stroke="#16A34A"
            strokeWidth="2.5"
            opacity="0.45"
          />
          <rect x="32" y="26" width="16" height="10" rx="3" fill="#16A34A" opacity="0.5" />
          <rect x="112" y="26" width="16" height="10" rx="3" fill="#16A34A" opacity="0.5" />
        </svg>
      );
  }
}
