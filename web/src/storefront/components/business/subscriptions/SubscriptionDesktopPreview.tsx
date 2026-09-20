import { AlertCircle, CheckCircle2, Clock3 } from "lucide-react";
import { CARD_META_CLASS, CARD_TITLE_CLASS } from "@/storefront/typography";
import { ELEVATION_FLOAT, ELEVATION_HAIRLINE } from "@/storefront/effects";

const STATUS_CARDS = [
  { label: "Đang hoạt động", Icon: CheckCircle2, tone: "text-accent bg-accent-soft" },
  { label: "Sắp gia hạn", Icon: Clock3, tone: "text-amber-700 bg-amber-50" },
  { label: "Cần xem xét", Icon: AlertCircle, tone: "text-sky-700 bg-sky-50" },
] as const;

const ILLUSTRATION_ROWS = [
  { label: "Gói đang sử dụng", status: "Đang hoạt động", tone: "bg-accent/15 text-accent" },
  { label: "Gói sắp đến hạn", status: "Sắp gia hạn", tone: "bg-amber-50 text-amber-800" },
  { label: "Gói cần xem xét", status: "Cần xem xét", tone: "bg-sky-50 text-sky-800" },
] as const;

/** Compact desktop hub — height aligned with other landing hero arts. */
export function SubscriptionDesktopPreview() {
  return (
    <div className="relative mx-auto hidden w-full max-w-[440px] md:block lg:max-w-none">
      <div
        className={`relative overflow-hidden rounded-2xl border border-border bg-white p-4 sm:p-5 ${ELEVATION_FLOAT}`}
        aria-hidden
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className={CARD_TITLE_CLASS}>Subscription Hub</p>
            <p className={CARD_META_CLASS}>Theo dõi trạng thái gói</p>
          </div>
          <span className="rounded-md bg-accent-soft px-2 py-1 text-[11px] font-semibold text-accent">
            KEYON
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {STATUS_CARDS.map(({ label, Icon, tone }) => (
            <div
              key={label}
              className={`rounded-xl border border-border/80 bg-[#F7FAFC] px-2.5 py-2.5 ${ELEVATION_HAIRLINE}`}
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
              className="flex items-center justify-between gap-2 rounded-xl border border-border bg-[#F7FAFC] px-3 py-2"
            >
              <p className={`${CARD_TITLE_CLASS} truncate`}>{s.label}</p>
              <span
                className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${s.tone}`}
              >
                {s.status}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-3 rounded-xl border border-accent/25 bg-accent-soft/40 px-3 py-2.5">
          <p className="text-[12px] font-bold text-navy">Sắp đến kỳ gia hạn</p>
          <p className={`mt-0.5 ${CARD_META_CLASS}`}>
            Nhắc trước hạn để kịp xem xét và chọn hướng xử lý.
          </p>
        </div>
      </div>
    </div>
  );
}
