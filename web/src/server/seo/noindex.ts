import type { Metadata } from "next";

/** Private / transactional surfaces — never index. */
export const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

export const noindexMetadata = (title: string): Metadata => ({
  title,
  robots: NOINDEX_ROBOTS,
});
