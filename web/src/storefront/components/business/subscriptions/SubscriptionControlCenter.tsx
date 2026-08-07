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
import { ELEVATION_FLOAT, ELEVATION_HAIRLINE } from "@/storefront/effects";
import { SAMPLE_SUBSCRIPTIONS } from "./shared";

const POINTS = [
  { title: "Tổng quan subscription", Icon: LayoutDashboard },
  { title: "Theo dõi trạng thái", Icon: ListChecks },
  { title: "Mốc gia hạn", Icon: CalendarClock },
  { title: "Lịch sử xử lý", Icon: History },
] as const;

export function SubscriptionControlCenter() {
  return (
    <section className="border-y border-border bg-[#F4F8FB] py-10 md:py-12 lg:py-14">
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
                  className={`flex items-center gap-3 rounded-xl border border-border bg-white px-3.5 py-3 ${ELEVATION_HAIRLINE}`}
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
              <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
                <div>
                  <p className={CARD_TITLE_CLASS}>Bảng theo dõi</p>
                  <p className={CARD_META_CLASS}>Conceptual UI — không dùng số liệu vận hành</p>
                </div>
              </div>
              <ul className="divide-y divide-border">
                {SAMPLE_SUBSCRIPTIONS.map((s) => (
                  <li
                    key={s.name}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5"
                  >
                    <div>
                      <p className={CARD_TITLE_CLASS}>{s.name}</p>
                      <p className={`mt-0.5 ${BODY_MUTED_CLASS}`}>{s.statusLabel}</p>
                    </div>
                    <span className="rounded-lg border border-border px-2.5 py-1 text-[12px] font-semibold text-navy">
                      Xem trạng thái
                    </span>
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
