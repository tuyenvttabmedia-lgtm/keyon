import { cache } from "react";
import { unstable_cache } from "next/cache";
import { defaultCmsHome, readJsonFile } from "@/server/cms/store";
import { homeFixture } from "./home.fixture";
import type { HomeHero } from "./types";

function cmsTextOrFallback(
  value: string | undefined,
  fallback: string,
  stale: readonly string[] = [],
): string {
  const v = value?.trim() ?? "";
  if (!v || stale.includes(v)) return fallback;
  return v;
}

const RETIRED_HERO_TITLES = [
  "Nền tảng phân phối bản quyền số",
  "Nền tảng phân phối bản quyền số cho phần mềm và cloud",
];

const RETIRED_HERO_SUBTITLES = [
  "Mua, triển khai và quản lý software license, subscription, cloud và hạ tầng số trên một nền tảng — từ giao license đến gia hạn và hỗ trợ.",
  "Mua, triển khai và quản lý bản quyền phần mềm, cloud và dịch vụ số trên một nền tảng duy nhất. Dành cho cá nhân, đội nhóm và doanh nghiệp.",
];

async function loadHomeHero(): Promise<HomeHero> {
  const cmsHome = await readJsonFile("home.json", defaultCmsHome);
  return {
    ...homeFixture.hero,
    title: cmsTextOrFallback(
      cmsHome.heroTitle,
      homeFixture.hero.title,
      RETIRED_HERO_TITLES,
    ),
    titleAccent: cmsHome.heroTitleAccent?.trim() || undefined,
    subtitle: cmsTextOrFallback(
      cmsHome.heroSubtitle,
      homeFixture.hero.subtitle,
      RETIRED_HERO_SUBTITLES,
    ),
    ctaLabel: cmsHome.heroCta || homeFixture.hero.ctaLabel,
    ctaHref: cmsHome.heroCtaHref || homeFixture.hero.ctaHref,
    visible: cmsHome.published,
  };
}

const getHomeHeroCached = unstable_cache(loadHomeHero, ["storefront-home-hero-v3"], {
  revalidate: 60,
});

/** Fast path for Home LCP — CMS hero only, no catalog. */
export const getHomeHero = cache(() => getHomeHeroCached());
