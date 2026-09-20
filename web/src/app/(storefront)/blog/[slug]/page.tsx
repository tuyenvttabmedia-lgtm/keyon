import { notFound, permanentRedirect } from "next/navigation";
import { defaultBlog, readJsonFile, type BlogPost } from "@/server/cms/store";
import { resourcePostHref } from "@/storefront/lib/resources";
import { isBlogPostLive } from "@/server/cms/blog-utils";

export const dynamic = "force-dynamic";

/** Legacy /blog/{slug} → /knowledge/{section}/{slug} */
export default async function BlogSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postsRaw = await readJsonFile<BlogPost[]>("blog.json", defaultBlog);
  const posts = (Array.isArray(postsRaw) ? postsRaw : defaultBlog).filter(
    (p) => isBlogPostLive(p),
  );
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  permanentRedirect(resourcePostHref(post));
}
