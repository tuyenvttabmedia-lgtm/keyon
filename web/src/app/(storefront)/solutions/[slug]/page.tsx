import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { IaLandingPage } from "@/storefront/components/marketing/IaLanding";
import {
  CLOUD_FALLBACK_FEATURED,
  CloudSolutionLanding,
  type CloudFeaturedProduct,
} from "@/storefront/components/solutions/CloudSolutionLanding";
import { SOLUTION_PAGES } from "@/storefront/nav/ia-pages";
import { PRODUCT_CATEGORY_KEYS } from "@/storefront/lib/product-cms";
import { inferCategory } from "@/storefront/components/shop/shop-utils";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(SOLUTION_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = SOLUTION_PAGES[slug];
  if (!page) return buildMainPageMetadata("/solutions");
  if (slug === "cloud") {
    return {
      ...(await buildMainPageMetadata("/solutions/cloud")),
      title: "Cloud linh hoạt cho doanh nghiệp | KEYON",
      description:
        "Giải pháp cloud KEYON: hạ tầng, storage, backup và tư vấn triển khai cho doanh nghiệp hiện đại.",
    };
  }
  return {
    ...(await buildMainPageMetadata(`/solutions/${slug}`)),
    title: `${page.title} | KEYON`,
    description: page.subtitle,
  };
}

async function loadCloudFeatured(): Promise<CloudFeaturedProduct[]> {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      brand: true,
      variants: { where: { active: true }, orderBy: { priceVnd: "asc" }, take: 1 },
    },
    orderBy: { name: "asc" },
    take: 40,
  });

  const cloudish: CloudFeaturedProduct[] = [];
  for (const p of products) {
    const variant = p.variants[0];
    if (!variant) continue;
    const cat =
      p.categoryKey &&
      (PRODUCT_CATEGORY_KEYS as readonly string[]).includes(p.categoryKey)
        ? p.categoryKey
        : inferCategory(p.brand.name, p.name);
    const nameL = p.name.toLowerCase();
    const isCloud =
      cat === "cloud" ||
      nameL.includes("cloud") ||
      nameL.includes("azure") ||
      nameL.includes("server") ||
      nameL.includes("backup");
    if (!isCloud) continue;
    cloudish.push({
      id: p.id,
      title: p.name,
      href: `/products/${p.slug}`,
      specs: [
        p.brand.name,
        variant.sku ? `SKU ${variant.sku}` : "License / dịch vụ số",
      ].filter(Boolean),
      priceLabel: `Từ ${variant.priceVnd.toLocaleString("vi-VN")}đ`,
    });
    if (cloudish.length >= 5) break;
  }

  return cloudish.length > 0 ? cloudish : CLOUD_FALLBACK_FEATURED;
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  const page = SOLUTION_PAGES[slug];
  if (!page) notFound();

  if (slug === "cloud") {
    const featured = await loadCloudFeatured();
    return <CloudSolutionLanding featured={featured} />;
  }

  return <IaLandingPage page={page} hubLabel="Giải pháp" hubHref="/solutions" />;
}
