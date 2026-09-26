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
  tl: "left-[2%] top-[8%]",
  tr: "right-0 top-[14%]",
  ml: "left-0 top-[44%] hidden sm:flex",
  bl: "bottom-[10%] left-[3%]",
  br: "bottom-[6%] right-[1%]",
};

const PANEL_FADE =
  "motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]" as const;

const DASHBOARD_TILES: Record<
  HomeSolutionTabId,
  { label: string; bar: string }[]
> = {
  productivity: [
    { label: "Email", bar: "w-3/4" },
    { label: "Lịch", bar: "w-1/2" },
    { label: "Tài liệu", bar: "w-2/3" },
    { label: "Nhóm", bar: "w-3/5" },
  ],
  cloud: [
    { label: "Catalog", bar: "w-2/3" },
    { label: "SKU", bar: "w-1/2" },
    { label: "Quy mô", bar: "w-3/4" },
    { label: "Bàn giao", bar: "w-3/5" },
  ],
  security: [
    { label: "Endpoint", bar: "w-3/4" },
    { label: "Antivirus", bar: "w-2/3" },
    { label: "Kích hoạt", bar: "w-1/2" },
    { label: "Hỗ trợ", bar: "w-3/5" },
  ],
  backup: [
    { label: "Gói backup", bar: "w-2/3" },
    { label: "Khôi phục", bar: "w-3/5" },
    { label: "Hạ tầng", bar: "w-3/4" },
    { label: "Hướng dẫn", bar: "w-1/2" },
  ],
  "license-management": [
    { label: "Tài khoản", bar: "w-3/4" },
    { label: "Hạn dùng", bar: "w-2/3" },
    { label: "Gia hạn", bar: "w-1/2" },
    { label: "Đơn hàng", bar: "w-3/5" },
  ],
};

