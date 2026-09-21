import type { BlogCategoryId, BlogPost } from "@/server/cms/types";

/**
 * NAV-03 Knowledge IA (ADR-006)
 *
 * Hierarchy (professional content hub — NOT “tin tức” as root):
 *   /kien-thuc                         → hub
 *   /kien-thuc/{chuyen-muc}            → chuyên mục list
 *   /kien-thuc/{chuyen-muc}/{slug}     → article
 *   /kien-thuc/chu-de/{topic}          → chủ đề archive (cross-section)
 *
 * Why Kiến thức (not Tin tức) as hub:
 *   Guides + deep analysis are not “news”. Putting Tin tức at the root
 *   mismatches search intent and dilutes SEO for how-to / expert content.
 *   Tin tức remains one chuyên mục under the hub.
 */

/** Public hub path (Vietnamese SEO). */
export const KNOWLEDGE_HUB_PATH = "/kien-thuc";

/** Path segment for topic archives. Reserved — not a chuyên mục. */
export const TOPIC_ARCHIVE_SEGMENT = "chu-de";

/** IA NAV-03 — one Article engine; internal ids stay stable. */
export const RESOURCE_SECTION_IDS = ["insights", "guides", "news"] as const;
export type ResourceSectionId = (typeof RESOURCE_SECTION_IDS)[number];

/**
 * Public SEO slugs for chuyên mục (Vietnamese, kebab-case).
 * Internal id ↔ URL path segment.
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
  // Legacy English section ids (pre SEO)
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
    title: "Tin tức",
    subtitle: "Cập nhật sản phẩm, vendor và KEYON.",
    slug: RESOURCE_SECTION_SLUG.news,
  },
};

/** Topic → default chuyên mục (when author does not set section explicitly). */
export const TOPIC_DEFAULT_SECTION: Partial<
  Record<string, ResourceSectionId>
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
  if (raw === TOPIC_ARCHIVE_SEGMENT) return null;
  return SLUG_TO_SECTION[raw] ?? null;
}

export function resourceSectionPath(section: ResourceSectionId): string {
  return RESOURCE_SECTION_SLUG[section];
}

export function resourceHubHref(): string {
  return KNOWLEDGE_HUB_PATH;
}

export function resourceIndexHref(section: ResourceSectionId): string {
  return `${KNOWLEDGE_HUB_PATH}/${resourceSectionPath(section)}`;
}

export function resourcePostHref(
  post: Pick<BlogPost, "slug" | "section" | "category">,
): string {
  return `${KNOWLEDGE_HUB_PATH}/${resourceSectionPath(resolveResourceSection(post))}/${post.slug}`;
}

/** Topic archive across all chuyên mục. */
export function resourceTopicHref(topic: BlogCategoryId): string {
  return `${KNOWLEDGE_HUB_PATH}/${TOPIC_ARCHIVE_SEGMENT}/${topic}`;
}

/** Filter within a chuyên mục (`?chu-de=`). */
export function resourceSectionTopicHref(
  section: ResourceSectionId,
  topic: BlogCategoryId,
): string {
  return `${resourceIndexHref(section)}?chu-de=${topic}`;
}

export function filterPostsBySection(
  posts: BlogPost[],
  section: ResourceSectionId,
): BlogPost[] {
  return posts.filter((p) => resolveResourceSection(p) === section);
}

export function filterPostsByTopic(
  posts: BlogPost[],
  topic: BlogCategoryId,
): BlogPost[] {
  return posts.filter((p) => p.category === topic);
}

/** Suggested section when admin picks a topic. */
export function suggestedSectionForTopic(
  topic: BlogCategoryId | undefined,
): ResourceSectionId | undefined {
  if (!topic) return undefined;
  return TOPIC_DEFAULT_SECTION[topic];
}
