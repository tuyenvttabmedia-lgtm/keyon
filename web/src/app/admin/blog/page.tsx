import Link from "next/link";
import { defaultBlog, readJsonFile, type BlogPost } from "@/server/cms/store";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { BlogList } from "./blog-list";

export const dynamic = "force-dynamic";

export default async function AdminBlogListPage() {
  const posts = await readJsonFile<BlogPost[]>("blog.json", defaultBlog);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className={ADMIN_PAGE_TITLE_CLASS}>
            Bài viết
          </h1>
          <p className="text-sm text-muted">
            Quản lý nội dung blog và SEO
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/blog/new"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            + Viết bài mới
          </Link>
          <Link
            href="/admin/cms/blog-taxonomy"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-navy hover:border-accent"
          >
            Danh mục bài viết
          </Link>
        </div>
      </div>
      <BlogList posts={posts} />
    </div>
  );
}
