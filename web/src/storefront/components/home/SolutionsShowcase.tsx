"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { SolutionItem } from "@/storefront/content/types";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  LINK_ACCENT_CLASS,
  OVERLINE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
  SUBSECTION_TITLE_CLASS,
  TAB_ACTIVE_CLASS,
  TAB_CLASS,
} from "@/storefront/typography";
import {
  EASE_STANDARD,
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  MOTION_NORMAL,
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
};

const SLOT_CLASS: Record<SolutionChip["slot"], string> = {
  tl: "left-1 top-[6%]",
  tr: "right-1 top-[12%]",
  ml: "left-0 top-[48%] hidden sm:flex",
  bl: "bottom-[8%] left-2",
  br: "bottom-[4%] right-2",
};

const TONE_WELL: Record<NonNullable<SolutionChip["tone"]>, string> = {
  sky: "bg-sky-50 text-sky-600",
  violet: "bg-violet-50 text-violet-600",
  cyan: "bg-cyan-50 text-cyan-700",
  amber: "bg-amber-50 text-amber-700",
  emerald: "bg-emerald-50 text-emerald-700",
  teal: "bg-accent-soft text-accent",
};

const PANEL_FADE =
  "motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]";

/**
 * Home Giải pháp — ecosystem tabs + panel, toned to Home cadence
 * (white ground, hairline elevation, compact padding).
 */
