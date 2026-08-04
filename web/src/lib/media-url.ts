/**
 * Media public URL helpers.
 * Prefer CDN / public Wasabi base; fall back to /api/media proxy when no base.
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

/** Join public base + key without double slashes. */
export function joinPublicBase(publicBaseUrl: string, storageKey: string): string {
  const base = publicBaseUrl.replace(/\/$/, "");
  const key = storageKey.replace(/^\//, "");
  return `${base}/${key}`;
}

/**
 * Extract object key from stored URL forms:
 * - /api/media/media/2026/...
 * - https://s3...wasabisys.com/bucket/media/...
 * - https://cdn.example.com/media/...
 * - media/2026/...
 */
export function extractStorageKey(url: string): string | null {
  const u = url.trim();
  if (!u) return null;

  if (u.startsWith("/api/media/")) {
    return u
      .slice("/api/media/".length)
      .split("/")
      .map((s) => decodeURIComponent(s))
      .join("/");
  }

  if (u.startsWith("media/") || u.startsWith("brand/")) {
    return u;
  }

  if (u.startsWith("/uploads/") || u.startsWith("/brand/")) {
    return null;
  }

  try {
    if (/^https?:\/\//i.test(u)) {
      const { pathname } = new URL(u);
      let path = pathname.replace(/^\/+/, "");

      // path-style Wasabi: /bucket/key...
      if (WASABI_HOST.test(u)) {
        const parts = path.split("/");
        if (parts.length >= 2) {
          // first segment is bucket name
          path = parts.slice(1).join("/");
        }
      }

      if (path.startsWith("media/") || path.startsWith("brand/")) {
        return decodeURIComponent(path);
      }
      // CDN may serve key at root of custom domain
      if (path.includes("/")) {
        return decodeURIComponent(path);
      }
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Normalize URL for display / CMS.
 * When `publicBaseUrl` is set (CDN or public Wasabi), rewrite proxy & raw S3 → that base.
 */
export function resolveMediaUrl(
  url: string | null | undefined,
  publicBaseUrl?: string | null,
): string {
  if (!url) return "";
  const u = url.trim();
  if (!u) return "";

  if (u.startsWith("/uploads/") || u.startsWith("/brand/")) return u;

  const base = (publicBaseUrl ?? process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "")
    .trim()
    .replace(/\/$/, "");

  const key = extractStorageKey(u);
  if (key && base) {
    return joinPublicBase(base, key);
  }

  // Already on configured CDN / absolute https — keep
  if (/^https?:\/\//i.test(u) && base && u.startsWith(base)) {
    return u;
  }

  // Absolute public URL (non-proxy) — keep as-is when no rewrite needed
  if (/^https?:\/\//i.test(u) && !WASABI_HOST.test(u) && !u.includes("/api/media/")) {
    return u;
  }

  // Wasabi direct without base configured — keep (bucket may be public now)
  if (WASABI_HOST.test(u)) {
    return u;
  }

  if (key) {
    return mediaProxyUrl(key);
  }

  return u;
}

export function isWasabiDirectUrl(url: string): boolean {
  return WASABI_HOST.test(url);
}
