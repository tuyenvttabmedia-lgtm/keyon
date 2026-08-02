/**
 * Plausible social-proof counters (sold / reviews).
 * Deterministic per slug + slow time drift — avoids round numbers and frozen counts.
 */

function hashSlug(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Soft social-proof only — modest ranges so storefront does not claim
 * enterprise-scale volume KEYON has not earned yet.
 */
export function computeSocialSold(slug: string, nowMs = Date.now()): number {
  const h = hashSlug(slug);
  const base = 18 + (h % 87); // 18–104
  const day = Math.floor(nowMs / 86_400_000);
  const growth = Math.floor((day + (h % 17)) % 24); // slow drift
  let n = base + growth;
  if (n % 10 === 0) n += 1 + (h % 3);
  return n;
}

/** Reviews << sold; keep counts small and believable for a young shop. */
export function computeSocialReviews(slug: string, sold: number): number {
  const h = hashSlug(slug);
  let reviews = Math.max(3, Math.round(sold * 0.12) + (h % 5));
  if (reviews % 10 === 0) reviews += 1;
  return reviews;
}

/** Rating 4.6–4.9 with one decimal, not always .0 / .5. */
export function computeSocialRating(slug: string): number {
  const h = hashSlug(slug);
  const tenths = [4.6, 4.7, 4.8, 4.9, 4.8, 4.7][h % 6]!;
  return tenths;
}
