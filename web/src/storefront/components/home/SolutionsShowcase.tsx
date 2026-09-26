"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type SVGProps,
} from "react";
import type { SolutionItem } from "@/storefront/content/types";
import {
  BODY_MUTED_CLASS,
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

type IconSize = "sm" | "md" | "lg";

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
 * Home Giải pháp — filled product icons (same language as Categories),
 * no micro uppercase eyebrow classes.
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
            <h2 className={SECTION_TITLE_CLASS}>{sectionTitle}</h2>
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
            const iconKey = (tab.id in TAB_ICONS
              ? tab.id
              : "productivity") as HomeSolutionTabId;
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
                  className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    selected
                      ? "bg-white text-accent"
                      : "bg-slate-50 text-navy"
                  }`}
                  aria-hidden
                >
                  <SolutionTopicIcon topic={iconKey} size="sm" />
                </span>
                <span className="min-w-0">
                  <span
                    className={`block text-sm font-semibold tabular-nums ${
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
              <SolutionVisual topic={tabId} title={panel.panelKicker} chips={chips} />
            </div>

            <div className="flex flex-col justify-center px-5 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8 xl:pr-10">
              <p className={`text-sm font-semibold text-accent`}>
                {String(activeIndex + 1).padStart(2, "0")} · {panel.panelKicker}
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
                      <CheckMarkIcon />
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

function SolutionVisual({
  topic,
  title,
  chips,
}: {
  topic: HomeSolutionTabId;
  title: string;
  chips: SolutionChip[];
}) {
  return (
    <div className="home-solutions__visual flex h-full flex-col justify-center gap-4 px-5 py-6 sm:px-6 sm:py-7 lg:px-7 lg:py-8">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <SolutionTopicIcon topic={topic} size="md" />
        </span>
        <p className={`${CARD_TITLE_CLASS} leading-snug`}>{title}</p>
      </div>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {chips.map((chip) => (
          <li
            key={chip.id}
            className={`flex items-center gap-2.5 rounded-xl border border-border/70 bg-white px-3 py-2.5 ${ELEVATION_HAIRLINE}`}
          >
            <span
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                TONE_WELL[chip.tone ?? "teal"]
              }`}
            >
              <ChipIcon id={chip.id} size="sm" />
            </span>
            <span className={`${CARD_TITLE_CLASS} !font-semibold leading-snug`}>
              {chip.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Filled product icons (Categories-style, not thin Lucide outlines) ─── */

const TAB_ICONS: Record<HomeSolutionTabId, true> = {
  productivity: true,
  cloud: true,
  security: true,
  backup: true,
  "license-management": true,
};

function iconClass(size: IconSize) {
  return size === "lg" ? "h-10 w-10" : size === "md" ? "h-7 w-7" : "h-5 w-5";
}

function SolutionTopicIcon({
  topic,
  size = "sm",
}: {
  topic: HomeSolutionTabId;
  size?: IconSize;
}) {
  const props: SVGProps<SVGSVGElement> = {
    className: iconClass(size),
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };
  switch (topic) {
    case "productivity":
      // Filled app suite (4 tiles) — reads as productivity suite
      return (
        <svg {...props} fill="currentColor">
          <rect x="3" y="3" width="8" height="8" rx="1.5" />
          <rect x="13" y="3" width="8" height="8" rx="1.5" opacity="0.85" />
          <rect x="3" y="13" width="8" height="8" rx="1.5" opacity="0.85" />
          <rect x="13" y="13" width="8" height="8" rx="1.5" opacity="0.7" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...props} fill="currentColor">
          <path d="M7.2 18.5h9.6a4.1 4.1 0 0 0 .35-8.18A5.7 5.7 0 0 0 6.4 11.6 3.7 3.7 0 0 0 7.2 18.5Z" />
        </svg>
      );
    case "security":
      return (
        <svg {...props} fill="currentColor">
          <path d="M12 2.8 4.5 6v5.4c0 4.7 3.3 8.2 7.5 9.4 4.2-1.2 7.5-4.7 7.5-9.4V6L12 2.8Zm-1.1 11.6-2.6-2.6 1.3-1.3 1.3 1.3 3.4-3.4 1.3 1.3-4.7 4.7Z" />
        </svg>
      );
    case "backup":
      return (
        <svg {...props} fill="currentColor">
          <path d="M6 4h12a2 2 0 0 1 2 2v2H4V6a2 2 0 0 1 2-2Zm-2 6h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8Zm7 1.5v3.2l1.4-1.4 1.1 1.1L12 17.3l-3.5-3.4 1.1-1.1 1.4 1.4v-3.2H13Z" />
        </svg>
      );
    case "license-management":
      return (
        <svg {...props} fill="currentColor">
          <path d="M8.2 10.2a3.8 3.8 0 1 1 3.5 3.78V15h1.6v2H11.7v1.8H9.6V17H8v-2h1.7v-1.02a3.8 3.8 0 0 1-1.5-3.78Zm3.8-2.1a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2Z" />
          <path
            d="M14.5 7.2h5.2v2.2H16.8L19.5 12l-1.5 1.4-2.5-2.7V14h-2.2V7.2h1.2Z"
            opacity="0.45"
          />
        </svg>
      );
  }
}

function ChipIcon({ id, size = "sm" }: { id: string; size?: IconSize }) {
  const props: SVGProps<SVGSVGElement> = {
    className: iconClass(size),
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };
  switch (id) {
    case "mail":
      return (
        <svg {...props} fill="currentColor">
          <path d="M3.5 6.2A1.7 1.7 0 0 1 5.2 4.5h13.6a1.7 1.7 0 0 1 1.7 1.7v11.6a1.7 1.7 0 0 1-1.7 1.7H5.2a1.7 1.7 0 0 1-1.7-1.7V6.2Zm1.9.55 6.6 5 6.6-5v-.55H5.4v.55Zm13.3 1.7-5.9 4.45a1.7 1.7 0 0 1-2 0L4.9 8.45v9.05h13.8V8.45Z" />
        </svg>
      );
    case "cloud":
      return (
        <svg {...props} fill="currentColor">
          <path d="M7.2 18.5h9.6a4.1 4.1 0 0 0 .35-8.18A5.7 5.7 0 0 0 6.4 11.6 3.7 3.7 0 0 0 7.2 18.5Z" />
        </svg>
      );
    case "m365":
      return (
        <svg {...props} fill="currentColor">
          <rect x="3" y="3" width="8" height="8" rx="1.2" />
          <rect x="13" y="3" width="8" height="8" rx="1.2" opacity="0.85" />
          <rect x="3" y="13" width="8" height="8" rx="1.2" opacity="0.85" />
          <rect x="13" y="13" width="8" height="8" rx="1.2" opacity="0.7" />
        </svg>
      );
    case "cal":
    case "renew":
    case "track":
      return (
        <svg {...props} fill="currentColor">
          <path d="M8 3.2h1.8v1.6H14V3.2H15.8v1.6h2.4A1.8 1.8 0 0 1 20 6.6v12a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 18.6v-12A1.8 1.8 0 0 1 5.8 4.8H8V3.2Zm10.2 7.2H5.8v8.2h12.4v-8.2Zm-8.2 2.2h2.4v2.4H10v-2.4Zm4 0h2.4v2.4H14v-2.4Z" />
        </svg>
      );
    case "team":
    case "support":
      return (
        <svg {...props} fill="currentColor">
          <circle cx="9" cy="8" r="3.1" />
          <circle cx="16.2" cy="9" r="2.5" opacity="0.85" />
          <path d="M3.2 18.8c0-3.1 2.8-5.2 5.8-5.2s5.8 2.1 5.8 5.2v.5H3.2v-.5Z" />
          <path
            d="M14.2 18.8c.3-2.2 1.9-3.8 4.1-4.1 1.8.2 3.5 1.5 3.5 3.6v.5h-7.6v-.5Z"
            opacity="0.75"
          />
        </svg>
      );
    case "shield":
    case "web":
      return (
        <svg {...props} fill="currentColor">
          <path d="M12 2.8 4.5 6v5.4c0 4.7 3.3 8.2 7.5 9.4 4.2-1.2 7.5-4.7 7.5-9.4V6L12 2.8Zm-1.1 11.6-2.6-2.6 1.3-1.3 1.3 1.3 3.4-3.4 1.3 1.3-4.7 4.7Z" />
        </svg>
      );
    case "key":
    case "account":
      return (
        <svg {...props} fill="currentColor">
          <path d="M8.2 10.2a3.8 3.8 0 1 1 3.5 3.78V15h1.6v2H11.7v1.8H9.6V17H8v-2h1.7v-1.02a3.8 3.8 0 0 1-1.5-3.78Zm3.8-2.1a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2Z" />
        </svg>
      );
    case "backup":
    case "restore":
    case "infra":
      return (
        <svg {...props} fill="currentColor">
          <path d="M6 4h12a2 2 0 0 1 2 2v2H4V6a2 2 0 0 1 2-2Zm-2 6h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8Zm7 1.5v3.2l1.4-1.4 1.1 1.1L12 17.3l-3.5-3.4 1.1-1.1 1.4 1.4v-3.2H13Z" />
        </svg>
      );
    case "scale":
    case "sku":
      return (
        <svg {...props} fill="currentColor">
          <path d="M5 19.5V10h2.4v9.5H5Zm5.8 0V6.5h2.4v13H10.8Zm5.8 0V3.5H19v16h-2.4Z" />
        </svg>
      );
    case "handoff":
    case "order":
    case "guide":
    case "quote":
    default:
      return (
        <svg {...props} fill="currentColor">
          <path d="M7 3.5h7.2L19 8.3v12.2A1.5 1.5 0 0 1 17.5 22h-10A1.5 1.5 0 0 1 6 20.5v-15A1.5 1.5 0 0 1 7.5 4L7 3.5Zm6.8.8v3.7H17l-3.2-3.7ZM8.5 11h7v1.6h-7V11Zm0 3.2h7v1.6h-7v-1.6Zm0 3.2h5v1.6h-5v-1.6Z" />
        </svg>
      );
  }
}

function CheckMarkIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M9.6 16.7 5.3 12.4l1.4-1.4 2.9 2.9 7.1-7.1 1.4 1.4-8.5 8.5Z" />
    </svg>
  );
}
