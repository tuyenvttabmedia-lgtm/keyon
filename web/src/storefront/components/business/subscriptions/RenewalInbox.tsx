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
    title: "Sắp đến kỳ gia hạn",
    body: "Nhận biết sớm các gói sắp đến mốc cần quyết định tiếp tục hay điều chỉnh.",
    Icon: Clock3,
    tone: "text-amber-700 bg-amber-50",
  },
  {
    title: "Cần xác nhận nhu cầu",
    body: "Xem lại số lượng người dùng hoặc phạm vi sử dụng trước khi gia hạn.",
    Icon: MessageCircle,
    tone: "text-sky-700 bg-sky-50",
  },
  {
    title: "Đang chờ xử lý",
    body: "Theo dõi các yêu cầu tư vấn / báo giá liên quan đến subscription.",
    Icon: Hourglass,
    tone: "text-navy bg-navy/5",
  },
  {
    title: "Đã hoàn tất",
    body: "Ghi nhận các kỳ đã xử lý xong để dễ đối chiếu lần sau.",
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
            <h2 className={SECTION_TITLE_CLASS}>Biết việc gì cần xử lý trước kỳ gia hạn</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              KEYON tổ chức các loại việc trước hạn theo trạng thái — giúp ưu tiên đúng việc cần
              xem xét, không bỏ sót mốc quan trọng.
            </p>
          </header>
          <Link
            href={SUB_CONSULT_HREF}
            className={`inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
          >
            Yêu cầu tư vấn →
          </Link>
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-9 lg:grid-cols-4">
          {WORK_TYPES.map((row) => (
            <li
              key={row.title}
              className={`flex h-full flex-col p-4 sm:p-5 ${CARD_SURFACE} ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} hover:border-accent/35`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${row.tone}`}
              >
                <row.Icon size={18} strokeWidth={1.85} aria-hidden />
              </span>
              <h3 className={`mt-3.5 ${CARD_TITLE_CLASS}`}>{row.title}</h3>
              <p className={`mt-1.5 flex-1 ${BODY_MUTED_CLASS}`}>{row.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
