import type { HomeContent } from "@/storefront/content/types";
import type { HeroPublicStats } from "@/server/hero-stats";
import { HeroSection } from "./HeroSection";
import { TrustPartnersSection } from "./TrustPartnersSection";
import { CategoriesSection } from "./CategoriesSection";
import { FeaturedSection } from "./FeaturedSection";
import { WhyKeyonSection } from "./WhyKeyonSection";
import { SolutionsSection } from "./SolutionsSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { NewsSection } from "./NewsSection";
import { FaqHomeSection } from "./FaqHomeSection";
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
      <CategoriesSection data={content.categories} />
      <SolutionsSection data={content.solutions} />
      <FeaturedSection data={content.featured} />
      <HowItWorksSection data={content.howItWorks} />
      <WhyKeyonSection data={content.why} />
      <TrustPartnersSection data={content.partners} />
      <NewsSection data={content.news} />
      {content.faqHome ? <FaqHomeSection data={content.faqHome} /> : null}
      <CtaBannerSection data={content.ctaBanner} />
    </>
  );
}
