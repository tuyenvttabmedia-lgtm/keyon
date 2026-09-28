import {
  CalendarClock,
  History,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
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
    title: "Sản phẩm đang dùng",
    body: "Xem các subscription đang được quản lý trong tài khoản.",
    Icon: LayoutDashboard,
  },
  {
    title: "Trạng thái",
    body: "Biết subscription đang sử dụng, chưa kích hoạt hoặc đã hết hạn.",
    Icon: ListChecks,
  },
  {
    title: "Thời điểm gia hạn",
    body: "Kiểm tra thời hạn để chủ động chuẩn bị cho kỳ tiếp theo.",
    Icon: CalendarClock,
  },
  {
    title: "Thay đổi nhu cầu",
    body: "Liên hệ KEYON khi cần thay đổi sản phẩm hoặc số lượng.",
    Icon: History,
  },
] as const;

/** Matches Tài khoản → License: đang sử dụng, chưa kích hoạt, hết hạn. */
const STATUS_LEGEND = [
  {
    label: "Đang sử dụng",
    hint: "License còn trong thời hạn đã mua.",
    tone: "bg-accent/15 text-accent",
  },
  {
    label: "Chưa kích hoạt",
    hint: "Đã nhận license, chưa hoàn tất kích hoạt.",
    tone: "bg-amber-50 text-amber-800",
  },
  {
    label: "Hết hạn",
    hint: "Đã qua ngày hết hạn. Liên hệ KEYON khi cần gia hạn.",
    tone: "bg-rose-50 text-rose-700",
  },
] as const;

export function SubscriptionControlCenter() {
  return (
    <section className={`border-t border-border bg-[#F4F8FB] ${SECTION_PAD}`}>
      <div className="home-container">
        <header className="max-w-2xl">
          <h2 className={SECTION_TITLE_CLASS}>Kiểm tra subscription và thời hạn</h2>
          <p className={`mt-3 ${SECTION_LEAD_CLASS}`}>
            Theo dõi subscription đang sử dụng trong Tài khoản KEYON và liên hệ khi cần gia hạn hoặc
            điều chỉnh nhu cầu.
          </p>
        </header>

        <div className="mt-8 grid items-stretch gap-4 md:mt-9 lg:grid-cols-2 lg:gap-6">
          <ul className="grid h-full gap-3 sm:grid-cols-2 sm:grid-rows-2">
            {POINTS.map(({ title, body, Icon }) => (
              <li
                key={title}
                className={`flex h-full flex-col rounded-xl border border-border bg-white px-3.5 py-3.5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} hover:border-accent/35`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon size={16} strokeWidth={1.85} aria-hidden />
                </span>
                <p className={`mt-2.5 ${CARD_TITLE_CLASS}`}>{title}</p>
                <p className={`mt-1 ${BODY_MUTED_CLASS}`}>{body}</p>
              </li>
            ))}
          </ul>

          <div
            className={`flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_FLOAT}`}
          >
            <div className="border-b border-border px-4 py-3 sm:px-5">
              <p className={CARD_TITLE_CLASS}>Trong Tài khoản KEYON</p>
              <p className={CARD_META_CLASS}>
                Trạng thái license: đang sử dụng, chưa kích hoạt, hết hạn
              </p>
            </div>
            <ul className="flex flex-1 flex-col divide-y divide-border">
              {STATUS_LEGEND.map((s) => (
                <li
                  key={s.label}
                  className="flex flex-1 items-center px-4 py-3.5 sm:px-5"
                >
                  <div className="min-w-0">
                    <span
                      className={`inline-flex rounded-md px-2 py-0.5 ${BADGE_CLASS} ${s.tone}`}
                    >
                      {s.label}
                    </span>
                    <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{s.hint}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
