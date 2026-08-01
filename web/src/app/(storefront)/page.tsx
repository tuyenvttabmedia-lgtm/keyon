import { getHomeContent } from "@/storefront/content/get-home-content";
import { HeroStatsService } from "@/server/hero-stats";
import { HomeView } from "@/storefront/components/home/HomeView";

export default async function HomePage() {
  const [content, heroStats] = await Promise.all([
    getHomeContent(),
    HeroStatsService.getPublicWindowStats(),
  ]);
  return <HomeView content={content} heroStats={heroStats} />;
}
