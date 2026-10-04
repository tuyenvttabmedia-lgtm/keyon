"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  CTA_LABEL_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LINK_ACCENT,
  TRANSITION_UI,
} from "@/storefront/effects";
import { goToConsultation, SECTION_PAD, SURFACE } from "./shared";

/** Full-width consultation card — same container edge as other sections. */
export function ConsultingFinalCTA() {
  return (
    <section className={`border-t border-border bg-[#F4F8FB] ${SECTION_PAD}`}>
      <div className="home-container">
        <div
          className={`relative overflow-hidden px-6 py-8 sm:px-8 sm:py-9 md:flex md:items-center md:justify-between md:gap-8 md:px-10 md:py-10 ${SURFACE} ${ELEVATION_HAIRLINE}`}
        >
          <div
            className="pointer-events-none absolute -right-4 top-2 hidden text-accent/12 sm:block md:right-6 md:top-1/2 md:-translate-y-1/2"
            aria-hidden
          >
            <ArrowUpRight size={120} strokeWidth={1.15} />
          </div>

          <div className="relative min-w-0 max-w-xl">
            <h2 className={SECTION_TITLE_CLASS}>Chưa chắc nên chọn bản quyền nào?</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Mô tả nhu cầu, KEYON sẽ giúp bạn xác định hướng lựa chọn phù hợp.
            </p>
            <Link href="/business" className={`mt-3 inline-flex ${HOVER_LINK_ACCENT}`}>
              Giải pháp dành cho doanh nghiệp
            </Link>
          </div>

          <button
            type="button"
            onClick={() => goToConsultation()}
            className={`relative mt-6 inline-flex h-12 w-full shrink-0 items-center justify-center rounded-xl bg-accent px-6 sm:w-auto ${CTA_LABEL_CLASS} text-white md:mt-0 ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
          >
            Bắt đầu tư vấn
          </button>
        </div>
      </div>
    </section>
  );
}
