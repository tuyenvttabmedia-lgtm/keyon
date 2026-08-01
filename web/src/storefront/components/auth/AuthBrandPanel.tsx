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
  /** Mid block — fills tall panes (register) without empty stretch */
  features?: AuthBrandFeature[];
  bullets?: string[];
};

const DEFAULT_SUB =
  "Thanh toán rõ ràng, đơn giản và bảo mật. Lưu trữ và quản lý giấy phép mọi lúc, mọi nơi.";

const DEFAULT_BULLETS = [
  "Thanh toán rõ ràng, tách biệt giao hàng",
  "Nhận đúng loại: key / tài khoản / kích hoạt",
  "Lưu và quản lý trong Tài khoản",
];

/** Desktop brand column — navy-soft + faint K */
export function AuthBrandPanel({
  headline,
  subtext = DEFAULT_SUB,
  features,
  bullets = DEFAULT_BULLETS,
}: Props) {
  const hasFeatures = Boolean(features?.length);

  return (
    <aside className="relative hidden overflow-hidden bg-navy-soft lg:block">
      <span
        className={`pointer-events-none absolute select-none font-[family-name:var(--font-display)] font-bold leading-none text-navy/[0.05] ${
          hasFeatures
            ? "bottom-[-4%] right-[-8%] text-[14rem]"
            : "left-[42%] top-[46%] -translate-x-1/2 -translate-y-1/2 text-[22rem]"
        }`}
        aria-hidden
      >
        K
      </span>

      <div
        className={`relative z-10 flex h-full flex-col px-8 py-10 xl:px-10 xl:py-12 ${
          hasFeatures ? "" : "min-h-[520px] justify-between"
        }`}
      >
        <div className="max-w-[22rem] shrink-0">
          <p className={`${OVERLINE_CLASS} text-accent`}>KEYON Account</p>
          <h2 className={`mt-3 ${SECTION_TITLE_CLASS}`}>{headline}</h2>
          <div className="mt-4 h-1 w-11 rounded-full bg-accent" />
          <p className={`mt-4 ${SECTION_LEAD_CLASS}`}>{subtext}</p>
        </div>

        {hasFeatures ? (
          <ol className="my-8 flex flex-1 flex-col justify-evenly gap-3">
            {features!.map((f, i) => (
              <li
                key={f.title}
                className={`flex gap-3 rounded-xl border border-border/70 bg-white/55 px-3.5 py-3 ${ELEVATION_NONE} backdrop-blur-[2px]`}
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

        <ul
          className={`shrink-0 space-y-2.5 ${BODY_MUTED_CLASS} ${
            hasFeatures ? "border-t border-border/60 pt-5" : "pt-2"
          }`}
        >
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
      </div>
    </aside>
  );
}
