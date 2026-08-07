import {
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import { ELEVATION_HAIRLINE } from "@/storefront/effects";
import { SECTION_PAD, SURFACE } from "./shared";

const STEPS = [
  {
    who: "Bạn",
    title: "Mô tả nhu cầu",
    body: "Cho KEYON biết bạn đang cần giải quyết vấn đề gì.",
  },
  {
    who: "KEYON",
    title: "Làm rõ yêu cầu",
    body: "Hỏi thêm về quy mô, mục đích và hình thức cấp phép.",
  },
  {
    who: "KEYON",
    title: "So sánh lựa chọn",
    body: "Giải thích điểm khác nhau giữa các phương án phù hợp.",
  },
  {
    who: "Bạn + KEYON",
    title: "Chọn phương án",
    body: "Cùng chốt hướng đi trước khi mua.",
  },
  {
    who: "KEYON",
    title: "Hỗ trợ mua & triển khai",
    body: "Khi đã chọn sản phẩm: Mua ngay → Checkout — không dùng giỏ hàng.",
  },
] as const;

/** Conversation thread — header + dense content, no sparse side column. */
export function ConsultingConversationFlow() {
  return (
    <section className={`border-t border-border bg-[#F4F8FB] ${SECTION_PAD}`}>
      <div className="home-container">
        <header className="max-w-2xl">
          <h2 className={SECTION_TITLE_CLASS}>Quy trình tư vấn cùng KEYON</h2>
          <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
            Dạng hội thoại — từ mô tả nhu cầu đến hỗ trợ mua khi đã chọn được sản phẩm.
          </p>
        </header>

        <ol className="relative mt-8 space-y-0 md:mt-9">
          <div
            className="pointer-events-none absolute bottom-4 left-[15px] top-4 w-px bg-border"
            aria-hidden
          />
          {STEPS.map((step, i) => {
            const n = String(i + 1).padStart(2, "0");
            const keyonSide = step.who.startsWith("KEYON") && !step.who.includes("Bạn");
            return (
              <li key={step.title} className="relative z-[1] flex gap-3 pb-3 last:pb-0 sm:gap-4 sm:pb-4">
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    keyonSide
                      ? "bg-accent text-white"
                      : "border border-border bg-white text-navy"
                  }`}
                >
                  {n}
                </span>
                <div
                  className={`min-w-0 flex-1 p-4 sm:flex sm:items-start sm:justify-between sm:gap-6 sm:p-5 ${SURFACE} ${ELEVATION_HAIRLINE}`}
                >
                  <div className="min-w-0">
                    <p
                      className={`${CARD_META_CLASS} font-semibold uppercase tracking-wide text-accent`}
                    >
                      {step.who}
                    </p>
                    <h3 className={`mt-1 ${CARD_TITLE_CLASS}`}>{step.title}</h3>
                  </div>
                  <p className={`mt-1.5 sm:mt-0 sm:max-w-md sm:text-right ${BODY_MUTED_CLASS}`}>
                    {step.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
