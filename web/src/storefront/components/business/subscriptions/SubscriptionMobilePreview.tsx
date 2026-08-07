import { CARD_META_CLASS, CARD_TITLE_CLASS } from "@/storefront/typography";
import { ELEVATION_FLOAT, ELEVATION_HAIRLINE } from "@/storefront/effects";

const MOBILE_ROWS = [
  {
    name: "Productivity Suite",
    status: "Sắp gia hạn",
    tone: "bg-amber-50 text-amber-800",
    action: true,
  },
  {
    name: "Creative Software",
    status: "Đang sử dụng",
    tone: "bg-accent-soft text-accent",
    action: false,
  },
] as const;

const STEPS = ["Dùng", "Nhắc", "Xem", "Renew"] as const;

/** Mobile-only app card — not a scaled desktop dashboard. */
export function SubscriptionMobilePreview() {
  return (
    <div className="mx-auto w-full max-w-md md:hidden">
      <div
        className={`overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_FLOAT}`}
      >
        <div className="border-b border-border px-4 py-3">
          <p className={CARD_TITLE_CLASS}>Subscription Hub</p>
          <p className={CARD_META_CLASS}>Minh họa giao diện</p>
        </div>

        <div className="space-y-3 p-4">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">
            Sắp đến kỳ gia hạn
          </p>
          <div
            className={`rounded-xl border border-border bg-[#F7FAFC] px-3.5 py-3 ${ELEVATION_HAIRLINE}`}
          >
            <p className={CARD_TITLE_CLASS}>{MOBILE_ROWS[0].name}</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span
                className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${MOBILE_ROWS[0].tone}`}
              >
                {MOBILE_ROWS[0].status}
              </span>
              <span className="text-[12px] font-semibold text-accent">Xem chi tiết →</span>
            </div>
          </div>

          <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">
            Đang hoạt động
          </p>
          <div
            className={`rounded-xl border border-border bg-white px-3.5 py-3 ${ELEVATION_HAIRLINE}`}
          >
            <p className={CARD_TITLE_CLASS}>{MOBILE_ROWS[1].name}</p>
            <span
              className={`mt-2 inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${MOBILE_ROWS[1].tone}`}
            >
              {MOBILE_ROWS[1].status}
            </span>
          </div>

          <div className="pt-1">
            <div className="relative mx-2 mb-2 h-px bg-border" aria-hidden />
            <ol className="relative z-[1] flex justify-between px-1">
              {STEPS.map((s, i) => (
                <li key={s} className="flex flex-col items-center gap-1.5">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      i === 0 ? "bg-accent" : "border-2 border-border bg-white"
                    }`}
                  />
                  <span className="text-[10px] font-medium text-muted">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
