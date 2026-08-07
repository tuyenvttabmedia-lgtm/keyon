"use client";

import Link from "next/link";
import {
  Compass,
  GitCompare,
  HelpCircle,
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
import { AREAS_HREF, goToConsultation } from "./shared";
import { DesktopDecisionWorkspace } from "./DesktopDecisionWorkspace";
import { MobileDecisionCard } from "./MobileDecisionCard";

const BENEFITS = [
  {
    title: "Hiểu rõ nhu cầu",
    body: "Xác định sản phẩm và hình thức cấp phép phù hợp.",
    Icon: Compass,
  },
  {
    title: "So sánh lựa chọn",
    body: "Giúp bạn hiểu điểm khác nhau giữa các phương án.",
    Icon: GitCompare,
  },
  {
    title: "Hỗ trợ trước khi mua",
    body: "Giải đáp các vấn đề về sản phẩm và bản quyền.",
    Icon: HelpCircle,
  },
] as const;

export function ConsultingHero() {
  return (
    <section className="relative overflow-x-clip border-b border-border bg-[#F7FAFC]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_12%,rgba(14,165,164,0.07),transparent_45%),radial-gradient(ellipse_at_8%_85%,rgba(14,165,233,0.04),transparent_50%)]"
        aria-hidden
      />
      <div className="home-container relative py-8 md:py-10 lg:py-11">
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

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)] lg:gap-10 xl:gap-12">
          <div className="min-w-0">
            <p className={`${OVERLINE_CLASS} tracking-[0.16em] text-accent`}>
              Tư vấn bản quyền
            </p>
            <h1 className={`mt-2.5 max-w-[18ch] ${HERO_TITLE_CLASS}`}>
              Chọn đúng bản quyền cho nhu cầu của bạn
            </h1>
            <p className={`mt-3.5 max-w-xl ${PAGE_LEAD_CLASS}`}>
              Chưa chắc nên chọn Office nào, Microsoft 365 nào, Windows hay giải pháp bảo mật?
              KEYON hỗ trợ phân tích nhu cầu và tư vấn trước khi mua.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {BENEFITS.map(({ title, body, Icon }) => (
                <li key={title} className="min-w-0">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon size={17} strokeWidth={1.85} aria-hidden />
                  </span>
                  <p className="mt-2.5 text-[14px] font-bold text-navy">{title}</p>
                  <p className={`mt-1 ${BODY_MUTED_CLASS}`}>{body}</p>
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
            <DesktopDecisionWorkspace />
            <MobileDecisionCard />
          </div>
        </div>
      </div>
    </section>
  );
}
