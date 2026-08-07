import Link from "next/link";
import { MessageCircle, RefreshCw, SlidersHorizontal } from "lucide-react";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";
import { SUB_CONSULT_HREF } from "./shared";

const OPTIONS = [
  {
    title: "Tiếp tục",
    body: "Gia hạn subscription đang sử dụng.",
    Icon: RefreshCw,
  },
  {
    title: "Điều chỉnh",
    body: "Xem xét số lượng người dùng hoặc nhu cầu mới.",
    Icon: SlidersHorizontal,
  },
  {
    title: "Tư vấn",
    body: "Trao đổi với KEYON trước khi quyết định.",
    Icon: MessageCircle,
  },
] as const;

export function RenewalDecision() {
  return (
    <section className="border-y border-border bg-[#F7FAFC] py-10 md:py-12 lg:py-14">
      <div className="home-container">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="min-w-0 lg:col-span-5">
            <h2 className={SECTION_TITLE_CLASS}>Khi đến kỳ gia hạn</h2>
            <p className={`mt-3 ${SECTION_LEAD_CLASS}`}>
              Doanh nghiệp không phải lúc nào cũng cần đơn giản là “mua lại”. Có thể tiếp tục,
              điều chỉnh hoặc trao đổi trước khi chốt.
            </p>
            <Link
              href={SUB_CONSULT_HREF}
              className={`mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
            >
              Yêu cầu tư vấn →
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:col-span-7">
            {OPTIONS.map(({ title, body, Icon }) => (
              <article
                key={title}
                className={`rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD}`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon size={18} strokeWidth={1.85} aria-hidden />
                </span>
                <h3 className={`mt-3.5 ${CARD_TITLE_CLASS}`}>{title}</h3>
                <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
