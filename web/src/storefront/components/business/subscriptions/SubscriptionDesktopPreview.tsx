import { AlertCircle, CheckCircle2, Clock3 } from "lucide-react";
import { BADGE_CLASS, CARD_META_CLASS, CARD_TITLE_CLASS } from "@/storefront/typography";
import { ELEVATION_FLOAT, ELEVATION_HAIRLINE } from "@/storefront/effects";

const STATUS_CARDS = [
  { label: "Đang sử dụng", Icon: CheckCircle2, tone: "text-accent bg-accent-soft" },
  { label: "Chưa kích hoạt", Icon: Clock3, tone: "text-amber-700 bg-amber-50" },
  { label: "Hết hạn", Icon: AlertCircle, tone: "text-rose-700 bg-rose-50" },
] as const;

const ILLUSTRATION_ROWS = [
  { label: "Còn trong thời hạn", status: "Đang sử dụng", tone: "bg-accent/15 text-accent" },
  { label: "Đã nhận, chờ kích hoạt", status: "Chưa kích hoạt", tone: "bg-amber-50 text-amber-800" },
  { label: "Đã qua ngày hết hạn", status: "Hết hạn", tone: "bg-rose-50 text-rose-700" },
] as const;

/** Desktop hub for the subscription hero. */
export function SubscriptionDesktopPreview() {
  return (
    <div className="relative mx-auto hidden w-full max-w-[440px] md:block lg:max-w-none">
      <div
        className={`relative overflow-hidden rounded-2xl border border-border bg-white p-4 sm:p-5 ${ELEVATION_FLOAT}`}
        aria-hidden
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className={CARD_TITLE_CLASS}>Theo dõi thời hạn</p>
            <p className={CARD_META_CLASS}>Subscription đang dùng</p>
          </div>
          <span className={`rounded-md bg-accent-soft px-2 py-1 ${BADGE_CLASS} text-accent`}>
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
              <p className={`mt-2 ${BADGE_CLASS} leading-snug text-navy`}>{label}</p>
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
                className={`shrink-0 rounded-md px-1.5 py-0.5 ${BADGE_CLASS} ${s.tone}`}
              >
                {s.status}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-3 rounded-xl border border-accent/25 bg-accent-soft/40 px-3 py-2.5">
          <p className={CARD_TITLE_CLASS}>Kiểm tra thời hạn</p>
          <p className={`mt-0.5 ${CARD_META_CLASS}`}>
            Xem ngày hết hạn trong Tài khoản, rồi liên hệ KEYON khi cần gia hạn.
          </p>
        </div>
        <div className="mt-3 rounded-xl border border-dashed border-border bg-[#F7FAFC] px-3 py-2.5">
          <p className={CARD_TITLE_CLASS}>Không tự trừ tiền gia hạn</p>
          <p className={`mt-0.5 ${CARD_META_CLASS}`}>
            Subscription hết hạn thì dừng. KEYON báo giá khi bạn cần tiếp tục hoặc đổi số lượng.
          </p>
        </div>
      </div>
    </div>
  );
}
