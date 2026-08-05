import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { IaLandingPage } from "@/storefront/components/marketing/IaLanding";
import {
  CLOUD_FALLBACK_FEATURED,
  CloudSolutionLanding,
  type CloudFeaturedProduct,
} from "@/storefront/components/solutions/CloudSolutionLanding";
import {
  PRODUCTIVITY_FALLBACK_FEATURED,
  ProductivitySolutionLanding,
  type ProductivityFeaturedProduct,
} from "@/storefront/components/solutions/ProductivitySolutionLanding";
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
  if (slug === "productivity") {
    return {
      ...(await buildMainPageMetadata("/solutions/productivity")),
      title: "Năng suất & Cộng tác | KEYON",
      description:
        "Microsoft 365, Office, Teams và công cụ cộng tác chính hãng trên KEYON — kích hoạt nhanh, hỗ trợ tiếng Việt.",
    };
  }
  return {
    ...(await buildMainPageMetadata(`/solutions/${slug}`)),
    title: `${page.title} | KEYON`,
    description: page.subtitle,
  };
}

async function loadCloudFeatured(): Promise<{
  featured: CloudFeaturedProduct[];
  usingFallback: boolean;
}> {
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
      icon: "server",
    });
    if (cloudish.length >= 5) break;
  }

  if (cloudish.length > 0) {
    return { featured: cloudish, usingFallback: false };
  }
  return { featured: CLOUD_FALLBACK_FEATURED, usingFallback: true };
}

function inferProductivityBrand(
  name: string,
): ProductivityFeaturedProduct["brand"] {
  const n = name.toLowerCase();
  if (n.includes("team")) return "teams";
  if (n.includes("outlook")) return "outlook";
  if (n.includes("onedrive") || n.includes("one drive")) return "onedrive";
  if (n.includes("365") || n.includes("microsoft 365") || n.includes("m365")) return "m365";
  if (n.includes("office")) return "office";
  return "generic";
}

async function loadProductivityFeatured(): Promise<{
  featured: ProductivityFeaturedProduct[];
  usingFallback: boolean;
}> {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      brand: true,
      variants: { where: { active: true }, orderBy: { priceVnd: "asc" }, take: 1 },
    },
    orderBy: { name: "asc" },
    take: 60,
  });

  const scored: { score: number; item: ProductivityFeaturedProduct }[] = [];
  for (const p of products) {
    const variant = p.variants[0];
    if (!variant) continue;
    const cat =
      p.categoryKey &&
      (PRODUCT_CATEGORY_KEYS as readonly string[]).includes(p.categoryKey)
        ? p.categoryKey
        : inferCategory(p.brand.name, p.name);
    const nameL = p.name.toLowerCase();
    const brandL = p.brand.name.toLowerCase();
    const isOffice =
      cat === "office" ||
      nameL.includes("office") ||
      nameL.includes("365") ||
      nameL.includes("teams") ||
      nameL.includes("outlook") ||
      nameL.includes("onedrive") ||
      brandL.includes("microsoft");
    if (!isOffice) continue;

    let score = 0;
    if (nameL.includes("365") || nameL.includes("microsoft 365")) score += 50;
    else if (nameL.includes("teams")) score += 40;
    else if (nameL.includes("office 2024") || nameL.includes("office 2021")) score += 35;
    else if (nameL.includes("outlook")) score += 30;
    else if (nameL.includes("onedrive")) score += 25;
    else if (nameL.includes("office")) score += 20;
    if (cat === "office") score += 10;

    scored.push({
      score,
      item: {
        id: p.id,
        title: p.name,
        href: `/products/${p.slug}`,
        description: `${p.brand.name} · License / gói số trên KEYON`,
        priceLabel: `Từ ${variant.priceVnd.toLocaleString("vi-VN")}đ`,
        brand: inferProductivityBrand(p.name),
      },
    });
  }

  scored.sort((a, b) => b.score - a.score);
  const featured = scored.slice(0, 5).map((s) => s.item);
  if (featured.length > 0) {
    return { featured, usingFallback: false };
  }
  return { featured: PRODUCTIVITY_FALLBACK_FEATURED, usingFallback: true };
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  const page = SOLUTION_PAGES[slug];
  if (!page) notFound();

  if (slug === "cloud") {
    const { featured, usingFallback } = await loadCloudFeatured();
    return <CloudSolutionLanding featured={featured} usingFallback={usingFallback} />;
  }

  if (slug === "productivity") {
    const { featured, usingFallback } = await loadProductivityFeatured();
    return (
      <ProductivitySolutionLanding featured={featured} usingFallback={usingFallback} />
    );
  }

  return <IaLandingPage page={page} hubLabel="Giải pháp" hubHref="/solutions" />;
}
