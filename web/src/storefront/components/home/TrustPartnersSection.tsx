"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import type { PartnerItem, HomeContent } from "@/storefront/content/types";
import { HomeSectionHeading } from "../HomeSectionHeading";
import { usePrefersReducedMotion } from "@/storefront/hooks/use-prefers-reduced-motion";
import { BrandLogo, brandLogoIdFromName } from "@/storefront/brand-logo";
import {
  EASE_STANDARD,
  ELEVATION_CARD_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  MOTION_NORMAL,
  MOTION_SLOW,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";

type Partners = HomeContent["partners"];

const AUTO_MS = 3500;
/** Card width (168) + gap (32) — keep in sync with PartnerSlide + track gap */
const STEP_PX = 200;
const GAP_PX = 32;

/**
 * Logo carousel. Each brand is rendered once, in list order.
 * The track only slides when the row overflows, so a short list is not cloned to fill the viewport.
 */
export function TrustPartnersSection({
  data,
  className = "",
}: {
  data: Partners;
  className?: string;
}) {
  const items = data.items.filter((p) => p.visible !== false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(items.length);
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const len = items.length;
  const maxIndex = Math.max(0, len - Math.max(1, visible));
  const canSlide = maxIndex > 0 && !reducedMotion;
  const autoPlay = canSlide && !paused;

  const go = useCallback(
    (dir: -1 | 1) => {
      if (!canSlide) return;
      setIndex((i) => {
        const next = i + dir;
        if (next > maxIndex) return 0;
        if (next < 0) return maxIndex;
        return next;
      });
    },
    [canSlide, maxIndex],
  );

  useLayoutEffect(() => {
    if (!viewport) return;
    const measure = () => {
      const count = Math.max(1, Math.floor((viewport.clientWidth + GAP_PX) / STEP_PX));
      setVisible(count);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [viewport, len]);

  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex);
  }, [index, maxIndex]);

  useEffect(() => {
    if (!autoPlay) return;
    const id = window.setInterval(() => go(1), AUTO_MS);
    return () => window.clearInterval(id);
  }, [autoPlay, go]);

  if (!len) return null;

  const offset = canSlide ? index * STEP_PX : 0;

  return (
    <section className={`bg-white pb-5 pt-4 md:pb-6 md:pt-5 lg:pt-6 ${className}`}>
      <div className="home-container">
        <HomeSectionHeading
          title={data.title || "Hệ sinh thái sản phẩm & thương hiệu"}
          variant="centered"
        />

        <div
          className="relative flex items-center gap-2 md:gap-3"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setPaused(false);
            }
          }}
        >
          <ArrowButton
            label="Thương hiệu trước"
            direction="prev"
            onClick={() => go(-1)}
            disabled={!canSlide}
            className="hidden sm:inline-flex"
          />

          <div ref={setViewport} className="relative min-w-0 flex-1 overflow-hidden px-1">
            <div
              className={
                canSlide
                  ? `flex items-center gap-8 py-3 transition-transform ${MOTION_SLOW} ${EASE_STANDARD}`
                  : "flex items-center justify-center gap-8 py-3"
              }
              style={canSlide ? { transform: `translateX(-${offset}px)` } : undefined}
              aria-label="Thương hiệu phần mềm"
              aria-roledescription="carousel"
            >
              {items.map((item) => (
                <PartnerSlide key={item.id} item={item} />
              ))}
            </div>
          </div>

          <ArrowButton
            label="Thương hiệu sau"
            direction="next"
            onClick={() => go(1)}
            disabled={!canSlide}
            className="hidden sm:inline-flex"
          />
        </div>

        {canSlide ? (
          <div
            className="mt-3 flex items-center justify-center gap-1.5"
            role="tablist"
            aria-label="Vị trí thương hiệu"
          >
            {Array.from({ length: maxIndex + 1 }, (_, i) => {
              const active = i === index;
              const name = items[i]?.name ?? `${i + 1}`;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Thương hiệu ${i + 1}: ${name}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-[width,background-color] ${MOTION_NORMAL} ${
                    active ? "w-5 bg-accent" : "w-1.5 bg-border hover:bg-muted-soft"
                  }`}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ArrowButton({
  label,
  direction,
  onClick,
  disabled,
  className = "",
}: {
  label: string;
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-navy ${ELEVATION_HAIRLINE} ${TRANSITION_UI} hover:border-accent hover:text-accent disabled:cursor-default disabled:opacity-40 ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
        {direction === "prev" ? <path d="M15 6 9 12l6 6" /> : <path d="m9 6 6 6-6 6" />}
      </svg>
    </button>
  );
}

function PartnerSlide({ item }: { item: PartnerItem }) {
  const inner = item.logoUrl ? (
    <Image
      src={item.logoUrl}
      alt={item.name}
      width={160}
      height={48}
      className="h-7 w-auto max-h-7 max-w-[118px] object-contain object-center md:h-8 md:max-h-8 md:max-w-[128px]"
    />
  ) : (
    <BrandMark name={item.name} color={item.brandColor} />
  );

  const className = `inline-flex h-14 w-[168px] shrink-0 items-center justify-center rounded-xl border border-border/80 bg-white px-5 py-3 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/50 ${ELEVATION_CARD_HOVER}`;

  if (item.href) {
    const external = /^https?:\/\//i.test(item.href);
    return (
      <a
        href={item.href}
        className={className}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }
  return <div className={className}>{inner}</div>;
}

function BrandMark({ name, color }: { name: string; color?: string }) {
  const logo = brandLogoIdFromName(name);
  if (logo) {
    return <BrandLogo name={logo} size={28} wide={logo === "veeam" || logo === "aws"} />;
  }
  return (
    <span className="truncate text-sm font-bold text-navy" style={color ? { color } : undefined}>
      {name}
    </span>
  );
}
