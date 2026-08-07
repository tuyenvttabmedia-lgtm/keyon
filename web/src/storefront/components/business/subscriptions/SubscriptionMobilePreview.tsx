import { CARD_META_CLASS, CARD_TITLE_CLASS } from "@/storefront/typography";
import { ELEVATION_FLOAT, ELEVATION_HAIRLINE } from "@/storefront/effects";

const STEPS = ["Dùng", "Nhắc", "Xem", "Renew"] as const;

/** Mobile-only decorative card — no fake products or dead action links. */
export function SubscriptionMobilePreview() {
  return (
    <div className="mx-auto w-full max-w-md md:hidden">
      <div
        className={`overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_FLOAT}`}
        aria-hidden
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
            <p className={CARD_TITLE_CLASS}>Gói sắp đến hạn</p>
            <span className="mt-2 inline-flex rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
              Sắp gia hạn
            </span>
          </div>

          <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">
            Đang hoạt động
          </p>
          <div
            className={`rounded-xl border border-border bg-white px-3.5 py-3 ${ELEVATION_HAIRLINE}`}
          >
            <p className={CARD_TITLE_CLASS}>Gói đang sử dụng</p>
            <span className="mt-2 inline-flex rounded-md bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
              Đang sử dụng
            </span>
          </div>

          <div className="pt-1">
            <div className="relative mx-2 mb-2 h-px bg-border" />
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
