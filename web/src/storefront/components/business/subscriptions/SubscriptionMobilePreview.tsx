import { BADGE_CLASS, CARD_META_CLASS, CARD_TITLE_CLASS } from "@/storefront/typography";
import { ELEVATION_FLOAT, ELEVATION_HAIRLINE } from "@/storefront/effects";

const STEPS = ["Mua", "Dùng", "Theo dõi", "Gia hạn"] as const;

/** Mobile-only decorative card — no fake products or dead action links. */
export function SubscriptionMobilePreview() {
  return (
    <div className="mx-auto w-full max-w-md md:hidden">
      <div
        className={`overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_FLOAT}`}
        aria-hidden
      >
        <div className="border-b border-border px-4 py-3">
          <p className={CARD_TITLE_CLASS}>Theo dõi thời hạn</p>
          <p className={CARD_META_CLASS}>Subscription đang dùng</p>
        </div>

        <div className="space-y-3 p-4">
          <div
            className={`rounded-xl border border-border bg-white px-3.5 py-3 ${ELEVATION_HAIRLINE}`}
          >
            <p className={CARD_TITLE_CLASS}>Còn trong thời hạn</p>
            <span className={`mt-2 inline-flex rounded-md bg-accent-soft px-2 py-0.5 ${BADGE_CLASS} text-accent`}>
              Đang sử dụng
            </span>
          </div>
          <div
            className={`rounded-xl border border-border bg-[#F7FAFC] px-3.5 py-3 ${ELEVATION_HAIRLINE}`}
          >
            <p className={CARD_TITLE_CLASS}>Đã nhận, chờ kích hoạt</p>
            <span className={`mt-2 inline-flex rounded-md bg-amber-50 px-2 py-0.5 ${BADGE_CLASS} text-amber-800`}>
              Chưa kích hoạt
            </span>
          </div>
          <div
            className={`rounded-xl border border-border bg-[#F7FAFC] px-3.5 py-3 ${ELEVATION_HAIRLINE}`}
          >
            <p className={CARD_TITLE_CLASS}>Đã qua ngày hết hạn</p>
            <span className={`mt-2 inline-flex rounded-md bg-rose-50 px-2 py-0.5 ${BADGE_CLASS} text-rose-700`}>
              Hết hạn
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
                  <span className={`${BADGE_CLASS} text-muted`}>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
