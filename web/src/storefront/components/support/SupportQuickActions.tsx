import Link from "next/link";
import {
  BookOpen,
  LifeBuoy,
  MessageSquarePlus,
  Ticket,
} from "lucide-react";
import { BODY_MUTED_CLASS, CARD_TITLE_CLASS } from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  TRANSITION_PANEL,
} from "@/storefront/effects";
import {
  CONTACT_HREF,
  GUIDES_HREF,
  SURFACE,
  TICKETS_HREF,
} from "./shared";

const ACTIONS = [
  {
    title: "Tạo ticket hỗ trợ",
    body: "Gửi yêu cầu và theo dõi quá trình xử lý.",
    href: TICKETS_HREF,
    Icon: MessageSquarePlus,
    short: "Gửi một yêu cầu mới",
  },
  {
    title: "Kiểm tra ticket",
    body: "Xem trạng thái yêu cầu hỗ trợ.",
    href: TICKETS_HREF,
    Icon: Ticket,
    short: "Theo dõi yêu cầu đã gửi",
  },
  {
    title: "Hướng dẫn sử dụng",
    body: "Tìm hướng dẫn và bài viết hỗ trợ.",
    href: GUIDES_HREF,
    Icon: BookOpen,
    short: "Xem hướng dẫn",
  },
  {
    title: "Liên hệ",
    body: "Xem các kênh hỗ trợ của KEYON.",
    href: CONTACT_HREF,
    Icon: LifeBuoy,
    short: "Các kênh hỗ trợ",
  },
] as const;

export function SupportQuickActions({ layout }: { layout: "row" | "stack" }) {
  if (layout === "stack") {
    return (
      <ul className="space-y-2.5">
        {ACTIONS.map(({ title, short, href, Icon }) => (
          <li key={title}>
            <Link
              href={href}
              className={`flex min-h-[56px] items-center gap-3 px-4 py-3 ${SURFACE} ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} active:border-accent`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Icon size={18} strokeWidth={1.85} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block ${CARD_TITLE_CLASS}`}>{title}</span>
                <span className={`mt-0.5 block ${BODY_MUTED_CLASS}`}>{short}</span>
              </span>
              <span className="shrink-0 text-accent" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {ACTIONS.map(({ title, body, href, Icon }) => (
        <li key={title}>
          <Link
            href={href}
            className={`flex h-full flex-col p-4 ${SURFACE} ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} hover:border-accent/35`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Icon size={18} strokeWidth={1.85} aria-hidden />
            </span>
            <span className={`mt-3 ${CARD_TITLE_CLASS}`}>{title}</span>
            <span className={`mt-1 flex-1 ${BODY_MUTED_CLASS}`}>{body}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
