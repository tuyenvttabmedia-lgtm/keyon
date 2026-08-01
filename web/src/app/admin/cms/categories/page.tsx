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
          Quản lý section <strong>Danh mục sản phẩm</strong> trên Home. Upload
          icon hoặc dùng icon SVG fallback. Tối đa <strong>8</strong> mục; chỉ
          mục bật “Hiện trên Home” được hiển thị (sắp xếp theo thứ tự ↑↓).
        </p>
      </div>
      <CmsSubnav active="/admin/cms/categories" />
      <CategoriesForm initial={categories} />
    </div>
  );
}
