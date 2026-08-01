import Link from "next/link";
import { notFound } from "next/navigation";
import { readSession } from "@/lib/auth";
import { defaultBlog, readJsonFile, type BlogPost } from "@/server/cms/store";
import { BlogEditor } from "../blog-editor";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [posts, session] = await Promise.all([
    readJsonFile<BlogPost[]>("blog.json", defaultBlog),
    readSession(),
  ]);

  const defaultAuthor =
    session?.name?.trim() || session?.email?.split("@")[0] || "Admin Keyon";

  let post: BlogPost;
  const isNew = id === "new";
  if (isNew) {
    post = {
      id: `post_${Date.now()}`,
      slug: "",
      title: "",
      excerpt: "",
      body: "",
      status: "draft",
      metaTitle: "",
      metaDescription: "",
      author: defaultAuthor,
      robotsIndex: true,
      robotsFollow: true,
      updatedAt: new Date().toISOString(),
    };
  } else {
    const found = posts.find((p) => p.id === id);
    if (!found) notFound();
    post = found;
  }

  return (
    <div className="space-y-4">
      <Link href="/admin/blog" className="text-sm text-accent hover:underline">
        ← Bài viết
      </Link>
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>
          {isNew ? "Viết bài mới" : "Sửa bài viết"}
        </h1>
        <p className="text-sm text-muted">
          Soạn thảo nội dung, SEO và xuất bản cho website KEYON
        </p>
      </div>
      <BlogEditor
        initial={post}
        allPosts={posts}
        isNew={isNew}
        defaultAuthor={defaultAuthor}
      />
    </div>
  );
}
