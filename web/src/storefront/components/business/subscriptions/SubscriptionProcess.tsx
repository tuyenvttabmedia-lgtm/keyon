"use client";

import { useState } from "react";
import {
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_HAIRLINE,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";
import { SECTION_PAD } from "./shared";

const STEPS = [
  {
    title: "Thêm / ghi nhận subscription",
    body: "Đưa subscription vào hệ thống theo dõi tập trung.",
    previewTitle: "Ghi nhận",
    previewBody:
      "Thêm thông tin gói đang dùng — trạng thái và chu kỳ được gắn vào một bản ghi rõ ràng.",
  },
  {
    title: "Theo dõi chu kỳ",
    body: "Nắm thời hạn và trạng thái trong quá trình sử dụng.",
    previewTitle: "Theo dõi",
    previewBody:
      "Subscription Hub hiển thị trạng thái đang hoạt động, sắp gia hạn hoặc cần xem xét — bằng nhãn, không phải số liệu giả.",
  },
  {
    title: "Nhận thông tin trước kỳ gia hạn",
    body: "Biết trước mốc cần xử lý để chủ động kế hoạch.",
    previewTitle: "Nhắc trước hạn",
    previewBody:
      "Thông báo gia hạn xuất hiện trong hàng đợi — đủ thời gian để xem xét trước khi đến hạn.",
  },
  {
    title: "Xem xét nhu cầu",
    body: "Quyết định tiếp tục, điều chỉnh hoặc tư vấn.",
    previewTitle: "Xem xét",
    previewBody:
      "Ba hướng: tiếp tục gói hiện tại, điều chỉnh quy mô, hoặc trao đổi với KEYON trước khi chốt.",
  },
  {
    title: "Gia hạn / cập nhật",
    body: "Hoàn tất theo luồng phù hợp — mua trực tiếp hoặc báo giá.",
    previewTitle: "Gia hạn",
    previewBody:
      "Gói có giá rõ: Mua ngay → Checkout. Cần tư vấn: Yêu cầu báo giá. Không dùng giỏ hàng.",
  },
] as const;

/** Vertical activity timeline + contextual preview (desktop). */
export function SubscriptionProcess() {
  const [active, setActive] = useState(0);
  const current = STEPS[active]!;

  return (
    <section className={`border-t border-border bg-[#F4F8FB] ${SECTION_PAD}`}>
      <div className="home-container">
        <header className="max-w-2xl">
          <h2 className={SECTION_TITLE_CLASS}>Quy trình quản lý subscription</h2>
          <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
            Timeline hoạt động theo từng bước — khác với stepper vòng tròn của volume licensing.
          </p>
        </header>

        <div className="mt-8 grid gap-8 md:mt-9 lg:grid-cols-12 lg:gap-10">
          <ol className="relative space-y-0 lg:col-span-5">
            <div
              className="pointer-events-none absolute bottom-4 left-[15px] top-4 w-px bg-border"
              aria-hidden
            />
            {STEPS.map((step, i) => {
              const selected = i === active;
              const n = String(i + 1).padStart(2, "0");
              return (
                <li key={step.title} className="relative z-[1]">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className={`flex w-full items-start gap-3 rounded-xl px-2 py-3 text-left ${TRANSITION_PANEL} ${
                      selected ? "bg-white shadow-sm" : "hover:bg-white/70"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${TRANSITION_UI} ${
                        selected
                          ? "bg-accent text-white"
                          : "border border-border bg-white text-muted"
                      }`}
                    >
                      {n}
                    </span>
                    <span className="min-w-0">
                      <span className={`block ${CARD_TITLE_CLASS}`}>{step.title}</span>
                      <span className={`mt-1 block ${BODY_MUTED_CLASS}`}>{step.body}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="min-w-0 lg:col-span-7">
            <div
              className={`flex h-full min-h-[220px] flex-col justify-center rounded-2xl border border-border bg-white p-6 sm:p-8 ${ELEVATION_HAIRLINE}`}
            >
              <p className={`${CARD_META_CLASS} font-semibold uppercase tracking-wide text-accent`}>
                Bước {String(active + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-lg font-bold text-navy sm:text-xl">
                {current.previewTitle}
              </h3>
              <p className={`mt-3 max-w-lg ${SECTION_LEAD_CLASS}`}>{current.previewBody}</p>
              <p className={`mt-5 ${CARD_META_CLASS}`}>
                Minh họa luồng — không phải dữ liệu vận hành thực tế của KEYON.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
