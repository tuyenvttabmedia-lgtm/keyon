import Link from "next/link";
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
  HOVER_LINK_ACCENT,
  TRANSITION_PANEL,
} from "@/storefront/effects";
import { SECTION_PAD } from "./shared";

const STEPS: { title: string; body: string; Icon: LucideIcon }[] = [
  { title: "Mua subscription", body: "Chọn sản phẩm và thời hạn sử dụng.", Icon: Rocket },
  { title: "Thời hạn", body: "Biết ngày hết hạn trước khi mua.", Icon: Timer },
  { title: "Đang sử dụng", body: "Dùng license trong thời hạn đã mua.", Icon: CirclePlay },
  { title: "Theo dõi", body: "Kiểm tra thời hạn trong Tài khoản KEYON.", Icon: Eye },
  { title: "Gia hạn", body: "Liên hệ KEYON khi cần gia hạn hoặc đổi nhu cầu.", Icon: RefreshCcw },
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
            Chọn sản phẩm theo số lượng người dùng, thiết bị và thời hạn sử dụng — KEYON hỗ trợ tư
            vấn trước khi mua. Xem{" "}
            <Link href="/solutions/microsoft-365-office" className={HOVER_LINK_ACCENT}>
              Microsoft 365 &amp; Office
            </Link>{" "}
            hoặc{" "}
            <Link href="/products" className={HOVER_LINK_ACCENT}>
              danh mục sản phẩm
            </Link>
            . Mua nhiều license một lần nằm ở{" "}
            <Link href="/business/volume-licensing" className={HOVER_LINK_ACCENT}>
              Mua bản quyền số lượng lớn
            </Link>
            .
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
