import Link from "next/link";
import {
  CTA_LABEL_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import { ELEVATION_CTA_HOVER, TRANSITION_UI } from "@/storefront/effects";
import { QUOTE_HREF, QUOTE_LABEL } from "@/storefront/lib/cta";

type Props = {
  title?: string;
  subtitle?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

/**
 * Shared final CTA band for Solutions landings — keeps quote funnel consistent.
 */
export function SolutionFinalCta({
  title = "Cần tư vấn chọn gói phù hợp?",
  subtitle = "Đội ngũ KEYON hỗ trợ tiếng Việt — báo giá theo nhu cầu cá nhân, đội nhóm hoặc doanh nghiệp.",
  primaryHref = QUOTE_HREF,
  primaryLabel = `${QUOTE_LABEL} →`,
  secondaryHref = "/products",
  secondaryLabel = "Xem sản phẩm",
}: Props) {
  return (
    <section className="pb-10 md:pb-12 lg:pb-14">
      <div className="home-container">
        <div className="rounded-2xl bg-navy px-6 py-9 text-center sm:px-10 sm:py-11">
          <h2 className={`${SECTION_TITLE_CLASS} !text-white`}>{title}</h2>
          <p className={`mx-auto mt-2.5 max-w-xl ${SECTION_LEAD_CLASS} !text-white/70`}>
            {subtitle}
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
            >
              {primaryLabel}
            </Link>
            {secondaryHref ? (
              <Link
                href={secondaryHref}
                className={`inline-flex h-12 items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:border-white/50 hover:bg-white/10`}
              >
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
