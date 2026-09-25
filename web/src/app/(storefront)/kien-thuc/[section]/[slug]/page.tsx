import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  defaultBlog,
  defaultCmsBlog,
  readJsonFile,
  type BlogPost,
} from "@/server/cms/store";
import type { CmsBlog } from "@/server/cms/types";
import {
  resolveMetaDescription,
  resolveOgImage,
  resolveOgDescription,
  resolveOgTitle,
  resolveSeoTitle,
  robotsFollowOf,
  robotsIndexOf,
  isBlogPostLive,
} from "@/server/cms/blog-utils";
import { BlogDetailView } from "@/storefront/components/blog/BlogDetailView";
import {
  parseResourceSectionParam,
  resolveResourceSection,
  resourcePostHref,
  resourceSectionPath,
  resourceIndexHref,
  KNOWLEDGE_HUB_PATH,
} from "@/storefront/lib/resources";
import {
  resolveWithGlobalFallback,
  toNextMetadata,
} from "@/server/seo/metadata";
import { loadSiteSettings } from "@/server/seo/settings";
import { absoluteUrl } from "@/server/seo/site-url";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
} from "@/server/seo/structured-data";
import { SECTION_LABEL } from "@/storefront/lib/blog";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ section: string; slug: string }>;
};

async function loadPublished() {
  const postsRaw = await readJsonFile<BlogPost[]>("blog.json", defaultBlog);
  const posts = (Array.isArray(postsRaw) ? postsRaw : defaultBlog).filter(
    (p) => isBlogPostLive(p),
  );
  return posts;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section: raw, slug } = await params;
  const section = parseResourceSectionParam(raw);
  if (!section) return { title: "Bài viết" };

  const [posts, settings] = await Promise.all([
    loadPublished(),
    loadSiteSettings(),
  ]);
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Bài viết" };

  const path = resourcePostHref(post);
  const seo = resolveWithGlobalFallback(settings, {
    path,
    title: resolveSeoTitle(post),
    description: resolveMetaDescription(post),
    ogImageUrl: resolveOgImage(post) ?? null,
  });
  const canonical = post.canonicalUrl?.trim() || absoluteUrl(path);
  const ogTitle = resolveOgTitle(post) || seo.title;
  const ogDescription = resolveOgDescription(post) || seo.description;

  return toNextMetadata(
    {
      ...seo,
      title: ogTitle,
      description: ogDescription,
      canonical,
    },
    {
      robotsIndex: robotsIndexOf(post),
      robotsFollow: robotsFollowOf(post),
      type: "article",
      faviconUrl: settings.faviconUrl,
      appleTouchIconUrl: settings.appleTouchIconUrl,
      googleSiteVerification: settings.googleSiteVerification,
    },
  );
}

export default async function ResourceArticlePage({ params }: Props) {
  const { section: raw, slug } = await params;
  const section = parseResourceSectionParam(raw);
  if (!section) notFound();

  const [cmsRaw, posts] = await Promise.all([
    readJsonFile<CmsBlog>("blog-page.json", defaultCmsBlog),
    loadPublished(),
  ]);

  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const canonicalSection = resolveResourceSection(post);
  if (
    canonicalSection !== section ||
    raw !== resourceSectionPath(canonicalSection)
  ) {
    permanentRedirect(resourcePostHref(post));
  }

  const cms = { ...defaultCmsBlog, ...cmsRaw };
  const path = resourcePostHref(post);
  const sectionLabel = SECTION_LABEL[canonicalSection] ?? "Kiến thức";
  const articleLd = buildArticleJsonLd({
    title: post.title,
    description: resolveMetaDescription(post),
    path,
    imageUrl: resolveOgImage(post),
    datePublished: post.publishedAt ?? post.updatedAt ?? null,
    dateModified: post.updatedAt ?? null,
    authorName: post.author ?? null,
  });
  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Trang chủ", path: "/" },
    { name: "Kiến thức", path: KNOWLEDGE_HUB_PATH },
    { name: sectionLabel, path: resourceIndexHref(canonicalSection) },
    { name: post.title, path },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <BlogDetailView cms={cms} post={post} posts={posts} />
    </>
  );
}
