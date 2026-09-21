import { defaultCmsBlogTaxonomy, readJsonFile } from "@/server/cms/store";
import type { CmsBlogTaxonomy } from "@/server/cms/types";
import { mergeBlogTaxonomy } from "@/storefront/lib/blog-taxonomy";
import { CmsSubnav } from "../CmsSubnav";
import { BlogTaxonomyForm } from "./blog-taxonomy-form";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function BlogTaxonomyCmsPage() {
  const raw = await readJsonFile<CmsBlogTaxonomy>(
    "blog-taxonomy.json",
    defaultCmsBlogTaxonomy,
  );
  const initial = mergeBlogTaxonomy(raw);

  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>Danh mục bài viết</h1>
        <p className="mt-1 text-sm text-muted">
          Chuyên mục (URL Kiến thức) và chủ đề lọc — dùng chung cho storefront và
          editor bài viết.
        </p>
      </div>
      <CmsSubnav active="/admin/cms/blog-taxonomy" />
      <BlogTaxonomyForm initial={initial} />
    </div>
  );
}
