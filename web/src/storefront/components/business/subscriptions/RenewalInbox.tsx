import Link from "next/link";
import { CheckCircle2, Clock3, Hourglass, MessageCircle } from "lucide-react";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
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

const ROWS = [
  {
    name: "Productivity Suite",
    status: "Sắp đến kỳ gia hạn",
    Icon: Clock3,
    tone: "text-amber-700 bg-amber-50",
  },
  {
    name: "Creative Software",
    status: "Cần xác nhận nhu cầu",
    Icon: MessageCircle,
    tone: "text-sky-700 bg-sky-50",
  },
  {
    name: "Business Security",
    status: "Đang chờ xử lý",
    Icon: Hourglass,
    tone: "text-navy bg-navy/5",
  },
  {
    name: "Cloud Workspace",
    status: "Đã hoàn tất",
    Icon: CheckCircle2,
    tone: "text-accent bg-accent-soft",
  },
] as const;

export function RenewalInbox() {
  return (
    <section className={`bg-white ${SECTION_PAD}`}>
      <div className="home-container">
        <header className="max-w-3xl">
          <h2 className={SECTION_TITLE_CLASS}>Biết việc gì cần xử lý trước kỳ gia hạn</h2>
          <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
            Hàng đợi gia hạn dạng inbox — ưu tiên việc cần xem xét trước mốc quan trọng.
          </p>
        </header>

        <ul className="mt-8 space-y-3 md:mt-9">
          {ROWS.map((row) => (
            <li
              key={row.name}
              className={`flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:px-5 sm:py-4 ${CARD_SURFACE} ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} hover:border-accent/35`}
            >
              <div className="flex min-w-0 items-center gap-3.5">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${row.tone}`}
                >
                  <row.Icon size={18} strokeWidth={1.85} aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className={CARD_TITLE_CLASS}>{row.name}</p>
                  <p className={`mt-0.5 ${BODY_MUTED_CLASS}`}>{row.status}</p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                <span
                  className={`inline-flex h-10 items-center justify-center rounded-xl border border-border px-3.5 text-[13px] font-semibold text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  Xem chi tiết
                </span>
                <Link
                  href={SUB_CONSULT_HREF}
                  className={`inline-flex h-10 items-center justify-center rounded-xl bg-accent px-3.5 text-[13px] font-semibold text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Yêu cầu tư vấn
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
