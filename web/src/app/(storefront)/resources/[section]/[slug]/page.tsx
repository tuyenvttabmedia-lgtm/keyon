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
  resolveSeoTitle,
  robotsFollowOf,
  robotsIndexOf,
} from "@/server/cms/blog-utils";
import { BlogDetailView } from "@/storefront/components/blog/BlogDetailView";
import {
  isResourceSectionId,
  resolveResourceSection,
  resourcePostHref,
} from "@/storefront/lib/resources";
import {
  resolveWithGlobalFallback,
  toNextMetadata,
} from "@/server/seo/metadata";
import { loadSiteSettings } from "@/server/seo/settings";
import { absoluteUrl } from "@/server/seo/site-url";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ section: string; slug: string }>;
};

async function loadPublished() {
  const postsRaw = await readJsonFile<BlogPost[]>("blog.json", defaultBlog);
  const posts = (Array.isArray(postsRaw) ? postsRaw : defaultBlog).filter(
    (p) => p.status === "published",
  );
  return posts;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section, slug } = await params;
  if (!isResourceSectionId(section)) return { title: "Bài viết" };

  const [posts, settings] = await Promise.all([loadPublished(), loadSiteSettings()]);
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

  return toNextMetadata(
    { ...seo, canonical },
    {
      robotsIndex: robotsIndexOf(post),
      robotsFollow: robotsFollowOf(post),
      type: "article",
    },
  );
}

export default async function ResourceArticlePage({ params }: Props) {
  const { section, slug } = await params;
  if (!isResourceSectionId(section)) notFound();

  const [cmsRaw, posts] = await Promise.all([
    readJsonFile<CmsBlog>("blog-page.json", defaultCmsBlog),
    loadPublished(),
  ]);

  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const canonicalSection = resolveResourceSection(post);
  if (canonicalSection !== section) {
    permanentRedirect(resourcePostHref(post));
  }

  const cms = { ...defaultCmsBlog, ...cmsRaw };
  return <BlogDetailView cms={cms} post={post} posts={posts} />;
}
