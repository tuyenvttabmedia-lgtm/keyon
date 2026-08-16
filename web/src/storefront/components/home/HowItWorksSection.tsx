import Link from "next/link";
import type { HomeContent } from "@/storefront/content/types";
import { HowItWorksJourney } from "@/storefront/components/support/HowItWorksJourney";
import { LINK_ACCENT_CLASS } from "@/storefront/typography";

/**
 * Home — same 3-step journey as `/how-it-works` (mockup v2).
 */
export function HowItWorksSection({ data }: { data: HomeContent["howItWorks"] }) {
  if (!data.visible) return null;

  const subtitle =
    data.subtitle ??
    "Ba bước rõ ràng — từ chọn gói đến giữ giấy phép trong Tài khoản.";

  return (
    <section id="how-it-works" className="scroll-mt-20 bg-white py-6 md:py-7 lg:py-9">
      <div className="home-container">
        <HowItWorksJourney heading="h2" title={data.title} lead={subtitle} />
        <p className="mt-3 text-right">
          <Link href="/how-it-works" className={LINK_ACCENT_CLASS}>
            Quản lý license & hỗ trợ →
          </Link>
        </p>
      </div>
    </section>
  );
}
