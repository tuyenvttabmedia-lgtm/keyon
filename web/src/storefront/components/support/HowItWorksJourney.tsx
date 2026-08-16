"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  OVERLINE_CLASS,
  PAGE_LEAD_CLASS,
  SECTION_TITLE_CLASS,
  TAB_CLASS,
} from "@/storefront/typography";
import {
  EASE_STANDARD,
  ELEVATION_HAIRLINE,
  MOTION_SLOW,
  TRANSITION_TRANSFORM,
  TRANSITION_UI,
} from "@/storefront/effects";

const STEP_MS = 5200;
const STEP_COUNT = 3;

const STEPS = [
  {
    tab: "Chọn gói",
    meta: "Catalog",
    eyebrow: "Bước 01 · Catalog",
    title: "Chọn gói đúng nhu cầu",
    desc: "Xem loại nhận (key / tài khoản) và giá trước khi đặt — không ẩn phí, không đổi SKU sau thanh toán.",
    chips: ["Key retail", "Tài khoản sẵn", "Giá VND rõ"],
  },
  {
    tab: "Thanh toán",
    meta: "VietQR",
    eyebrow: "Bước 02 · Payment",
    title: "Thanh toán một lần, rõ ràng",
    desc: "Chuyển khoản / VietQR theo hướng dẫn trên trang thanh toán. Thanh toán thành công chưa phải đã giao — KEYON tách hai trạng thái.",
    chips: ["VietQR", "SePay", "Đối soát"],
  },
  {
    tab: "Nhận trong Tài khoản",
    meta: "Deliverable",
    eyebrow: "Bước 03 · Fulfillment",
    title: "Nhận trong Tài khoản",
    desc: "Sau khi hệ thống xác nhận thanh toán, mở Đơn hàng / Tài sản để lấy deliverable — lưu lại, mở lại khi cần.",
    chips: ["Đơn hàng", "Tài sản", "Copy key"],
  },
] as const;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Interactive 3-step journey (mockup v2). Autoplay respects reduced motion. */
export function HowItWorksJourney() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const started = useRef(false);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!reduced) setPlaying(true);
  }, [reduced]);

  const go = useCallback((to: number) => {
    progressRef.current = 0;
    setIndex(((to % STEP_COUNT) + STEP_COUNT) % STEP_COUNT);
    setProgress(0);
  }, []);

  useEffect(() => {
    if (!playing || reduced) return;
    const origin = performance.now() - progressRef.current * STEP_MS;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - origin) / STEP_MS);
      setProgress(t);
      if (t >= 1) {
        go(index + 1);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, reduced, index, go]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPlaying(false);
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  const fill = `${Math.round(progress * 1000) / 10}%`;

  return (
    <section
      aria-label="Cách KEYON hoạt động"
      className={`overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_HAIRLINE}`}
    >
      <div className="grid lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)]">
        <aside className="bg-gradient-to-br from-[#0b1f33] via-[#102a43] to-accent px-6 py-8 text-white md:px-7">
          <p className={`${OVERLINE_CLASS} text-accent-soft`}>Hành trình mua</p>
          <h1 className={`mt-3 ${SECTION_TITLE_CLASS} !text-white`}>
            Cách KEYON hoạt động
          </h1>
          <p className={`mt-3 max-w-[28ch] ${PAGE_LEAD_CLASS} !text-white/75`}>
            Ba bước rõ ràng — từ chọn gói đến giữ giấy phép trong Tài khoản.
          </p>

          <div className="mt-7 flex flex-col gap-2" role="tablist" aria-label="Các bước">
            {STEPS.map((s, i) => {
              const on = i === index;
              return (
                <button
                  key={s.tab}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => go(i)}
                  onMouseEnter={() => {
                    if (playing) setPlaying(false);
                  }}
                  className={`relative grid grid-cols-[36px_1fr] items-center gap-3 rounded-xl px-2.5 py-2.5 text-left ${TRANSITION_UI} ${
                    on
                      ? "border border-accent/40 bg-white/10 text-white"
                      : "border border-transparent text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${CTA_COMPACT_CLASS} ${
                      on ? "bg-accent text-white" : "bg-white/10"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className={`block ${TAB_CLASS} ${on ? "text-white" : "text-white/80"}`}>
                      {s.tab}
                    </span>
                    <span className={`block ${OVERLINE_CLASS} mt-0.5 !normal-case tracking-wide text-white/50`}>
                      {s.meta}
                    </span>
                  </span>
                  {on ? (
                    <span className="absolute inset-x-2.5 bottom-0 h-0.5 overflow-hidden rounded-full bg-white/15">
                      <span
                        className="block h-full bg-accent"
                        style={{ width: playing && !reduced ? fill : on ? "100%" : "0%" }}
                      />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={playing}
              onClick={() => setPlaying((p) => !p)}
              className={`inline-flex h-9 items-center rounded-full border border-white/20 bg-white/10 px-3 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} hover:border-accent/50 hover:bg-white/15`}
            >
              {playing ? "Tạm dừng" : "Phát"}
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className={`inline-flex h-9 items-center rounded-full border border-white/20 bg-white/10 px-3 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} hover:border-accent/50 hover:bg-white/15`}
            >
              Bước tiếp →
            </button>
          </div>
        </aside>

        <div className="overflow-hidden bg-surface">
          <div
            className={`flex ${TRANSITION_TRANSFORM} ${MOTION_SLOW} ${EASE_STANDARD}`}
            style={{
              width: `${STEP_COUNT * 100}%`,
              transform: `translateX(-${(index * 100) / STEP_COUNT}%)`,
            }}
          >
            {STEPS.map((s, i) => (
              <article
                key={s.tab}
                className="grid shrink-0 gap-6 p-6 md:grid-cols-[minmax(0,1.05fr)_minmax(200px,0.95fr)] md:items-center md:p-8"
                style={{ width: `${100 / STEP_COUNT}%` }}
                aria-hidden={i !== index}
              >
                <div>
                  <p className={`${OVERLINE_CLASS} text-accent`}>{s.eyebrow}</p>
                  <h2 className={`mt-2 ${SECTION_TITLE_CLASS}`}>{s.title}</h2>
                  <p className={`mt-3 max-w-[36ch] ${BODY_MUTED_CLASS}`}>{s.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {s.chips.map((c) => (
                      <span
                        key={c}
                        className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 ${CARD_META_CLASS} font-semibold text-muted`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  className={`relative min-h-[220px] overflow-hidden rounded-2xl border border-border bg-white p-4 ${ELEVATION_HAIRLINE}`}
                  aria-hidden
                >
                  <span
                    className="pointer-events-none absolute -bottom-4 -right-1 select-none font-display text-8xl font-bold leading-none text-accent/10"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <StepVisual step={i} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-white px-4 py-3 md:px-7">
        <div className="flex max-w-md flex-1 items-center gap-2" aria-hidden>
          {STEPS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              className="h-2 flex-1 overflow-hidden rounded-full bg-border"
              aria-label={`Bước ${i + 1}`}
            >
              <span
                className="block h-full bg-accent"
                style={{
                  width:
                    i < index
                      ? "100%"
                      : i === index
                        ? playing && !reduced
                          ? fill
                          : "100%"
                        : "0%",
                }}
              />
            </button>
          ))}
        </div>
        <p className={CARD_META_CLASS}>
          Hover tab để khóa bước · Esc tạm dừng
        </p>
      </div>
    </section>
  );
}

