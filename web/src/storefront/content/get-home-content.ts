import { cache } from "react";
import type { HomeContent } from "./types";
import { homeFixture } from "./home.fixture";
import {
  defaultBlog,
  defaultCmsBanner,
  defaultCmsCategories,
  defaultCmsFooter,
  defaultCmsHome,
  defaultCmsNav,
  defaultCmsFaq,
  defaultCmsPartners,
  readJsonFile,
  type BlogPost,
  type CmsBanner,
  type CmsCategories,
  type CmsCategoryIconKey,
  type CmsFaqItem,
  type CmsFooter,
  type CmsNav,
  type CmsPartners,
} from "@/server/cms/store";
import { ProductRatingsService, getProductRatingMap } from "@/server/product-ratings";
import type { CategoryIconKey, CategoryItem } from "./types";
import { prisma } from "@/lib/db";
import { resolveMediaUrl } from "@/lib/media-url";
import { resolveStorage } from "@/server/storage/config";
import {
  inferCategory,
  shopCatFromCmsIcon,
} from "@/storefront/components/shop/shop-utils";
import { PRODUCT_CATEGORY_KEYS } from "@/storefront/lib/product-cms";
import type { ShopCategoryId } from "@/storefront/components/shop/types";
import { mapProductsToShopCards } from "@/storefront/lib/related-products";
import type { FeaturedProduct, FaqItem } from "./types";

/**
 * Home content: fixture + overlay CMS (hero, nav, footer, news, partners, categories, ratings, why banner).
 * Wrapped in React cache() so layout + page share one load per request.
 */
