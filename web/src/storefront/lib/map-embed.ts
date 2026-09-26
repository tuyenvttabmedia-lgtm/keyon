/**
 * Normalize CMS map embed field: accept either a bare embed URL or a full
 * <iframe …> paste and return a clean https src for ContactMap.
 */
export function normalizeMapEmbedUrl(raw: string | null | undefined): string {
  const input = (raw ?? "").trim();
  if (!input) return "";

  // Full iframe HTML (or HTML-entity encoded attributes after a bad paste).
  const srcMatch =
    input.match(/src\s*=\s*["']([^"']+)["']/i) ||
    input.match(/src\s*=\s*&quot;([^&]+)&quot;/i);
  let url = (srcMatch?.[1] ?? input).trim();

  // Strip trailing junk if someone pasted attributes after the URL.
  url = url
    .replace(/&quot;.*$/i, "")
    .replace(/["'].*$/, "")
    .replace(/\s+width=.*$/i, "")
    .trim();

  if (!/^https?:\/\//i.test(url)) return "";

  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return "";
    const host = u.hostname.toLowerCase();
    const allowed =
      host === "www.google.com" ||
      host === "google.com" ||
      host === "maps.google.com" ||
      host.endsWith(".google.com") ||
      host === "www.openstreetmap.org" ||
      host === "openstreetmap.org";
    if (!allowed) return "";
    return u.toString();
  } catch {
    return "";
  }
}