function StepVisual({ step }: { step: number }) {
  if (step === 1) {
    return (
      <div className="relative z-[1] space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className={CARD_TITLE_CLASS}>Thanh toán đơn</p>
          <span className={`${BADGE_CLASS} rounded-full bg-accent-soft px-2 py-0.5 text-accent`}>
            Chờ CK
          </span>
        </div>
        <p className={`${CARD_META_CLASS} text-center`}>Quét VietQR trên trang thanh toán</p>
        <div
          className="mx-auto aspect-square w-24 rounded-xl border border-dashed border-accent/40 bg-accent-soft"
          aria-hidden
        />
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className="relative z-[1] space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className={CARD_TITLE_CLASS}>Tài sản · License</p>
          <span className={`${BADGE_CLASS} rounded-full bg-accent-soft px-2 py-0.5 text-accent`}>
            Đã giao
          </span>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
          <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft ${CTA_COMPACT_CLASS} text-accent`}>
            OFF
          </span>
          <div>
            <p className={CARD_TITLE_CLASS}>Office (ví dụ catalog)</p>
            <p className={CARD_META_CLASS}>Retail · loại nhận ghi trên gói</p>
          </div>
        </div>
        <p className={`rounded-xl border border-accent/25 bg-accent-soft px-3 py-2 font-mono ${CARD_META_CLASS} font-semibold text-navy`}>
          ••••-••••-••••-••••
        </p>
      </div>
    );
  }
  return (
    <div className="relative z-[1] space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className={CARD_TITLE_CLASS}>Gói trên cửa hàng</p>
        <span className={`${BADGE_CLASS} rounded-full bg-accent-soft px-2 py-0.5 text-accent`}>
          Key
        </span>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft ${CTA_COMPACT_CLASS} text-accent`}>
          WIN
        </span>
        <div>
          <p className={CARD_TITLE_CLASS}>Windows (ví dụ catalog)</p>
          <p className={CARD_META_CLASS}>Giá và loại nhận trên PDP</p>
        </div>
      </div>
    </div>
  );
}
