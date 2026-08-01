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

/** Stable-ish sold count; drifts by day/hour so it feels alive without jumping wildly. */
export function computeSocialSold(slug: string, nowMs = Date.now()): number {
  const h = hashSlug(slug);
  // Uneven base in a realistic retail range
  const base = 1283 + (h % 5189);
  const day = Math.floor(nowMs / 86_400_000);
  const hour = Math.floor(nowMs / 3_600_000);
  // ~2–7 units/day growth pattern (product-specific)
  const dailyPace = 2 + (h % 6);
  const growth = Math.floor((day * dailyPace + (h % 113)) % 941);
  const hourBump = (hour + (h % 17)) % 5; // 0–4 within the hour
  let n = base + growth + hourBump;
  // Avoid suspiciously round endings (…00, …000)
  if (n % 100 === 0) n += 3 + (h % 11);
  if (n % 10 === 0) n += 1 + (h % 3);
  return n;
}

/** Reviews << sold, correlated so ratio looks natural (~2.5%–4%). */
export function computeSocialReviews(slug: string, sold: number): number {
  const h = hashSlug(slug);
  const rate = 0.025 + ((h % 20) / 1000); // 2.5%–4.4%
  let reviews = Math.max(37, Math.round(sold * rate) + (h % 19));
  if (reviews % 10 === 0) reviews += 1;
  return reviews;
}

/** Rating 4.6–4.9 with one decimal, not always .0 / .5. */
export function computeSocialRating(slug: string): number {
  const h = hashSlug(slug);
  const tenths = [4.6, 4.7, 4.8, 4.9, 4.8, 4.7][h % 6]!;
  return tenths;
}
