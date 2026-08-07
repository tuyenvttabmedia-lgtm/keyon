import {
  CalendarClock,
  History,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import {
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  OVERLINE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_FLOAT,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  TRANSITION_PANEL,
} from "@/storefront/effects";
import { SECTION_PAD } from "./shared";

const POINTS = [
  {
    title: "Tổng quan subscription",
    body: "Nhìn toàn bộ gói đang theo dõi ở một nơi.",
    Icon: LayoutDashboard,
  },
  {
    title: "Theo dõi trạng thái",
    body: "Phân biệt đang dùng, sắp hạn hoặc cần xem xét.",
    Icon: ListChecks,
  },
  {
    title: "Mốc gia hạn",
    body: "Biết trước kỳ cần xử lý để chủ động kế hoạch.",
    Icon: CalendarClock,
  },
  {
    title: "Lịch sử xử lý",
    body: "Giữ dấu vết các lần xem xét và gia hạn.",
    Icon: History,
  },
] as const;

const STATUS_LEGEND = [
  { label: "Đang hoạt động", hint: "Gói đang trong chu kỳ sử dụng", tone: "bg-accent/15 text-accent" },
  { label: "Sắp gia hạn", hint: "Sắp đến mốc cần quyết định", tone: "bg-amber-50 text-amber-800" },
  { label: "Cần xem xét", hint: "Cần xác nhận nhu cầu trước khi tiếp tục", tone: "bg-sky-50 text-sky-800" },
] as const;

export function SubscriptionControlCenter() {
  return (
    <section className={`border-t border-border bg-[#F4F8FB] ${SECTION_PAD}`}>
      <div className="home-container">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-5">
            <p className={`${OVERLINE_CLASS} tracking-[0.16em] text-accent`}>Quản lý tập trung</p>
            <h2 className={`mt-2.5 ${SECTION_TITLE_CLASS}`}>
              Nắm rõ những gì đang sử dụng và điều gì sắp tới
            </h2>
            <p className={`mt-3 ${SECTION_LEAD_CLASS}`}>
              Thông tin subscription, trạng thái và thời hạn được tổ chức rõ ràng để doanh nghiệp
              dễ theo dõi và ra quyết định.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {POINTS.map(({ title, Icon }) => (
                <li
                  key={title}
                  className={`flex items-center gap-3 rounded-xl border border-border bg-white px-3.5 py-3 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} hover:border-accent/35`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Icon size={16} strokeWidth={1.85} aria-hidden />
                  </span>
                  <span className="text-[13px] font-semibold text-navy">{title}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <div
              className={`overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_FLOAT}`}
            >
              <div className="border-b border-border px-4 py-3 sm:px-5">
                <p className={CARD_TITLE_CLASS}>Trạng thái theo dõi</p>
                <p className={CARD_META_CLASS}>
                  Cách KEYON phân loại subscription — không phải danh sách tài khoản thật
                </p>
              </div>
              <ul className="divide-y divide-border">
                {STATUS_LEGEND.map((s) => (
                  <li
                    key={s.label}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5"
                  >
                    <div className="min-w-0">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-[12px] font-semibold ${s.tone}`}
                      >
                        {s.label}
                      </span>
                      <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{s.hint}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <ul className="grid gap-2 border-t border-border bg-[#F7FAFC] p-4 sm:grid-cols-2 sm:p-5">
                {POINTS.map(({ title, body }) => (
                  <li key={title} className="min-w-0">
                    <p className="text-[12px] font-semibold text-navy">{title}</p>
                    <p className={`mt-0.5 text-[12px] leading-snug text-muted`}>{body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
