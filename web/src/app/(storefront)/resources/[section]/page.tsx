import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  defaultBlog,
  defaultCmsBlog,
  readJsonFile,
  type BlogPost,
} from "@/server/cms/store";
import type { BlogCategoryId, CmsBlog } from "@/server/cms/types";
import { BlogIndexView } from "@/storefront/components/blog/BlogIndexView";
import { BLOG_CATEGORIES } from "@/storefront/lib/blog";
import {
  filterPostsBySection,
  isResourceSectionId,
  RESOURCE_SECTION_META,
  type ResourceSectionId,
} from "@/storefront/lib/resources";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ q?: string; category?: string }>;
};

export async function generateStaticParams() {
  return [
    { section: "insights" },
    { section: "guides" },
    { section: "news" },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section: raw } = await params;
  if (!isResourceSectionId(raw)) return buildMainPageMetadata("/resources");
  const meta = RESOURCE_SECTION_META[raw];
  return {
    ...(await buildMainPageMetadata(`/resources/${raw}`)),
    title: `${meta.title} | KEYON`,
    description: meta.subtitle,
  };
}

export default async function ResourceSectionIndexPage({
  params,
  searchParams,
}: Props) {
  const { section: raw } = await params;
  if (!isResourceSectionId(raw)) notFound();
  const section = raw as ResourceSectionId;

  const sp = await searchParams;
  const [cmsRaw, postsRaw] = await Promise.all([
    readJsonFile("blog-page.json", defaultCmsBlog),
    readJsonFile("blog.json", defaultBlog),
  ]);

  const sectionMeta = RESOURCE_SECTION_META[section];
  const cms: CmsBlog = {
    ...defaultCmsBlog,
    ...cmsRaw,
    pageTitle: sectionMeta.title,
    pageLead: sectionMeta.subtitle,
  };

  const published = (Array.isArray(postsRaw) ? postsRaw : defaultBlog).filter(
    (p: BlogPost) => p.status === "published",
  );
  const posts = filterPostsBySection(published, section);

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
      section={section}
    />
  );
}