/**
 * Home Giải pháp — ecosystem showcase (scoped `.home-solutions` only).
 * Composition: header → segmented nav → featured panel (42% visual / 58% copy).
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
      }, 160);
    },
    [activeId],
  );

  if (tabs.length === 0) return null;

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0]!;
  const tabId = (active.id in HOME_SOLUTION_SHOWCASE
    ? active.id
    : "productivity") as HomeSolutionTabId;
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
      className="home-solutions scroll-mt-24 border-t border-border bg-[#F8FAFC] py-16 lg:py-20"
    >
      <div className="home-container">
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
          className="home-solutions__nav mb-5 flex gap-1 overflow-x-auto rounded-2xl border border-border/80 bg-white/80 p-1.5 lg:mb-6 lg:grid lg:grid-cols-5 lg:overflow-visible"
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
                className={`group relative inline-flex min-w-[10.5rem] flex-col gap-0.5 rounded-xl px-3 py-2.5 text-left ${TRANSITION_COLORS} ${MOTION_NORMAL} ${EASE_STANDARD} lg:min-w-0 ${
                  selected
                    ? `bg-white text-navy ${ELEVATION_HAIRLINE} ring-1 ring-accent/35`
                    : "text-muted hover:bg-slate-50 hover:text-navy"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${TRANSITION_COLORS} ${
                      selected
                        ? "bg-accent-soft text-accent"
                        : "bg-slate-100 text-muted group-hover:text-navy"
                    }`}
                  >
                    <SolutionGlyph art={tab.art} size={14} />
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
                  className={`pl-9 leading-snug ${
                    selected ? TAB_ACTIVE_CLASS : TAB_CLASS
                  }`}
                >
                  {showcase?.tabLabel ?? tab.title}
                </span>
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-accent transition-opacity ${MOTION_NORMAL} ${
                    selected ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${tablistId}-panel`}
          aria-labelledby={`${tablistId}-${active.id}`}
          className={`home-solutions__panel grid overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_HAIRLINE} lg:grid-cols-[42fr_58fr]`}
        >
          <div
            className={`border-b border-border lg:border-b-0 lg:border-r ${PANEL_FADE} ${
              panelIn
                ? "opacity-100 motion-safe:translate-y-0"
                : "opacity-0 motion-safe:translate-y-1"
            }`}
          >
            <SolutionVisual
              art={active.art}
              chips={panel.chips}
              tabId={tabId}
            />
          </div>

          <div
            className={`flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-9 lg:px-10 lg:py-10 ${PANEL_FADE} ${
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
            <p className={`mt-3 max-w-lg ${SECTION_LEAD_CLASS}`}>{panel.lead}</p>

            <ul className="mt-5 space-y-2.5">
              {panel.checks.map((line) => (
                <li key={line} className={`flex gap-2.5 ${BODY_MUTED_CLASS}`}>
                  <CheckIcon />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <Link
                href={active.href}
                className={`inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                {HOME_SOLUTIONS_SECTION_COPY.primaryCta} →
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
  tabId,
}: {
  art: SolutionItem["art"];
  chips: SolutionChip[];
  tabId: HomeSolutionTabId;
}) {
  return (
    <div className="home-solutions__visual relative min-h-[260px] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50/40 px-5 py-9 sm:min-h-[300px] sm:px-7 sm:py-10 lg:min-h-[340px] lg:px-8 lg:py-11">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 70% 65% at 50% 48%, black 20%, transparent 75%)",
        }}
      />
      <div
        className="pointer-events-none absolute -left-10 top-1/4 h-40 w-40 rounded-full bg-accent/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 bottom-1/4 h-36 w-36 rounded-full bg-sky-400/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex h-full max-w-[440px] items-center justify-center">
        <div
          className="pointer-events-none absolute bottom-[12%] left-1/2 h-3 w-[70%] -translate-x-1/2 rounded-[100%] bg-slate-900/10 blur-md"
          aria-hidden
        />

        <DashboardMock art={art} tabId={tabId} />

        {chips.map((chip, i) => (
          <span
            key={chip.id}
            className={`absolute z-[1] inline-flex max-w-[10.5rem] items-center gap-2 rounded-xl border border-border/70 bg-white/95 px-2.5 py-1.5 ${ELEVATION_FLOAT} ${SLOT_CLASS[chip.slot]} motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.2,0,0,1)]`}
            style={{ transitionDelay: `${i * 30}ms` }}
          >
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <ChipGlyph id={chip.id} />
            </span>
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

function DashboardMock({
  art,
  tabId,
}: {
  art: SolutionItem["art"];
  tabId: HomeSolutionTabId;
}) {
  const tiles = DASHBOARD_TILES[tabId];
  return (
    <div className="relative z-0 w-[min(100%,292px)] sm:w-[312px]">
      <div
        className={`rounded-2xl border border-slate-200/90 bg-slate-800/95 p-[7px] ${ELEVATION_FLOAT}`}
      >
        <div className="overflow-hidden rounded-[13px] bg-white">
          <div className="flex items-center gap-1.5 border-b border-border/80 bg-slate-50/90 px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            <span className={`ml-2 ${CARD_META_CLASS}`}>KEYON · workspace</span>
          </div>
          <div className="grid grid-cols-[58px_1fr] gap-2.5 p-3 sm:grid-cols-[66px_1fr]">
            <aside className="space-y-1.5 rounded-xl bg-slate-50 p-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-5 rounded-md ${
                    i === 1
                      ? "bg-accent/25"
                      : "border border-border/60 bg-white"
                  }`}
                />
              ))}
            </aside>
            <div className="min-w-0 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className={CARD_META_CLASS}>Giải pháp</p>
                  <p className={`${CARD_TITLE_CLASS} mt-0.5 truncate`}>
                    Bảng điều khiển
                  </p>
                </div>
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <SolutionGlyph art={art} size={15} />
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {tiles.map((cell) => (
                  <div
                    key={cell.label}
                    className="rounded-lg border border-border/70 bg-slate-50/90 px-2 py-1.5"
                  >
                    <p className={CARD_META_CLASS}>{cell.label}</p>
                    <div
                      className={`mt-1.5 h-1.5 rounded-full bg-accent/20 ${cell.bar}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-0.5 h-2 w-[70%] rounded-b-md bg-slate-300/80" />
      <div className="mx-auto h-1 w-[82%] rounded-b-sm bg-slate-200/90" />
    </div>
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
    width: 13,
    height: 13,
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
