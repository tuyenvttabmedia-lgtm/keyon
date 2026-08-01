import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCreateForm } from "./create-form";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminProductCreatePage() {
  const [brands, suppliers] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.supplier.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-4">
      <div>
        <Link href="/admin/catalog" className="text-sm text-accent hover:underline">
          ← Catalog
        </Link>
        <h1 className={`mt-2 ${ADMIN_PAGE_TITLE_CLASS}`}>Tạo sản phẩm</h1>
        <p className="text-sm text-muted">
          Wizard 5 bước · nháp mặc định · Media / OG / SEO · thêm gói sau khi tạo
        </p>
      </div>
      {brands.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted">
          Chưa có brand — tạo brand trước tại Brands.
        </p>
      ) : (
        <ProductCreateForm
          brands={brands.map((b) => ({ id: b.id, name: b.name }))}
          suppliers={suppliers.map((s) => ({ id: s.id, name: s.name }))}
        />
      )}
    </div>
  );
}