export const getHomeContent = cache(async (): Promise<HomeContent> => {
  const [
    cmsHome,
    posts,
    footer,
    nav,
    partners,
    categories,
    ratingMap,
    banner,
    catalogRows,
    faqRaw,
  ] = await Promise.all([
    readJsonFile("home.json", defaultCmsHome),
    readJsonFile<BlogPost[]>("blog.json", defaultBlog),
    readJsonFile<CmsFooter>("footer.json", defaultCmsFooter),
    readJsonFile<CmsNav>("nav.json", defaultCmsNav),
    readJsonFile<CmsPartners>("partners.json", defaultCmsPartners),
    readJsonFile<CmsCategories>("categories.json", defaultCmsCategories),
    getProductRatingMap(),
    readJsonFile<CmsBanner>("banner.json", defaultCmsBanner),
    prisma.product.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryKey: true,
        galleryUrls: true,
        brand: { select: { name: true } },
        variants: {
          where: { active: true },
          orderBy: { priceVnd: "asc" },
          select: {
            id: true,
            name: true,
            priceVnd: true,
            compareAtPriceVnd: true,
            deliverableType: true,
            fulfillmentStrategy: true,
          },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 40,
    }),
    readJsonFile<CmsFaqItem[]>("faq.json", defaultCmsFaq),
  ]);

  const published = posts.filter((p) => p.status === "published").slice(0, 4);

  const storage = await resolveStorage();
  const mediaBase =
    storage.driver === "wasabi"
      ? storage.wasabi.publicBaseUrl ||
        `${storage.wasabi.endpoint.replace(/\/$/, "")}/${storage.wasabi.bucket}`
      : "";

  const partnerItems = (partners.items?.length ? partners.items : homeFixture.partners.items)
    .filter((p) => p.visible !== false)
    .map((p) => ({
      ...p,
      logoUrl: p.logoUrl
        ? resolveMediaUrl(p.logoUrl, mediaBase) || p.logoUrl
        : p.logoUrl,
    }));

  const shopCounts: Record<ShopCategoryId, number> = {
    windows: 0,
    office: 0,
    adobe: 0,
    cloud: 0,
    security: 0,
    other: 0,
  };
  for (const p of catalogRows) {
    if (!p.variants.length) continue;
    const categoryId: ShopCategoryId =
      p.categoryKey &&
      (PRODUCT_CATEGORY_KEYS as readonly string[]).includes(p.categoryKey)
        ? (p.categoryKey as ShopCategoryId)
        : inferCategory(p.brand.name, p.name);
    shopCounts[categoryId] += 1;
  }

  const categorySource =
    categories.items?.length > 0 ? categories.items : defaultCmsCategories.items;
  const categoryItems: CategoryItem[] = categorySource
    .filter((c) => c.visible !== false)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 8)
    .map((c) => {
      const shopCat = shopCatFromCmsIcon(c.iconKey);
      const liveCount =
        shopCat && shopCat !== "all" ? shopCounts[shopCat] : undefined;
      const countLabel =
        liveCount !== undefined
          ? `${liveCount} sản phẩm`
          : c.countLabel;
      const href =
        shopCat && shopCat !== "all"
          ? `/products?cat=${shopCat}`
          : c.href || "/products";
      return {
        id: c.id,
        title: c.title,
        countLabel,
        href,
        icon: toCategoryIcon(c.iconKey),
        iconUrl: c.iconUrl,
        accentColor: c.accentColor,
      };
    });

  const shopCards = mapProductsToShopCards(
    catalogRows.filter((p) => p.variants.length > 0).slice(0, 8),
  );
  const featuredFromCatalog: FeaturedProduct[] = shopCards.map((c) => {
    const gal = c.imageUrl;
    return {
      id: c.id,
      brandName: c.brandName,
      productName: c.productName,
      packageName: c.packageName,
      priceVnd: c.priceVnd,
      receiveLabel: c.receiveLabel,
      receiveKind: c.receiveKind,
      deliveryLabel: c.deliveryLabel,
      mark: c.mark,
      imageUrl: gal,
      href: c.href,
      ctaLabel: "Thanh toán ngay",
      rating: undefined,
      reviewCount: undefined,
    };
  });
  /** Prefer live catalog; pad with fixture so Home always shows up to 5 compact cards. */
  const featuredMerged = fillFeaturedSlots(
    featuredFromCatalog,
    homeFixture.featured.items,
    5,
  );
  const featuredItems = ProductRatingsService.applyToFeatured(
    featuredMerged,
    ratingMap,
  );

  const faqHome: FaqItem[] = faqRaw
    .filter((f) => f.showOnHome)
    .slice(0, 6)
    .map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      category: f.category ?? "general",
    }));

  const solutions = {
    ...homeFixture.solutions,
    title: cmsHome.solutionsTitle || homeFixture.solutions.title,
    subtitle: cmsHome.solutionsSubtitle || homeFixture.solutions.subtitle,
  };

  const why = {
    ...homeFixture.why,
    title: cmsHome.whyTitle || homeFixture.why.title,
    subtitle: cmsHome.whySubtitle || homeFixture.why.subtitle,
    sideBanner: {
      title: banner.title,
      ctaLabel: banner.ctaLabel,
      ctaHref: banner.ctaHref,
      imageUrl: banner.imageUrl,
      visible: banner.visible,
    },
  };

  const howItWorks = {
    ...homeFixture.howItWorks,
    title: cmsHome.howTitle || homeFixture.howItWorks.title,
    subtitle: cmsHome.howSubtitle || homeFixture.howItWorks.subtitle,
  };

  const ctaBanner = {
    ...homeFixture.ctaBanner,
    title: cmsHome.ctaTitle || homeFixture.ctaBanner.title,
    subtitle: cmsHome.ctaSubtitle || homeFixture.ctaBanner.subtitle,
    ctaLabel: cmsHome.ctaLabel || homeFixture.ctaBanner.ctaLabel,
    ctaHref: cmsHome.ctaHref || homeFixture.ctaBanner.ctaHref,
  };

  return {
    ...homeFixture,
    navigation: nav.items.length ? nav.items : homeFixture.navigation,
    brand: {
      logoUrl: resolveMediaUrl(nav.logoUrl, mediaBase) || undefined,
      brandName: nav.brandName?.trim() || defaultCmsNav.brandName,
      tagline:
        typeof nav.tagline === "string"
          ? nav.tagline.trim()
          : defaultCmsNav.tagline,
    },
    hero: {
      ...homeFixture.hero,
      title: cmsHome.heroTitle || homeFixture.hero.title,
      subtitle: cmsHome.heroSubtitle || homeFixture.hero.subtitle,
      ctaLabel: cmsHome.heroCta || homeFixture.hero.ctaLabel,
      ctaHref: cmsHome.heroCtaHref || homeFixture.hero.ctaHref,
      visible: cmsHome.published,
    },
    partners: {
      title: partners.title || homeFixture.partners.title,
      badges: partners.badges?.length ? partners.badges : homeFixture.partners.badges,
      items: partnerItems,
    },
    categories: {
      ...homeFixture.categories,
      title: categories.title || homeFixture.categories.title,
      viewAllHref: categories.viewAllHref || homeFixture.categories.viewAllHref,
      viewAllLabel: categories.viewAllLabel || homeFixture.categories.viewAllLabel,
      items: categoryItems.length ? categoryItems : homeFixture.categories.items,
    },
    featured: {
      ...homeFixture.featured,
      items: featuredItems,
      visible: featuredItems.length > 0,
    },
    why,
    howItWorks,
    solutions,
    ctaBanner,
    faqHome: {
      visible: faqHome.length > 0,
      title: "Câu hỏi thường gặp",
      items: faqHome,
    },
    news: {
      ...homeFixture.news,
      visible: published.length > 0,
      items: published.map((p, i) => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt,
        dateLabel: new Date(p.publishedAt ?? p.updatedAt).toLocaleDateString(
          "vi-VN",
        ),
        href: `/blog/${p.slug}`,
        tag: homeFixture.news.items[i]?.tag,
        tagTone: homeFixture.news.items[i]?.tagTone,
      })),
    },
    footer: {
      logoUrl:
        resolveMediaUrl(footer.logoUrl, mediaBase) ||
        resolveMediaUrl(nav.logoUrl, mediaBase) ||
        undefined,
      brandName:
        footer.brandName?.trim() ||
        nav.brandName?.trim() ||
        defaultCmsFooter.brandName,
      blurb: footer.blurb || homeFixture.footer.blurb,
      columns: footer.columns.length ? footer.columns : homeFixture.footer.columns,
      copyright: footer.copyright || homeFixture.footer.copyright,
      legalLinks: footer.legalLinks.length
        ? footer.legalLinks
        : homeFixture.footer.legalLinks,
      supportEmail: "support@keyon.vn",
      paymentBadges: ["VietQR", "Chuyển khoản"],
    },
  };
});

/** Catalog first, then fixture fillers — keep Home featured row dense (up to `limit`). */
function fillFeaturedSlots(
  catalog: FeaturedProduct[],
  fallback: FeaturedProduct[],
  limit: number,
): FeaturedProduct[] {
  const out: FeaturedProduct[] = [];
  const seen = new Set<string>();
  const keyOf = (p: FeaturedProduct) =>
    `${p.brandName}|${p.productName}`.toLowerCase().trim();

  for (const list of [catalog, fallback]) {
    for (const p of list) {
      const key = keyOf(p);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        ...p,
        rating: p.rating,
        reviewCount: p.reviewCount,
      });
      if (out.length >= limit) return out;
    }
  }
  return out;
}

function toCategoryIcon(key?: CmsCategoryIconKey): CategoryIconKey {
  if (!key) return "other";
  return key;
}

export async function getFaqForPage() {
  const faq = await readJsonFile<CmsFaqItem[]>("faq.json", defaultCmsFaq);
  return faq
    .filter((f) => f.showOnFaqPage)
    .map((f) => ({
      ...f,
      category: f.category ?? ("general" as const),
    }));
}
