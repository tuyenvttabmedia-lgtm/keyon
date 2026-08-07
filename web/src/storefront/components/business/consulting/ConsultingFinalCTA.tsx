"use client";

import { ArrowUpRight } from "lucide-react";
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
import { goToConsultation, SECTION_PAD } from "./shared";

/** Large consultation card — not a navy banner like Volume/Subscription. */
export function ConsultingFinalCTA() {
  return (
    <section className={`border-t border-border bg-[#F4F8FB] ${SECTION_PAD}`}>
      <div className="home-container px-5 md:px-0">
        <div
          className={`relative overflow-hidden rounded-2xl border border-border bg-white px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12 ${ELEVATION_HAIRLINE}`}
        >
          <div
            className="pointer-events-none absolute -right-6 -top-6 text-accent/15 sm:-right-2 sm:top-4"
            aria-hidden
          >
            <ArrowUpRight size={140} strokeWidth={1.15} />
          </div>

          <div className="relative max-w-xl">
            <h2 className={SECTION_TITLE_CLASS}>Chưa chắc lựa chọn nào phù hợp?</h2>
            <p className={`mt-3 ${SECTION_LEAD_CLASS}`}>
              Mô tả nhu cầu. KEYON sẽ giúp bạn hiểu và so sánh các lựa chọn.
            </p>
            <button
              type="button"
              onClick={() => goToConsultation()}
              className={`mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
            >
              Bắt đầu tư vấn
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
