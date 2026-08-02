"use client";

import { useEffect, useState } from "react";
import { computeSocialSold } from "@/storefront/lib/social-proof";

/** Sold counter — null when synthetic social proof is disabled. */
export function useLiveSoldCount(slug: string): number | null {
  const [count, setCount] = useState<number | null>(() =>
    computeSocialSold(slug),
  );

  useEffect(() => {
    setCount(computeSocialSold(slug));
  }, [slug]);

  return count;
}
