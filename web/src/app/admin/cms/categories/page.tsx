import { defaultCmsCategories, readJsonFile } from "@/server/cms/store";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { CmsSubnav } from "../CmsSubnav";
import { CategoriesForm } from "./categories-form";

export const dynamic = "force-dynamic";

export default async function AdminCmsCategoriesPage() {
  const categories = await readJsonFile(
    "categories.json",
    defaultCmsCategories,
  );
  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Danh mục</h1>
        <p className="text-sm text-muted">
          Section danh mục sản phẩm trên Home — tối đa 8 mục. Dùng thanh công cụ
          phía trên để thêm / lưu; chỉ mục bật “Hiện trên Home” được hiển thị
          (thứ tự ↑↓).
        </p>
      </div>
      <CmsSubnav active="/admin/cms/categories" />
      <CategoriesForm initial={categories} />
    </div>
  );
}
