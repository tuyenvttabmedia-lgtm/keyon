"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import { TRANSITION_UI } from "@/storefront/effects";
import { FAQ_HREF } from "./shared";

export type SupportFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export function SupportFAQ({ items }: { items: SupportFaqItem[] }) {
  const teaser = items.slice(0, 5);
  const [openId, setOpenId] = useState<string | null>(teaser[0]?.id ?? null);

  return (
    <div>
      <header>
        <h2 className={SECTION_TITLE_CLASS}>Câu hỏi thường gặp</h2>
        <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
          Các câu hỏi phổ biến — chọn để xem câu trả lời nhanh.
        </p>
      </header>

      {teaser.length === 0 ? (
        <p className={`mt-6 ${BODY_MUTED_CLASS}`}>Chưa có câu hỏi trong chủ đề này.</p>
      ) : (
        <ul className="mt-6 divide-y divide-border rounded-2xl border border-border bg-white">
          {teaser.map((item) => {
            const open = openId === item.id;
            return (
              <li key={item.id}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenId(open ? null : item.id)}
                    className={`flex w-full items-start justify-between gap-3 px-4 py-4 text-left sm:px-5 ${TRANSITION_UI} hover:bg-[#F7FAFC]`}
                  >
                    <span className={CARD_TITLE_CLASS}>{item.question}</span>
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-[14px] font-semibold text-muted ${
                        open ? "bg-accent text-white border-accent" : "bg-white"
                      }`}
                      aria-hidden
                    >
                      {open ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                {open ? (
                  <div className={`border-t border-border bg-[#F7FAFC] px-4 py-4 sm:px-5 ${BODY_MUTED_CLASS}`}>
                    <div className="prose prose-sm max-w-none text-muted whitespace-pre-wrap">
                      {item.answer}
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <Link
        href={FAQ_HREF}
        className="mt-4 inline-flex text-[14px] font-semibold text-accent hover:underline"
      >
        Xem tất cả câu hỏi →
      </Link>
    </div>
  );
}
