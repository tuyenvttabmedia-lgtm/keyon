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

export type SoftwareCrossSellRef = {
  name: string;
  categoryKey: string | null;
  brand: string;
};

function crossSellText(item: SoftwareCrossSellRef) {
  return `${item.brand} ${item.name}`.toLowerCase();
}

function isDesignSoftware(item: SoftwareCrossSellRef) {
  return (
    item.categoryKey === "autodesk" ||
    item.categoryKey === "adobe" ||
    /autodesk|autocad|adobe|revit|photoshop|illustrator/.test(crossSellText(item))
  );
}

function isWindowsHome(name: string) {
  return /windows/.test(name) && /home/.test(name) && !/server/.test(name);
}

function isWindowsPro(name: string) {
  return (
    /windows/.test(name) && /\bpro\b/.test(name) && !/workstation|server/.test(name)
  );
}

function isWorkstationOs(name: string) {
  return /windows/.test(name) && /workstation/.test(name);
}

function isWindowsServerOs(name: string) {
  return /windows server/.test(name);
}

function isPersonalProductivity(name: string) {
  return /office|365/.test(name) && /personal|home|cá nhân/.test(name);
}

/**
 * Lower rank is a better software cross-sell. 99 = skip.
 * Curated related IDs still win. This only ranks the fallback pool.
 */
export function softwareCrossSellRank(
  source: SoftwareCrossSellRef,
  candidate: SoftwareCrossSellRef,
): number {
  const src = crossSellText(source);
  const name = candidate.name.toLowerCase();
  if (name === source.name.toLowerCase()) return 99;

  if (isDesignSoftware(source)) {
    if (isWorkstationOs(name)) return 1;
    if (isWindowsPro(name)) return 2;
    if (
      candidate.brand.toLowerCase() === source.brand.toLowerCase() &&
      candidate.categoryKey === source.categoryKey
    ) {
      return 3;
    }
    if (isWindowsServerOs(name)) return 4;
    return 99;
  }

  if (isWindowsServerOs(source.name.toLowerCase())) {
    if (isWorkstationOs(name)) return 1;
    if (isWindowsPro(name)) return 2;
    return 99;
  }

  if (/windows/.test(src) && /workstation/.test(src)) {
    if (isWindowsPro(name)) return 1;
    if (isWindowsServerOs(name)) return 2;
    if (isDesignSoftware(candidate)) return 3;
    return 99;
  }

  if (/windows/.test(src) && /\bpro\b/.test(src) && !/server/.test(src)) {
    if (isWorkstationOs(name)) return 1;
    if (isWindowsServerOs(name)) return 2;
    if (isDesignSoftware(candidate)) return 3;
    return 99;
  }

  if (isWindowsHome(src)) {
    if (isPersonalProductivity(name)) return 1;
    if (isWindowsPro(name)) return 3;
    return 99;
  }

  if (source.categoryKey === "office" || /office|365/.test(src)) {
    if (/personal|home|cá nhân/.test(src)) {
      if (isWindowsHome(name)) return 1;
      if (isPersonalProductivity(name)) return 2;
      return 99;
    }
    if (isWindowsPro(name)) return 1;
    if (isWorkstationOs(name)) return 2;
    if (isWindowsServerOs(name)) return 3;
    return 99;
  }

  if (source.categoryKey === "security" || /kaspersky|eset|antivirus|bảo mật/.test(src)) {
    if (candidate.categoryKey === "security") return 1;
    if (isWindowsPro(name)) return 2;
    return 99;
  }

  if (
    candidate.brand.toLowerCase() === source.brand.toLowerCase() &&
    candidate.categoryKey &&
    candidate.categoryKey === source.categoryKey &&
    candidate.categoryKey !== "other"
  ) {
    return 8;
  }
  return 99;
}

/** Lower rank is a better cross-sell for an infrastructure package. 99 = skip. */
export function infraCrossSellRank(
  name: string,
  categoryKey: string | null,
): number {
  const n = name.toLowerCase();
  if (n.includes("cloud server")) return 99;
  if (/365/.test(n) && /personal|home|cá nhân/.test(n)) return 99;
  if (categoryKey === "backup" || /backup|sao lưu/.test(n)) return 1;
  if (categoryKey === "security" || /security|bảo mật|endpoint/.test(n)) return 2;
  if (/ssl|chứng thư/.test(n)) return 3;
  if (/domain|tên miền/.test(n)) return 4;
  if (/email|mail doanh/.test(n)) return 5;
  if (/windows server/.test(n)) return 6;
  if (/365/.test(n) && /business|doanh nghiệp/.test(n)) return 7;
  return 99;
}
