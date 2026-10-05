import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { resolveMediaUrl } from "@/lib/media-url";
import { Microsoft365EmailLanding, M365_EMAIL_FAQ, M365_EMAIL_PATH, M365_EMAIL_SEO } from "@/storefront/components/services/Microsoft365EmailLanding";
import { ServiceTopicLanding } from "@/storefront/components/services/ServiceTopicLanding";
import { SERVICE_TOPICS, serviceTopicBySlug } from "@/storefront/nav/ia";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildServiceJsonLd,
} from "@/server/seo/structured-data";
import { absoluteTitle } from "@/server/seo/title";
import { PRODUCT_CATEGORY_KEYS } from "@/storefront/lib/product-cms";
import { inferCategory } from "@/storefront/components/shop/shop-utils";
import { mapProductsToShopCards } from "@/storefront/lib/related-products";
import type { FeaturedProduct } from "@/storefront/content/types";

async function loadM365Plans(): Promise<FeaturedProduct[]> {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: {
      brand: true,
      variants: { where: { active: true }, orderBy: { priceVnd: "asc" }, take: 1 },
    },
    orderBy: { name: "asc" },
    take: 80,
  });
  const scored: { score: number; product: (typeof products)[number] }[] = [];
  for (const product of products) {
    if (!product.variants[0]) continue;
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
    scored.push({ score, product });
  }
  scored.sort(
    (a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name, "vi"),
  );
  return mapProductsToShopCards(scored.slice(0, 5).map((row) => row.product)).map((card) => {
    const imageUrl = card.imageUrl ? resolveMediaUrl(card.imageUrl) || card.imageUrl : "";
    return {
      id: card.id,
      brandName: card.brandName,
      productName: card.productName,
      packageName: card.packageName,
      priceVnd: card.priceVnd,
      receiveLabel: card.receiveLabel,
      receiveKind: card.receiveKind,
      deliveryLabel: card.deliveryLabel,
      mark: card.mark,
      imageUrl: imageUrl || undefined,
      href: card.href,
      ctaLabel: "Xem sản phẩm →",
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
    const plans = await loadM365Plans();
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
        <Microsoft365EmailLanding plans={plans} />
      </>
    );
  }
  return <ServiceTopicLanding topic={topic} />;
}
