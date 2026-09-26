import { Suspense } from "react";
import type { Metadata } from "next";
import { getHomeContent } from "@/storefront/content/get-home-content";
import { getHomeHero } from "@/storefront/content/get-home-hero";
import { HeroStatsService } from "@/server/hero-stats";
import type { HeroPublicStats } from "@/server/hero-stats";
import { HeroSection } from "@/storefront/components/home/HeroSection";
import { HomeBelowFold } from "@/storefront/components/home/HomeBelowFold";
import { buildMainPageMetadata } from "@/server/seo/metadata";

/** ISR — marketing HTML cacheable; CMS/stats refresh within a minute. */
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return buildMainPageMetadata("/");
}

/** Drop unused recent activity (never rendered) from the hero props tree. */
function slimHeroStats(stats: HeroPublicStats): HeroPublicStats {
  return {
    windowDays: stats.windowDays,
    sparkScaleMax: stats.sparkScaleMax,
    cards: stats.cards,
    recent: [],
  };
}

async function HomeHero() {
  const [hero, heroStats] = await Promise.all([
    getHomeHero(),
    HeroStatsService.getPublicWindowStats(),
  ]);
  return <HeroSection hero={hero} stats={slimHeroStats(heroStats)} />;
}

async function HomeRest() {
  const content = await getHomeContent();
  return <HomeBelowFold content={content} />;
}

export default function HomePage() {
  return (
    <>
      <Suspense
        fallback={
          <section className="bg-white pb-5 pt-5 md:pb-4 md:pt-5 lg:pb-6 lg:pt-8">
            <div className="home-container min-h-[280px] animate-pulse rounded-2xl bg-surface" />
          </section>
        }
      >
        <HomeHero />
      </Suspense>
      <Suspense fallback={null}>
        <HomeRest />
      </Suspense>
    </>
  );
}
