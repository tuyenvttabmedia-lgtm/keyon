import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import {
  resolveWithGlobalFallback,
  toNextMetadata,
} from "@/server/seo/metadata";
import { loadSiteSettings } from "@/server/seo/settings";
import { BrandDetailView } from "@/storefront/components/brands/BrandDetailView";
import { inferMark } from "@/storefront/components/shop/shop-utils";
import type { ShopCategoryId } from "@/storefront/components/shop/types";
import {
  parseStringList,
  PRODUCT_CATEGORY_KEYS,
} from "@/storefront/lib/product-cms";
import { receiveFromDeliverable } from "@/storefront/lib/customer-labels";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [brand, settings] = await Promise.all([
    prisma.brand.findFirst({
      where: { slug, active: true },
    }),
    loadSiteSettings(),
  ]);
  if (!brand) return { title: "Thương hiệu" };

  const seo = resolveWithGlobalFallback(settings, {
    path: `/brands/${slug}`,
    title: brand.seoTitle?.trim() || `${brand.name} | KEYON`,
    description:
      brand.seoDescription?.trim() ||
      brand.shortDescription?.trim() ||
      undefined,
    ogImageUrl:
      brand.ogImageUrl?.trim() ||
      brand.bannerDesktopUrl?.trim() ||
      brand.logoUrl?.trim() ||
      null,
  });
  const meta = toNextMetadata(seo);
  if (brand.canonicalUrl?.trim()) {
    return {
      ...meta,
      alternates: { canonical: brand.canonicalUrl.trim() },
    };
  }
  return meta;
}

export default async function BrandLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = await prisma.brand.findFirst({
    where: { slug, active: true },
    include: {
      products: {
        where: { active: true },
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          shortDescription: true,
          galleryUrls: true,
          categoryKey: true,
          variants: {
            where: { active: true },
            orderBy: { priceVnd: "asc" },
            take: 1,
            select: {
              name: true,
              priceVnd: true,
              deliverableType: true,
            },
          },
        },
      },
    },
  });
  if (!brand) notFound();

  const products = brand.products
    .map((p) => {
      const variant = p.variants[0];
      if (!variant) return null;
      const gallery = parseStringList(p.galleryUrls);
      const categoryId =
        p.categoryKey &&
        (PRODUCT_CATEGORY_KEYS as readonly string[]).includes(p.categoryKey)
          ? (p.categoryKey as ShopCategoryId)
          : ("other" as ShopCategoryId);
      const receive = receiveFromDeliverable(variant.deliverableType);
      return {
        id: p.id,
        brandName: brand.name,
        productName: p.name,
        packageName: variant.name,
        priceVnd: variant.priceVnd,
        receiveLabel: receive.label,
        receiveKind: receive.kind,
        href: `/products/${p.slug}`,
        imageUrl: gallery[0],
        mark: inferMark(categoryId, p.name),
        ctaLabel: "Xem chi tiết",
      };
    })
    .filter((p): p is NonNullable<typeof p> => p != null);

  return (
    <BrandDetailView
      brand={{
        name: brand.name,
        slug: brand.slug,
        logoUrl: brand.logoUrl?.trim() || null,
        shortDescription: brand.shortDescription?.trim() || null,
        description: brand.description?.trim() || null,
        featured: brand.featured,
        bannerDesktopUrl: brand.bannerDesktopUrl?.trim() || null,
        bannerMobileUrl: brand.bannerMobileUrl?.trim() || null,
        products,
      }}
    />
  );
}
