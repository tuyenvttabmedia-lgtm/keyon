import type { HomeContent } from "@/storefront/content/types";
import { HowItWorksJourney } from "@/storefront/components/support/HowItWorksJourney";

/** Home — four-step license lifecycle. */
export function HowItWorksSection({ data }: { data: HomeContent["howItWorks"] }) {
  if (!data.visible) return null;

  const subtitle =
    data.subtitle ??
    "Chọn sản phẩm, thanh toán hoặc báo giá, nhận bàn giao, rồi quản lý và gia hạn trong Tài khoản.";

  return (
    <section id="how-it-works" className="scroll-mt-20 bg-white home-section">
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
