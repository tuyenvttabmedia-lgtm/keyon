import Link from "next/link";
import { prisma } from "@/lib/db";
import { InventoryReadModel } from "@/server/inventory-read-model";
import {
  deliveryPromiseLabel,
  receiveFromDeliverable,
} from "@/storefront/lib/customer-labels";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { CatalogTable, type CatalogRow } from "./catalog-table";

export const dynamic = "force-dynamic";

export default async function AdminCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string }>;
}) {
  const sp = await searchParams;
  const brandFilter = sp.brand?.trim() || null;

  const [variants, invRows] = await Promise.all([
    prisma.productVariant.findMany({
      where: brandFilter
        ? {
            product: {
              brand: {
                OR: [{ slug: brandFilter }, { id: brandFilter }],
              },
            },
          }
        : undefined,
      include: {
        product: {
          include: {
            brand: true,
            _count: { select: { variants: true } },
          },
        },
        supplier: true,
      },
      orderBy: [{ active: "desc" }, { sku: "asc" }],
    }),
    InventoryReadModel.listInstantSkus().catch(() => []),
  ]);

  const invByVariant = new Map(invRows.map((r) => [r.variantId, r]));

  const rows: CatalogRow[] = variants.map((v) => {
    const receive = receiveFromDeliverable(v.deliverableType);
    const inv =
      v.fulfillmentStrategy === "INSTANT" ? invByVariant.get(v.id) : undefined;
    let health: CatalogRow["health"] = "na";
    if (v.fulfillmentStrategy === "INSTANT") {
      if (!inv || inv.available <= 0) health = "out";
      else if (inv.stock_status === "LOW_STOCK") health = "low";
      else health = "healthy";
    }

    return {
      id: v.id,
      productId: v.productId,
      sku: v.sku,
      brandName: v.product.brand.name,
      productName: v.product.name,
      variantName: v.name,
      supplierName: v.supplier?.name ?? null,
      receiveLabel: receive.label,
      deliveryLabel: deliveryPromiseLabel(v.fulfillmentStrategy),
      fulfillmentStrategy: v.fulfillmentStrategy,
      priceVnd: v.priceVnd,
      costVnd: v.costVnd,
      variantActive: v.active,
      productActive: v.product.active,
      productSlug: v.product.slug,
      skuCount: v.product._count.variants,
      invAvailable: inv?.available ?? null,
      invReserved: inv?.reserved ?? null,
      invDisabled: inv?.disabled ?? null,
      health,
    };
  });

  const brandLabel = brandFilter
    ? rows[0]?.brandName ?? brandFilter
    : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className={ADMIN_PAGE_TITLE_CLASS}>Sản phẩm / Catalog</h2>
          <p className="text-sm text-muted">
            Ops view · tồn kho · health · quick actions
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-10 items-center rounded-xl bg-accent px-4 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          + Tạo sản phẩm
        </Link>
      </div>
      {brandLabel ? (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm">
          <span className="text-muted">Đang lọc</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-soft px-2.5 py-0.5 font-medium text-navy">
            Brand: {brandLabel}
            <Link
              href="/admin/catalog"
              className="ml-0.5 text-accent hover:underline"
              aria-label="Bỏ lọc brand"
            >
              ×
            </Link>
          </span>
          <Link
            href="/admin/catalog"
            className="text-xs font-semibold text-accent hover:underline"
          >
            Bỏ lọc
          </Link>
          <span className="text-xs text-muted">{rows.length} gói</span>
        </div>
      ) : null}
      <CatalogTable rows={rows} />
    </div>
  );
}
