"use client";

import { useState } from "react";
import {
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CTA_LABEL_CLASS,
  OVERLINE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CTA_HOVER,
  ELEVATION_FLOAT,
  TRANSITION_UI,
} from "@/storefront/effects";
import { goToConsultation, SECTION_PAD, SURFACE } from "./shared";

const CHECKS = [
  "Hiểu nhu cầu sử dụng thực tế",
  "Đề xuất các phương án phù hợp",
  "So sánh rõ ràng giữa các lựa chọn",
  "Hỗ trợ trước khi quyết định mua",
] as const;

const USER_SIZES = ["1–5", "6–25", "26+"] as const;
const PURPOSES = ["Làm việc văn phòng", "Email & cộng tác", "Thiết kế"] as const;
const FORMS = ["Mua một lần", "Subscription", "Chưa chắc"] as const;

function Chip({
  label,
  on,
  kind,
  onClick,
}: {
  label: string;
  on: boolean;
  kind: "radio" | "check";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 items-center gap-2 rounded-xl border px-3.5 text-[13px] font-semibold ${TRANSITION_UI} ${
        on
          ? "border-accent bg-accent-soft text-accent"
          : "border-border bg-[#F7FAFC] text-navy hover:border-accent/35"
      }`}
    >
      {kind === "radio" ? (
        <span
          className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
            on ? "border-accent" : "border-border"
          }`}
          aria-hidden
        >
          {on ? <span className="h-2 w-2 rounded-full bg-accent" /> : null}
        </span>
      ) : (
        <span
          className={`flex h-3.5 w-3.5 items-center justify-center rounded border text-[10px] ${
            on
              ? "border-accent bg-accent text-white"
              : "border-border bg-white text-transparent"
          }`}
          aria-hidden
        >
          ✓
        </span>
      )}
      {label}
    </button>
  );
}

export function ConsultingWorkspace() {
  const [users, setUsers] = useState(1);
  const [purposes, setPurposes] = useState<Set<number>>(() => new Set([0, 1]));
  const [form, setForm] = useState(2);

  function togglePurpose(i: number) {
    setPurposes((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <section className={`border-y border-border bg-[#F4F8FB] ${SECTION_PAD}`}>
      <div className="home-container">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-5">
            <p className={`${OVERLINE_CLASS} tracking-[0.16em] text-accent`}>
              Cách KEYON hỗ trợ
            </p>
            <h2 className={`mt-2.5 ${SECTION_TITLE_CLASS}`}>
              Từ nhu cầu đến lựa chọn phù hợp
            </h2>
            <p className={`mt-3 ${SECTION_LEAD_CLASS}`}>
              KEYON tập trung vào nhu cầu sử dụng, quy mô và hình thức cấp phép trước khi đề xuất
              sản phẩm.
            </p>
            <ul className="mt-6 space-y-2.5">
              {CHECKS.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span className="text-[14px] font-medium text-navy">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <div className={`${SURFACE} p-5 sm:p-6 ${ELEVATION_FLOAT}`}>
              <p className={`${CARD_META_CLASS} font-semibold uppercase tracking-wide text-accent`}>
                Nhu cầu
              </p>

              <fieldset className="mt-4">
                <legend className="text-[13px] font-semibold text-navy">Số người dùng</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {USER_SIZES.map((label, i) => (
                    <Chip
                      key={label}
                      label={label}
                      on={users === i}
                      kind="radio"
                      onClick={() => setUsers(i)}
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-5">
                <legend className="text-[13px] font-semibold text-navy">Mục đích</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PURPOSES.map((label, i) => (
                    <Chip
                      key={label}
                      label={label}
                      on={purposes.has(i)}
                      kind="check"
                      onClick={() => togglePurpose(i)}
                    />
                  ))}
                </div>
              </fieldset>

              <fieldset className="mt-5">
                <legend className="text-[13px] font-semibold text-navy">Hình thức</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {FORMS.map((label, i) => (
                    <Chip
                      key={label}
                      label={label}
                      on={form === i}
                      kind="radio"
                      onClick={() => setForm(i)}
                    />
                  ))}
                </div>
              </fieldset>

              <div className="mt-6 border-t border-border pt-5">
                <p className={BODY_MUTED_CLASS}>
                  KEYON sẽ giúp bạn so sánh các lựa chọn phù hợp — không tự gắn nhãn “tốt nhất”.
                </p>
                <button
                  type="button"
                  onClick={() => goToConsultation()}
                  className={`mt-4 inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Nhận tư vấn →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
