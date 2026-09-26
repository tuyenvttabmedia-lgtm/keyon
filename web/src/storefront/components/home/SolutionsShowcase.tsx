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
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Check,
  Cloud,
  FileText,
  HardDrive,
  KeyRound,
  Mail,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import type { SolutionItem } from "@/storefront/content/types";
import {
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  LINK_ACCENT_CLASS,
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

/** Eyebrow / index — avoid OVERLINE/BADGE `text-[11px]`. */
const EYE_CLASS =
  "text-xs font-semibold uppercase tracking-wider text-accent" as const;
const INDEX_CLASS = "text-xs font-bold tabular-nums" as const;

const TAB_ICON: Record<HomeSolutionTabId, LucideIcon> = {
  productivity: TrendingUp,
  cloud: Cloud,
  security: ShieldCheck,
  backup: HardDrive,
  "license-management": KeyRound,
};

const CHIP_ICON: Record<string, LucideIcon> = {
  mail: Mail,
  cloud: Cloud,
  m365: FileText,
  cal: CalendarDays,
  team: Users,
  shield: ShieldCheck,
  key: KeyRound,
  account: KeyRound,
  backup: HardDrive,
  restore: HardDrive,
  scale: TrendingUp,
  sku: FileText,
  handoff: FileText,
  quote: FileText,
  web: ShieldCheck,
  guide: FileText,
  support: Users,
  infra: HardDrive,
  renew: CalendarDays,
  track: CalendarDays,
  order: FileText,
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
 * Home Giải pháp — tabs + panel. Lucide icons; content-weighted columns.
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
  const TabIcon = TAB_ICON[tabId];
  const sectionTitle =
    title?.trim() && title.trim() !== "Giải pháp"
      ? title.trim()
      : HOME_SOLUTIONS_SECTION_COPY.title;
  const sectionLead =
    subtitle?.trim() || HOME_SOLUTIONS_SECTION_COPY.subtitle;
  const panelDomId = `${tablistId}-panel`;

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
            <p className={EYE_CLASS}>{HOME_SOLUTIONS_SECTION_COPY.overline}</p>
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
            const Icon =
              TAB_ICON[(tab.id as HomeSolutionTabId)] ?? TrendingUp;
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
                aria-controls={panelDomId}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectTab(tab.id)}
                className={`inline-flex min-w-[10.5rem] items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left ${TRANSITION_COLORS} ${MOTION_NORMAL} ${EASE_STANDARD} lg:min-w-0 ${
                  selected
                    ? "border-accent bg-accent-soft/60 text-accent"
                    : "border-border/80 bg-white text-navy hover:border-accent/40 hover:text-accent"
                }`}
              >
                <span
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    selected
                      ? "bg-white text-accent"
                      : "bg-slate-50 text-muted"
                  }`}
                  aria-hidden
                >
                  <Icon size={16} strokeWidth={1.9} />
                </span>
                <span className="min-w-0">
                  <span
                    className={`block ${INDEX_CLASS} ${
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

        {/*
          Single live tabpanel — content-weighted grid:
          left visual ~38%, right copy ~62% (copy is primary).
        */}
        <div
          role="tabpanel"
          id={panelDomId}
          aria-labelledby={`${tablistId}-${active.id}`}
          tabIndex={0}
          className={`home-solutions__panel overflow-hidden rounded-2xl border border-border/80 bg-white ${ELEVATION_HAIRLINE}`}
        >
          <div
            key={active.id}
            className={`grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)] ${PANEL_FADE} ${
              panelIn
                ? "opacity-100 motion-safe:translate-y-0"
                : "opacity-0 motion-safe:translate-y-1"
            }`}
          >
            <div className="border-b border-border/70 bg-slate-50/70 lg:border-b-0 lg:border-r">
              <SolutionVisual
                Icon={TabIcon}
                kicker={panel.panelKicker}
                chips={chips}
              />
            </div>

            <div className="flex flex-col justify-center px-5 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8 xl:pr-10">
              <p className={EYE_CLASS}>
                {String(activeIndex + 1).padStart(2, "0")} / {panel.panelKicker}
              </p>
              <h3 className={`mt-2 ${SUBSECTION_TITLE_CLASS}`}>
                {panel.headline}
              </h3>
              <p className={`mt-2.5 max-w-lg ${SECTION_LEAD_CLASS}`}>
                {panel.lead}
              </p>

              <ul className="mt-4 space-y-2">
                {panel.checks.map((line) => (
                  <li key={line} className={`flex gap-2.5 ${BODY_MUTED_CLASS}`}>
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <Check size={12} strokeWidth={2.5} aria-hidden />
                    </span>
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
      </div>
    </section>
  );
}

/** Left column: category mark + capability grid — no fake laptop chrome. */
function SolutionVisual({
  Icon,
  kicker,
  chips,
}: {
  Icon: LucideIcon;
  kicker: string;
  chips: SolutionChip[];
}) {
  return (
    <div className="home-solutions__visual flex h-full flex-col justify-center gap-4 px-5 py-6 sm:px-6 sm:py-7 lg:px-7 lg:py-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <Icon size={22} strokeWidth={1.75} aria-hidden />
        </span>
        <div className="min-w-0">
          <p className={`${CARD_META_CLASS} uppercase tracking-wide`}>Chủ đề</p>
          <p className={`${CARD_TITLE_CLASS} mt-0.5 truncate`}>{kicker}</p>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {chips.map((chip) => {
          const ChipLucide = CHIP_ICON[chip.id] ?? FileText;
          return (
            <li
              key={chip.id}
              className={`flex items-start gap-2.5 rounded-xl border border-border/70 bg-white px-3 py-2.5 ${ELEVATION_HAIRLINE}`}
            >
              <span
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  TONE_WELL[chip.tone ?? "teal"]
                }`}
              >
                <ChipLucide size={15} strokeWidth={1.9} aria-hidden />
              </span>
              <span className={`${CARD_TITLE_CLASS} !font-semibold leading-snug pt-1`}>
                {chip.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
