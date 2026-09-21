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
import { isBlogPostLive } from "@/server/cms/blog-utils";
import {
  filterPostsBySection,
  parseResourceSectionParam,
  RESOURCE_SECTION_IDS,
  RESOURCE_SECTION_META,
  resourceIndexHref,
  resourceSectionPath,
} from "@/storefront/lib/resources";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import type { MainSeoPageKey } from "@/lib/seo-main-pages";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ q?: string; category?: string; tag?: string }>;
};

export async function generateStaticParams() {
  return RESOURCE_SECTION_IDS.map((id) => ({
    section: resourceSectionPath(id),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section: raw } = await params;
  const section = parseResourceSectionParam(raw);
  if (!section) return buildMainPageMetadata("/knowledge");
  const meta = RESOURCE_SECTION_META[section];
  const path = resourceIndexHref(section) as MainSeoPageKey;
  return {
    ...(await buildMainPageMetadata(path)),
    title: `${meta.title} | KEYON`,
    description: meta.subtitle,
  };
}

export default async function ResourceSectionIndexPage({
  params,
  searchParams,
}: Props) {
  const { section: raw } = await params;
  const section = parseResourceSectionParam(raw);
  if (!section) notFound();

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
    (p: BlogPost) => isBlogPostLive(p),
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
      initialTag={sp.tag?.trim() ?? ""}
      section={section}
    />
  );
}
