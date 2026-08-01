"use client";

import { useEffect, useRef, useState } from "react";
import type { HomeHeroTrustItem } from "@/storefront/content/types";
import { CARD_META_CLASS, CARD_TITLE_CLASS } from "@/storefront/typography";

type Props = {
  items: HomeHeroTrustItem[];
};

/** Mobile: horizontal snap strip + dots. sm+: 3-col grid (parent switches layout). */
export function HeroTrustStrip({ items }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const children = Array.from(el.children) as HTMLElement[];
      if (!children.length) return;
      const left = el.scrollLeft;
      let best = 0;
      let bestDist = Infinity;
      children.forEach((child, i) => {
        const dist = Math.abs(child.offsetLeft - left);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActive(best);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="mt-6 sm:hidden">
      <div ref={scrollerRef} className="home-snap-x -mx-4 px-4 pb-1">
        {items.map((item, i) => (
          <div
            key={item.title}
            className="w-[min(78vw,280px)] rounded-2xl border border-border/80 bg-surface/80 p-3.5"
          >
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                <TrustIcon index={i} />
              </span>
              <p className={CARD_TITLE_CLASS}>{item.title}</p>
            </div>
            <p className={`mt-2 leading-snug ${CARD_META_CLASS}`}>{item.description}</p>
          </div>
        ))}
      </div>
      {items.length > 1 ? (
        <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
          {items.map((item, i) => (
            <span
              key={item.title}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ${
                i === active ? "w-5 bg-accent" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
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
