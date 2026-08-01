"use client";

import { useEffect, useState } from "react";
import { computeSocialSold } from "@/storefront/lib/social-proof";

/**
 * Client sold counter: starts from deterministic social proof, rarely ticks +1
 * while the tab stays open (feels live, hard to spot as a static fake).
 */
export function useLiveSoldCount(slug: string): number {
  const [count, setCount] = useState(() => computeSocialSold(slug));

  useEffect(() => {
    setCount(computeSocialSold(slug));
  }, [slug]);

  useEffect(() => {
    const tick = () => {
      // Soft live feel: ~8–18% chance every ~75–110s
      if (Math.random() < 0.12) {
        setCount((c) => c + 1);
      }
    };
    const delay = 75_000 + Math.floor(Math.random() * 35_000);
    const id = window.setInterval(tick, delay);
    return () => window.clearInterval(id);
  }, [slug]);

  return count;
}
