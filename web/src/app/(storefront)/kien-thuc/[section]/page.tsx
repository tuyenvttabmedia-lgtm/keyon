import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  defaultBlog,
  defaultCmsBlog,
  defaultCmsBlogTaxonomy,
  readJsonFile,
  type BlogPost,
  type CmsBlogTaxonomy,
} from "@/server/cms/store";
import type { BlogCategoryId, CmsBlog } from "@/server/cms/types";
import { BlogIndexView } from "@/storefront/components/blog/BlogIndexView";
import { BLOG_CATEGORIES } from "@/storefront/lib/blog";
import { isBlogPostLive } from "@/server/cms/blog-utils";
import {
  filterPostsBySection,
  KNOWLEDGE_HUB_PATH,
  parseResourceSectionParam,
  RESOURCE_SECTION_IDS,
  resourceIndexHref,
  resourceSectionPath,
} from "@/storefront/lib/resources";
import { mergeBlogTaxonomy } from "@/storefront/lib/blog-taxonomy";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import type { MainSeoPageKey } from "@/lib/seo-main-pages";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ section: string }>;
  searchParams: Promise<{
    q?: string;
    "chu-de"?: string;
    category?: string;
    tag?: string;
  }>;
};

export async function generateStaticParams() {
  return RESOURCE_SECTION_IDS.map((id) => ({
    section: resourceSectionPath(id),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section: raw } = await params;
  const section = parseResourceSectionParam(raw);
  if (!section)
    return buildMainPageMetadata(KNOWLEDGE_HUB_PATH as MainSeoPageKey);
  const taxRaw = await readJsonFile<CmsBlogTaxonomy>(
    "blog-taxonomy.json",
    defaultCmsBlogTaxonomy,
  );
  const taxonomy = mergeBlogTaxonomy(taxRaw);
  const meta = taxonomy.sections.find((s) => s.id === section);
  const path = resourceIndexHref(section) as MainSeoPageKey;
  return {
    ...(await buildMainPageMetadata(path)),
    title: `${meta?.title ?? section} | KEYON`,
    description: meta?.subtitle,
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
  const [cmsRaw, postsRaw, taxRaw] = await Promise.all([
    readJsonFile("blog-page.json", defaultCmsBlog),
    readJsonFile("blog.json", defaultBlog),
    readJsonFile<CmsBlogTaxonomy>(
      "blog-taxonomy.json",
      defaultCmsBlogTaxonomy,
    ),
  ]);

  const taxonomy = mergeBlogTaxonomy(taxRaw);
  const sectionMeta = taxonomy.sections.find((s) => s.id === section);
  const cms: CmsBlog = {
    ...defaultCmsBlog,
    ...cmsRaw,
    pageTitle: sectionMeta?.title ?? section,
    pageLead: sectionMeta?.subtitle ?? "",
  };

  const published = (Array.isArray(postsRaw) ? postsRaw : defaultBlog).filter(
    (p: BlogPost) => isBlogPostLive(p),
  );
  const posts = filterPostsBySection(published, section);

  const categoryIds = new Set([
    ...BLOG_CATEGORIES.filter((c) => c.id !== "all").map((c) => c.id),
    ...taxonomy.topics.map((t) => t.id),
  ]);
  const topicRaw = sp["chu-de"] ?? sp.category;
  const initialCategory =
    topicRaw && categoryIds.has(topicRaw as BlogCategoryId)
      ? (topicRaw as BlogCategoryId)
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
