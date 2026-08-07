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
  { title: "Kích hoạt", body: "Ghi nhận subscription mới vào hệ thống.", Icon: Rocket },
  { title: "Đang sử dụng", body: "Theo dõi trạng thái vận hành hàng ngày.", Icon: CirclePlay },
  { title: "Theo dõi", body: "Nắm chu kỳ và thông tin liên quan.", Icon: Eye },
  { title: "Sắp gia hạn", body: "Nhận tín hiệu trước mốc cần xử lý.", Icon: Timer },
  { title: "Gia hạn", body: "Tiếp tục, điều chỉnh hoặc tư vấn.", Icon: RefreshCcw },
];

/** Horizontal lifecycle — visual signature for this landing. */
export function LifecycleTimeline() {
  const active = 3;

  return (
    <section className={`bg-white ${SECTION_PAD}`}>
      <div className="home-container">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className={SECTION_TITLE_CLASS}>Một subscription, một vòng đời rõ ràng</h2>
          <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
            Từ kích hoạt đến gia hạn — từng trạng thái nối tiếp, dễ theo dõi.
          </p>
        </header>

        <div className="relative mt-8 md:mt-9">
          <div
            className="pointer-events-none absolute left-[8%] right-[8%] top-[1.65rem] z-0 hidden h-0.5 bg-gradient-to-r from-border via-accent/40 to-border lg:block"
            aria-hidden
          />
          <ol className="relative z-[1] grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
            {STEPS.map((step, i) => {
              const isActive = i === active;
              return (
                <li
                  key={step.title}
                  className={`flex flex-col items-center rounded-2xl border px-3 py-4 text-center ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} ${
                    isActive
                      ? "border-accent bg-accent-soft/40 ring-1 ring-accent/20"
                      : `border-border bg-white ${ELEVATION_HAIRLINE} hover:border-accent/35`
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                      isActive
                        ? "border-accent bg-accent text-white"
                        : "border-accent/35 bg-white text-accent"
                    }`}
                    aria-hidden
                  >
                    <step.Icon size={20} strokeWidth={1.75} />
                  </span>
                  <h3 className={`mt-3 ${CARD_TITLE_CLASS}`}>{step.title}</h3>
                  <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{step.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
