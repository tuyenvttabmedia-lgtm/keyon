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
import { CATEGORY_LABEL } from "@/storefront/lib/blog";
import { isBlogPostLive } from "@/server/cms/blog-utils";
import {
  filterPostsByTopic,
  KNOWLEDGE_HUB_PATH,
  resourceTopicHref,
} from "@/storefront/lib/resources";
import { absoluteUrl } from "@/server/seo/site-url";

export const dynamic = "force-dynamic";

const TOPIC_IDS = new Set<string>([
  "ban-quyen",
  "windows",
  "m365",
  "doanh-nghiep",
  "bao-mat",
  "huong-dan",
  "tin-keyon",
]);

type Props = {
  params: Promise<{ topic: string }>;
  searchParams: Promise<{ q?: string; tag?: string }>;
};

export async function generateStaticParams() {
  return [...TOPIC_IDS].map((topic) => ({ topic }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: raw } = await params;
  if (!TOPIC_IDS.has(raw)) return { title: "Chủ đề | KEYON" };
  const topic = raw as BlogCategoryId;
  const label = CATEGORY_LABEL[topic];
  const path = resourceTopicHref(topic);
  return {
    title: `${label} — Kiến thức | KEYON`,
    description: `Bài viết về ${label} trên KEYON — hướng dẫn, chuyên sâu và tin tức bản quyền phần mềm.`,
    alternates: { canonical: absoluteUrl(path) },
  };
}

export default async function TopicArchivePage({
  params,
  searchParams,
}: Props) {
  const { topic: raw } = await params;
  if (!TOPIC_IDS.has(raw)) notFound();
  const topic = raw as BlogCategoryId;

  const sp = await searchParams;
  const [cmsRaw, postsRaw] = await Promise.all([
    readJsonFile("blog-page.json", defaultCmsBlog),
    readJsonFile("blog.json", defaultBlog),
  ]);

  const label = CATEGORY_LABEL[topic];
  const cms: CmsBlog = {
    ...defaultCmsBlog,
    ...cmsRaw,
    pageTitle: label,
    pageLead: `Tất cả bài viết chủ đề ${label} trên hub Kiến thức KEYON.`,
  };

  const published = (Array.isArray(postsRaw) ? postsRaw : defaultBlog).filter(
    (p: BlogPost) => isBlogPostLive(p),
  );
  const posts = filterPostsByTopic(published, topic);

  return (
    <BlogIndexView
      cms={cms}
      posts={posts}
      initialQuery={sp.q?.trim() ?? ""}
      initialCategory={topic}
      initialTag={sp.tag?.trim() ?? ""}
      topicArchive={topic}
      hubHref={KNOWLEDGE_HUB_PATH}
    />
  );
}
