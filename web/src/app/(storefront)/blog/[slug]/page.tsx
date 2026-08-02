import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  resolveWithGlobalFallback,
  toNextMetadata,
} from "@/server/seo/metadata";
import { loadSiteSettings } from "@/server/seo/settings";
import { absoluteUrl } from "@/server/seo/site-url";

export const dynamic = "force-dynamic";

async function loadPublishedPost(slug: string) {
  const postsRaw = await readJsonFile<BlogPost[]>("blog.json", defaultBlog);
  const posts = (Array.isArray(postsRaw) ? postsRaw : defaultBlog).filter(
    (p) => p.status === "published",
  );
  return { posts, post: posts.find((p) => p.slug === slug) };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [{ post }, settings] = await Promise.all([
    loadPublishedPost(slug),
    loadSiteSettings(),
  ]);
  if (!post) return { title: "Bài viết" };

  const seo = resolveWithGlobalFallback(settings, {
    path: `/blog/${post.slug}`,
    title: resolveSeoTitle(post),
    description: resolveMetaDescription(post),
    ogImageUrl: resolveOgImage(post) ?? null,
  });
  const canonical =
    post.canonicalUrl?.trim() || absoluteUrl(`/blog/${post.slug}`);

  return toNextMetadata(
    { ...seo, canonical },
    {
      robotsIndex: robotsIndexOf(post),
      robotsFollow: robotsFollowOf(post),
      type: "article",
    },
  );
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [cmsRaw, loaded] = await Promise.all([
    readJsonFile<CmsBlog>("blog-page.json", defaultCmsBlog),
    loadPublishedPost(slug),
  ]);

  const cms = { ...defaultCmsBlog, ...cmsRaw };
  const { posts, post } = loaded;
  if (!post) notFound();

  return <BlogDetailView cms={cms} post={post} posts={posts} />;
}
