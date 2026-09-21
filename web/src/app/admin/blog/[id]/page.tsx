import Link from "next/link";
import { notFound } from "next/navigation";
import { readSession } from "@/lib/auth";
import {
  defaultBlog,
  defaultCmsBlogTaxonomy,
  readJsonFile,
  type BlogPost,
  type CmsBlogTaxonomy,
} from "@/server/cms/store";
import { mergeBlogTaxonomy } from "@/storefront/lib/blog-taxonomy";
import { BlogEditor } from "../blog-editor";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { HOVER_LINK_ACCENT, TRANSITION_UI } from "@/storefront/effects";

export const dynamic = "force-dynamic";

export default async function AdminBlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [posts, session, taxRaw] = await Promise.all([
    readJsonFile<BlogPost[]>("blog.json", defaultBlog),
    readSession(),
    readJsonFile<CmsBlogTaxonomy>(
      "blog-taxonomy.json",
      defaultCmsBlogTaxonomy,
    ),
  ]);

  const taxonomy = mergeBlogTaxonomy(taxRaw);
  const topics = taxonomy.topics
    .filter((t) => t.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((t) => ({ id: t.id, label: t.label }));

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
      section: "news",
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
      <div className="flex flex-wrap gap-3 text-sm">
        <Link
          href="/admin/blog"
          className={`font-medium text-accent ${HOVER_LINK_ACCENT} hover:underline`}
        >
          ← Bài viết
        </Link>
        <Link
          href="/admin/cms/blog-taxonomy"
          className={`text-muted ${TRANSITION_UI} hover:text-accent hover:underline`}
        >
          Quản trị danh mục
        </Link>
      </div>
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
        topics={topics}
      />
    </div>
  );
}
