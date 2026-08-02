/**
 * Social-proof helpers.
 * Fake sold/reviews/rating are DISABLED — only show when real CMS/DB data exists.
 */

/** Kill-switch: do not invent sold/review numbers for storefront. */
export const SOCIAL_PROOF_SYNTHETIC = false;

function hashSlug(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** @deprecated Synthetic counts off — always returns null. */
export function computeSocialSold(
  _slug: string,
  _nowMs = Date.now(),
): number | null {
  if (!SOCIAL_PROOF_SYNTHETIC) return null;
  const h = hashSlug(_slug);
  const base = 18 + (h % 87);
  const day = Math.floor(_nowMs / 86_400_000);
  const growth = Math.floor((day + (h % 17)) % 24);
  let n = base + growth;
  if (n % 10 === 0) n += 1 + (h % 3);
  return n;
}

/** @deprecated Synthetic counts off — always returns null. */
export function computeSocialReviews(
  _slug: string,
  _sold: number,
): number | null {
  if (!SOCIAL_PROOF_SYNTHETIC) return null;
  const h = hashSlug(_slug);
  let reviews = Math.max(3, Math.round(_sold * 0.12) + (h % 5));
  if (reviews % 10 === 0) reviews += 1;
  return reviews;
}

/** @deprecated Synthetic ratings off — always returns null. */
export function computeSocialRating(_slug: string): number | null {
  if (!SOCIAL_PROOF_SYNTHETIC) return null;
  const h = hashSlug(_slug);
  return [4.6, 4.7, 4.8, 4.9, 4.8, 4.7][h % 6]!;
}
