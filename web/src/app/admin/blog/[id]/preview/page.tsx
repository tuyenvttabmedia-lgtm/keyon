import Link from "next/link";
import { notFound } from "next/navigation";
import {
  defaultBlog,
  defaultCmsBlog,
  readJsonFile,
  type BlogPost,
} from "@/server/cms/store";
import type { CmsBlog } from "@/server/cms/types";
import { BlogDetailView } from "@/storefront/components/blog/BlogDetailView";

export const dynamic = "force-dynamic";

export default async function AdminBlogPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [cmsRaw, postsRaw] = await Promise.all([
    readJsonFile<CmsBlog>("blog-page.json", defaultCmsBlog),
    readJsonFile<BlogPost[]>("blog.json", defaultBlog),
  ]);
  const cms = { ...defaultCmsBlog, ...cmsRaw };
  const posts = Array.isArray(postsRaw) ? postsRaw : defaultBlog;
  const post = posts.find((p) => p.id === id);
  if (!post) notFound();

  const published = posts.filter((p) => p.status === "published");
  const forAdjacent =
    post.status === "published" ? published : [...published, post];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-amber-950">
            Xem trước bài viết
          </p>
          <p className="text-xs text-amber-900">
            {post.status === "published"
              ? "Bài đã xuất bản — đây là bản xem trong admin."
              : "Bản nháp — chưa hiển thị trên storefront công khai."}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/blog/${post.id}`}
            className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm font-medium text-navy"
          >
            Quay lại sửa
          </Link>
          {post.status === "published" ? (
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white"
            >
              Mở trang công khai
            </a>
          ) : null}
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-white">
        <BlogDetailView cms={cms} post={post} posts={forAdjacent} />
      </div>
    </div>
  );
}
