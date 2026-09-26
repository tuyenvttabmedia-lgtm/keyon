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
  CTA_COMPACT_CLASS,
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
  ELEVATION_FLOAT,
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
  tl: "left-0 top-[2%] sm:left-[1%] sm:top-[4%]",
  tr: "right-0 top-[8%] sm:right-[1%] sm:top-[10%]",
  ml: "-left-1 top-[46%] hidden sm:flex",
  bl: "bottom-[8%] left-[2%] sm:bottom-[6%] sm:left-[4%]",
  br: "bottom-[2%] right-[2%] sm:bottom-[4%] sm:right-[6%]",
};

const TONE_WELL: Record<NonNullable<SolutionChip["tone"]>, string> = {
  sky: "bg-sky-100 text-sky-600",
  violet: "bg-violet-100 text-violet-600",
  cyan: "bg-cyan-100 text-cyan-700",
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
  teal: "bg-accent-soft text-accent",
};

const PANEL_FADE =
  "motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]";

/**
 * Home Giải pháp — mockup-aligned ecosystem showcase.
 * Scoped `.home-solutions` only. Composition: header → tabs → featured panel.
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
      }, 150);
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
      className="home-solutions relative scroll-mt-24 overflow-hidden border-t border-border/60 py-14 lg:py-20"
    >
      {/* Soft cyan atmosphere — mockup */}
      <div
        className="pointer-events-none absolute inset-0 bg-[#F7FBFC]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full bg-accent/[0.09] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-sky-300/15 blur-3xl"
        aria-hidden
      />

      <div className="home-container relative">
        <div className="mb-8 flex flex-col gap-3 lg:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="max-w-2xl">
            <p
              className={`${OVERLINE_CLASS} uppercase tracking-[0.14em] text-accent`}
            >
              {HOME_SOLUTIONS_SECTION_COPY.overline}
            </p>
            <h2 className={`mt-2.5 ${SECTION_TITLE_CLASS}`}>{sectionTitle}</h2>
            <p className={`mt-2.5 max-w-xl ${SECTION_LEAD_CLASS}`}>
              {sectionLead}
            </p>
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
          className="home-solutions__nav mb-5 flex gap-2.5 overflow-x-auto pb-1 lg:mb-6 lg:grid lg:grid-cols-5 lg:gap-3 lg:overflow-visible lg:pb-0"
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
                className={`inline-flex min-w-[11.25rem] flex-col gap-1.5 rounded-2xl border bg-white px-3.5 py-3 text-left ${TRANSITION_COLORS} ${MOTION_NORMAL} ${EASE_STANDARD} lg:min-w-0 ${
                  selected
                    ? `border-accent text-accent ${ELEVATION_HAIRLINE} ring-1 ring-accent/25`
                    : `border-border/80 text-navy ${ELEVATION_HAIRLINE} hover:border-accent/35 hover:text-accent`
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                      selected
                        ? "bg-accent-soft text-accent"
                        : "bg-slate-50 text-muted"
                    }`}
                  >
                    <SolutionGlyph art={tab.art} size={15} />
                  </span>
                  <span
                    className={`tabular-nums ${BADGE_CLASS} ${
                      selected ? "text-accent" : "text-muted"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <span
                  className={`leading-snug ${
                    selected ? TAB_ACTIVE_CLASS : TAB_CLASS
                  } ${selected ? "!text-accent" : ""}`}
                >
                  {showcase?.tabLabel ?? tab.title}
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${tablistId}-panel`}
          aria-labelledby={`${tablistId}-${active.id}`}
          className={`home-solutions__panel grid overflow-hidden rounded-[1.35rem] border border-border/70 bg-white ${ELEVATION_FLOAT} lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]`}
        >
          <div
            className={`${PANEL_FADE} ${
              panelIn
                ? "opacity-100 motion-safe:translate-y-0"
                : "opacity-0 motion-safe:translate-y-1"
            }`}
          >
            <SolutionVisual art={active.art} chips={panel.chips} />
          </div>

          <div
            className={`flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-9 lg:px-9 lg:py-10 xl:px-11 ${PANEL_FADE} ${
              panelIn
                ? "opacity-100 motion-safe:translate-y-0"
                : "opacity-0 motion-safe:translate-y-1"
            }`}
          >
            <p className={`${OVERLINE_CLASS} text-accent`}>
              {String(activeIndex + 1).padStart(2, "0")} / {panel.panelKicker}
            </p>
            <h3 className={`mt-3 ${SUBSECTION_TITLE_CLASS} sm:text-2xl`}>
              {panel.headline}
            </h3>
            <p className={`mt-3 max-w-md ${SECTION_LEAD_CLASS}`}>{panel.lead}</p>

            <ul className="mt-5 space-y-2.5">
              {panel.checks.map((line) => (
                <li key={line} className={`flex gap-2.5 ${BODY_MUTED_CLASS}`}>
                  <CheckIcon />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href={active.href}
                className={`inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                {HOME_SOLUTIONS_SECTION_COPY.primaryCta} →
              </Link>
              <Link
                href={HOME_SOLUTIONS_SECTION_COPY.secondaryCtaHref}
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 ${CTA_COMPACT_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
              >
                <DocIcon />
                {HOME_SOLUTIONS_SECTION_COPY.secondaryCta}
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
    <div className="home-solutions__visual relative min-h-[280px] overflow-hidden bg-gradient-to-br from-[#EEF8FA] via-white to-[#E8F4F8] px-5 py-10 sm:min-h-[320px] sm:px-7 sm:py-11 lg:min-h-[380px] lg:px-8 lg:py-12">
      {/* Soft grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(14,165,164,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(14,165,164,0.07) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse 72% 68% at 48% 48%, black 15%, transparent 72%)",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/4 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-36 w-36 rounded-full bg-sky-400/15 blur-3xl"
        aria-hidden
      />

      {/* Connector arcs — mockup glow lines */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-accent/25"
        viewBox="0 0 480 360"
        fill="none"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M90 95C150 70 200 95 240 140"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeDasharray="3 7"
        />
        <path
          d="M390 110C340 95 300 130 260 155"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeDasharray="3 7"
        />
        <path
          d="M70 230C130 210 180 200 235 175"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeDasharray="3 7"
        />
        <path
          d="M400 250C340 220 300 200 255 175"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeDasharray="3 7"
        />
        <circle cx="240" cy="160" r="3.5" fill="currentColor" opacity="0.5" />
      </svg>

      <div className="relative mx-auto flex h-full max-w-[460px] items-center justify-center">
        <div
          className="pointer-events-none absolute bottom-[8%] left-1/2 h-4 w-[68%] -translate-x-1/2 rounded-[100%] bg-slate-900/12 blur-md"
          aria-hidden
        />
        <LaptopFrame art={art} />
        {chips.map((chip) => (
          <span
            key={chip.id}
            className={`absolute z-[1] inline-flex max-w-[12.5rem] items-center gap-2 rounded-2xl border border-white/80 bg-white/95 px-2.5 py-2 backdrop-blur-[2px] ${ELEVATION_FLOAT} ${SLOT_CLASS[chip.slot]}`}
          >
            {chip.id === "m365" ? (
              <M365SuiteMark />
            ) : (
              <span
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
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
    <div className="relative z-0 w-[min(100%,276px)] sm:w-[300px]">
      <div
        className={`rounded-[16px] border border-slate-700/80 bg-gradient-to-b from-slate-700 to-slate-900 p-[6px] ${ELEVATION_FLOAT}`}
      >
        <div className="overflow-hidden rounded-[11px] bg-white">
          {/* Title bar with KEYON mark — not browser traffic lights only */}
          <div className="flex items-center gap-2 border-b border-border/70 bg-slate-50/95 px-3 py-2">
            <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md bg-navy ${BADGE_CLASS} text-white`}>
              K
            </span>
            <span className={`${CARD_META_CLASS} !font-semibold !text-navy`}>
              KEYON
            </span>
            <span className={`ml-auto ${CARD_META_CLASS}`}>Workspace</span>
          </div>
          <div className="grid grid-cols-[58px_1fr] gap-2.5 p-2.5 sm:grid-cols-[64px_1fr] sm:p-3">
            <aside className="space-y-1.5 rounded-xl bg-slate-50 p-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-5 rounded-md ${
                    i === 1
                      ? "bg-accent/30"
                      : "border border-border/50 bg-white"
                  }`}
                />
              ))}
            </aside>
            <div className="min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className={CARD_META_CLASS}>Tổng quan</p>
                  <p className={`${CARD_TITLE_CLASS} mt-0.5 truncate`}>
                    Bảng điều khiển
                  </p>
                </div>
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <SolutionGlyph art={art} size={14} />
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: "Email", bar: "w-3/4" },
                  { label: "Lịch", bar: "w-1/2" },
                  { label: "Tài liệu", bar: "w-2/3" },
                  { label: "Nhóm", bar: "w-3/5" },
                ].map((cell) => (
                  <div
                    key={cell.label}
                    className="rounded-lg border border-border/60 bg-slate-50/90 px-2 py-1.5"
                  >
                    <p className={CARD_META_CLASS}>{cell.label}</p>
                    <div
                      className={`mt-1.5 h-1.5 rounded-full bg-accent/25 ${cell.bar}`}
                    />
                  </div>
                ))}
              </div>
              {/* Activity strip — depth without fake metrics */}
              <div className="rounded-lg border border-border/50 bg-white px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 flex-1 rounded-full bg-accent/20" />
                  <span className="h-1.5 w-8 rounded-full bg-slate-100" />
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="h-1.5 w-10 rounded-full bg-slate-100" />
                  <span className="h-1.5 flex-1 rounded-full bg-sky-200/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-0.5 h-2.5 w-[74%] rounded-b-md bg-slate-400/80" />
      <div className="mx-auto h-[3px] w-[88%] rounded-b-sm bg-slate-300/90" />
    </div>
  );
}

/** Generic colored suite tiles — no third-party logos. */
function M365SuiteMark() {
  return (
    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-50 p-1 ring-1 ring-border/60">
      <span className="grid grid-cols-2 gap-0.5">
        <span className="h-2.5 w-2.5 rounded-[2px] bg-[#2B579A]" />
        <span className="h-2.5 w-2.5 rounded-[2px] bg-[#217346]" />
        <span className="h-2.5 w-2.5 rounded-[2px] bg-[#C43E1C]" />
        <span className="h-2.5 w-2.5 rounded-[2px] bg-[#0078D4]" />
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

function DocIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
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
