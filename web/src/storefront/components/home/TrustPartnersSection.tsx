"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { PartnerItem, HomeContent } from "@/storefront/content/types";
import { HomeSectionHeading } from "../HomeSectionHeading";
import { usePrefersReducedMotion } from "@/storefront/hooks/use-prefers-reduced-motion";
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
const STEP_PX = 168; // card ~144 + gap

/**
 * Stepped carousel (mỗi vài giây nhảy 1 bước) + mũi tên hai đầu.
 * Auto-step tắt khi prefers-reduced-motion hoặc khi hover (pause).
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
  const reducedMotion = usePrefersReducedMotion();

  const len = items.length;
  const canSlide = len > 1;
  const autoPlay = canSlide && !paused && !reducedMotion;

  const go = useCallback(
    (dir: -1 | 1) => {
      if (!canSlide) return;
      setIndex((i) => (i + dir + len) % len);
    },
    [canSlide, len],
  );

  useEffect(() => {
    if (!autoPlay) return;
    const id = window.setInterval(() => go(1), AUTO_MS);
    return () => window.clearInterval(id);
  }, [autoPlay, go]);

  if (!len) return null;

  // Enough clones so track never looks empty while looping
  const track = [...items, ...items, ...items];
  const offset = index * STEP_PX;

  return (
    <section className={`bg-white pb-5 pt-4 md:pb-6 md:pt-5 lg:pt-6 ${className}`}>
      <div className="home-container">
        <HomeSectionHeading title={data.title} variant="centered" />

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

          <div className="relative min-w-0 flex-1 overflow-hidden">
            <div
              className={
                reducedMotion
                  ? "flex items-center gap-6 py-2.5"
                  : `flex items-center gap-6 py-2.5 transition-transform ${MOTION_SLOW} ${EASE_STANDARD}`
              }
              style={{ transform: `translateX(-${offset}px)` }}
              aria-label="Thương hiệu phần mềm"
              aria-roledescription="carousel"
            >
              {track.map((item, i) => (
                <PartnerSlide key={`${item.id}-${i}`} item={item} />
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
          <div className="mt-3 flex items-center justify-center gap-1.5" role="tablist" aria-label="Vị trí thương hiệu">
            {items.map((item, i) => {
              const active = i === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Đối tác ${i + 1}: ${item.name}`}
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
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white text-navy shadow-sm ${TRANSITION_UI} hover:border-accent hover:text-accent disabled:cursor-default disabled:opacity-40 ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
        {direction === "prev" ? (
          <path d="M15 6 9 12l6 6" />
        ) : (
          <path d="m9 6 6 6-6 6" />
        )}
      </svg>
    </button>
  );
}

function PartnerSlide({ item }: { item: PartnerItem }) {
  const inner = item.logoUrl ? (
    <Image
      src={item.logoUrl}
      alt={item.name}
      width={140}
      height={40}
      className="h-9 w-auto max-w-[140px] object-contain object-left md:h-10"
      unoptimized
    />
  ) : (
    <BrandMark name={item.name} color={item.brandColor} />
  );

  const className = `inline-flex h-12 w-[144px] shrink-0 items-center justify-center rounded-xl border border-border/80 bg-white px-3 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/50 ${ELEVATION_CARD_HOVER}`;

  if (item.href) {
    return (
      <a href={item.href} className={className} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return <div className={className}>{inner}</div>;
}

function BrandMark({ name, color }: { name: string; color?: string }) {
  const key = name.trim().toLowerCase();
  const c = color || "#0F172A";

  if (key === "microsoft") {
    return (
      <svg viewBox="0 0 128 28" className="h-7 w-auto" aria-label="Microsoft">
        <rect x="0" y="2" width="10" height="10" fill="#F25022" />
        <rect x="12" y="2" width="10" height="10" fill="#7FBA00" />
        <rect x="0" y="14" width="10" height="10" fill="#00A4EF" />
        <rect x="12" y="14" width="10" height="10" fill="#FFB900" />
        <text x="30" y="19" fill="#737373" fontFamily="Segoe UI, Arial, sans-serif" fontSize="14" fontWeight="600">
          Microsoft
        </text>
      </svg>
    );
  }
  if (key === "adobe") {
    return (
      <svg viewBox="0 0 88 28" className="h-7 w-auto" aria-label="Adobe">
        <path d="M14 3 2 25h5l2.2-5.2h9.6L21 25h5L14 3Zm.1 6.2 3.1 7.2h-6.2l3.1-7.2Z" fill="#EB1000" />
        <text x="32" y="19" fill="#EB1000" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700">
          Adobe
        </text>
      </svg>
    );
  }
  if (key === "autodesk") {
    return (
      <svg viewBox="0 0 120 28" className="h-7 w-auto" aria-label="Autodesk">
        <path d="M10 4 2 24h4.2l1.6-3.6h7.4L16.8 24H21L13 4h-3Zm2 5 2.6 5.8H9.4L12 9Z" fill="#0696D7" />
        <text x="26" y="19" fill="#0696D7" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700" letterSpacing="0.4">
          AUTODESK
        </text>
      </svg>
    );
  }
  if (key === "vmware") {
    return (
      <svg viewBox="0 0 96 28" className="h-7 w-auto" aria-label="VMware">
        <text x="0" y="19" fill="#607078" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="700" fontStyle="italic">
          vmware
        </text>
      </svg>
    );
  }
  if (key === "kaspersky") {
    return (
      <svg viewBox="0 0 118 28" className="h-7 w-auto" aria-label="Kaspersky">
        <path d="M3 4h3.6v7.2L13 4h4.4L10.8 12.2 18.4 24h-4.6L9 15.2V24H3V4Z" fill="#006D5C" />
        <text x="24" y="19" fill="#006D5C" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="600">
          kaspersky
        </text>
      </svg>
    );
  }
  if (key === "acronis") {
    return (
      <svg viewBox="0 0 100 28" className="h-7 w-auto" aria-label="Acronis">
        <circle cx="10" cy="14" r="7" fill="none" stroke="#1A73E8" strokeWidth="2.2" />
        <path d="M10 8.5v11M6.5 10.8l7 7M6.5 17.2l7-7" stroke="#1A73E8" strokeWidth="1.6" />
        <text x="24" y="19" fill="#1A73E8" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="600">
          Acronis
        </text>
      </svg>
    );
  }
  if (key === "norton") {
    return (
      <span className="inline-flex items-center gap-2 text-sm font-extrabold tracking-tight" style={{ color: "#1a1a1a" }}>
        <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-[#FFE01B] text-xs font-black">
          N
        </span>
        Norton
      </span>
    );
  }
  if (key === "mcafee") {
    return (
      <span className="text-sm font-extrabold tracking-tight" style={{ color: "#C01818" }}>
        McAfee
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: c }}>
      <span
        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-extrabold text-white"
        style={{ background: c }}
      >
        {name.slice(0, 2).toUpperCase()}
      </span>
      {name}
    </span>
  );
}
