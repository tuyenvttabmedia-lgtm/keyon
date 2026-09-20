import type { Metadata } from "next";
import { Suspense } from "react";
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
import {
  buildMainPageMetadata,
  resolveWithGlobalFallback,
  toNextMetadata,
} from "@/server/seo/metadata";
import { loadSiteSettings } from "@/server/seo/settings";

export const dynamic = "force-dynamic";

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

function resolveCategory(
  raw: string | undefined,
): ShopCategoryId | "all" {
  if (!raw) return "all";
  if (LEGACY_CAT[raw]) return LEGACY_CAT[raw]!;
  if ((PRODUCT_CATEGORY_KEYS as readonly string[]).includes(raw)) {
    return raw as ShopCategoryId;
  }
  return "all";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const settings = await loadSiteSettings();
  const q = (sp.q ?? "").trim();
  const cat = resolveCategory(sp.cat);

  // Text search is utility — keep out of the index.
  if (q) {
    const seo = resolveWithGlobalFallback(settings, {
      path: "/products",
      title: `Tìm “${q}” | Sản phẩm KEYON`,
      description:
        "Kết quả tìm kiếm trên catalog KEYON — bản quyền chính hãng, giao nhận rõ ràng.",
    });
    return toNextMetadata(seo, {
      robotsIndex: false,
      faviconUrl: settings.faviconUrl,
      appleTouchIconUrl: settings.appleTouchIconUrl,
    });
  }

  if (cat !== "all") {
    const label = CATEGORY_LABELS[cat];
    const path = `/products?cat=${cat}`;
    const seo = resolveWithGlobalFallback(settings, {
      path,
      title: `${label} chính hãng | KEYON`,
      description: `Mua ${label} chính hãng tại KEYON — xem giá, nhận license trong Tài khoản, hỗ trợ kích hoạt tiếng Việt.`,
    });
    return toNextMetadata(seo, {
      faviconUrl: settings.faviconUrl,
      appleTouchIconUrl: settings.appleTouchIconUrl,
    });
  }

  return buildMainPageMetadata("/products");
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const initialCategory = resolveCategory(sp.cat);
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
    <Suspense fallback={null}>
      <ShopView
        products={items}
        categories={categories}
        initialCategory={initialCategory}
        initialQuery={initialQuery}
      />
    </Suspense>
  );
}
