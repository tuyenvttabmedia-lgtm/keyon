import type { Metadata } from "next";

/** Private / transactional / demo surfaces — never index. */
export const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

/**
 * Noindex metadata that also clears inherited home canonical
 * (root layout must not pin every child to `/`).
 */
export function noindexMetadata(title: string): Metadata {
  return {
    title,
    robots: NOINDEX_ROBOTS,
    alternates: { canonical: null },
  };
}
