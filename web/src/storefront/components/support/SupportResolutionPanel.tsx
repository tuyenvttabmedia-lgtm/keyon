import Link from "next/link";
import {
  CTA_LABEL_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  TRANSITION_UI,
} from "@/storefront/effects";
import { CONTACT_HREF, SECTION_PAD, SURFACE, TICKETS_HREF } from "./shared";

/** Light resolution panel — not a sales CTA banner. */
export function SupportResolutionPanel() {
  return (
    <section className={`border-t border-border bg-[#F4F8FB] ${SECTION_PAD}`}>
      <div className="home-container">
        <div
          className={`flex flex-col gap-5 px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between md:gap-8 md:px-10 md:py-9 ${SURFACE} ${ELEVATION_HAIRLINE}`}
        >
          <div className="min-w-0 max-w-xl">
            <h2 className={SECTION_TITLE_CLASS}>Vẫn cần hỗ trợ?</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Gửi ticket để KEYON có thể theo dõi và hỗ trợ vấn đề của bạn.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Link
              href={TICKETS_HREF}
              className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
            >
              Tạo ticket
            </Link>
            <Link
              href={CONTACT_HREF}
              className={`inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
            >
              Liên hệ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
