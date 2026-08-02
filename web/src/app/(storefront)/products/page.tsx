import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ShopView } from "@/storefront/components/shop/ShopView";
import type { ShopProduct } from "@/storefront/components/shop/types";
import {
  CATEGORY_LABELS,
  countByCategory,
  discountPercent,
  inferCategory,
  inferLicenseTypes,
  inferMark,
  inferPlatforms,
} from "@/storefront/components/shop/shop-utils";
import type { ShopCategoryId } from "@/storefront/components/shop/types";
import {
  deliveryPromiseLabel,
  receiveFromDeliverable,
} from "@/storefront/lib/customer-labels";
import {
  parseStringList,
  PRODUCT_CATEGORY_KEYS,
} from "@/storefront/lib/product-cms";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMainPageMetadata("/products");
}

const LEGACY_CAT: Record<string, ShopCategoryId | "all"> = {
  all: "all",
  windows: "windows",
  office: "office",
  adobe: "adobe",
  design: "adobe",
  cloud: "cloud",
  security: "security",
  other: "other",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const initialCategory =
    LEGACY_CAT[sp.cat ?? "all"] ?? (sp.cat as ShopCategoryId | undefined) ?? "all";
  const initialQuery = (sp.q ?? "").trim();

  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      brand: true,
      variants: { where: { active: true }, orderBy: { priceVnd: "asc" } },
    },
    orderBy: { name: "asc" },
  });

  const items: ShopProduct[] = [];
  let index = 0;
  for (const p of products) {
    const variant = p.variants[0];
    if (!variant) continue;
    const receive = receiveFromDeliverable(variant.deliverableType);
    const action = deliveryPromiseLabel(variant.fulfillmentStrategy);
    const categoryId: ShopCategoryId =
      p.categoryKey &&
      (PRODUCT_CATEGORY_KEYS as readonly string[]).includes(p.categoryKey)
        ? (p.categoryKey as ShopCategoryId)
        : inferCategory(p.brand.name, p.name);
    const compareAtPriceVnd =
      variant.compareAtPriceVnd && variant.compareAtPriceVnd > variant.priceVnd
        ? variant.compareAtPriceVnd
        : undefined;
    const disc = discountPercent(variant.priceVnd, compareAtPriceVnd);
    const gallery = parseStringList(p.galleryUrls);
    items.push({
      id: p.id,
      brandName: p.brand.name,
      productName: p.name,
      packageName: variant.name,
      priceVnd: variant.priceVnd,
      receiveLabel: receive.label,
      receiveKind: receive.kind,
      deliveryLabel: action,
      deliveryActionLabel: action,
      deliveryKind: variant.fulfillmentStrategy === "INSTANT" ? "instant" : "manual",
      href: `/products/${p.slug}`,
      rating: undefined,
      reviewCount: undefined,
      mark: inferMark(categoryId, p.name),
      categoryId,
      licenseTypes: inferLicenseTypes(variant.name, p.name),
      platforms: inferPlatforms(p.brand.name, p.name, variant.name),
      compareAtPriceVnd,
      discountPercent: disc,
      imageUrl: gallery[0],
      sortIndex: products.length - index,
    });
    index += 1;
  }

  const counts = countByCategory(items);
  const categories = (Object.keys(CATEGORY_LABELS) as ShopCategoryId[]).map((id) => ({
    id,
    title: CATEGORY_LABELS[id],
    count: counts[id],
  }));

  return (
    <ShopView
      products={items}
      categories={categories}
      initialCategory={initialCategory}
      initialQuery={initialQuery}
    />
  );
}
