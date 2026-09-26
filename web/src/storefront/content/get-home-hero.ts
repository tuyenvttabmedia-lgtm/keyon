import { cache } from "react";
import { unstable_cache } from "next/cache";
import { defaultCmsHome, readJsonFile } from "@/server/cms/store";
import { homeFixture } from "./home.fixture";
import type { HomeHero } from "./types";

function cmsTextOrFallback(value: string | undefined, fallback: string): string {
  const v = value?.trim() ?? "";
  return v || fallback;
}

async function loadHomeHero(): Promise<HomeHero> {
  const cmsHome = await readJsonFile("home.json", defaultCmsHome);
  return {
    ...homeFixture.hero,
    title: cmsTextOrFallback(cmsHome.heroTitle, homeFixture.hero.title),
    titleAccent: cmsHome.heroTitleAccent?.trim() || undefined,
    subtitle: cmsTextOrFallback(cmsHome.heroSubtitle, homeFixture.hero.subtitle),
    ctaLabel: cmsHome.heroCta || homeFixture.hero.ctaLabel,
    ctaHref: cmsHome.heroCtaHref || homeFixture.hero.ctaHref,
    visible: cmsHome.published,
  };
}

const getHomeHeroCached = unstable_cache(loadHomeHero, ["storefront-home-hero-v1"], {
  revalidate: 60,
});

/** Fast path for Home LCP — CMS hero only, no catalog. */
export const getHomeHero = cache(() => getHomeHeroCached());
