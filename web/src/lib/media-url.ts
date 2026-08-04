/**
 * Media URL helpers — Wasabi private buckets must not be linked directly.
 * App proxy: GET /api/media/<storageKey>
 */

const WASABI_HOST = /wasabisys\.com/i;

/** Build same-origin proxy URL for a storage key (e.g. media/2026/08/x.png). */
export function mediaProxyUrl(storageKey: string): string {
  const encoded = storageKey
    .split("/")
    .filter(Boolean)
    .map((s) => encodeURIComponent(s))
    .join("/");
  return `/api/media/${encoded}`;
}

/**
 * Normalize any stored media URL for <img> / next/image.
 * Rewrites direct Wasabi / S3 URLs → /api/media/... so private buckets work.
 */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  const u = url.trim();
  if (!u) return "";
  if (u.startsWith("/api/media/")) return u;
  if (u.startsWith("/uploads/") || u.startsWith("/brand/")) return u;
  if (u.startsWith("media/") || u.startsWith("brand/")) {
    return mediaProxyUrl(u);
  }

  // path-style: https://s3.region.wasabisys.com/bucket/key...
  const pathStyle = u.match(
    /https?:\/\/[^/]*wasabisys\.com\/[^/]+\/(.+?)(?:\?|$)/i,
  );
  if (pathStyle?.[1]) {
    return mediaProxyUrl(decodeURIComponent(pathStyle[1]));
  }

  // virtual-hosted: https://bucket.s3.region.wasabisys.com/key...
  const virtual = u.match(
    /https?:\/\/[^.]+\.s3\.[^/]*wasabisys\.com\/(.+?)(?:\?|$)/i,
  );
  if (virtual?.[1]) {
    return mediaProxyUrl(decodeURIComponent(virtual[1]));
  }

  // Custom publicBaseUrl that still points at Wasabi
  if (WASABI_HOST.test(u)) {
    try {
      const pathname = new URL(u).pathname.replace(/^\/+/, "");
      // pathname may be "bucket/key" or "key"
      const parts = pathname.split("/");
      if (parts.length >= 2 && parts[0]?.includes(".")) {
        // bucket-like first segment (media.keyon.vn)
        return mediaProxyUrl(parts.slice(1).join("/"));
      }
      if (pathname.startsWith("media/") || pathname.startsWith("brand/")) {
        return mediaProxyUrl(pathname);
      }
    } catch {
      /* keep original */
    }
  }

  return u;
}

export function isWasabiDirectUrl(url: string): boolean {
  return WASABI_HOST.test(url);
}
