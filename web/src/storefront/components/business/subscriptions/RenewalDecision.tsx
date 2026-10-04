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
    body: "Gia hạn đúng sản phẩm và thời hạn đang sử dụng.",
    Icon: RefreshCw,
  },
  {
    title: "Điều chỉnh",
    body: "Thay đổi số lượng hoặc sản phẩm khi nhu cầu thay đổi.",
    Icon: SlidersHorizontal,
  },
  {
    title: "Tư vấn",
    body: "KEYON kiểm tra nhu cầu và tư vấn phương án phù hợp trước khi chốt.",
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
              Có thể phát sinh nhu cầu tăng, giảm số lượng hoặc thay đổi sản phẩm trong quá trình sử dụng.
            </p>
            <Link
              href={SUB_CONSULT_HREF}
              className={`mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-accent px-6 sm:w-auto ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
            >
              Nhận tư vấn →
            </Link>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:col-span-7">
            {OPTIONS.map(({ title, body, Icon }) => (
              <article
                key={title}
                className={`flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white p-3.5 last:col-span-2 sm:p-5 sm:last:col-span-1 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} hover:border-accent/35`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Icon size={16} strokeWidth={1.85} aria-hidden />
                  </span>
                  <h3 className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{title}</h3>
                </span>
                <p className={`mt-2 break-words ${BODY_MUTED_CLASS}`}>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
