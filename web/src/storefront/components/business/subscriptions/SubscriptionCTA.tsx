import Link from "next/link";
import {
  CTA_LABEL_CLASS,
  OVERLINE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  TRANSITION_UI,
} from "@/storefront/effects";
import { SECTION_PAD, SUB_BUSINESS_HREF, SUB_CONSULT_HREF } from "./shared";

/** White command panel on teal-tinted ground — not purple/navy volume banner. */
export function SubscriptionCTA() {
  return (
    <section className={`border-t border-border bg-[#Eef7f7] ${SECTION_PAD}`}>
      <div className="home-container">
        <div
          className={`rounded-2xl border border-border bg-white px-5 py-8 sm:px-8 md:px-10 md:py-10 ${ELEVATION_HAIRLINE}`}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="min-w-0 max-w-xl">
              <p className={`${OVERLINE_CLASS} tracking-[0.16em] text-accent`}>Cần hỗ trợ?</p>
              <h2 className={`mt-2 ${SECTION_TITLE_CLASS}`}>
                Chuẩn bị cho kỳ gia hạn tiếp theo
              </h2>
              <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
                Trao đổi với KEYON để xem xét nhu cầu subscription và phương án gia hạn phù hợp.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={SUB_CONSULT_HREF}
                className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                Tư vấn subscription →
              </Link>
              <Link
                href={SUB_BUSINESS_HREF}
                className={`inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
              >
                Liên hệ kinh doanh
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
