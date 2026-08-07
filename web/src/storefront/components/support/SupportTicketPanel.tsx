import Link from "next/link";
import {
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CTA_LABEL_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  TRANSITION_UI,
} from "@/storefront/effects";
import { CONTACT_HREF, SURFACE, TICKETS_HREF } from "./shared";

/** Real ticket statuses from Prisma SupportTicketStatus — labels only. */
const STATUS_LEGEND = [
  { label: "Mới", hint: "Ticket vừa được tạo" },
  { label: "Đang xử lý", hint: "KEYON đang xem xét" },
  { label: "Đã giải quyết", hint: "Vấn đề đã xử lý" },
  { label: "Đã đóng", hint: "Ticket kết thúc" },
] as const;

export function SupportTicketPanel() {
  return (
    <aside className={`p-5 sm:p-6 ${SURFACE} ${ELEVATION_HAIRLINE}`}>
      <h2 className={SECTION_TITLE_CLASS}>Không tìm thấy câu trả lời?</h2>
      <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
        Gửi yêu cầu để đội ngũ KEYON hỗ trợ vấn đề của bạn. Cần đăng nhập Tài khoản KEYON.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        <Link
          href={TICKETS_HREF}
          className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
        >
          Tạo ticket
        </Link>
        <Link
          href={TICKETS_HREF}
          className={`inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-5 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
        >
          Kiểm tra trạng thái
        </Link>
        <Link
          href={CONTACT_HREF}
          className={`inline-flex h-11 items-center justify-center text-[14px] font-semibold text-accent hover:underline`}
        >
          Liên hệ →
        </Link>
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <p className={`${CARD_META_CLASS} font-semibold uppercase tracking-wide text-muted`}>
          Trạng thái ticket
        </p>
        <ul className="mt-2.5 space-y-2">
          {STATUS_LEGEND.map((s) => (
            <li key={s.label} className="flex items-start gap-2.5">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent"
                aria-hidden
              />
              <span>
                <span className="text-[13px] font-semibold text-navy">{s.label}</span>
                <span className={`mt-0.5 block ${BODY_MUTED_CLASS}`}>{s.hint}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
