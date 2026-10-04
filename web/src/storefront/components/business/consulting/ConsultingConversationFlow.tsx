import {
  BADGE_CLASS,
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
    body: "Bạn chia sẻ sản phẩm đang quan tâm, số lượng người dùng và mục đích sử dụng.",
  },
  {
    who: "KEYON",
    title: "Làm rõ yêu cầu",
    body: "KEYON xác định quy mô, tính năng cần thiết và hình thức cấp phép phù hợp.",
  },
  {
    who: "KEYON",
    title: "So sánh lựa chọn",
    body: "Giải thích các phương án phù hợp để bạn dễ dàng so sánh.",
  },
  {
    who: "Bạn + KEYON",
    title: "Chọn phương án",
    body: "Cùng thống nhất lựa chọn trước khi mua.",
  },
  {
    who: "KEYON",
    title: "Hỗ trợ sau khi chọn",
    body: "Hỗ trợ đặt mua, kích hoạt và các bước tiếp theo theo từng sản phẩm.",
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
            Từ lúc xác định nhu cầu đến khi chọn được sản phẩm — KEYON đồng hành trong từng bước.
          </p>
        </header>

        <ol className="mt-8 grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3.5 md:mt-9 lg:grid-cols-5">
          {STEPS.map((step, i) => {
            const n = String(i + 1).padStart(2, "0");
            const keyonSide = step.who.startsWith("KEYON") && !step.who.includes("Bạn");
            return (
              <li
                key={step.title}
                className={`min-w-0 ${i === STEPS.length - 1 ? "col-span-2 lg:col-span-1" : ""}`}
              >
                <article
                  className={`flex h-full min-w-0 flex-col overflow-hidden p-3.5 sm:p-4 ${SURFACE} ${ELEVATION_HAIRLINE}`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${BADGE_CLASS} ${
                        keyonSide
                          ? "bg-accent text-white"
                          : "border border-border bg-white text-navy"
                      }`}
                    >
                      {n}
                    </span>
                    <h3 className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{step.title}</h3>
                  </span>
                  <p
                    className={`mt-2 ${CARD_META_CLASS} font-semibold uppercase tracking-wide text-accent`}
                  >
                    {step.who}
                  </p>
                  <p className={`mt-1 break-words ${BODY_MUTED_CLASS}`}>{step.body}</p>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
