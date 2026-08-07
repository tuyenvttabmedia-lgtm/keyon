"use client";

import type { LucideIcon } from "lucide-react";
import { CARD_META_CLASS } from "@/storefront/typography";
import {
  ELEVATION_FLOAT,
  ELEVATION_HAIRLINE,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";
import { goToConsultation, type InterestId } from "./shared";

type FloatItem = {
  id: InterestId;
  label: string;
  Icon: LucideIcon;
  className: string;
};

/** Desktop-only decision workspace — floating product cards around KEYON hub. */
export function DesktopDecisionWorkspace({ items }: { items: readonly FloatItem[] }) {
  return (
    <div className="relative mx-auto hidden min-h-[380px] w-full max-w-[520px] md:block lg:min-h-[420px]">
      {items.map(({ id, label, Icon, className }) => (
        <button
          key={id}
          type="button"
          onClick={() => goToConsultation(id)}
          className={`absolute z-[1] flex items-center gap-2.5 rounded-2xl border border-border bg-white px-3.5 py-2.5 text-left ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} hover:border-accent/40 hover:shadow-md ${className}`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Icon size={17} strokeWidth={1.85} aria-hidden />
          </span>
          <span className="text-[13px] font-semibold text-navy">{label}</span>
        </button>
      ))}

      <div
        className={`absolute left-1/2 top-[42%] z-[2] w-[min(100%,220px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-accent/25 bg-white p-5 text-center ${ELEVATION_FLOAT}`}
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-[1.35rem] font-black tracking-tight text-white">
          K
        </span>
        <p className="mt-3 text-[15px] font-bold text-navy">KEYON</p>
        <p className={`mt-1 ${CARD_META_CLASS}`}>Tìm giải pháp phù hợp</p>
      </div>

      <div
        className={`absolute bottom-0 left-1/2 z-[3] w-[min(100%,340px)] -translate-x-1/2 rounded-2xl border border-border bg-white p-4 ${ELEVATION_FLOAT}`}
      >
        <p className="text-[14px] font-bold text-navy">Bạn đang phân vân?</p>
        <p className={`mt-1 ${CARD_META_CLASS}`}>
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
  );
}
