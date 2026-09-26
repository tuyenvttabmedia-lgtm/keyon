"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { SolutionItem } from "@/storefront/content/types";
import { SOLUTION_PAGES } from "@/storefront/nav/ia-pages";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  LINK_ACCENT_CLASS,
  OVERLINE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CTA_HOVER,
  ELEVATION_FLOAT,
  ELEVATION_HAIRLINE,
  TRANSITION_COLORS,
  TRANSITION_UI,
} from "@/storefront/effects";
import {
  HOME_SOLUTIONS_SECTION_COPY,
  HOME_SOLUTION_SHOWCASE,
  pickSolutionTabs,
  type HomeSolutionTabId,
  type SolutionChip,
} from "./solutions-showcase-content";

type Props = {
  items: SolutionItem[];
  title?: string;
  subtitle?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
};

const SLOT_CLASS: Record<SolutionChip["slot"], string> = {
  tl: "left-[4%] top-[6%] sm:left-[2%] sm:top-[8%]",
  tr: "right-[2%] top-[10%] sm:right-0 sm:top-[12%]",
  ml: "left-0 top-[42%] hidden sm:flex",
  bl: "bottom-[10%] left-[6%] sm:bottom-[8%] sm:left-[4%]",
  br: "bottom-[6%] right-[4%] sm:bottom-[4%] sm:right-[2%]",
};

/**
 * Home Giải pháp — mockup: header + pill tabs + visual/copy panel.
 * Proportions tightened for Home (shorter visual, scrollable tabs on mobile).
 */
