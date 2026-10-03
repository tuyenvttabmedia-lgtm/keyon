"use client";

import { useState } from "react";
import {
  ClipboardList,
  Eye,
  RefreshCcw,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_FLOAT,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";
import { SECTION_PAD } from "./shared";

const STEPS: {
  title: string;
  body: string;
  previewTitle: string;
  previewBody: string;
  Icon: LucideIcon;
  visual: { label: string; tone: string }[];
}[] = [
  {
    title: "Chọn subscription",
    body: "Chọn sản phẩm, số lượng và thời hạn sử dụng.",
    previewTitle: "Chọn subscription",
    previewBody: "Chọn sản phẩm, số lượng người dùng hoặc thiết bị, và thời hạn cần mua.",
    Icon: ClipboardList,
    visual: [
      { label: "Sản phẩm", tone: "bg-accent/20 text-accent" },
      { label: "Thời hạn", tone: "bg-white/10 text-slate-200" },
    ],
  },
  {
    title: "Xác nhận nhu cầu",
    body: "KEYON xác nhận sản phẩm và hình thức cấp phép phù hợp.",
    previewTitle: "Xác nhận nhu cầu",
    previewBody: "KEYON xác nhận sản phẩm và hình thức cấp phép phù hợp.",
    Icon: Eye,
    visual: [
      { label: "Sản phẩm", tone: "bg-accent/20 text-accent" },
      { label: "Số lượng", tone: "bg-white/10 text-slate-200" },
    ],
  },
  {
    title: "Thanh toán & nhận license",
    body: "Hoàn tất thanh toán và nhận thông tin license theo sản phẩm.",
    previewTitle: "Thanh toán & nhận license",
    previewBody: "Sau thanh toán, nhận thông tin license hoặc hướng dẫn theo từng sản phẩm.",
    Icon: Wallet,
    visual: [
      { label: "Thanh toán", tone: "bg-accent/20 text-accent" },
      { label: "License", tone: "bg-white/10 text-slate-200" },
    ],
  },
  {
    title: "Theo dõi & gia hạn",
    body: "Kiểm tra thời hạn và liên hệ KEYON khi cần gia hạn.",
    previewTitle: "Theo dõi & gia hạn",
    previewBody: "Kiểm tra thời hạn và liên hệ KEYON khi cần gia hạn.",
    Icon: RefreshCcw,
    visual: [
      { label: "Thời hạn", tone: "bg-amber-400/20 text-amber-200" },
      { label: "Gia hạn", tone: "bg-accent/20 text-accent" },
    ],
  },
];

/** Vertical activity timeline + contextual preview (desktop). */
export function SubscriptionProcess() {
  const [active, setActive] = useState(0);
  const current = STEPS[active]!;
  const Icon = current.Icon;

  return (
    <section className={`border-t border-border bg-[#F4F8FB] ${SECTION_PAD}`}>
      <div className="home-container">
        <header className="max-w-2xl">
          <h2 className={SECTION_TITLE_CLASS}>Quy trình mua và gia hạn</h2>
          <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
            Chọn subscription, xác nhận nhu cầu, nhận license, rồi theo dõi thời hạn để gia hạn khi cần.
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
                      selected ? "bg-white" : "hover:bg-white/70"
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
              className={`relative overflow-hidden rounded-2xl bg-navy p-6 text-white sm:p-8 lg:sticky lg:top-24 ${ELEVATION_FLOAT}`}
            >
              <div
                className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent/25 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-sky-400/15 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute right-4 top-2 select-none text-[5.5rem] font-black leading-none text-white/[0.06] sm:right-6 sm:text-[7rem]"
                aria-hidden
              >
                {String(active + 1).padStart(2, "0")}
              </div>

              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white">
                    <Icon size={20} strokeWidth={1.85} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                      Bước {String(active + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
                    </p>
                    <h3 className="mt-0.5 text-lg font-bold sm:text-xl">{current.previewTitle}</h3>
                  </div>
                </div>

                <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
                  {current.previewBody}
                </p>

                <div
                  className="mt-6 rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm"
                  aria-hidden
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Tiến độ
                    </span>
                    <span className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                      <span
                        className={`block h-full rounded-full bg-accent ${TRANSITION_UI}`}
                        style={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
                      />
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {current.visual.map((chip) => (
                      <span
                        key={chip.label}
                        className={`inline-flex rounded-lg px-2.5 py-1 text-[12px] font-semibold ${chip.tone}`}
                      >
                        {chip.label}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-4 gap-1.5">
                    {STEPS.map((_, i) => (
                      <span
                        key={STEPS[i]!.title}
                        className={`h-1.5 rounded-full ${TRANSITION_UI} ${
                          i <= active ? "bg-accent" : "bg-white/15"
                        }`}
                      />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
