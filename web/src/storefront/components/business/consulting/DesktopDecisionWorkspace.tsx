"use client";

import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  Cloud,
  Monitor,
  Shield,
} from "lucide-react";
import { BODY_MUTED_CLASS, CARD_META_CLASS, CARD_TITLE_CLASS } from "@/storefront/typography";
import {
  ELEVATION_FLOAT,
  ELEVATION_HAIRLINE,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";
import { goToConsultation, SURFACE, type InterestId } from "./shared";

const PRODUCTS: {
  id: InterestId;
  label: string;
  Icon: LucideIcon;
}[] = [
  { id: "MICROSOFT_365", label: "Microsoft 365", Icon: Cloud },
  { id: "OFFICE", label: "Office", Icon: AppWindow },
  { id: "WINDOWS", label: "Windows", Icon: Monitor },
  { id: "SECURITY", label: "Security", Icon: Shield },
];

/** Desktop decision workspace — CSS grid, not absolute floating cards. */
export function DesktopDecisionWorkspace() {
  return (
    <div className="hidden md:block">
      <div
        className={`overflow-hidden ${SURFACE} p-4 sm:p-5 ${ELEVATION_FLOAT}`}
      >
        <div className="grid grid-cols-2 gap-3">
          {PRODUCTS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => goToConsultation(id)}
              className={`flex items-center gap-3 rounded-xl border border-border bg-[#F7FAFC] px-3.5 py-3 text-left ${TRANSITION_PANEL} hover:border-accent/40 hover:bg-accent-soft/40`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-accent shadow-sm">
                <Icon size={18} strokeWidth={1.85} aria-hidden />
              </span>
              <span className="min-w-0 text-[13px] font-semibold text-navy">{label}</span>
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-xl border border-accent/20 bg-accent-soft/50 px-4 py-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-[1.1rem] font-black text-white">
            K
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-navy">KEYON</p>
            <p className={CARD_META_CLASS}>Tìm giải pháp phù hợp giữa các lựa chọn</p>
          </div>
        </div>

        <div className={`mt-3 rounded-xl border border-border bg-[#F7FAFC] p-4 ${ELEVATION_HAIRLINE}`}>
          <p className={CARD_TITLE_CLASS}>Bạn đang phân vân?</p>
          <p className={`mt-1 ${BODY_MUTED_CLASS}`}>
            Mô tả nhu cầu để KEYON giúp bạn so sánh lựa chọn.
          </p>
          <button
            type="button"
            onClick={() => goToConsultation("NOT_SURE")}
            className={`mt-3 inline-flex h-10 items-center justify-center rounded-xl bg-accent px-4 text-[13px] font-semibold text-white ${TRANSITION_UI} hover:bg-accent-hover`}
          >
            Bắt đầu →
          </button>
        </div>
      </div>
    </div>
  );
}
