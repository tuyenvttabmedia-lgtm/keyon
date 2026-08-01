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

/**
 * Home content: fixture + overlay CMS (hero, nav, footer, news, partners, categories, ratings, why banner).
 * Wrapped in React cache() so layout + page share one load per request.
 */
export const getHomeContent = cache(async (): Promise<HomeContent> => {
  const [cmsHome, posts, footer, nav, partners, categories, ratingMap, banner] =
    await Promise.all([
      readJsonFile("home.json", defaultCmsHome),
      readJsonFile<BlogPost[]>("blog.json", defaultBlog),
      readJsonFile<CmsFooter>("footer.json", defaultCmsFooter),
      readJsonFile<CmsNav>("nav.json", defaultCmsNav),
      readJsonFile<CmsPartners>("partners.json", defaultCmsPartners),
      readJsonFile<CmsCategories>("categories.json", defaultCmsCategories),
      getProductRatingMap(),
      readJsonFile<CmsBanner>("banner.json", defaultCmsBanner),
    ]);

  const published = posts.filter((p) => p.status === "published").slice(0, 4);
  const partnerItems = (partners.items?.length ? partners.items : homeFixture.partners.items).filter(
    (p) => p.visible !== false,
  );

  const categorySource =
    categories.items?.length > 0 ? categories.items : defaultCmsCategories.items;
  const categoryItems: CategoryItem[] = categorySource
    .filter((c) => c.visible !== false)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 8)
    .map((c) => ({
      id: c.id,
      title: c.title,
      countLabel: c.countLabel,
      href: c.href,
      icon: toCategoryIcon(c.iconKey),
      iconUrl: c.iconUrl,
      accentColor: c.accentColor,
    }));

  const featuredItems = ProductRatingsService.applyToFeatured(
    homeFixture.featured.items,
    ratingMap,
  );

  return {
    ...homeFixture,
    navigation: nav.items.length ? nav.items : homeFixture.navigation,
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
    },
    why: {
      ...homeFixture.why,
      sideBanner: {
        title: banner.title,
        ctaLabel: banner.ctaLabel,
        ctaHref: banner.ctaHref,
        imageUrl: banner.imageUrl,
        visible: banner.visible,
      },
    },
    news: {
      ...homeFixture.news,
      items:
        published.length >= 4
          ? published.map((p, i) => ({
              id: p.id,
              title: p.title,
              excerpt: p.excerpt,
              dateLabel: new Date(p.publishedAt ?? p.updatedAt).toLocaleDateString("vi-VN"),
              href: `/blog/${p.slug}`,
              tag: homeFixture.news.items[i]?.tag,
              tagTone: homeFixture.news.items[i]?.tagTone,
            }))
          : homeFixture.news.items,
    },
    footer: {
      blurb: footer.blurb || homeFixture.footer.blurb,
      columns: footer.columns.length ? footer.columns : homeFixture.footer.columns,
      copyright: footer.copyright || homeFixture.footer.copyright,
      legalLinks: footer.legalLinks.length
        ? footer.legalLinks
        : homeFixture.footer.legalLinks,
    },
  };
});

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
