import { defaultCmsCategories, readJsonFile } from "@/server/cms/store";
import { normalizeCmsCategories } from "@/server/cms/home-categories";
import { loadShopCatalog } from "@/storefront/lib/shop-catalog";
import type { ShopCategoryId } from "@/storefront/components/shop/types";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { CmsSubnav } from "../CmsSubnav";
import { CategoriesForm } from "./categories-form";

export const dynamic = "force-dynamic";

export default async function AdminCmsCategoriesPage() {
  const [raw, catalog] = await Promise.all([
    readJsonFile("categories.json", defaultCmsCategories),
    loadShopCatalog(),
  ]);
  const categories = normalizeCmsCategories(raw);
  const catalogCounts = Object.fromEntries(
    catalog.categories.map((c) => [c.id, c.count]),
  ) as Record<ShopCategoryId, number>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>CMS · Danh mục Home</h1>
        <p className="text-sm text-muted">
          Ô danh mục trên trang chủ — gắn với taxonomy catalog (
          <code className="text-xs">/categories/{"{slug}"}</code>
          ). Không dùng để tạo slug mới; chọn category, thứ tự và icon.
        </p>
      </div>
      <CmsSubnav active="/admin/cms/categories" />
      <CategoriesForm initial={categories} catalogCounts={catalogCounts} />
    </div>
  );
}
