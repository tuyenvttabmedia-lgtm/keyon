"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/storefront/hooks/use-prefers-reduced-motion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger fade-up for direct children (cards grid). */
  stagger?: boolean;
};

/**
 * One-shot fade/slide when entering viewport. Honors prefers-reduced-motion.
 */
export function Reveal({ children, className = "", stagger = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const classes = [
    "home-reveal",
    stagger ? "home-reveal-stagger" : "",
    visible ? "is-visible" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
}
