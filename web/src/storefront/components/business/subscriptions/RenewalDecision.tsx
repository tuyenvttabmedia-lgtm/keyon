import Link from "next/link";
import { MessageCircle, RefreshCw, SlidersHorizontal } from "lucide-react";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import { SUB_CONSULT_HREF, SECTION_PAD } from "./shared";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";

const OPTIONS = [
  {
    title: "Tiếp tục",
    body: "Gia hạn đúng sản phẩm và thời hạn đang dùng.",
    Icon: RefreshCw,
  },
  {
    title: "Điều chỉnh",
    body: "Tăng, giảm hoặc đổi sản phẩm khi nhu cầu thay đổi.",
    Icon: SlidersHorizontal,
  },
  {
    title: "Tư vấn",
    body: "KEYON kiểm tra nhu cầu và gửi báo giá trước khi chốt.",
    Icon: MessageCircle,
  },
] as const;

export function RenewalDecision() {
  return (
    <section className={`border-t border-border bg-[#F7FAFC] ${SECTION_PAD}`}>
      <div className="home-container">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="min-w-0 lg:col-span-5">
            <h2 className={SECTION_TITLE_CLASS}>Khi nhu cầu sử dụng thay đổi</h2>
            <p className={`mt-3 ${SECTION_LEAD_CLASS}`}>
              Có thể gia hạn nguyên gói, điều chỉnh số lượng hoặc nhờ KEYON tư vấn trước khi chốt.
            </p>
            <Link
              href={SUB_CONSULT_HREF}
              className={`mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
            >
              Nhận tư vấn →
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:col-span-7">
            {OPTIONS.map(({ title, body, Icon }) => (
              <article
                key={title}
                className={`rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} hover:border-accent/35`}
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
