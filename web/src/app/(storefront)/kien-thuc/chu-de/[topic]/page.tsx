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
import type { CmsBlog } from "@/server/cms/types";
import { BlogIndexView } from "@/storefront/components/blog/BlogIndexView";
import { CATEGORY_LABEL } from "@/storefront/lib/blog";
import { isBlogPostLive } from "@/server/cms/blog-utils";
import {
  filterPostsByTopic,
  KNOWLEDGE_HUB_PATH,
  resourceTopicHref,
} from "@/storefront/lib/resources";
import { mergeBlogTaxonomy, topicLabelMap } from "@/storefront/lib/blog-taxonomy";
import {
  resolveWithGlobalFallback,
  toNextMetadata,
} from "@/server/seo/metadata";
import { loadSiteSettings } from "@/server/seo/settings";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ topic: string }>;
  searchParams: Promise<{ q?: string; tag?: string }>;
};

async function loadTaxonomy() {
  const raw = await readJsonFile<CmsBlogTaxonomy>(
    "blog-taxonomy.json",
    defaultCmsBlogTaxonomy,
  );
  return mergeBlogTaxonomy(raw);
}

export async function generateStaticParams() {
  const taxonomy = await loadTaxonomy();
  return taxonomy.topics.filter((t) => t.visible).map((t) => ({ topic: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: raw } = await params;
  const [taxonomy, settings] = await Promise.all([
    loadTaxonomy(),
    loadSiteSettings(),
  ]);
  const labels = topicLabelMap(taxonomy);
  const label = labels[raw] ?? CATEGORY_LABEL[raw] ?? raw;
  const known =
    taxonomy.topics.some((t) => t.id === raw) || Boolean(CATEGORY_LABEL[raw]);
  const path = resourceTopicHref(raw);
  if (!known) {
    return toNextMetadata(
      resolveWithGlobalFallback(settings, {
        path: KNOWLEDGE_HUB_PATH,
        title: "Chủ đề · KEYON",
      }),
      {
        faviconUrl: settings.faviconUrl,
        appleTouchIconUrl: settings.appleTouchIconUrl,
        googleSiteVerification: settings.googleSiteVerification,
        robotsIndex: false,
      },
    );
  }
  const seo = resolveWithGlobalFallback(settings, {
    path,
    title: `${label} — Kiến thức · KEYON`,
    description: `Bài viết về ${label} trên KEYON — hướng dẫn, chuyên sâu và tin tức bản quyền phần mềm.`,
  });
  return toNextMetadata(seo, {
    faviconUrl: settings.faviconUrl,
    appleTouchIconUrl: settings.appleTouchIconUrl,
    googleSiteVerification: settings.googleSiteVerification,
  });
}

export default async function TopicArchivePage({
  params,
  searchParams,
}: Props) {
  const { topic: raw } = await params;
  const taxonomy = await loadTaxonomy();
  const labels = { ...CATEGORY_LABEL, ...topicLabelMap(taxonomy) };
  const known =
    taxonomy.topics.some((t) => t.id === raw) || Boolean(CATEGORY_LABEL[raw]);
  if (!known) notFound();

  const sp = await searchParams;
  const [cmsRaw, postsRaw] = await Promise.all([
    readJsonFile("blog-page.json", defaultCmsBlog),
    readJsonFile("blog.json", defaultBlog),
  ]);

  const label = labels[raw] ?? raw;
  const cms: CmsBlog = {
    ...defaultCmsBlog,
    ...cmsRaw,
    pageTitle: label,
    pageLead: `Tất cả bài viết chủ đề ${label} trên hub Kiến thức KEYON.`,
  };

  const published = (Array.isArray(postsRaw) ? postsRaw : defaultBlog).filter(
    (p: BlogPost) => isBlogPostLive(p),
  );
  const posts = filterPostsByTopic(published, raw);

  return (
    <BlogIndexView
      cms={cms}
      posts={posts}
      initialQuery={sp.q?.trim() ?? ""}
      initialCategory={raw}
      initialTag={sp.tag?.trim() ?? ""}
      topicArchive={raw}
      hubHref={KNOWLEDGE_HUB_PATH}
    />
  );
}
