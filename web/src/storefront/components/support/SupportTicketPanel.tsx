import Link from "next/link";
import {
  BookOpen,
  LifeBuoy,
  MessageSquarePlus,
  Ticket,
} from "lucide-react";
import {
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";
import { CONTACT_HREF, SURFACE, TICKETS_HREF } from "./shared";

const ROWS = [
  {
    title: "Tạo ticket mới",
    body: "Gửi yêu cầu và theo dõi trong Tài khoản KEYON.",
    href: TICKETS_HREF,
    Icon: MessageSquarePlus,
    primary: true,
  },
  {
    title: "Kiểm tra trạng thái",
    body: "Xem ticket đã gửi và tiến độ xử lý.",
    href: TICKETS_HREF,
    Icon: Ticket,
    primary: false,
  },
  {
    title: "Hướng dẫn sử dụng",
    body: "How-to kích hoạt, license và tài khoản.",
    href: "/resources/guides",
    Icon: BookOpen,
    primary: false,
  },
  {
    title: "Liên hệ",
    body: "Các kênh hỗ trợ đã cấu hình trên hệ thống.",
    href: CONTACT_HREF,
    Icon: LifeBuoy,
    primary: false,
  },
] as const;

/** Ticket-first side panel — no fake live-chat / hotline. */
export function SupportTicketPanel() {
  return (
    <aside className={`p-5 sm:p-6 ${SURFACE} ${ELEVATION_HAIRLINE}`}>
      <h2 className={SECTION_TITLE_CLASS}>Không tìm thấy câu trả lời?</h2>
      <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
        Gửi yêu cầu để đội ngũ KEYON hỗ trợ vấn đề của bạn. Cần đăng nhập Tài khoản KEYON.
      </p>

      <ul className="mt-5 divide-y divide-border border-y border-border">
        {ROWS.map(({ title, body, href, Icon, primary }) => (
          <li key={title}>
            <Link
              href={href}
              className={`flex items-center gap-3 py-3.5 ${TRANSITION_PANEL} hover:bg-[#F7FAFC]`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  primary ? "bg-accent text-white" : "bg-accent-soft text-accent"
                }`}
              >
                <Icon size={16} strokeWidth={1.85} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-navy">{title}</span>
                <span className={`mt-0.5 block ${BODY_MUTED_CLASS}`}>{body}</span>
              </span>
              <span className="shrink-0 text-muted" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <Link
          href={TICKETS_HREF}
          className={`inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-accent px-4 text-[13px] font-semibold text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
        >
          Tạo ticket
        </Link>
        <Link
          href={TICKETS_HREF}
          className={`inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-border bg-white px-4 text-[13px] font-semibold text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
        >
          Kiểm tra trạng thái
        </Link>
      </div>

      <p className={`mt-4 ${CARD_META_CLASS}`}>
        Trạng thái thật trên hệ thống: Mới · Đang xử lý · Đã giải quyết · Đã đóng.
      </p>
    </aside>
  );
}
