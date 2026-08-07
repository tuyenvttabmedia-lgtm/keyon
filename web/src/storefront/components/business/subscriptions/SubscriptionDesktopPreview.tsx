import {
  AlertCircle,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { CARD_META_CLASS, CARD_TITLE_CLASS } from "@/storefront/typography";
import { ELEVATION_FLOAT, ELEVATION_HAIRLINE } from "@/storefront/effects";

const NAV = ["Tổng quan", "Subscriptions", "Gia hạn", "Lịch sử"] as const;

const STATUS_CARDS = [
  { label: "Đang hoạt động", Icon: CheckCircle2, tone: "text-accent bg-accent-soft" },
  { label: "Sắp gia hạn", Icon: Clock3, tone: "text-amber-700 bg-amber-50" },
  { label: "Cần xem xét", Icon: AlertCircle, tone: "text-sky-700 bg-sky-50" },
] as const;

/** Abstract rows — status vocabulary only, no fake product names / actions. */
const ILLUSTRATION_ROWS = [
  { label: "Gói đang sử dụng", status: "Đang hoạt động", tone: "bg-accent/15 text-accent" },
  { label: "Gói sắp đến hạn", status: "Sắp gia hạn", tone: "bg-amber-50 text-amber-800" },
  { label: "Gói cần xem xét", status: "Cần xem xét", tone: "bg-sky-50 text-sky-800" },
] as const;

const TIMELINE = ["Đang dùng", "Sắp gia hạn", "Xem xét", "Gia hạn"] as const;

/** Decorative desktop hub — non-interactive, no fake metrics or dead CTAs. */
export function SubscriptionDesktopPreview() {
  return (
    <div className="relative mx-auto hidden w-full max-w-[520px] md:block lg:max-w-none">
      <div
        className={`relative overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_FLOAT}`}
        aria-hidden
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <div>
            <p className={CARD_TITLE_CLASS}>Subscription Hub</p>
            <p className={CARD_META_CLASS}>Minh họa giao diện</p>
          </div>
          <span className="rounded-md bg-accent-soft px-2 py-1 text-[11px] font-semibold text-accent">
            KEYON
          </span>
        </div>

        <div className="flex gap-0">
          <nav className="hidden w-[118px] shrink-0 flex-col gap-1 border-r border-border bg-[#F7FAFC] p-3 sm:flex">
            {NAV.map((item, i) => (
              <span
                key={item}
                className={`rounded-lg px-2.5 py-1.5 text-[12px] font-medium ${
                  i === 0 ? "bg-white text-accent shadow-sm" : "text-muted"
                }`}
              >
                {item}
              </span>
            ))}
          </nav>

          <div className="min-w-0 flex-1 p-3.5 sm:p-4">
            <div className="grid grid-cols-3 gap-2">
              {STATUS_CARDS.map(({ label, Icon, tone }) => (
                <div
                  key={label}
                  className={`rounded-xl border border-border/80 bg-white px-2.5 py-2.5 ${ELEVATION_HAIRLINE}`}
                >
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${tone}`}
                  >
                    <Icon size={14} strokeWidth={1.9} />
                  </span>
                  <p className="mt-2 text-[11px] font-semibold leading-snug text-navy">{label}</p>
                </div>
              ))}
            </div>

            <ul className="mt-3 space-y-2">
              {ILLUSTRATION_ROWS.map((s) => (
                <li
                  key={s.label}
                  className="rounded-xl border border-border bg-[#F7FAFC] px-3 py-2.5"
                >
                  <p className={`${CARD_TITLE_CLASS} truncate`}>{s.label}</p>
                  <span
                    className={`mt-1 inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${s.tone}`}
                  >
                    {s.status}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-3 rounded-xl border border-dashed border-border bg-white px-3 py-3">
              <p className={`${CARD_META_CLASS} mb-3 font-medium text-navy`}>Chu kỳ gia hạn</p>
              <ol className="flex items-start justify-between gap-1">
                {TIMELINE.map((step, i) => (
                  <li key={step} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                    <span className="flex w-full items-center">
                      {i > 0 ? (
                        <span className="h-px flex-1 bg-border" />
                      ) : (
                        <span className="flex-1" />
                      )}
                      <span
                        className={`mx-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                          i === 1 ? "bg-accent" : "bg-border"
                        }`}
                      />
                      {i < TIMELINE.length - 1 ? (
                        <span className="h-px flex-1 bg-border" />
                      ) : (
                        <span className="flex-1" />
                      )}
                    </span>
                    <span className="truncate text-center text-[10px] font-medium text-muted">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`absolute -bottom-3 left-4 right-4 z-10 rounded-xl border border-accent/30 bg-white p-3 sm:left-auto sm:right-5 sm:w-[260px] ${ELEVATION_FLOAT}`}
        aria-hidden
      >
        <p className="text-[12px] font-bold text-navy">Sắp đến kỳ gia hạn</p>
        <p className={`mt-1 ${CARD_META_CLASS}`}>
          Nhắc trước hạn để doanh nghiệp kịp xem xét và chọn hướng xử lý.
        </p>
      </div>
    </div>
  );
}
