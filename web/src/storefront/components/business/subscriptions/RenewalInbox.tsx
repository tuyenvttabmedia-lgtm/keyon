import Link from "next/link";
import { CheckCircle2, Clock3, Hourglass, MessageCircle } from "lucide-react";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";
import { CARD_SURFACE, SECTION_PAD, SUB_CONSULT_HREF } from "./shared";

/** Conceptual work types — not a fake inbox of named subscriptions. */
const WORK_TYPES = [
  {
    title: "Kiểm tra sản phẩm và thời hạn",
    body: "Xác định subscription đang dùng và thời gian còn lại trước khi gia hạn.",
    Icon: Clock3,
    tone: "text-amber-700 bg-amber-50",
  },
  {
    title: "Xác nhận số lượng cần gia hạn",
    body: "Xác nhận số người dùng, thiết bị hoặc sản phẩm cần tiếp tục sử dụng.",
    Icon: MessageCircle,
    tone: "text-sky-700 bg-sky-50",
  },
  {
    title: "Nhận báo giá",
    body: "KEYON gửi báo giá theo sản phẩm, số lượng và thời hạn phù hợp.",
    Icon: Hourglass,
    tone: "text-navy bg-navy/5",
  },
  {
    title: "Thanh toán và nhận hướng dẫn",
    body: "Hoàn tất thanh toán và nhận thông tin gia hạn hoặc hướng dẫn tiếp theo.",
    Icon: CheckCircle2,
    tone: "text-accent bg-accent-soft",
  },
] as const;

export function RenewalInbox() {
  return (
    <section className={`bg-white ${SECTION_PAD}`}>
      <div className="home-container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Gia hạn bản quyền khi đến kỳ</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Kiểm tra thời hạn license, xác nhận sản phẩm cần gia hạn và nhận báo giá theo nhu cầu
              sử dụng tiếp theo.
            </p>
          </header>
          <Link
            href={SUB_CONSULT_HREF}
            className={`inline-flex h-12 w-full shrink-0 items-center justify-center rounded-xl bg-accent px-6 sm:w-auto ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
          >
            Nhận tư vấn →
          </Link>
        </div>

        <ul className="mt-8 grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3.5 md:mt-9 lg:grid-cols-4">
          {WORK_TYPES.map((row) => (
            <li
              key={row.title}
              className={`flex h-full min-w-0 flex-col overflow-hidden p-3.5 sm:p-5 ${CARD_SURFACE} ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} hover:border-accent/35`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${row.tone}`}
                >
                  <row.Icon size={16} strokeWidth={1.85} aria-hidden />
                </span>
                <h3 className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{row.title}</h3>
              </span>
              <p className={`mt-2 flex-1 break-words ${BODY_MUTED_CLASS}`}>{row.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
