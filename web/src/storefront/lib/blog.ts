import type { BlogCategoryId, BlogCoverTone, BlogPost } from "@/server/cms/types";

export type BlogCategoryFilter = "all" | BlogCategoryId;

export const BLOG_CATEGORIES: {
  id: BlogCategoryFilter;
  label: string;
  icon: "all" | "key" | "windows" | "office" | "building" | "guide" | "shield" | "news";
}[] = [
  { id: "all", label: "Tất cả", icon: "all" },
  { id: "ban-quyen", label: "Bản quyền", icon: "key" },
  { id: "windows", label: "Windows", icon: "windows" },
  { id: "m365", label: "Microsoft 365", icon: "office" },
  { id: "doanh-nghiep", label: "Doanh nghiệp", icon: "building" },
  { id: "huong-dan", label: "Hướng dẫn", icon: "guide" },
  { id: "bao-mat", label: "Bảo mật", icon: "shield" },
  { id: "tin-keyon", label: "Tin Keyon", icon: "news" },
];

export const CATEGORY_LABEL: Record<BlogCategoryId, string> = {
  "ban-quyen": "Bản quyền",
  windows: "Windows",
  m365: "Microsoft 365",
  "doanh-nghiep": "Doanh nghiệp",
  "huong-dan": "Hướng dẫn",
  "bao-mat": "Bảo mật",
  "tin-keyon": "Tin Keyon",
};

export const COVER_TONE_CLASS: Record<BlogCoverTone, string> = {
  navy: "from-[#0b1f3a] via-[#123056] to-[#0ea5a4]",
  teal: "from-[#0f766e] via-[#0d9488] to-[#14b8a6]",
  sky: "from-[#0c4a6e] via-[#0369a1] to-[#0ea5e9]",
  violet: "from-[#312e81] via-[#4c1d95] to-[#7c3aed]",
  orange: "from-[#9a3412] via-[#c2410c] to-[#ea580c]",
  emerald: "from-[#064e3b] via-[#047857] to-[#10b981]",
};

export function categoryLabel(post: BlogPost) {
  if (!post.category) return "Tin tức";
  return CATEGORY_LABEL[post.category];
}

export function postDateIso(post: BlogPost) {
  return post.publishedAt ?? post.updatedAt;
}

export function formatPostDate(post: BlogPost) {
  return new Date(postDateIso(post)).toLocaleDateString("vi-VN");
}

export function readMinutesOf(post: BlogPost) {
  if (post.readMinutes && post.readMinutes > 0) return post.readMinutes;
  // Lazy import avoided — mirror estimateReadingMinutes without server cycle
  const raw = post.body.trim();
  const text = /^<[a-z]/i.test(raw)
    ? raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    : raw;
  const words = text.split(/\s+/).filter(Boolean).length;
  if (words === 0) return 1;
  return Math.max(1, Math.ceil(words / 225));
}

export function authorOf(post: BlogPost) {
  return post.author?.trim() || "Admin Keyon";
}

export function coverToneOf(post: BlogPost): BlogCoverTone {
  return post.coverTone ?? "navy";
}

export function pickFeatured(posts: BlogPost[], count = 3) {
  const marked = posts.filter((p) => p.featured);
  const pool = marked.length >= count ? marked : posts;
  return pool.slice(0, count);
}

export type BlogBodyBlock =
  | { type: "p"; text: string }
  | { type: "h"; level: 2 | 3; text: string; id: string }
  | { type: "callout"; text: string };

function slugifyHeading(text: string, index: number) {
  const base = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return base || `section-${index + 1}`;
}

/** Parse simple markdown-ish body: ## headings, > callouts, paragraphs. */
export function parseBlogBody(body: string): BlogBodyBlock[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: BlogBodyBlock[] = [];
  let para: string[] = [];
  let headingCount = 0;

  const flushPara = () => {
    const text = para.join(" ").trim();
    if (text) blocks.push({ type: "p", text });
    para = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();
    if (!trimmed) {
      flushPara();
      continue;
    }
    const h2 = trimmed.match(/^##\s+(.+)$/);
    const h3 = trimmed.match(/^###\s+(.+)$/);
    if (h2 || h3) {
      flushPara();
      const text = (h2?.[1] ?? h3?.[1] ?? "").trim();
      blocks.push({
        type: "h",
        level: h2 ? 2 : 3,
        text,
        id: slugifyHeading(text, headingCount++),
      });
      continue;
    }
    if (trimmed.startsWith("> ")) {
      flushPara();
      blocks.push({ type: "callout", text: trimmed.slice(2).trim() });
      continue;
    }
    para.push(trimmed);
  }
  flushPara();
  return blocks;
}

export function tocFromBlocks(blocks: BlogBodyBlock[]) {
  return blocks
    .filter((b): b is Extract<BlogBodyBlock, { type: "h" }> => b.type === "h")
    .map((b) => ({ id: b.id, text: b.text }));
}

export function collectPopularTags(posts: BlogPost[], limit = 12) {
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.tags ?? []) {
      const key = t.trim();
      if (!key) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "vi"))
    .slice(0, limit)
    .map(([tag]) => tag);
}

export function adjacentPosts(posts: BlogPost[], currentId: string) {
  const ordered = [...posts].sort(
    (a, b) =>
      new Date(postDateIso(b)).getTime() - new Date(postDateIso(a)).getTime(),
  );
  const idx = ordered.findIndex((p) => p.id === currentId);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: ordered[idx + 1] ?? null,
    next: ordered[idx - 1] ?? null,
  };
}
