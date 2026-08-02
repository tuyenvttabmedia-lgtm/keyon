import type { Metadata } from "next";
import { defaultBlog, defaultCmsBlog, readJsonFile } from "@/server/cms/store";
import type { BlogCategoryId } from "@/server/cms/types";
import { BlogIndexView } from "@/storefront/components/blog/BlogIndexView";
import { BLOG_CATEGORIES } from "@/storefront/lib/blog";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMainPageMetadata("/blog");
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const [cmsRaw, postsRaw] = await Promise.all([
    readJsonFile("blog-page.json", defaultCmsBlog),
    readJsonFile("blog.json", defaultBlog),
  ]);

  const cms = { ...defaultCmsBlog, ...cmsRaw };
  const posts = (Array.isArray(postsRaw) ? postsRaw : defaultBlog).filter(
    (p) => p.status === "published",
  );

  const categoryIds = new Set(
    BLOG_CATEGORIES.filter((c) => c.id !== "all").map((c) => c.id),
  );
  const initialCategory =
    sp.category && categoryIds.has(sp.category as BlogCategoryId)
      ? (sp.category as BlogCategoryId)
      : "all";

  return (
    <BlogIndexView
      cms={cms}
      posts={posts}
      initialQuery={sp.q?.trim() ?? ""}
      initialCategory={initialCategory}
    />
  );
}