export function SolutionsShowcase({
  items,
  title,
  subtitle,
  secondaryCtaLabel,
  secondaryCtaHref,
}: Props) {
  const tabs = pickSolutionTabs(items);
  const tablistId = useId();
  const [activeId, setActiveId] = useState<string>(tabs[0]?.id ?? "productivity");

  if (tabs.length === 0) return null;

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0]!;
  const panel =
    HOME_SOLUTION_SHOWCASE[active.id as HomeSolutionTabId] ??
    HOME_SOLUTION_SHOWCASE.productivity;
  const page = SOLUTION_PAGES[active.id];
  const activeIndex = tabs.findIndex((t) => t.id === active.id) + 1;
  const sectionTitle =
    title?.trim() && title.trim() !== "Giải pháp"
      ? title.trim()
      : HOME_SOLUTIONS_SECTION_COPY.title;
  const sectionLead = subtitle?.trim() || HOME_SOLUTIONS_SECTION_COPY.subtitle;
  const secondaryHref = page?.secondaryCta?.href || secondaryCtaHref || "/contact/quote";
  const secondaryLabel =
    page?.secondaryCta?.label || secondaryCtaLabel || "Gửi yêu cầu tư vấn";

  return (
    <section
      id="solutions"
      className="scroll-mt-24 border-t border-border bg-gradient-to-b from-slate-50/90 via-white to-white py-10 md:py-12 lg:py-14"
    >
      <div className="home-container">
        <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-start md:justify-between md:gap-8">
          <div className="max-w-2xl">
            <p className={`${OVERLINE_CLASS} text-accent`}>
              {HOME_SOLUTIONS_SECTION_COPY.overline}
            </p>
            <h2 className={`mt-2 ${SECTION_TITLE_CLASS}`}>{sectionTitle}</h2>
            <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>{sectionLead}</p>
          </div>
          <Link
            href={HOME_SOLUTIONS_SECTION_COPY.viewAllHref}
            className={`mt-1 shrink-0 ${LINK_ACCENT_CLASS} md:mt-8`}
          >
            {HOME_SOLUTIONS_SECTION_COPY.viewAllLabel} →
          </Link>
        </div>

        <div
          role="tablist"
          aria-label="Chủ đề giải pháp"
          id={tablistId}
          className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1 md:mb-5 md:gap-2.5 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0"
        >
          {tabs.map((tab, i) => {
            const selected = tab.id === active.id;
            const showcase = HOME_SOLUTION_SHOWCASE[tab.id as HomeSolutionTabId];
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`${tablistId}-${tab.id}`}
                aria-selected={selected}
                aria-controls={`${tablistId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(tab.id)}
                className={`inline-flex min-w-[11.5rem] flex-1 items-center gap-2 rounded-xl border px-3 py-2.5 text-left ${TRANSITION_COLORS} lg:min-w-0 ${
                  selected
                    ? `border-accent bg-white text-accent ${ELEVATION_HAIRLINE}`
                    : "border-border bg-white text-navy hover:border-accent/40 hover:text-accent"
                }`}
              >
                <span
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    selected ? "bg-accent-soft text-accent" : "bg-slate-50 text-muted"
                  }`}
                >
                  <SolutionGlyph art={tab.art} size={16} />
                </span>
                <span className="min-w-0">
                  <span className={`block tabular-nums text-muted ${BADGE_CLASS} !font-semibold`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`block truncate ${CARD_TITLE_CLASS} !font-semibold ${
                      selected ? "!text-accent" : ""
                    }`}
                  >
                    {showcase?.tabLabel ?? tab.title}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${tablistId}-panel`}
          aria-labelledby={`${tablistId}-${active.id}`}
          className={`grid overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_HAIRLINE} lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]`}
        >
          <SolutionVisual art={active.art} chips={panel.chips} />

          <div className="flex flex-col justify-center border-t border-border px-5 py-6 sm:px-7 sm:py-7 lg:border-t-0 lg:border-l lg:px-8 lg:py-8 xl:px-10">
            <p className={`${OVERLINE_CLASS} text-accent`}>
              {String(activeIndex).padStart(2, "0")} / {panel.panelKicker}
            </p>
            <h3 className={`mt-2 ${SUBSECTION_TITLE_CLASS} sm:text-[1.35rem]`}>
              {panel.headline}
            </h3>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>{panel.lead}</p>

            <ul className="mt-4 space-y-2.5">
              {panel.checks.map((line) => (
                <li key={line} className={`flex gap-2.5 ${BODY_MUTED_CLASS}`}>
                  <CheckIcon />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href={active.href}
                className={`inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                {HOME_SOLUTIONS_SECTION_COPY.primaryCta} →
              </Link>
              <Link
                href={secondaryHref}
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 ${CTA_COMPACT_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
              >
                <DocIcon />
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SolutionVisual({
  art,
  chips,
}: {
  art: SolutionItem["art"];
  chips: SolutionChip[];
}) {
  const visibleChips = chips.slice(0, 5);

  return (
    <div className="relative min-h-[240px] overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50/40 to-slate-100/80 px-4 py-8 sm:min-h-[280px] sm:px-6 sm:py-10 lg:min-h-[320px] lg:px-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 40%, rgba(14,165,164,0.16), transparent 42%), radial-gradient(circle at 70% 30%, rgba(56,189,248,0.12), transparent 38%)",
        }}
      />
      <svg
        className="pointer-events-none absolute inset-6 text-accent/20 sm:inset-8"
        viewBox="0 0 400 280"
        fill="none"
        aria-hidden
      >
        <path
          d="M40 160C90 90 150 70 200 110s90 80 160 60"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <circle cx="200" cy="110" r="3" fill="currentColor" />
        <circle cx="120" cy="130" r="2.5" fill="currentColor" />
        <circle cx="300" cy="150" r="2.5" fill="currentColor" />
      </svg>

      <div className="relative mx-auto flex h-full max-w-[420px] items-center justify-center">
        <LaptopFrame art={art} />
        {visibleChips.map((chip) => (
          <span
            key={chip.id}
            className={`absolute z-[1] inline-flex max-w-[11rem] items-center gap-2 rounded-xl border border-border/80 bg-white/95 px-2.5 py-1.5 ${ELEVATION_FLOAT} ${SLOT_CLASS[chip.slot]}`}
          >
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <ChipGlyph id={chip.id} />
            </span>
            <span className={`${CARD_META_CLASS} !font-semibold !text-navy leading-snug`}>
              {chip.label}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function LaptopFrame({ art }: { art: SolutionItem["art"] }) {
  return (
    <div className="relative z-0 w-[min(100%,280px)] sm:w-[300px]">
      <div className={`rounded-[14px] border border-slate-300/90 bg-slate-800 p-1.5 ${ELEVATION_FLOAT}`}>
        <div className="overflow-hidden rounded-[10px] bg-white">
          <div className="flex items-center gap-1.5 border-b border-border bg-slate-50 px-2.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            <span className={`ml-2 ${CARD_META_CLASS}`}>KEYON workspace</span>
          </div>
          <div className="grid grid-cols-[56px_1fr] gap-2 p-2.5 sm:grid-cols-[64px_1fr] sm:p-3">
            <div className="space-y-1.5 rounded-lg bg-slate-50 p-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-6 rounded-md ${
                    i === 0 ? "bg-accent/20" : "border border-border/70 bg-white"
                  }`}
                />
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className={CARD_META_CLASS}>Chào buổi sáng</p>
                  <p className={`${CARD_TITLE_CLASS} mt-0.5`}>Bảng điều khiển</p>
                </div>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <SolutionGlyph art={art} size={16} />
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {["Email", "Lịch", "Tài liệu", "Nhóm"].map((label) => (
                  <div
                    key={label}
                    className="rounded-lg border border-border/80 bg-slate-50/80 px-2 py-1.5"
                  >
                    <p className={CARD_META_CLASS}>{label}</p>
                    <div className="mt-1 h-1.5 w-2/3 rounded-full bg-accent/25" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-0.5 h-2 w-[72%] rounded-b-md bg-slate-300/90" />
      <div className="mx-auto h-1 w-[84%] rounded-b-sm bg-slate-200" />
    </div>
  );
}

function CheckIcon() {
  return (
    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="m5 12 5 5L20 7"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function DocIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 7h8M8 11h8M8 15h5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M6 3h9l3 3v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChipGlyph({ id }: { id: string }) {
  const props = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    "aria-hidden": true as const,
  };
  switch (id) {
    case "mail":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 7 9-7" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...props}>
          <path d="M7 18h10a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.7 1.6A3.5 3.5 0 0 0 7 18Z" />
        </svg>
      );
    case "m365":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="8" height="8" rx="1" />
          <rect x="13" y="3" width="8" height="8" rx="1" />
          <rect x="3" y="13" width="8" height="8" rx="1" />
          <rect x="13" y="13" width="8" height="8" rx="1" />
        </svg>
      );
    case "cal":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 11h18" />
        </svg>
      );
    case "team":
      return (
        <svg {...props}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="16" cy="9" r="2.5" />
          <path d="M3 19c0-3 3-5 6-5s6 2 6 5M14 14c2.5.2 5 1.8 5 5" />
        </svg>
      );
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 3 4.5 6v5.5c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Z" />
        </svg>
      );
    case "key":
    case "account":
      return (
        <svg {...props}>
          <circle cx="8" cy="12" r="3.5" />
          <path d="M11 12h10v3M17 12v3" strokeLinecap="round" />
        </svg>
      );
    case "backup":
    case "restore":
      return (
        <svg {...props}>
          <path d="M12 16V4" strokeLinecap="round" />
          <path d="m8 8 4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="7" />
          <path d="M12 8v4l2.5 2.5" strokeLinecap="round" />
        </svg>
      );
  }
}

function SolutionGlyph({
  art,
  size = 18,
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
          <path d="M7 18h10a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.7 1.6A3.5 3.5 0 0 0 7 18Z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 3 4.5 6v5.5c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Z" />
        </svg>
      );
    case "backup":
      return (
        <svg {...props}>
          <path d="M12 16V4" strokeLinecap="round" />
          <path d="m8 8 4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
      );
    case "stack":
      return (
        <svg {...props}>
          <path d="M4 8h16M4 12h16M4 16h16" strokeLinecap="round" />
        </svg>
      );
  }
}
