import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  deliveryPromiseLabel,
  receiveFromDeliverable,
} from "@/storefront/lib/customer-labels";
import {
  parseFaqRows,
  parseSpecRows,
  parseStringList,
  type ProductCategoryKey,
  PRODUCT_CATEGORY_KEYS,
} from "@/storefront/lib/product-cms";
import {
  DELIVERABLE_ADMIN_LABELS,
  FULFILLMENT_ADMIN_LABELS,
} from "@/storefront/lib/catalog-admin-labels";
import { ProductEditForm } from "./edit-form";
import { AddVariantForm } from "./add-variant-form";
import { CloneProductButton } from "../CloneProductButton";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ variantId: string }>;
}) {
  const { variantId } = await params;
  const [variant, allProducts] = await Promise.all([
    prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: {
          include: {
            brand: true,
            variants: { orderBy: { createdAt: "asc" } },
          },
        },
        supplier: true,
      },
    }),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        active: true,
        brand: { select: { name: true } },
      },
    }),
  ]);
  if (!variant) notFound();

  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const receive = receiveFromDeliverable(variant.deliverableType);
  const strategy =
    FULFILLMENT_ADMIN_LABELS[variant.fulfillmentStrategy] ??
    deliveryPromiseLabel(variant.fulfillmentStrategy);
  const p = variant.product;
  const cat =
    p.categoryKey && (PRODUCT_CATEGORY_KEYS as readonly string[]).includes(p.categoryKey)
      ? (p.categoryKey as ProductCategoryKey)
      : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/admin/catalog" className="text-sm text-accent hover:underline">
            ← Sản phẩm / Catalog
          </Link>
          <h1 className={`mt-2 ${ADMIN_PAGE_TITLE_CLASS}`}>
            Sửa · {variant.product.brand.name} · {variant.product.name}
          </h1>
          <p className="text-sm text-muted">
            {variant.name} · {DELIVERABLE_ADMIN_LABELS[variant.deliverableType]} ·{" "}
            {p.active ? (
              <span className="font-medium text-emerald-700">Đã xuất bản</span>
            ) : (
              <span className="font-medium text-amber-700">Nháp</span>
            )}
          </p>
        </div>
        <CloneProductButton variantId={variant.id} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-navy">Các gói của sản phẩm này</h2>
          <span className="text-xs text-muted">{p.variants.length} gói</span>
        </div>
        <ul className="mb-4 divide-y divide-border rounded-xl border border-border">
          {p.variants.map((v) => {
            const current = v.id === variant.id;
            return (
              <li key={v.id}>
                <Link
                  href={`/admin/products/${v.id}`}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 text-sm hover:bg-surface ${
                    current ? "bg-accent/5 font-semibold text-accent" : "text-navy"
                  }`}
                >
                  <span>
                    {v.name}{" "}
                    <span className="font-mono text-xs text-muted">({v.sku})</span>
                  </span>
                  <span className="text-xs text-muted">
                    {v.priceVnd.toLocaleString("vi-VN")}đ
                    {!v.active ? " · tắt" : ""}
                    {current ? " · đang sửa" : ""}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <AddVariantForm productId={p.id} suppliers={suppliers} />
      </div>

      <ProductEditForm
        variantId={variant.id}
        productId={p.id}
        productSlug={p.slug}
        productName={p.name}
        productDescription={p.description ?? ""}
        productShortDescription={p.shortDescription ?? ""}
        productActive={p.active}
        categoryKey={cat}
        badgeLabel={p.badgeLabel ?? ""}
        galleryUrls={parseStringList(p.galleryUrls)}
        features={parseStringList(p.features)}
        specs={parseSpecRows(p.specs)}
        faqs={parseFaqRows(p.faqs)}
        seoTitle={p.seoTitle ?? ""}
        seoDescription={p.seoDescription ?? ""}
        ogImageUrl={p.ogImageUrl ?? ""}
        relatedProductIds={parseStringList(p.relatedProductIds)}
        relatedOptions={allProducts.map((x) => ({
          id: x.id,
          name: x.name,
          brandName: x.brand.name,
          slug: x.slug,
          active: x.active,
        }))}
        variantName={variant.name}
        priceVnd={variant.priceVnd}
        compareAtPriceVnd={variant.compareAtPriceVnd}
        costVnd={variant.costVnd}
        slaPromise={variant.slaPromise ?? ""}
        lowStockThreshold={variant.lowStockThreshold}
        active={variant.active}
        salesMotion={variant.salesMotion}
        strategyLabel={strategy}
        receiveLabel={receive.label}
        sku={variant.sku}
        fulfillmentStrategy={variant.fulfillmentStrategy}
        supplierId={variant.supplierId}
      />
    </div>
  );
}
