import "server-only";

import { prisma } from "@/lib/db";
import {
  CATEGORY_LABELS,
  countByCategory,
  discountPercent,
  inferCategory,
  inferLicenseTypes,
  inferMark,
  inferPlatforms,
} from "@/storefront/components/shop/shop-utils";
import type { ShopCategoryId, ShopProduct } from "@/storefront/components/shop/types";
import {
  deliveryPromiseLabel,
  receiveFromDeliverable,
} from "@/storefront/lib/customer-labels";
import {
  parseStringList,
  PRODUCT_CATEGORY_KEYS,
} from "@/storefront/lib/product-cms";

/** Legacy query / path aliases → canonical category key. */
const LEGACY_CAT: Record<string, ShopCategoryId | "all"> = {
  all: "all",
  windows: "windows",
  office: "office",
  adobe: "adobe",
  design: "adobe",
  cloud: "cloud",
  security: "security",
  backup: "backup",
  autodesk: "autodesk",
  other: "other",
};

export function resolveCategorySlug(
  raw: string | undefined,
): ShopCategoryId | "all" {
  if (!raw) return "all";
  const key = raw.trim().toLowerCase();
  if (LEGACY_CAT[key]) return LEGACY_CAT[key]!;
  if ((PRODUCT_CATEGORY_KEYS as readonly string[]).includes(key)) {
    return key as ShopCategoryId;
  }
  return "all";
}

/** Canonical category URL (ADR-006 amended: `/categories/{slug}`). */
export function categoryHref(id: ShopCategoryId | "all"): string {
  if (id === "all") return "/products";
  return `/categories/${id}`;
}

export type ShopCatalogPayload = {
  products: ShopProduct[];
  categories: { id: ShopCategoryId; title: string; count: number }[];
};

export async function loadShopCatalog(): Promise<ShopCatalogPayload> {
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
  const categories = (Object.keys(CATEGORY_LABELS) as ShopCategoryId[]).map(
    (id) => ({
      id,
      title: CATEGORY_LABELS[id],
      count: counts[id],
    }),
  );

  return { products: items, categories };
}
