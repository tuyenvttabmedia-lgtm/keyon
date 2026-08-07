import {
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import { ELEVATION_HAIRLINE } from "@/storefront/effects";
import { SECTION_PAD } from "./shared";

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

/** Conversation-thread process — distinct from volume/subscription timelines. */
export function ConsultingConversationFlow() {
  return (
    <section className={`border-t border-border bg-[#F4F8FB] ${SECTION_PAD}`}>
      <div className="home-container px-5 md:px-0">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className={SECTION_TITLE_CLASS}>Quy trình tư vấn cùng KEYON</h2>
          <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
            Dạng hội thoại — từ mô tả nhu cầu đến hỗ trợ mua khi đã chọn được sản phẩm.
          </p>
        </header>

        <ol className="relative mx-auto mt-8 max-w-xl space-y-0 md:mt-10">
          <div
            className="pointer-events-none absolute bottom-6 left-[19px] top-6 w-px bg-border md:left-[23px]"
            aria-hidden
          />
          {STEPS.map((step, i) => {
            const n = String(i + 1).padStart(2, "0");
            const keyonSide = step.who.startsWith("KEYON") && !step.who.includes("Bạn");
            return (
              <li key={step.title} className="relative z-[1] flex gap-3.5 pb-6 last:pb-0 md:gap-4">
                <span
                  className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-bold md:h-12 md:w-12 md:text-[13px] ${
                    keyonSide
                      ? "bg-accent text-white"
                      : "border border-border bg-white text-navy"
                  }`}
                >
                  {n}
                </span>
                <div
                  className={`min-w-0 flex-1 rounded-2xl border border-border bg-white p-4 ${ELEVATION_HAIRLINE}`}
                >
                  <p className={`${CARD_META_CLASS} font-semibold uppercase tracking-wide text-accent`}>
                    {step.who}
                  </p>
                  <h3 className={`mt-1 ${CARD_TITLE_CLASS}`}>{step.title}</h3>
                  <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
