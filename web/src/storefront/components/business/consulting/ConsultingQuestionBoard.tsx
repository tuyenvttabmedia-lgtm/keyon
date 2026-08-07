"use client";

import { ArrowRight } from "lucide-react";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  TRANSITION_PANEL,
} from "@/storefront/effects";
import { goToConsultation, SECTION_PAD, SURFACE_MUTED, type InterestId } from "./shared";

const QUESTIONS: {
  id: InterestId;
  topic: string;
  question: string;
  span?: boolean;
}[] = [
  { id: "OFFICE", topic: "Office", question: "Nên chọn phiên bản nào?" },
  { id: "MICROSOFT_365", topic: "Microsoft 365", question: "Gói nào phù hợp?" },
  { id: "WINDOWS", topic: "Windows", question: "Có cần nâng cấp?" },
  { id: "SECURITY", topic: "Security", question: "Nên bảo vệ thế nào?" },
  {
    id: "NOT_SURE",
    topic: "Tôi chưa xác định được sản phẩm",
    question: "Mô tả nhu cầu để KEYON hỗ trợ.",
    span: true,
  },
];

export function ConsultingQuestionBoard() {
  return (
    <section className={`bg-white ${SECTION_PAD}`}>
      <div className="home-container">
        <header className="max-w-2xl">
          <h2 className={SECTION_TITLE_CLASS}>Bạn đang cần giải đáp điều gì?</h2>
          <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
            Chọn câu hỏi gần nhất — KEYON sẽ nhận ngữ cảnh khi bạn gửi yêu cầu tư vấn.
          </p>
        </header>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-9 md:gap-4">
          {QUESTIONS.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => goToConsultation(q.id)}
              className={`group flex items-center justify-between gap-3 p-4 text-left sm:p-5 ${SURFACE_MUTED} ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} hover:border-accent/35 ${
                q.span ? "sm:col-span-2" : ""
              }`}
            >
              <span className="min-w-0">
                <span className={`block ${CARD_TITLE_CLASS}`}>{q.topic}</span>
                <span className={`mt-1 block ${BODY_MUTED_CLASS}`}>{q.question}</span>
              </span>
              <ArrowRight
                size={18}
                className="shrink-0 text-muted transition-colors group-hover:text-accent"
                aria-hidden
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
