import type { Metadata } from "next";
import { getHomeContent } from "@/storefront/content/get-home-content";
import { HeroStatsService } from "@/server/hero-stats";
import { HomeView } from "@/storefront/components/home/HomeView";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMainPageMetadata("/");
}

export default async function HomePage() {
  const [content, heroStats] = await Promise.all([
    getHomeContent(),
    HeroStatsService.getPublicWindowStats(),
  ]);
  return <HomeView content={content} heroStats={heroStats} />;
}
