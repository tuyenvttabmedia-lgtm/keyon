import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { resolveMediaUrl } from "@/lib/media-url";
import {
  Microsoft365EmailLanding,
  M365_EMAIL_FAQ,
  M365_EMAIL_PATH,
  M365_EMAIL_SEO,
  type M365BrandChip,
  type M365PlanCard,
} from "@/storefront/components/services/Microsoft365EmailLanding";
import { ServiceTopicLanding } from "@/storefront/components/services/ServiceTopicLanding";
import { SERVICE_TOPICS, serviceTopicBySlug } from "@/storefront/nav/ia";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildServiceJsonLd,
} from "@/server/seo/structured-data";
import { absoluteTitle } from "@/server/seo/title";
import { parseStringList, PRODUCT_CATEGORY_KEYS } from "@/storefront/lib/product-cms";
import { inferCategory } from "@/storefront/components/shop/shop-utils";

async function loadM365Plans(): Promise<M365PlanCard[]> {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      brand: true,
      variants: { where: { active: true }, orderBy: { priceVnd: "asc" }, take: 1 },
    },
    orderBy: { name: "asc" },
    take: 60,
  });
  const scored: { score: number; item: M365PlanCard }[] = [];
  for (const product of products) {
    const variant = product.variants[0];
    if (!variant) continue;
    const cat =
      product.categoryKey &&
      (PRODUCT_CATEGORY_KEYS as readonly string[]).includes(product.categoryKey)
        ? product.categoryKey
        : inferCategory(product.brand.name, product.name);
    const name = product.name.toLowerCase();
    const isM365 =
      name.includes("365") ||
      name.includes("office") ||
      name.includes("outlook") ||
      name.includes("teams") ||
      name.includes("onedrive");
    if (!isM365 || name.includes("windows")) continue;
    let score = 0;
    if (name.includes("business")) score += 30;
    if (name.includes("365")) score += 50;
    else if (name.includes("office")) score += 20;
    if (cat === "office") score += 10;
    const image = parseStringList(product.galleryUrls)[0];
    const imageUrl = image ? resolveMediaUrl(image) || image : "";
    scored.push({
      score,
      item: {
        id: product.id,
        title: product.name,
        href: `/products/${product.slug}`,
        priceLabel: `Từ ${variant.priceVnd.toLocaleString("vi-VN")}đ`,
        imageUrl: imageUrl || undefined,
      },
    });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 4).map((row) => row.item);
}

async function loadM365Brands(): Promise<M365BrandChip[]> {
  const brands = await prisma.brand.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
    take: 8,
    select: { name: true, slug: true, logoUrl: true },
  });
  return brands.map((brand) => {
    const logoUrl = brand.logoUrl ? resolveMediaUrl(brand.logoUrl) || brand.logoUrl : "";
    return {
      name: brand.name,
      href: `/brands/${brand.slug}`,
      logoUrl: logoUrl || undefined,
    };
  });
}

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICE_TOPICS.map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = serviceTopicBySlug(slug);
  if (!topic) return buildMainPageMetadata("/services");
  if (slug === "microsoft-365-email") {
    const base = await buildMainPageMetadata(M365_EMAIL_PATH);
    return {
      ...base,
      title: absoluteTitle(M365_EMAIL_SEO.title),
      description: M365_EMAIL_SEO.description,
      openGraph: {
        ...base.openGraph,
        title: M365_EMAIL_SEO.title,
        description: M365_EMAIL_SEO.description,
      },
      twitter: {
        ...base.twitter,
        title: M365_EMAIL_SEO.title,
        description: M365_EMAIL_SEO.description,
      },
    };
  }
  return {
    ...(await buildMainPageMetadata(`/services/${slug}`)),
    title: absoluteTitle(`${topic.label} | KEYON`),
    description: topic.description,
  };
}

export default async function ServiceTopicPage({ params }: Props) {
  const { slug } = await params;
  const topic = serviceTopicBySlug(slug);
  if (!topic) notFound();
  if (slug === "microsoft-365-email") {
    const serviceLd = buildServiceJsonLd({
      name: "Thiết lập Microsoft 365 và email doanh nghiệp",
      description: M365_EMAIL_SEO.description,
      path: M365_EMAIL_PATH,
      serviceType: "Thiết lập Microsoft 365 và email doanh nghiệp",
    });
    const breadcrumbLd = buildBreadcrumbJsonLd([
      { name: "Trang chủ", path: "/" },
      { name: "Dịch vụ", path: "/services" },
      { name: "Microsoft 365 & Email doanh nghiệp", path: M365_EMAIL_PATH },
    ]);
    const faqLd = buildFaqPageJsonLd([...M365_EMAIL_FAQ]);
    const [plans, brands] = await Promise.all([loadM365Plans(), loadM365Brands()]);
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        {faqLd ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
          />
        ) : null}
        <Microsoft365EmailLanding plans={plans} brands={brands} />
      </>
    );
  }
  return <ServiceTopicLanding topic={topic} />;
}
