import type { HomeContent } from "@/storefront/content/types";
import { HowItWorksJourney } from "@/storefront/components/support/HowItWorksJourney";

/** Home — 3-step journey (owner mockup: header + stepper + equal cards). */
export function HowItWorksSection({ data }: { data: HomeContent["howItWorks"] }) {
  if (!data.visible) return null;

  const subtitle =
    data.subtitle ??
    "Ba bước: chọn gói → thanh toán → nhận deliverable trong Tài khoản.";

  return (
    <section id="how-it-works" className="scroll-mt-20 bg-white py-8 md:py-10 lg:py-12">
      <div className="home-container">
        <HowItWorksJourney
          heading="h2"
          title={data.title}
          lead={subtitle}
          ctaHref="/how-it-works"
        />
      </div>
    </section>
  );
}
