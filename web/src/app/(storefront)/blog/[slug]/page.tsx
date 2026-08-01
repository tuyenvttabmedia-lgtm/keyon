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
  resolveOgDescription,
  resolveOgImage,
  resolveOgTitle,
  resolveSeoTitle,
  robotsFollowOf,
  robotsIndexOf,
} from "@/server/cms/blog-utils";
import { absoluteAssetUrl } from "@/storefront/lib/asset-url";
import { BlogDetailView } from "@/storefront/components/blog/BlogDetailView";

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
  const { post } = await loadPublishedPost(slug);
  if (!post) return { title: "Bài viết" };

  const title = resolveSeoTitle(post);
  const description = resolveMetaDescription(post);
  const ogTitle = resolveOgTitle(post);
  const ogDescription = resolveOgDescription(post);
  const og = absoluteAssetUrl(resolveOgImage(post) ?? null);
  const canonical =
    post.canonicalUrl?.trim() || `https://keyon.vn/blog/${post.slug}`;
  const index = robotsIndexOf(post);
  const follow = robotsFollowOf(post);

  return {
    title,
    description,
    alternates: { canonical },
    robots: {
      index,
      follow,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "article",
      url: canonical,
      ...(og ? { images: [{ url: og }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      ...(og ? { images: [og] } : {}),
    },
  };
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
