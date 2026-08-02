import type { DeliverableType, FulfillmentStrategy, Prisma } from "@prisma/client";
import {
  deliveryPromiseLabel,
  receiveFromDeliverable,
} from "@/storefront/lib/customer-labels";
import {
  discountPercent,
  inferCategory,
  inferLicenseTypes,
  inferMark,
  inferPlatforms,
} from "@/storefront/components/shop/shop-utils";
import type { ShopCategoryId, ShopProduct } from "@/storefront/components/shop/types";
import { parseStringList, PRODUCT_CATEGORY_KEYS } from "@/storefront/lib/product-cms";

type RelatedSource = {
  id: string;
  name: string;
  slug: string;
  categoryKey: string | null;
  galleryUrls: Prisma.JsonValue;
  brand: { name: string };
  variants: Array<{
    name: string;
    priceVnd: number;
    compareAtPriceVnd: number | null;
    deliverableType: DeliverableType;
    fulfillmentStrategy: FulfillmentStrategy;
  }>;
};

export function mapProductsToShopCards(
  products: RelatedSource[],
  startIndex = 0,
): ShopProduct[] {
  const out: ShopProduct[] = [];
  let ri = startIndex;
  for (const p of products) {
    const v = p.variants[0];
    if (!v) continue;
    const r = receiveFromDeliverable(v.deliverableType);
    const cat =
      p.categoryKey &&
      (PRODUCT_CATEGORY_KEYS as readonly string[]).includes(p.categoryKey)
        ? (p.categoryKey as ShopCategoryId)
        : inferCategory(p.brand.name, p.name);
    const compare =
      v.compareAtPriceVnd && v.compareAtPriceVnd > v.priceVnd
        ? v.compareAtPriceVnd
        : undefined;
    const action = deliveryPromiseLabel(v.fulfillmentStrategy);
    const gal = parseStringList(p.galleryUrls);
    out.push({
      id: p.id,
      brandName: p.brand.name,
      productName: p.name,
      packageName: v.name,
      priceVnd: v.priceVnd,
      receiveLabel: r.label,
      receiveKind: r.kind,
      deliveryLabel: action,
      deliveryActionLabel: action,
      deliveryKind: v.fulfillmentStrategy === "INSTANT" ? "instant" : "manual",
      href: `/products/${p.slug}`,
      rating: undefined,
      reviewCount: undefined,
      mark: inferMark(cat, p.name),
      categoryId: cat,
      licenseTypes: inferLicenseTypes(v.name, p.name),
      platforms: inferPlatforms(p.brand.name, p.name, v.name),
      compareAtPriceVnd: compare,
      discountPercent: discountPercent(v.priceVnd, compare),
      imageUrl: gal[0],
      sortIndex: ri,
    });
    ri += 1;
  }
  return out;
}
