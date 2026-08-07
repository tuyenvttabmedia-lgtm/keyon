"use client";

import Link from "next/link";
import { Headphones } from "lucide-react";
import {
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  HERO_TITLE_CLASS,
  PAGE_LEAD_CLASS,
} from "@/storefront/typography";
import { HOVER_LINK_ACCENT } from "@/storefront/effects";
import { SupportSearch } from "./SupportSearch";
import { SupportQuickActions } from "./SupportQuickActions";
import type { SuggestChip, SupportSearchDoc } from "./shared";

type Props = {
  docs: SupportSearchDoc[];
  suggestions: SuggestChip[];
};

/**
 * Desktop: search-first + quick-access panel (mockup direction).
 * Mobile: dedicated compose — no illustration.
 */
export function SupportHero({ docs, suggestions }: Props) {
  return (
    <section className="relative overflow-x-clip border-b border-border bg-[#F7FAFC]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(14,165,164,0.07),transparent_55%)]"
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
          <span className={BREADCRUMB_CURRENT_CLASS}>Trung tâm hỗ trợ</span>
        </nav>

        {/* Desktop / tablet */}
        <div className="hidden md:grid md:grid-cols-12 md:items-start md:gap-8 lg:gap-10">
          <div className="min-w-0 md:col-span-7 lg:col-span-8">
            <h1 className={`max-w-[22ch] ${HERO_TITLE_CLASS}`}>
              Bạn cần KEYON hỗ trợ điều gì?
            </h1>
            <p className={`mt-3 max-w-xl ${PAGE_LEAD_CLASS}`}>
              Tìm hướng dẫn, câu trả lời thường gặp hoặc gửi yêu cầu hỗ trợ cho đội ngũ KEYON.
            </p>
            <div className="mt-6 max-w-[680px]">
              <SupportSearch docs={docs} suggestions={suggestions} size="hero" />
            </div>

            {/* Secondary flat cue — never larger than search */}
            <div
              className="mt-8 hidden max-w-[680px] items-center gap-3 rounded-2xl border border-border bg-white/80 px-4 py-3 lg:flex"
              aria-hidden
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Headphones size={18} strokeWidth={1.75} />
              </span>
              <p className="text-[13px] leading-snug text-muted">
                Ưu tiên tìm FAQ / hướng dẫn trước — gửi ticket khi cần theo dõi xử lý.
              </p>
            </div>
          </div>

          <div className="min-w-0 md:col-span-5 lg:col-span-4">
            <SupportQuickActions layout="panel" />
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <p className={`${OVERLINE_CLASS} tracking-[0.16em] text-accent`}>Trung tâm hỗ trợ</p>
          <h1 className={`mt-2 ${HERO_TITLE_CLASS}`}>
            Bạn cần KEYON
            <br />
            hỗ trợ điều gì?
          </h1>
          <p className={`mt-3 ${PAGE_LEAD_CLASS}`}>
            Tìm hướng dẫn, câu trả lời hoặc gửi yêu cầu hỗ trợ.
          </p>
          <div className="mt-5">
            <SupportSearch docs={docs} suggestions={suggestions} size="compact" />
          </div>
          <div className="mt-6">
            <p className="mb-2.5 text-[13px] font-semibold text-navy">Bạn muốn làm gì?</p>
            <SupportQuickActions layout="stack" />
          </div>
        </div>
      </div>
    </section>
  );
}
