"use client";

import Link from "next/link";
import {
  Compass,
  GitCompare,
  HelpCircle,
} from "lucide-react";
import { LANDING_CRUMB_GAP } from "@/storefront/components/marketing/hero-shell";
import {
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  HERO_TITLE_CLASS,
  PAGE_LEAD_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CTA_HOVER,
  HOVER_LINK_ACCENT,
  TRANSITION_UI,
} from "@/storefront/effects";
import { AREAS_HREF, goToConsultation } from "./shared";
import { DesktopDecisionWorkspace } from "./DesktopDecisionWorkspace";

const BENEFITS = [
  {
    title: "Xác định đúng nhu cầu",
    body: "Phân tích sản phẩm, số lượng người dùng và cách sử dụng thực tế.",
    Icon: Compass,
  },
  {
    title: "So sánh hình thức license",
    body: "Giải thích các lựa chọn phù hợp trước khi bạn quyết định mua.",
    Icon: GitCompare,
  },
  {
    title: "Tư vấn trước khi mua",
    body: "Làm rõ tính năng, thời hạn và điều kiện sử dụng của từng sản phẩm.",
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
      <div className="home-container relative pb-5 pt-5 md:pb-4 md:pt-5 lg:pb-6 lg:pt-8">
        <nav className={`${LANDING_CRUMB_GAP} flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
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

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)] lg:gap-10 xl:gap-12">
          <div className="min-w-0 max-w-full">
            <h1 className={`max-w-full break-words lg:max-w-xl ${HERO_TITLE_CLASS}`}>
              Tư vấn chọn bản quyền phần mềm phù hợp
            </h1>
            <p className={`mt-3.5 max-w-full break-words lg:max-w-xl ${PAGE_LEAD_CLASS}`}>
              Chưa biết nên chọn license nào? KEYON giúp phân tích nhu cầu sử dụng, quy mô người
              dùng và hình thức cấp phép trước khi bạn mua.
            </p>

            <ul className="mt-6 grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-3">
              {BENEFITS.map(({ title, body, Icon }, index) => (
                <li
                  key={title}
                  className={`min-w-0 ${index === BENEFITS.length - 1 ? "col-span-2 lg:col-span-1" : ""}`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                      <Icon size={16} strokeWidth={1.85} aria-hidden />
                    </span>
                    <p className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{title}</p>
                  </span>
                  <p className={`mt-2 break-words ${BODY_MUTED_CLASS}`}>{body}</p>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => goToConsultation()}
                className={`inline-flex h-12 w-full min-w-0 items-center justify-center rounded-xl bg-accent px-6 sm:w-auto ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                Nhận tư vấn →
              </button>
              <a
                href={AREAS_HREF}
                className={`inline-flex h-12 w-full min-w-0 items-center justify-center rounded-xl border border-border bg-white px-6 sm:w-auto ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
              >
                Xem KEYON tư vấn gì
              </a>
            </div>
          </div>

          <div className="hidden min-w-0 lg:block">
            <DesktopDecisionWorkspace />
          </div>
        </div>
      </div>
    </section>
  );
}
