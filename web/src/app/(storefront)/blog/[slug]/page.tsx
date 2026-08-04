import { notFound, permanentRedirect } from "next/navigation";
import { defaultBlog, readJsonFile, type BlogPost } from "@/server/cms/store";
import { resourcePostHref } from "@/storefront/lib/resources";

export const dynamic = "force-dynamic";

/** Legacy /blog/{slug} → /resources/{section}/{slug} */
export default async function BlogSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postsRaw = await readJsonFile<BlogPost[]>("blog.json", defaultBlog);
  const posts = (Array.isArray(postsRaw) ? postsRaw : defaultBlog).filter(
    (p) => p.status === "published",
  );
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  permanentRedirect(resourcePostHref(post));
}
