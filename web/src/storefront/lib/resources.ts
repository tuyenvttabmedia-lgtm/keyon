import type { BlogCategoryId, BlogPost } from "@/server/cms/types";

/** IA NAV-03 — one Article engine; internal ids stay stable. */
export const RESOURCE_SECTION_IDS = ["insights", "guides", "news"] as const;
export type ResourceSectionId = (typeof RESOURCE_SECTION_IDS)[number];

/**
 * Public SEO slugs (Vietnamese, kebab-case).
 * Internal id ↔ URL path.
 */
export const RESOURCE_SECTION_SLUG: Record<ResourceSectionId, string> = {
  insights: "chuyen-sau",
  guides: "huong-dan",
  news: "tin-tuc",
};

const SLUG_TO_SECTION: Record<string, ResourceSectionId> = {
  "chuyen-sau": "insights",
  "huong-dan": "guides",
  "tin-tuc": "news",
  // Legacy English paths (pre SEO amend)
  insights: "insights",
  guides: "guides",
  news: "news",
};

export const RESOURCE_SECTION_META: Record<
  ResourceSectionId,
  { title: string; subtitle: string; label: string; slug: string }
> = {
  insights: {
    label: "Chuyên sâu",
    title: "Chuyên sâu",
    subtitle:
      "Phân tích bản quyền, Microsoft 365, bảo mật và vận hành phần mềm cho doanh nghiệp.",
    slug: RESOURCE_SECTION_SLUG.insights,
  },
  guides: {
    label: "Hướng dẫn",
    title: "Hướng dẫn",
    subtitle:
      "How-to: kích hoạt, nhận license, kiểm tra bản quyền và dùng Tài khoản KEYON.",
    slug: RESOURCE_SECTION_SLUG.guides,
  },
  news: {
    label: "Tin tức",
    title: "Tin tức & cập nhật",
    subtitle: "Cập nhật sản phẩm, vendor và KEYON.",
    slug: RESOURCE_SECTION_SLUG.news,
  },
};

/** Topic → default chuyên mục (when author does not set section explicitly). */
export const TOPIC_DEFAULT_SECTION: Partial<
  Record<BlogCategoryId, ResourceSectionId>
> = {
  "ban-quyen": "insights",
  windows: "insights",
  m365: "insights",
  "doanh-nghiep": "insights",
  "bao-mat": "insights",
  "huong-dan": "guides",
  "tin-keyon": "news",
};

/** Explicit `section` wins; else map from topic (category); default news. */
export function resolveResourceSection(
  post: Pick<BlogPost, "section" | "category">,
): ResourceSectionId {
  if (post.section && RESOURCE_SECTION_IDS.includes(post.section)) {
    return post.section;
  }
  if (post.category && TOPIC_DEFAULT_SECTION[post.category]) {
    return TOPIC_DEFAULT_SECTION[post.category]!;
  }
  return "news";
}

export function isResourceSectionId(v: string): v is ResourceSectionId {
  return (RESOURCE_SECTION_IDS as readonly string[]).includes(v);
}

/** Accept Vietnamese SEO slug or legacy English id from the URL. */
export function parseResourceSectionParam(
  raw: string,
): ResourceSectionId | null {
  return SLUG_TO_SECTION[raw] ?? null;
}

export function resourceSectionPath(section: ResourceSectionId): string {
  return RESOURCE_SECTION_SLUG[section];
}

export function resourceIndexHref(section: ResourceSectionId): string {
  return `/knowledge/${resourceSectionPath(section)}`;
}

export function resourcePostHref(
  post: Pick<BlogPost, "slug" | "section" | "category">,
): string {
  return `/knowledge/${resourceSectionPath(resolveResourceSection(post))}/${post.slug}`;
}

export function filterPostsBySection(
  posts: BlogPost[],
  section: ResourceSectionId,
): BlogPost[] {
  return posts.filter((p) => resolveResourceSection(p) === section);
}

/** Suggested section when admin picks a topic. */
export function suggestedSectionForTopic(
  topic: BlogCategoryId | undefined,
): ResourceSectionId | undefined {
  if (!topic) return undefined;
  return TOPIC_DEFAULT_SECTION[topic];
}
