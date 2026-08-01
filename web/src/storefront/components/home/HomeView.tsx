import type { HomeContent } from "@/storefront/content/types";
import type { HeroPublicStats } from "@/server/hero-stats";
import { HeroSection } from "./HeroSection";
import { TrustPartnersSection } from "./TrustPartnersSection";
import { CategoriesSection } from "./CategoriesSection";
import { FeaturedSection } from "./FeaturedSection";
import { WhyKeyonSection } from "./WhyKeyonSection";
import { SolutionsSection } from "./SolutionsSection";
import { NewsSection } from "./NewsSection";
import { CtaBannerSection } from "./CtaBannerSection";

export function HomeView({
  content,
  heroStats,
}: {
  content: HomeContent;
  heroStats: HeroPublicStats;
}) {
  return (
    <>
      <HeroSection hero={content.hero} stats={heroStats} />
      <TrustPartnersSection data={content.partners} className="hidden lg:block" />
      <CategoriesSection data={content.categories} />
      <FeaturedSection data={content.featured} />
      <WhyKeyonSection data={content.why} />
      <SolutionsSection data={content.solutions} />
      <NewsSection data={content.news} />
      <CtaBannerSection data={content.ctaBanner} />
    </>
  );
}
