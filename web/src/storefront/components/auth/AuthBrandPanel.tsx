import {
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  FONT_DISPLAY,
  OVERLINE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import { ELEVATION_NONE } from "@/storefront/effects";

export type AuthBrandFeature = {
  title: string;
  detail: string;
};

type Props = {
  headline: string;
  subtext?: string;
  features?: AuthBrandFeature[];
  bullets?: string[];
};

const DEFAULT_SUB =
  "Thanh toán rõ ràng, đơn giản và bảo mật. Lưu trữ và quản lý giấy phép mọi lúc, mọi nơi.";

const DEFAULT_BULLETS = [
  "Thanh toán rõ · giao hàng tách biệt",
  "Nhận đúng loại: key / tài khoản / kích hoạt",
  "Lưu và quản lý trong Tài khoản",
];

/** Desktop brand column — padding synced with form pane. */
export function AuthBrandPanel({
  headline,
  subtext = DEFAULT_SUB,
  features,
  bullets = DEFAULT_BULLETS,
}: Props) {
  const tall = Boolean(features?.length);
  const showBullets = !tall && bullets.length > 0;

  return (
    <aside className="relative hidden overflow-hidden bg-navy-soft [container-type:inline-size] lg:flex lg:flex-col">
      <div
        className={`auth-brand-k ${tall ? "auth-brand-k--tall" : "auth-brand-k--compact"}`}
        aria-hidden
      >
        <span className={`auth-brand-k-letter ${FONT_DISPLAY}`}>K</span>
      </div>

      <div
        className={`relative z-10 flex h-full flex-col px-8 py-8 sm:px-8 md:px-10 md:py-10 lg:px-12 lg:py-12 ${
          tall ? "justify-between gap-8" : "justify-center gap-10"
        }`}
      >
        <div className="max-w-[24rem] shrink-0">
          <p className={`${OVERLINE_CLASS} text-accent`}>KEYON Account</p>
          <h2 className={`mt-3 ${SECTION_TITLE_CLASS}`}>{headline}</h2>
          <div className="mt-4 h-1 w-11 rounded-full bg-accent" />
          <p className={`mt-4 ${SECTION_LEAD_CLASS}`}>{subtext}</p>
        </div>

        {tall ? (
          <ol className="flex flex-col gap-2.5">
            {features!.map((f, i) => (
              <li
                key={f.title}
                className={`flex gap-3 rounded-xl border border-border/60 bg-white/70 px-3.5 py-3 ${ELEVATION_NONE} backdrop-blur-[2px]`}
              >
                <span
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft ${FONT_DISPLAY} text-xs font-bold text-accent`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className={CARD_TITLE_CLASS}>{f.title}</p>
                  <p className={`mt-0.5 leading-relaxed ${CARD_META_CLASS}`}>
                    {f.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        ) : null}

        {showBullets ? (
          <ul className={`shrink-0 space-y-2.5 ${BODY_MUTED_CLASS}`}>
            {bullets.map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden
                />
                {line}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </aside>
  );
}
