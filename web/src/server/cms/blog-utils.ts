import type { BlogPost } from "@/server/cms/types";

/** Detect TipTap/HTML body vs legacy markdown-ish posts. */
export function isHtmlBody(body: string): boolean {
  const t = body.trim();
  if (!t) return false;
  return /^<[a-z][\s\S]*>/i.test(t);
}

export function slugifyTitle(input: string): string {
  const base = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  return base.slice(0, 120);
}

export function uniqueBlogSlug(
  desired: string,
  posts: BlogPost[],
  excludeId?: string,
): string {
  const base = slugifyTitle(desired) || `bai-viet-${Date.now()}`;
  let slug = base;
  let n = 2;
  const taken = (s: string) =>
    posts.some((p) => p.slug === s && p.id !== excludeId);
  while (taken(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

/** Strip tags for word counting / plain text. */
export function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** ~225 words/minute; minimum 1. */
export function estimateReadingMinutes(body: string): number {
  const text = isHtmlBody(body) ? stripHtml(body) : body.trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words === 0) return 1;
  return Math.max(1, Math.ceil(words / 225));
}

/**
 * Best-effort markdown → HTML so legacy seed posts open in TipTap.
 * Not a full markdown parser — matches storefront parseBlogBody coverage.
 */
export function legacyBodyToHtml(body: string): string {
  if (!body.trim()) return "";
  if (isHtmlBody(body)) return body;

  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const parts: string[] = [];
  let para: string[] = [];

  const flushPara = () => {
    const text = para.join(" ").trim();
    if (text) parts.push(`<p>${escapeHtml(text)}</p>`);
    para = [];
  };

  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) {
      flushPara();
      continue;
    }
    const h2 = trimmed.match(/^##\s+(.+)$/);
    const h3 = trimmed.match(/^###\s+(.+)$/);
    if (h2) {
      flushPara();
      parts.push(`<h2>${escapeHtml(h2[1].trim())}</h2>`);
      continue;
    }
    if (h3) {
      flushPara();
      parts.push(`<h3>${escapeHtml(h3[1].trim())}</h3>`);
      continue;
    }
    if (trimmed.startsWith("> ")) {
      flushPara();
      parts.push(
        `<blockquote><p>${escapeHtml(trimmed.slice(2).trim())}</p></blockquote>`,
      );
      continue;
    }
    para.push(trimmed);
  }
  flushPara();
  return parts.join("");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function resolveSeoTitle(post: BlogPost): string {
  return post.metaTitle?.trim() || post.title.trim();
}

export function resolveMetaDescription(post: BlogPost): string {
  return post.metaDescription?.trim() || post.excerpt.trim();
}

export function resolveOgTitle(post: BlogPost): string {
  return post.ogTitle?.trim() || resolveSeoTitle(post);
}

export function resolveOgDescription(post: BlogPost): string {
  return post.ogDescription?.trim() || resolveMetaDescription(post);
}

export function resolveOgImage(post: BlogPost): string | undefined {
  return post.ogImageUrl?.trim() || post.coverUrl?.trim() || undefined;
}

export function robotsIndexOf(post: BlogPost): boolean {
  return post.robotsIndex !== false;
}

export function robotsFollowOf(post: BlogPost): boolean {
  return post.robotsFollow !== false;
}
