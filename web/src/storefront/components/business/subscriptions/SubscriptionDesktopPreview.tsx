import {
  AlertCircle,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { CARD_META_CLASS, CARD_TITLE_CLASS } from "@/storefront/typography";
import { ELEVATION_FLOAT, ELEVATION_HAIRLINE } from "@/storefront/effects";
import { SAMPLE_SUBSCRIPTIONS } from "./shared";

const NAV = ["Tổng quan", "Subscriptions", "Gia hạn", "Lịch sử"] as const;

const STATUS_CARDS = [
  { label: "Đang hoạt động", Icon: CheckCircle2, tone: "text-accent bg-accent-soft" },
  { label: "Sắp gia hạn", Icon: Clock3, tone: "text-amber-700 bg-amber-50" },
  { label: "Cần xem xét", Icon: AlertCircle, tone: "text-sky-700 bg-sky-50" },
] as const;

const TIMELINE = ["Đang dùng", "Sắp gia hạn", "Xem xét", "Gia hạn"] as const;

function statusTone(status: (typeof SAMPLE_SUBSCRIPTIONS)[number]["status"]) {
  if (status === "active") return "bg-accent/15 text-accent";
  if (status === "renewal") return "bg-amber-50 text-amber-800";
  return "bg-sky-50 text-sky-800";
}

/** Conceptual desktop hub — labels only, no fake counters/cost charts. */
export function SubscriptionDesktopPreview() {
  return (
    <div className="relative mx-auto hidden w-full max-w-[520px] md:block lg:max-w-none">
      <div
        className={`relative overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_FLOAT}`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <div>
            <p className={CARD_TITLE_CLASS}>Subscription Hub</p>
            <p className={CARD_META_CLASS}>Minh họa giao diện — không phải dữ liệu vận hành</p>
          </div>
          <span className="rounded-md bg-accent-soft px-2 py-1 text-[11px] font-semibold text-accent">
            KEYON
          </span>
        </div>

        <div className="flex gap-0">
          <nav
            className="hidden w-[118px] shrink-0 flex-col gap-1 border-r border-border bg-[#F7FAFC] p-3 sm:flex"
            aria-hidden
          >
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
                    <Icon size={14} strokeWidth={1.9} aria-hidden />
                  </span>
                  <p className={`mt-2 text-[11px] font-semibold leading-snug text-navy`}>{label}</p>
                </div>
              ))}
            </div>

            <ul className="mt-3 space-y-2">
              {SAMPLE_SUBSCRIPTIONS.map((s) => (
                <li
                  key={s.name}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-[#F7FAFC] px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className={`${CARD_TITLE_CLASS} truncate`}>{s.name}</p>
                    <span
                      className={`mt-1 inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${statusTone(s.status)}`}
                    >
                      {s.statusLabel}
                    </span>
                  </div>
                  <span className="shrink-0 text-[11px] font-semibold text-accent">Chi tiết</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 rounded-xl border border-dashed border-border bg-white px-3 py-3">
              <p className={`${CARD_META_CLASS} mb-3 font-medium text-navy`}>Chu kỳ gia hạn</p>
              <ol className="flex items-start justify-between gap-1">
                {TIMELINE.map((step, i) => (
                  <li key={step} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                    <span className="flex w-full items-center">
                      {i > 0 ? <span className="h-px flex-1 bg-border" aria-hidden /> : <span className="flex-1" />}
                      <span
                        className={`mx-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                          i === 1 ? "bg-accent" : "bg-border"
                        }`}
                      />
                      {i < TIMELINE.length - 1 ? (
                        <span className="h-px flex-1 bg-border" aria-hidden />
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

      {/* Floating renewal notification — signature layer */}
      <div
        className={`absolute -bottom-3 left-4 right-4 z-10 rounded-xl border border-accent/30 bg-white p-3 sm:left-auto sm:right-5 sm:w-[260px] ${ELEVATION_FLOAT}`}
      >
        <p className="text-[12px] font-bold text-navy">Sắp đến kỳ gia hạn</p>
        <p className={`mt-1 ${CARD_META_CLASS}`}>
          Kiểm tra subscription và lựa chọn tiếp tục trước thời hạn.
        </p>
      </div>
    </div>
  );
}
