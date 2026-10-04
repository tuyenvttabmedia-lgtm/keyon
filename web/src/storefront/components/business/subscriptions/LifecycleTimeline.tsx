import {
  CirclePlay,
  Eye,
  RefreshCcw,
  Rocket,
  Timer,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
import { SECTION_PAD } from "./shared";

const STEPS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Chọn subscription",
    body: "Chọn sản phẩm, số lượng và thời hạn sử dụng.",
    Icon: Rocket,
  },
  {
    title: "Xác nhận thời hạn",
    body: "Biết rõ thời gian sử dụng trước khi mua.",
    Icon: Timer,
  },
  {
    title: "Bắt đầu sử dụng",
    body: "Nhận license và kích hoạt theo hướng dẫn.",
    Icon: CirclePlay,
  },
  {
    title: "Theo dõi thời hạn",
    body: "Kiểm tra subscription đang sử dụng trong Tài khoản KEYON.",
    Icon: Eye,
  },
  {
    title: "Gia hạn",
    body: "Liên hệ KEYON khi cần tiếp tục sử dụng hoặc thay đổi nhu cầu.",
    Icon: RefreshCcw,
  },
];

/** Horizontal lifecycle — visual signature for this landing. */
export function LifecycleTimeline() {
  const active = 3;

  return (
    <section id="lifecycle" className={`scroll-mt-24 bg-white ${SECTION_PAD}`}>
      <div className="home-container">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className={SECTION_TITLE_CLASS}>Từ lúc mua đến lúc gia hạn</h2>
          <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
            Chọn sản phẩm theo số lượng người dùng, thiết bị và thời hạn sử dụng. KEYON hỗ trợ tư
            vấn trước khi mua và khi cần gia hạn.
          </p>
        </header>

        <div className="relative mt-8 md:mt-9">
          <div
            className="pointer-events-none absolute left-[8%] right-[8%] top-[1.65rem] z-0 hidden h-0.5 bg-gradient-to-r from-border via-accent/40 to-border lg:block"
            aria-hidden
          />
          <ol className="relative z-[1] grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-5 lg:gap-3">
            {STEPS.map((step, i) => {
              const isActive = i === active;
              return (
                <li
                  key={step.title}
                  className={`flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border p-3.5 sm:p-4 ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} ${
                    i === STEPS.length - 1 ? "col-span-2 lg:col-span-1" : ""
                  } ${
                    isActive
                      ? "border-accent bg-accent-soft/40 ring-1 ring-accent/20"
                      : `border-border bg-white ${ELEVATION_HAIRLINE} hover:border-accent/35`
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                        isActive
                          ? "border-accent bg-accent text-white"
                          : "border-accent/35 bg-white text-accent"
                      }`}
                      aria-hidden
                    >
                      <step.Icon size={16} strokeWidth={1.75} />
                    </span>
                    <h3 className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{step.title}</h3>
                  </span>
                  <p className={`mt-2 break-words ${BODY_MUTED_CLASS}`}>{step.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
