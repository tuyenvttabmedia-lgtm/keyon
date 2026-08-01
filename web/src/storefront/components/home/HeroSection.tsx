import Link from "next/link";
import type { HomeHero } from "@/storefront/content/types";
import type { HeroPublicStats } from "@/server/hero-stats";
import { HeroSparkArea } from "./HeroSparkArea";
import { HeroTrustStrip } from "./HeroTrustStrip";
import {
  BADGE_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  FONT_DISPLAY,
  HERO_TITLE_CLASS,
  OVERLINE_CLASS,
  PAGE_LEAD_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  EASE_STANDARD,
  ELEVATION_CARD_HOVER,
  ELEVATION_CTA_HOVER,
  ELEVATION_HERO_HOVER,
  ELEVATION_MODAL,
  HOVER_LIFT_CARD,
  MOTION_SLOW,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";

type Props = {
  hero: HomeHero;
  stats: HeroPublicStats;
};

export function HeroSection({ hero, stats }: Props) {
  if (!hero.visible) return null;

  const titleMain = hero.titleAccent
    ? hero.title.replace(new RegExp(`\\s*${hero.titleAccent}\\s*$`), "").trim()
    : hero.title;

  const statCards = [stats.cards.total, stats.cards.activated, stats.cards.pending];

  return (
    <section className="bg-white pb-5 pt-5 md:pb-4 md:pt-5 lg:pb-6 lg:pt-8">
      <div className="home-container grid items-center gap-6 md:gap-7 lg:grid-cols-2 lg:gap-8 xl:gap-10">
        <div className="min-w-0 lg:pr-2">
          {hero.badge ? (
            <span className={`inline-flex w-fit rounded-full bg-accent-soft px-3 py-1 ${OVERLINE_CLASS} text-accent`}>
              {hero.badge}
            </span>
          ) : null}
          <h1 className={`mt-4 max-w-[34rem] sm:mt-5 lg:max-w-none ${HERO_TITLE_CLASS}`}>
            {titleMain}
            {hero.titleAccent ? (
              <>
                {" "}
                <span className="text-accent">{hero.titleAccent}</span>
              </>
            ) : null}
          </h1>
          <p className={`mt-4 sm:mt-5 lg:max-w-[36rem] ${PAGE_LEAD_CLASS}`}>
            {hero.subtitle}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap">
            <Link
              href={hero.ctaHref}
              className={`inline-flex h-12 w-full items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER} sm:h-[48px] sm:w-auto`}
            >
              {hero.ctaLabel}
            </Link>
            {hero.secondaryCtaLabel && hero.secondaryCtaHref ? (
              <Link
                href={hero.secondaryCtaHref}
                className={`inline-flex h-12 w-full items-center justify-center rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent sm:h-[48px] sm:w-auto`}
              >
                {hero.secondaryCtaLabel}
              </Link>
            ) : null}
          </div>
          {hero.trustItems?.length ? (
            <>
              <HeroTrustStrip items={hero.trustItems} />
              <div className="mt-6 hidden gap-4 sm:grid sm:grid-cols-3 sm:gap-3">
                {hero.trustItems.map((item, i) => (
                  <div key={item.title} className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                        <TrustIcon index={i} />
                      </span>
                      <p className={CARD_TITLE_CLASS}>{item.title}</p>
                    </div>
                    <p className={`mt-1.5 leading-snug sm:pl-10 ${CARD_META_CLASS}`}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>

        <div className="hidden md:block">
          <div
            className={`home-hero-panel rounded-2xl border border-border bg-white p-5 ${ELEVATION_MODAL} transition-[border-color,box-shadow] ${MOTION_SLOW} ${EASE_STANDARD} hover:border-slate-300 ${ELEVATION_HERO_HOVER} sm:p-6`}
          >
            <div className="flex items-center justify-between gap-3">
              <strong className={`${SUBSECTION_TITLE_CLASS} !text-lg sm:!text-xl`}>
                Tổng quan
              </strong>
              <span
                className={`inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 ${CARD_META_CLASS} font-medium transition hover:border-accent/40 hover:text-navy`}
              >
                {stats.windowDays} ngày qua
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-3">
              {statCards.map((s) => (
                <div
                  key={s.label}
                  className={`rounded-xl border border-border/70 bg-surface p-3 ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-border hover:bg-white ${ELEVATION_CARD_HOVER} sm:p-3.5`}
                >
                  <div className={CARD_META_CLASS}>{s.label}</div>
                  <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5">
                    <span
                      className={`${FONT_DISPLAY} text-xl font-bold tabular-nums tracking-tight text-navy sm:text-[1.35rem]`}
                    >
                      {s.valueLabel}
                    </span>
                    <span
                      className={`rounded-md px-1.5 py-0.5 ${BADGE_CLASS} ${
                        s.up ? "bg-emerald-50 text-accent" : "bg-rose-50 text-danger"
                      }`}
                      title="So với 7 ngày trước"
                    >
                      {s.deltaLabel}
                    </span>
                  </div>
                  <div className="home-hero-spark">
                    <HeroSparkArea
                      series={s.series}
                      scaleMax={stats.sparkScaleMax}
                      tone={s.up ? "up" : "down"}
                      gradientId={`hero-spark-${s.label.replace(/\s+/g, "-")}`}
                      compact
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className={`mt-5 ${CARD_META_CLASS} font-semibold uppercase tracking-wide`}>
              License Lifecycle
            </p>
            <div className="mt-3 grid grid-cols-4 gap-1.5 sm:gap-2">
              {[
                { title: "Mua hàng", sub: "Đặt hàng & thanh toán", icon: "cart" as const },
                { title: "Giao license", sub: "Nhận key/license", icon: "truck" as const },
                { title: "Kích hoạt", sub: "Kích hoạt & sử dụng", icon: "check" as const },
                { title: "Quản lý", sub: "Theo dõi & gia hạn", icon: "list" as const },
              ].map((step, i, arr) => (
                <div
                  key={step.title}
                  className="group/step relative flex flex-col items-center rounded-lg px-0.5 py-1 text-center"
                >
                  {i < arr.length - 1 ? (
                    <span
                      className="absolute left-[calc(50%+18px)] top-[22px] right-[-50%] border-t-2 border-dashed border-slate-200"
                      aria-hidden
                    />
                  ) : null}
                  <span
                    className={`relative z-[1] inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-sm ${TRANSITION_UI} group-hover/step:scale-105 group-hover/step:shadow-md`}
                  >
                    <LifecycleIcon name={step.icon} />
                  </span>
                  <p className={`mt-2.5 ${CARD_TITLE_CLASS} transition-colors group-hover/step:text-accent`}>
                    {step.title}
                  </p>
                  <p className={`mt-1 ${CARD_META_CLASS} leading-snug`}>{step.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LifecycleIcon({ name }: { name: "cart" | "truck" | "check" | "list" }) {
  const props = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    "aria-hidden": true as const,
  };
  if (name === "cart") {
    return (
      <svg {...props}>
        <circle cx="9" cy="20" r="1" />
        <circle cx="17" cy="20" r="1" />
        <path d="M3 4h2l2.4 11h9.6l2-8H7" />
      </svg>
    );
  }
  if (name === "truck") {
    return (
      <svg {...props}>
        <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7V10Z" />
        <circle cx="7" cy="18" r="1.5" />
        <circle cx="17" cy="18" r="1.5" />
      </svg>
    );
  }
  if (name === "check") {
    return (
      <svg {...props}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  );
}

function TrustIcon({ index }: { index: number }) {
  const props = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    "aria-hidden": true as const,
  };
  if (index === 1) {
    return (
      <svg {...props}>
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg {...props}>
        <path d="M4.5 13.5v-2a7.5 7.5 0 0 1 15 0v2" />
        <path d="M4.5 13.5a2 2 0 0 0 2 2H8v-5H6.5a2 2 0 0 0-2 2v1Z" />
        <path d="M19.5 13.5a2 2 0 0 1-2 2H16v-5h1.5a2 2 0 0 1 2 2v1Z" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M12 3 4.5 6v5.5c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
