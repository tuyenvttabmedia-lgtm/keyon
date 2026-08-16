import Link from "next/link";
import { HowItWorksJourney } from "@/storefront/components/support/HowItWorksJourney";
import { SolutionPageChrome } from "@/storefront/components/solutions/SolutionPageChrome";
import { SolutionFinalCta } from "@/storefront/components/solutions/SolutionFinalCta";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  LINK_ACCENT_CLASS,
  PAGE_LEAD_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  TRANSITION_PANEL,
} from "@/storefront/effects";

/** Dedicated `/how-it-works` — journey mockup + bước quản lý/hỗ trợ. */
export function HowItWorksLanding() {
  return (
    <div className="bg-[#F7FAFC]">
      <section className="border-b border-border bg-white py-8 md:py-10">
        <div className="home-container">
          <SolutionPageChrome
            kicker="Hỗ trợ"
            crumbs={[
              { label: "Trang chủ", href: "/" },
              { label: "Hỗ trợ", href: "/support" },
              { label: "Cách nhận hàng" },
            ]}
          />
          <p className={`mt-4 max-w-2xl ${PAGE_LEAD_CLASS}`}>
            Mua trên KEYON là Order → thanh toán → giao vào Tài khoản. Bước bốn:
            mở lại license và tạo ticket khi cần hỗ trợ kích hoạt.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-10 lg:py-12">
        <div className="home-container">
          <HowItWorksJourney heading="h1" />

          <article
            className={`mt-4 rounded-2xl border border-border bg-white p-5 md:p-6 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
          >
            <p className={CARD_TITLE_CLASS}>Bước 04 · Quản lý & hỗ trợ</p>
            <p className={`mt-2 max-w-2xl ${BODY_MUTED_CLASS}`}>
              Mở lại deliverable trong Tài sản. Cần hỗ trợ kích hoạt — tạo ticket
              trong Tài khoản, không gửi key qua kênh ngoài.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/account/assets" className={LINK_ACCENT_CLASS}>
                Tài sản →
              </Link>
              <Link href="/account/tickets" className={LINK_ACCENT_CLASS}>
                Gửi yêu cầu hỗ trợ →
              </Link>
            </div>
          </article>
        </div>
      </section>

      <SolutionFinalCta
        title="Sẵn sàng chọn gói?"
        subtitle="Xem loại nhận và giá trên sản phẩm trước khi đặt. Tư vấn tiếng Việt nếu chưa chắc gói nào."
        primaryHref="/products"
        primaryLabel="Xem sản phẩm"
        secondaryHref="/contact/quote"
        secondaryLabel="Liên hệ tư vấn"
      />
    </div>
  );
}
