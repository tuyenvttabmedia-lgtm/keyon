import Link from "next/link";
import { prisma } from "@/lib/db";
import { InventoryReadModel } from "@/server/inventory-read-model";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { BrandsTable, type BrandRow } from "./brands-table";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [brands, suppliers, invRows, orderAgg] = await Promise.all([
    prisma.brand.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: {
        supplier: true,
        products: {
          select: {
            id: true,
            variants: {
              select: {
                id: true,
                fulfillmentStrategy: true,
              },
            },
          },
        },
      },
    }),
    prisma.supplier.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    InventoryReadModel.listInstantSkus().catch(() => []),
    prisma.$queryRaw<Array<{ brandId: string; cnt: bigint }>>`
      SELECT p."brandId" AS "brandId", COUNT(DISTINCT oi."orderId")::bigint AS cnt
      FROM "OrderItem" oi
      INNER JOIN "Order" o ON o.id = oi."orderId"
      INNER JOIN "ProductVariant" v ON v.id = oi."variantId"
      INNER JOIN "Product" p ON p.id = v."productId"
      WHERE o."createdAt" >= ${since}
      GROUP BY p."brandId"
    `.catch(() => [] as Array<{ brandId: string; cnt: bigint }>),
  ]);

  const invByVariant = new Map(invRows.map((r) => [r.variantId, r]));

  const ordersByBrand = new Map<string, number>();
  for (const row of orderAgg) {
    ordersByBrand.set(row.brandId, Number(row.cnt));
  }

  const rows: BrandRow[] = brands.map((b) => {
    const variantIds: string[] = [];
    let instantCount = 0;
    for (const p of b.products) {
      for (const v of p.variants) {
        variantIds.push(v.id);
        if (v.fulfillmentStrategy === "INSTANT") instantCount += 1;
      }
    }

    let available = 0;
    let hasLow = false;
    let hasHealthy = false;
    let hasOut = false;
    for (const vid of variantIds) {
      const inv = invByVariant.get(vid);
      if (!inv) continue;
      available += inv.available;
      if (inv.stock_status === "OUT_OF_STOCK" || inv.available <= 0) hasOut = true;
      else if (inv.stock_status === "LOW_STOCK") hasLow = true;
      else hasHealthy = true;
    }

    let health: BrandRow["health"] = "na";
    if (instantCount > 0) {
      if (available <= 0 || (!hasHealthy && !hasLow && hasOut)) health = "out";
      else if (hasLow && !hasHealthy) health = "low";
      else if (hasLow) health = "low";
      else health = "healthy";
    }

    const hasSeo = Boolean(
      (b.seoTitle && b.seoTitle.trim()) ||
        (b.seoDescription && b.seoDescription.trim()),
    );

    return {
      id: b.id,
      name: b.name,
      slug: b.slug,
      logoUrl: b.logoUrl,
      supplierId: b.supplierId,
      supplierName: b.supplier?.name ?? null,
      productCount: b.products.length,
      variantCount: variantIds.length,
      availableLicenses: instantCount > 0 ? available : null,
      health,
      orders30d: ordersByBrand.get(b.id) ?? 0,
      featured: b.featured,
      active: b.active,
      hasSeo,
      sortOrder: b.sortOrder,
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className={ADMIN_PAGE_TITLE_CLASS}>Thương hiệu</h1>
          <p className="text-sm text-muted">
            Ops · tồn Instant · orders 30d · điều hướng Catalog / Landing
          </p>
        </div>
        <Link
          href="/admin/brands/new"
          className="inline-flex h-10 items-center rounded-xl bg-accent px-4 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          + Tạo brand
        </Link>
      </div>
      <BrandsTable rows={rows} suppliers={suppliers} />
    </div>
  );
}
