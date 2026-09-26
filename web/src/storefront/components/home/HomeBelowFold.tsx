import type { HomeContent } from "@/storefront/content/types";
import { CategoriesSection } from "./CategoriesSection";
import { FeaturedSection } from "./FeaturedSection";
import { WhyKeyonSection } from "./WhyKeyonSection";
import { SolutionsSection } from "./SolutionsSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { NewsSection } from "./NewsSection";
import { FaqHomeSection } from "./FaqHomeSection";
import { CtaBannerSection } from "./CtaBannerSection";
import { TrustPartnersLazy } from "./TrustPartnersLazy";

/** Below-fold Home sections — streamed after hero for faster LCP. */
export function HomeBelowFold({ content }: { content: HomeContent }) {
  return (
    <>
      <TrustPartnersLazy data={content.partners} className="hidden lg:block" />
      <CategoriesSection data={content.categories} />
      <SolutionsSection data={content.solutions} />
      <FeaturedSection data={content.featured} />
      <HowItWorksSection data={content.howItWorks} />
      <WhyKeyonSection data={content.why} />
      <NewsSection data={content.news} />
      {content.faqHome ? <FaqHomeSection data={content.faqHome} /> : null}
      <CtaBannerSection data={content.ctaBanner} />
    </>
  );
}
