import { Check } from "lucide-react";
import {
  BODY_MUTED_CLASS,
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

        <ul className="mt-8 grid min-w-0 grid-cols-2 items-stretch gap-2.5 sm:gap-3.5 md:mt-9 lg:gap-4">
          {BENEFITS.map((b) => (
            <li
              key={b.title}
              className={`flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-[#F7FAFC] p-3.5 sm:p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} hover:border-accent/35`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Check size={13} strokeWidth={3} aria-hidden />
                </span>
                <p className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{b.title}</p>
              </span>
              <p className={`mt-2 break-words ${BODY_MUTED_CLASS}`}>{b.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
