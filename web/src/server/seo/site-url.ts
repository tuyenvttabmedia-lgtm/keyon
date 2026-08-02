import "server-only";

/** Trusted public origin for canonical, OG absolute URLs, sitemap. */
export function getSiteOrigin(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export function getSiteHostname(): string {
  try {
    return new URL(getSiteOrigin()).hostname;
  } catch {
    return "keyon.vn";
  }
}

/** Non-production / localhost must not be indexed. */
export function allowSearchIndexing(): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  if (
    process.env.SEO_NOINDEX === "1" ||
    process.env.SEO_NOINDEX === "true"
  ) {
    return false;
  }
  const origin = getSiteOrigin();
  if (/localhost|127\.0\.0\.1|\.local\b/i.test(origin)) return false;
  return true;
}

export function absoluteUrl(pathOrUrl: string): string {
  const raw = pathOrUrl.trim();
  if (/^https?:\/\//i.test(raw)) return raw;
  const origin = getSiteOrigin();
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${origin}${path}`;
}
