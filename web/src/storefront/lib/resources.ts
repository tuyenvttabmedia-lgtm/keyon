import type { BlogCategoryId, BlogPost } from "@/server/cms/types";

/** IA NAV-03 — one Article engine, three Resource sections */
export const RESOURCE_SECTION_IDS = ["insights", "guides", "news"] as const;
export type ResourceSectionId = (typeof RESOURCE_SECTION_IDS)[number];

export const RESOURCE_SECTION_META: Record<
  ResourceSectionId,
  { title: string; subtitle: string; label: string }
> = {
  insights: {
    label: "Kiến thức",
    title: "Kiến thức",
    subtitle: "Bài chuyên sâu: bản quyền, Microsoft, cloud, security, doanh nghiệp.",
  },
  guides: {
    label: "Hướng dẫn",
    title: "Hướng dẫn",
    subtitle: "How-to: kích hoạt, nhập key, kiểm tra license, dùng Tài khoản KEYON.",
  },
  news: {
    label: "Tin tức",
    title: "Tin tức",
    subtitle: "Cập nhật vendor và KEYON.",
  },
};

const CATEGORY_TO_SECTION: Partial<Record<BlogCategoryId, ResourceSectionId>> = {
  "huong-dan": "guides",
  "tin-keyon": "news",
};

/** Explicit `section` wins; else map from category; default news for legacy posts. */
export function resolveResourceSection(post: Pick<BlogPost, "section" | "category">): ResourceSectionId {
  if (post.section && RESOURCE_SECTION_IDS.includes(post.section)) {
    return post.section;
  }
  if (post.category && CATEGORY_TO_SECTION[post.category]) {
    return CATEGORY_TO_SECTION[post.category]!;
  }
  // Insight-oriented categories
  if (
    post.category === "ban-quyen" ||
    post.category === "windows" ||
    post.category === "m365" ||
    post.category === "doanh-nghiep" ||
    post.category === "bao-mat"
  ) {
    return "insights";
  }
  return "news";
}

export function isResourceSectionId(v: string): v is ResourceSectionId {
  return (RESOURCE_SECTION_IDS as readonly string[]).includes(v);
}

export function resourceIndexHref(section: ResourceSectionId): string {
  return `/resources/${section}`;
}

export function resourcePostHref(post: Pick<BlogPost, "slug" | "section" | "category">): string {
  return `/resources/${resolveResourceSection(post)}/${post.slug}`;
}

export function filterPostsBySection(
  posts: BlogPost[],
  section: ResourceSectionId,
): BlogPost[] {
  return posts.filter((p) => resolveResourceSection(p) === section);
}
