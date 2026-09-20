import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { ShopView } from "@/storefront/components/shop/ShopView";
import {
  categoryHref,
  loadShopCatalog,
  resolveCategorySlug,
} from "@/storefront/lib/shop-catalog";
import {
  buildMainPageMetadata,
  resolveWithGlobalFallback,
  toNextMetadata,
} from "@/server/seo/metadata";
import { loadSiteSettings } from "@/server/seo/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const settings = await loadSiteSettings();
  const q = (sp.q ?? "").trim();

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

  // ?cat= redirects to /categories/{slug}; keep catalog metadata here.
  void resolveCategorySlug(sp.cat);
  return buildMainPageMetadata("/products");
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const cat = resolveCategorySlug(sp.cat);
  const initialQuery = (sp.q ?? "").trim();

  // SEO: permanent redirect legacy ?cat= → /categories/{slug}
  if (cat !== "all") {
    const base = categoryHref(cat);
    permanentRedirect(
      initialQuery ? `${base}?q=${encodeURIComponent(initialQuery)}` : base,
    );
  }

  const { products, categories } = await loadShopCatalog();

  return (
    <Suspense fallback={null}>
      <ShopView
        products={products}
        categories={categories}
        initialCategory="all"
        initialQuery={initialQuery}
      />
    </Suspense>
  );
}
