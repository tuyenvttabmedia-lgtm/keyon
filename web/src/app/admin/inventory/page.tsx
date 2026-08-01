import Link from "next/link";
import { prisma } from "@/lib/db";
import type { AdminInventoryRow } from "@/lib/admin-inventory";
import { InventoryReadModel } from "@/server/inventory-read-model";
import { receiveFromDeliverable } from "@/storefront/lib/customer-labels";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { InventoryConsole } from "./inventory-console";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const [summary, variants] = await Promise.all([
    InventoryReadModel.dashboardSummary(),
    prisma.productVariant.findMany({
      where: { fulfillmentStrategy: "INSTANT", active: true },
      include: {
        product: { include: { brand: true } },
        supplier: true,
      },
      orderBy: { sku: "asc" },
    }),
  ]);

  const invByVariant = new Map(summary.skus.map((r) => [r.variantId, r]));

  const rows: AdminInventoryRow[] = variants.map((v) => {
    const inv = invByVariant.get(v.id);
    return {
      sku: v.sku,
      variantId: v.id,
      productId: v.productId,
      productName: v.product.name,
      variantName: v.name,
      brandId: v.product.brandId,
      brandName: v.product.brand.name,
      supplierId: v.supplierId,
      supplierName: v.supplier?.name ?? null,
      deliverableType: v.deliverableType,
      deliverableLabel: receiveFromDeliverable(v.deliverableType).label,
      available: inv?.available ?? 0,
      reserved: inv?.reserved ?? 0,
      consumed: inv?.consumed ?? 0,
      disabled: inv?.disabled ?? 0,
      lowStockThreshold: inv?.low_stock_threshold ?? v.lowStockThreshold,
      stockStatus: inv?.stock_status ?? "OUT_OF_STOCK",
    };
  });

  const brandMap = new Map<string, string>();
  const productMap = new Map<
    string,
    { id: string; name: string; brandId: string }
  >();
  const supplierMap = new Map<string, string>();
  const deliverableMap = new Map<string, string>();

  for (const r of rows) {
    brandMap.set(r.brandId, r.brandName);
    productMap.set(r.productId, {
      id: r.productId,
      name: r.productName,
      brandId: r.brandId,
    });
    if (r.supplierId && r.supplierName) {
      supplierMap.set(r.supplierId, r.supplierName);
    }
    deliverableMap.set(r.deliverableType, r.deliverableLabel);
  }

  const brands = Array.from(brandMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name, "vi"));
  const products = Array.from(productMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "vi"),
  );
  const suppliers = Array.from(supplierMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name, "vi"));
  const deliverableOptions = Array.from(deliverableMap.entries())
    .map(([id, label]) => ({ id, label }))
    .sort((a, b) => a.label.localeCompare(b.label, "vi"));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className={ADMIN_PAGE_TITLE_CLASS}>Tồn kho</h1>
          <p className="text-sm text-muted">
            Theo dõi số lượng license và cảnh báo tồn kho
          </p>
        </div>
        <Link
          href="/admin/stock"
          className="text-sm font-medium text-accent hover:underline"
        >
          Kho License (nhập key) →
        </Link>
      </div>

      <InventoryConsole
        kpis={{
          available: summary.available,
          reserved: summary.reserved,
          consumed: summary.consumed,
          lowStockSkus: summary.low_stock_skus,
          outOfStockSkus: summary.out_of_stock_skus,
        }}
        rows={rows}
        brands={brands}
        products={products}
        suppliers={suppliers}
        deliverableOptions={deliverableOptions}
      />
    </div>
  );
}
