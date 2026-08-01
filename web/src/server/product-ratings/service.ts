import "server-only";

import { unstable_cache } from "next/cache";
import {
  defaultCmsProductRatings,
  readJsonFile,
  type CmsProductRating,
  type CmsProductRatings,
} from "@/server/cms/store";

export type ProductRatingSummary = {
  productKey: string;
  ratingAvg: number;
  reviewCount: number;
};

function clampRating(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(5, Math.max(0, Math.round(n * 10) / 10));
}

async function loadSummaries(): Promise<Map<string, ProductRatingSummary>> {
  const data = await readJsonFile<CmsProductRatings>(
    "product-ratings.json",
    defaultCmsProductRatings,
  );
  const map = new Map<string, ProductRatingSummary>();
  for (const row of data.items ?? []) {
    if (!row.productKey) continue;
    map.set(row.productKey, {
      productKey: row.productKey,
      ratingAvg: clampRating(row.ratingAvg),
      reviewCount: Math.max(0, Math.floor(row.reviewCount || 0)),
    });
  }
  return map;
}

/** Cached rating summaries keyed by productKey (featured id or catalog id). */
export const getProductRatingMap = unstable_cache(
  async () => {
    const map = await loadSummaries();
    return Object.fromEntries(map.entries()) as Record<string, ProductRatingSummary>;
  },
  ["product-ratings-v1"],
  { revalidate: 60 },
);

export const ProductRatingsService = {
  async getSummary(productKey: string): Promise<ProductRatingSummary | null> {
    const all = await getProductRatingMap();
    return all[productKey] ?? null;
  },

  /** Apply CMS ratings onto featured rows (CMS wins when present). */
  applyToFeatured<T extends { id: string; rating?: number; reviewCount?: number }>(
    items: T[],
    ratings: Record<string, ProductRatingSummary>,
  ): T[] {
    return items.map((item) => {
      const hit = ratings[item.id];
      if (!hit) {
        return {
          ...item,
          rating: clampRating(item.rating ?? 0),
          reviewCount: Math.max(0, item.reviewCount ?? 0),
        };
      }
      return {
        ...item,
        rating: hit.ratingAvg,
        reviewCount: hit.reviewCount,
      };
    });
  },
};

export type { CmsProductRating };
