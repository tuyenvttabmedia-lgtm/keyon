"use client";

import Link from "next/link";
import {
  Cloud,
  Monitor,
  Shield,
  AppWindow,
} from "lucide-react";
import {
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CTA_LABEL_CLASS,
  HERO_TITLE_CLASS,
  OVERLINE_CLASS,
  PAGE_LEAD_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CTA_HOVER,
  HOVER_LINK_ACCENT,
  TRANSITION_UI,
} from "@/storefront/effects";
import {
  AREAS_HREF,
  goToConsultation,
  type InterestId,
} from "./shared";
import { DesktopDecisionWorkspace } from "./DesktopDecisionWorkspace";
import { MobileDecisionCard } from "./MobileDecisionCard";

const BENEFITS = [
  {
    title: "Hiểu rõ nhu cầu",
    body: "Xác định sản phẩm và hình thức cấp phép phù hợp.",
  },
  {
    title: "So sánh lựa chọn",
    body: "Giúp bạn hiểu điểm khác nhau giữa các phương án.",
  },
  {
    title: "Hỗ trợ trước khi mua",
    body: "Giải đáp các vấn đề về sản phẩm và bản quyền.",
  },
] as const;

const FLOATING = [
  {
    id: "MICROSOFT_365" as InterestId,
    label: "Microsoft 365",
    Icon: Cloud,
    className: "left-[8%] top-[6%] sm:left-[4%] sm:top-[8%]",
  },
  {
    id: "OFFICE" as InterestId,
    label: "Office",
    Icon: AppWindow,
    className: "right-[6%] top-[10%] sm:right-[2%] sm:top-[12%]",
  },
  {
    id: "WINDOWS" as InterestId,
    label: "Windows",
    Icon: Monitor,
    className: "left-[4%] bottom-[22%] sm:left-0 sm:bottom-[24%]",
  },
  {
    id: "SECURITY" as InterestId,
    label: "Security",
    Icon: Shield,
    className: "right-[4%] bottom-[20%] sm:right-0 sm:bottom-[22%]",
  },
] as const;

export function ConsultingHero() {
  return (
    <section className="relative overflow-x-clip border-b border-border bg-[#F7FAFC]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_12%,rgba(14,165,164,0.08),transparent_42%),radial-gradient(ellipse_at_10%_88%,rgba(14,165,233,0.05),transparent_48%)]"
        aria-hidden
      />
      <div className="home-container relative px-5 py-8 md:px-0 md:py-10 lg:py-11">
        <nav className={`mb-5 flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
          <Link href="/" className={HOVER_LINK_ACCENT}>
            Trang chủ
          </Link>
          <span aria-hidden className="text-muted-soft">
            ›
          </span>
          <Link href="/business" className={HOVER_LINK_ACCENT}>
            Doanh nghiệp
          </Link>
          <span aria-hidden className="text-muted-soft">
            ›
          </span>
          <span className={BREADCRUMB_CURRENT_CLASS}>Tư vấn bản quyền</span>
        </nav>

        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] md:gap-10 lg:gap-12">
          <div className="min-w-0 max-w-[540px]">
            <p className={`${OVERLINE_CLASS} tracking-[0.16em] text-accent`}>
              Tư vấn bản quyền
            </p>
            <h1 className={`mt-2.5 max-w-[18ch] ${HERO_TITLE_CLASS}`}>
              Chọn đúng bản quyền cho nhu cầu của bạn
            </h1>
            <p className={`mt-3.5 ${PAGE_LEAD_CLASS}`}>
              Chưa chắc nên chọn Office nào, Microsoft 365 nào, Windows hay giải pháp bảo mật?
              KEYON hỗ trợ phân tích nhu cầu và tư vấn trước khi mua.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {BENEFITS.map((b) => (
                <li key={b.title} className="min-w-0">
                  <p className="text-[14px] font-bold text-navy">{b.title}</p>
                  <p className={`mt-1 ${BODY_MUTED_CLASS}`}>{b.body}</p>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => goToConsultation()}
                className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                Nhận tư vấn →
              </button>
              <a
                href={AREAS_HREF}
                className={`inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
              >
                Xem lĩnh vực tư vấn
              </a>
            </div>
          </div>

          <div className="min-w-0">
            <DesktopDecisionWorkspace items={FLOATING} />
            <MobileDecisionCard />
          </div>
        </div>
      </div>
    </section>
  );
}
