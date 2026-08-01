/** Resolve OG/image URL for Next Metadata (prefer absolute). */

export function absoluteAssetUrl(
  pathOrUrl: string | null | undefined,
  siteOrigin?: string | null,
): string | undefined {
  const raw = pathOrUrl?.trim();
  if (!raw) return undefined;
  if (/^https?:\/\//i.test(raw)) return raw;
  const origin =
    siteOrigin?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    process.env.APP_URL?.replace(/\/$/, "") ||
    "";
  if (!origin) return raw.startsWith("/") ? raw : `/${raw}`;
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${origin}${path}`;
}
