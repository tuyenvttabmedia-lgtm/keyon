import { Check } from "lucide-react";
import {
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import { SECTION_PAD } from "./shared";

const BENEFITS = [
  {
    title: "Hạn chế gián đoạn",
    body: "Biết trước những subscription cần được xem xét.",
  },
  {
    title: "Dễ kiểm soát",
    body: "Thông tin được tổ chức tập trung và rõ ràng.",
  },
  {
    title: "Ra quyết định đúng lúc",
    body: "Có thời gian đánh giá nhu cầu trước khi tiếp tục.",
  },
  {
    title: "Giảm công việc thủ công",
    body: "Hạn chế theo dõi subscription bằng nhiều nguồn rời rạc.",
  },
] as const;

/** Editorial split — not a 4-card grid. */
export function SubscriptionBenefits() {
  return (
    <section className={`bg-white ${SECTION_PAD}`}>
      <div className="home-container">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-5">
            <h2 className={`max-w-[14ch] ${SECTION_TITLE_CLASS}`}>
              Chủ động hơn trước mỗi kỳ gia hạn
            </h2>
            <p className={`mt-3 max-w-md ${SECTION_LEAD_CLASS}`}>
              Subscription operations giúp doanh nghiệp chuẩn bị trước — thay vì xử lý khi đã sát
              hạn.
            </p>
          </div>
          <ul className="space-y-5 lg:col-span-7">
            {BENEFITS.map((b) => (
              <li
                key={b.title}
                className="flex items-start gap-3.5 border-b border-border pb-5 last:border-0 last:pb-0"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Check size={13} strokeWidth={3} aria-hidden />
                </span>
                <div>
                  <p className="text-[15px] font-bold text-navy">{b.title}</p>
                  <p className={`mt-1 ${SECTION_LEAD_CLASS}`}>{b.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
