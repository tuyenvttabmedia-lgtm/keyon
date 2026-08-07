"use client";

import {
  AppWindow,
  Cloud,
  Monitor,
  Shield,
  ChevronRight,
} from "lucide-react";
import { BODY_MUTED_CLASS, CARD_TITLE_CLASS, CTA_LABEL_CLASS } from "@/storefront/typography";
import {
  ELEVATION_HAIRLINE,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";
import { goToConsultation, type InterestId } from "./shared";

const OPTIONS: {
  id: InterestId;
  label: string;
  Icon: typeof Cloud;
}[] = [
  { id: "MICROSOFT_365", label: "Microsoft 365", Icon: Cloud },
  { id: "OFFICE", label: "Office", Icon: AppWindow },
  { id: "WINDOWS", label: "Windows", Icon: Monitor },
  { id: "SECURITY", label: "Security", Icon: Shield },
];

/** Mobile-only decision card — not a scaled-down desktop illustration. */
export function MobileDecisionCard() {
  return (
    <div
      className={`rounded-2xl border border-border bg-white p-4 sm:p-5 md:hidden ${ELEVATION_HAIRLINE}`}
    >
      <p className={CARD_TITLE_CLASS}>Bạn đang cần giải pháp nào?</p>
      <ul className="mt-3 space-y-2">
        {OPTIONS.map(({ id, label, Icon }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => goToConsultation(id)}
              className={`flex h-14 w-full items-center gap-3 rounded-xl border border-border bg-[#F7FAFC] px-3.5 text-left ${TRANSITION_PANEL} active:border-accent active:bg-accent-soft/50`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-accent">
                <Icon size={17} strokeWidth={1.85} aria-hidden />
              </span>
              <span className="min-w-0 flex-1 text-[14px] font-semibold text-navy">
                {label}
              </span>
              <ChevronRight size={16} className="shrink-0 text-muted" aria-hidden />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t border-border pt-4">
        <p className={BODY_MUTED_CLASS}>Chưa chắc lựa chọn?</p>
        <button
          type="button"
          onClick={() => goToConsultation("NOT_SURE")}
          className={`mt-2.5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent px-4 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover`}
        >
          Để KEYON tư vấn →
        </button>
      </div>
    </div>
  );
}
