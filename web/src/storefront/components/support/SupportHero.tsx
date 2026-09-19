"use client";

import Link from "next/link";
import {
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  HERO_TITLE_CLASS,
  PAGE_LEAD_CLASS,
} from "@/storefront/typography";
import { HOVER_LINK_ACCENT } from "@/storefront/effects";
import { SupportSearch } from "./SupportSearch";
import type { SuggestChip, SupportSearchDoc } from "./shared";

type Props = {
  docs: SupportSearchDoc[];
  suggestions: SuggestChip[];
};

/** Search-first hero. Ticket CTA is once, at the bottom of the page. */
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

        <div className="max-w-3xl">
          <h1 className={HERO_TITLE_CLASS}>Bạn cần KEYON hỗ trợ điều gì?</h1>
          <p className={`mt-3 max-w-xl ${PAGE_LEAD_CLASS}`}>
            Tìm hướng dẫn hoặc câu trả lời. Chưa xong thì gửi ticket ở cuối trang.
          </p>
          <div className="mt-6">
            <SupportSearch docs={docs} suggestions={suggestions} size="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}
