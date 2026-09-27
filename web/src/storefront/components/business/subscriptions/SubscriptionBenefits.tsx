import { Check } from "lucide-react";
import {
  CARD_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import { SECTION_PAD } from "./shared";

const BENEFITS = [
  {
    title: "Thông tin rõ ràng",
    body: "Biết sản phẩm, thời hạn và hình thức subscription trước khi mua.",
  },
  {
    title: "Theo dõi thời hạn",
    body: "Dễ kiểm tra subscription đang sử dụng và thời điểm gia hạn.",
  },
  {
    title: "Tư vấn khi thay đổi nhu cầu",
    body: "Hỗ trợ khi cần tăng, giảm hoặc thay đổi sản phẩm.",
  },
  {
    title: "Hỗ trợ sau mua",
    body: "Hướng dẫn kích hoạt và xử lý các vấn đề theo phạm vi sản phẩm.",
  },
] as const;

/** Editorial split — not a 4-card grid. */
export function SubscriptionBenefits() {
  return (
    <section className={`bg-white ${SECTION_PAD}`}>
      <div className="home-container">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-5">
            <h2 className={SECTION_TITLE_CLASS}>
              Biết thời hạn, rồi gia hạn khi cần
            </h2>
            <p className={`mt-3 max-w-md ${SECTION_LEAD_CLASS}`}>
              KEYON hỗ trợ mua subscription theo thời hạn, theo dõi ngày hết hạn và tư vấn khi cần
              gia hạn hoặc đổi sản phẩm.
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
                  <p className={CARD_TITLE_CLASS}>{b.title}</p>
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
