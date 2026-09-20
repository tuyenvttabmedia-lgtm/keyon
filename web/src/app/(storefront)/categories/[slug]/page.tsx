import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { ShopView } from "@/storefront/components/shop/ShopView";
import { CATEGORY_LABELS } from "@/storefront/components/shop/shop-utils";
import type { ShopCategoryId } from "@/storefront/components/shop/types";
import {
  loadShopCatalog,
  resolveCategorySlug,
} from "@/storefront/lib/shop-catalog";
import { PRODUCT_CATEGORY_KEYS } from "@/storefront/lib/product-cms";
import {
  resolveWithGlobalFallback,
  toNextMetadata,
} from "@/server/seo/metadata";
import { loadSiteSettings } from "@/server/seo/settings";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateStaticParams() {
  return PRODUCT_CATEGORY_KEYS.filter((k) => k !== "other").map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const cat = resolveCategorySlug(slug);
  const settings = await loadSiteSettings();
  const q = (sp.q ?? "").trim();

  if (cat === "all") {
    return { title: "Danh mục sản phẩm" };
  }

  const label = CATEGORY_LABELS[cat];
  const path = `/categories/${cat}`;

  if (q) {
    const seo = resolveWithGlobalFallback(settings, {
      path,
      title: `Tìm “${q}” trong ${label} | KEYON`,
      description: `Kết quả tìm kiếm ${label} trên catalog KEYON.`,
    });
    return toNextMetadata(seo, {
      robotsIndex: false,
      faviconUrl: settings.faviconUrl,
      appleTouchIconUrl: settings.appleTouchIconUrl,
    });
  }

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

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const cat = resolveCategorySlug(slug);

  if (cat === "all") notFound();

  // Canonicalize legacy aliases (e.g. /categories/design → /categories/adobe)
  if (slug.toLowerCase() !== cat) {
    const q = (sp.q ?? "").trim();
    permanentRedirect(
      q ? `/categories/${cat}?q=${encodeURIComponent(q)}` : `/categories/${cat}`,
    );
  }

  const { products, categories } = await loadShopCatalog();
  const initialQuery = (sp.q ?? "").trim();

  return (
    <Suspense fallback={null}>
      <ShopView
        products={products}
        categories={categories}
        initialCategory={cat as ShopCategoryId}
        initialQuery={initialQuery}
      />
    </Suspense>
  );
}