export function SolutionsShowcase({ items, title, subtitle }: Props) {
  const tabs = pickSolutionTabs(items);
  const tablistId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "productivity");
  const [panelIn, setPanelIn] = useState(true);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, []);

  const selectTab = useCallback(
    (id: string) => {
      if (id === activeId) return;
      setPanelIn(false);
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
      fadeTimer.current = setTimeout(() => {
        setActiveId(id);
        setPanelIn(true);
      }, 140);
    },
    [activeId],
  );

  if (tabs.length === 0) return null;

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0]!;
  const tabId = (
    active.id in HOME_SOLUTION_SHOWCASE ? active.id : "productivity"
  ) as HomeSolutionTabId;
  const panel = HOME_SOLUTION_SHOWCASE[tabId];
  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === active.id));
  const chips = panel.chips.slice(0, 4);
  const sectionTitle =
    title?.trim() && title.trim() !== "Giải pháp"
      ? title.trim()
      : HOME_SOLUTIONS_SECTION_COPY.title;
  const sectionLead =
    subtitle?.trim() || HOME_SOLUTIONS_SECTION_COPY.subtitle;

  function onTabKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const i = tabs.findIndex((t) => t.id === activeId);
    if (i < 0) return;
    let next = i;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      next = (i + 1) % tabs.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      next = (i - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      next = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      next = tabs.length - 1;
    } else {
      return;
    }
    selectTab(tabs[next]!.id);
    tabRefs.current[next]?.focus();
  }

  return (
    <section
      id="solutions"
      className="home-solutions scroll-mt-24 border-t border-border bg-white py-8 md:py-10 lg:py-12"
    >
      <div className="home-container">
        <div className="mb-5 flex flex-col gap-2.5 md:mb-6 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="max-w-2xl">
            <p className={`${OVERLINE_CLASS} text-accent`}>
              {HOME_SOLUTIONS_SECTION_COPY.overline}
            </p>
            <h2 className={`mt-2 ${SECTION_TITLE_CLASS}`}>{sectionTitle}</h2>
            <p className={`mt-2 max-w-xl ${SECTION_LEAD_CLASS}`}>{sectionLead}</p>
          </div>
          <Link
            href={HOME_SOLUTIONS_SECTION_COPY.viewAllHref}
            className={`shrink-0 ${LINK_ACCENT_CLASS}`}
          >
            {HOME_SOLUTIONS_SECTION_COPY.viewAllLabel} →
          </Link>
        </div>

        <div
          role="tablist"
          aria-label="Chủ đề giải pháp"
          id={tablistId}
          onKeyDown={onTabKeyDown}
          className="home-solutions__nav mb-4 flex gap-2 overflow-x-auto pb-0.5 lg:mb-5 lg:grid lg:grid-cols-5 lg:overflow-visible"
        >
          {tabs.map((tab, i) => {
            const selected = tab.id === active.id;
            const showcase =
              HOME_SOLUTION_SHOWCASE[tab.id as HomeSolutionTabId];
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                id={`${tablistId}-${tab.id}`}
                aria-selected={selected}
                aria-controls={`${tablistId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectTab(tab.id)}
                className={`inline-flex min-w-[10.5rem] items-center gap-2 rounded-xl border px-3 py-2 text-left ${TRANSITION_COLORS} ${MOTION_NORMAL} ${EASE_STANDARD} lg:min-w-0 ${
                  selected
                    ? "border-accent bg-accent-soft/60 text-accent"
                    : "border-border/80 bg-white text-navy hover:border-accent/40 hover:text-accent"
                }`}
              >
                <span
                  className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    selected
                      ? "bg-white text-accent"
                      : "bg-slate-50 text-muted"
                  }`}
                >
                  <SolutionGlyph art={tab.art} size={14} />
                </span>
                <span className="min-w-0">
                  <span
                    className={`block tabular-nums ${BADGE_CLASS} ${
                      selected ? "text-accent" : "text-muted"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`block truncate leading-snug ${
                      selected ? TAB_ACTIVE_CLASS : TAB_CLASS
                    } ${selected ? "!text-accent" : ""}`}
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
          className={`home-solutions__panel grid overflow-hidden rounded-2xl border border-border/80 bg-white ${ELEVATION_HAIRLINE} lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]`}
        >
          <div
            className={`border-b border-border/70 lg:border-b-0 lg:border-r ${PANEL_FADE} ${
              panelIn
                ? "opacity-100 motion-safe:translate-y-0"
                : "opacity-0 motion-safe:translate-y-1"
            }`}
          >
            <SolutionVisual art={active.art} chips={chips} />
          </div>

          <div
            className={`flex flex-col justify-center px-5 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8 ${PANEL_FADE} ${
              panelIn
                ? "opacity-100 motion-safe:translate-y-0"
                : "opacity-0 motion-safe:translate-y-1"
            }`}
          >
            <p className={`${OVERLINE_CLASS} text-accent`}>
              {String(activeIndex + 1).padStart(2, "0")} / {panel.panelKicker}
            </p>
            <h3 className={`mt-2 ${SUBSECTION_TITLE_CLASS}`}>{panel.headline}</h3>
            <p className={`mt-2.5 max-w-md ${SECTION_LEAD_CLASS}`}>{panel.lead}</p>

            <ul className="mt-4 space-y-2">
              {panel.checks.map((line) => (
                <li key={line} className={`flex gap-2.5 ${BODY_MUTED_CLASS}`}>
                  <CheckIcon />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link
                href={active.href}
                className={`inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                {HOME_SOLUTIONS_SECTION_COPY.primaryCta} →
              </Link>
              <Link
                href={HOME_SOLUTIONS_SECTION_COPY.secondaryCtaHref}
                className={LINK_ACCENT_CLASS}
              >
                {HOME_SOLUTIONS_SECTION_COPY.secondaryCta} →
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
  return (
    <div className="home-solutions__visual relative min-h-[220px] overflow-hidden bg-slate-50/80 px-4 py-7 sm:min-h-[250px] sm:px-6 sm:py-8 lg:min-h-[280px] lg:px-7 lg:py-9">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.28]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 70% 65% at 50% 50%, black 20%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto flex h-full max-w-[400px] items-center justify-center">
        <LaptopFrame art={art} />
        {chips.map((chip) => (
          <span
            key={chip.id}
            className={`absolute z-[1] inline-flex max-w-[10.5rem] items-center gap-1.5 rounded-xl border border-border/70 bg-white px-2 py-1.5 ${ELEVATION_HAIRLINE} ${SLOT_CLASS[chip.slot]}`}
          >
            {chip.id === "m365" ? (
              <M365SuiteMark />
            ) : (
              <span
                className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                  TONE_WELL[chip.tone ?? "teal"]
                }`}
              >
                <ChipGlyph id={chip.id} />
              </span>
            )}
            <span
              className={`${CARD_META_CLASS} !font-semibold !text-navy leading-snug`}
            >
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
    <div className="relative z-0 w-[min(100%,240px)] sm:w-[256px]">
      <div
        className={`rounded-xl border border-slate-200 bg-slate-800/90 p-[5px] ${ELEVATION_HAIRLINE}`}
      >
        <div className="overflow-hidden rounded-[9px] bg-white">
          <div className="flex items-center gap-1.5 border-b border-border/70 bg-slate-50 px-2.5 py-1.5">
            <span
              className={`inline-flex h-5 w-5 items-center justify-center rounded bg-navy ${BADGE_CLASS} text-white`}
            >
              K
            </span>
            <span className={`${CARD_META_CLASS} !font-semibold !text-navy`}>
              KEYON
            </span>
          </div>
          <div className="grid grid-cols-[48px_1fr] gap-2 p-2 sm:grid-cols-[52px_1fr] sm:p-2.5">
            <aside className="space-y-1 rounded-lg bg-slate-50 p-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-4 rounded ${
                    i === 1
                      ? "bg-accent/25"
                      : "border border-border/50 bg-white"
                  }`}
                />
              ))}
            </aside>
            <div className="min-w-0 space-y-1.5">
              <div className="flex items-center justify-between gap-1">
                <div className="min-w-0">
                  <p className={CARD_META_CLASS}>Tổng quan</p>
                  <p className={`${CARD_TITLE_CLASS} truncate`}>Điều khiển</p>
                </div>
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent">
                  <SolutionGlyph art={art} size={13} />
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {["Email", "Lịch", "Tài liệu", "Nhóm"].map((label) => (
                  <div
                    key={label}
                    className="rounded-md border border-border/60 bg-slate-50/90 px-1.5 py-1"
                  >
                    <p className={CARD_META_CLASS}>{label}</p>
                    <div className="mt-1 h-1 w-2/3 rounded-full bg-accent/20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-0.5 h-1.5 w-[70%] rounded-b bg-slate-300/80" />
      <div className="mx-auto h-0.5 w-[82%] rounded-b bg-slate-200" />
    </div>
  );
}

function M365SuiteMark() {
  return (
    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-50 p-0.5 ring-1 ring-border/50">
      <span className="grid grid-cols-2 gap-px">
        <span className="h-2 w-2 rounded-[1px] bg-[#2B579A]" />
        <span className="h-2 w-2 rounded-[1px] bg-[#217346]" />
        <span className="h-2 w-2 rounded-[1px] bg-[#C43E1C]" />
        <span className="h-2 w-2 rounded-[1px] bg-[#0078D4]" />
      </span>
    </span>
  );
}

function CheckIcon() {
  return (
    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="m5 12 5 5L20 7"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function ChipGlyph({ id }: { id: string }) {
  const props = {
    width: 12,
    height: 12,
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
    case "scale":
    case "sku":
    case "quote":
      return (
        <svg {...props}>
          <path d="M4 20V10M10 20V4M16 20v-8M22 20V8" strokeLinecap="round" />
        </svg>
      );
    case "handoff":
    case "order":
      return (
        <svg {...props}>
          <path d="M4 7h16M4 12h10M4 17h13" strokeLinecap="round" />
        </svg>
      );
    case "web":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <path d="M3 12h18M12 4a14 14 0 0 1 0 16M12 4a14 14 0 0 0 0 16" />
        </svg>
      );
    case "guide":
    case "support":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
        </svg>
      );
    case "infra":
      return (
        <svg {...props}>
          <rect x="4" y="4" width="16" height="6" rx="1.5" />
          <rect x="4" y="14" width="16" height="6" rx="1.5" />
        </svg>
      );
    case "renew":
    case "track":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="7" />
          <path d="M12 8v4l2.5 2.5" strokeLinecap="round" />
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
  size = 16,
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
          <path
            d="M3 17 10 10l4 4 7-8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
