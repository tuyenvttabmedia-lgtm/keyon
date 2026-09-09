"use client";

import { useEffect, useState } from "react";

/** Load Turnstile site key from Admin config (runtime — no rebuild). */
export function useTurnstileSiteKey(): string | null {
  const [siteKey, setSiteKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/turnstile", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { enabled?: boolean; siteKey?: string | null }) => {
        if (cancelled) return;
        if (data.enabled && data.siteKey) setSiteKey(data.siteKey);
        else setSiteKey(null);
      })
      .catch(() => {
        if (!cancelled) setSiteKey(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return siteKey;
}
