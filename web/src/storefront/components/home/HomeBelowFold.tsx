import dynamic from "next/dynamic";
import type { HomeContent } from "@/storefront/content/types";
import { CategoriesSection } from "./CategoriesSection";
import { FeaturedSection } from "./FeaturedSection";
import { WhyKeyonSection } from "./WhyKeyonSection";
import { SolutionsSection } from "./SolutionsSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { NewsSection } from "./NewsSection";
import { FaqHomeSection } from "./FaqHomeSection";
import { CtaBannerSection } from "./CtaBannerSection";

/**
 * Partners carousel is client-only and lg-only — skip SSR to shrink the
 * initial HTML/RSC payload that blocks LCP on mobile.
 */
const TrustPartnersSection = dynamic(
  () =>
    import("./TrustPartnersSection").then((m) => m.TrustPartnersSection),
  { ssr: false, loading: () => null },
);

/** Below-fold Home sections — streamed after hero for faster LCP. */
export function HomeBelowFold({ content }: { content: HomeContent }) {
  return (
    <>
      <TrustPartnersSection data={content.partners} className="hidden lg:block" />
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
