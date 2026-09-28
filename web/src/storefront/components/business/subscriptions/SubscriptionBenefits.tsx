import { Check } from "lucide-react";
import {
  CARD_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  TRANSITION_PANEL,
  ELEVATION_CARD_HOVER,
} from "@/storefront/effects";
import { SECTION_PAD } from "./shared";

const BENEFITS = [
  {
    title: "Thông tin rõ ràng",
    body: "Biết sản phẩm, thời hạn và hình thức subscription trước khi mua.",
  },
  {
    title: "Theo dõi thời hạn",
    body: "Dễ kiểm tra subscription đang sử dụng và thời điểm cần gia hạn.",
  },
  {
    title: "Tư vấn khi thay đổi nhu cầu",
    body: "Hỗ trợ khi cần tăng, giảm số lượng hoặc thay đổi sản phẩm.",
  },
  {
    title: "Hỗ trợ sau mua",
    body: "Hướng dẫn kích hoạt và xử lý các vấn đề theo phạm vi sản phẩm.",
  },
] as const;

/** Heading across the row, then four equal cards — no sparse left column. */
export function SubscriptionBenefits() {
  return (
    <section className={`bg-white ${SECTION_PAD}`}>
      <div className="home-container">
        <header className="max-w-2xl">
          <h2 className={SECTION_TITLE_CLASS}>Chủ động theo dõi và gia hạn</h2>
          <p className={`mt-3 ${SECTION_LEAD_CLASS}`}>
            KEYON hỗ trợ theo dõi thời hạn, hướng dẫn kích hoạt và tư vấn khi nhu cầu sử dụng thay
            đổi.
          </p>
        </header>

        <ul className="mt-8 grid items-stretch gap-3 sm:grid-cols-2 md:mt-9 lg:gap-4">
          {BENEFITS.map((b) => (
            <li
              key={b.title}
              className={`flex h-full items-start gap-3.5 rounded-2xl border border-border bg-[#F7FAFC] p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} hover:border-accent/35`}
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Check size={13} strokeWidth={3} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className={CARD_TITLE_CLASS}>{b.title}</p>
                <p className={`mt-1 ${SECTION_LEAD_CLASS}`}>{b.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
