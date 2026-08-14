import Link from "next/link";
import { SolutionTopicGrid } from "@/storefront/components/home/SolutionsSection";
import { SolutionPageChrome } from "@/storefront/components/solutions/SolutionPageChrome";
import { solutionTopicCards } from "@/storefront/nav/ia";
import {
  CTA_LABEL_CLASS,
  PAGE_LEAD_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import { ELEVATION_CTA_HOVER, TRANSITION_UI } from "@/storefront/effects";

/** Hub `/solutions` — same topic cards as Home Giải pháp. */
export function SolutionsHubLanding() {
  const items = solutionTopicCards();

  return (
    <div className="bg-white">
      <section className="border-b border-border bg-[#F7FAFC] py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <SolutionPageChrome
            kicker="Giải pháp"
            crumbs={[
              { label: "Trang chủ", href: "/" },
              { label: "Giải pháp" },
            ]}
          />
          <h1 className={`mt-3 max-w-3xl ${PAGE_TITLE_CLASS}`}>
            Giải pháp theo nhu cầu
          </h1>
          <p className={`mt-3 max-w-2xl ${PAGE_LEAD_CLASS}`}>
            Chọn hướng theo việc tổ chức cần giải quyết — không phải danh mục
            SKU. Mua số lượng lớn, gia hạn và tư vấn B2B nằm ở Doanh nghiệp.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              href="/business"
              className={`inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
            >
              Dành cho doanh nghiệp →
            </Link>
            <Link
              href="/contact/quote"
              className={`inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <header className="mb-6 max-w-2xl md:mb-8">
            <h2 className={SECTION_TITLE_CLASS}>Các hướng giải pháp</h2>
            <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
              Cùng bộ thẻ với trang chủ — bấm vào từng hướng để xem landing.
            </p>
          </header>
          <SolutionTopicGrid items={items} />
        </div>
      </section>
    </div>
  );
}
