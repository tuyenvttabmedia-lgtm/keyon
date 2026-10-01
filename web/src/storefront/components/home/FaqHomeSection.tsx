import Link from "next/link";
import type { HomeContent } from "@/storefront/content/types";
import { HomeSectionHeading } from "../HomeSectionHeading";
import { BODY_CLASS, CARD_META_CLASS, CARD_TITLE_CLASS, LINK_ACCENT_CLASS } from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";
import { normalizeFaqAnswerText } from "@/lib/normalize-faq-answer";

type FaqHome = NonNullable<HomeContent["faqHome"]>;

const FAQ_NEXT: Record<string, { href: string; label: string }> = {
  "KEYON là gì?": { href: "/about", label: "Về KEYON" },
  "Sau khi thanh toán tôi nhận license ở đâu?": {
    href: "/how-it-works",
    label: "Cách KEYON hoạt động",
  },
  "Bao lâu sau khi thanh toán tôi nhận được license?": {
    href: "/how-it-works",
    label: "Cách nhận bàn giao",
  },
  "License của tôi không hoạt động thì phải làm gì?": {
    href: "/support",
    label: "Trung tâm hỗ trợ",
  },
  "Doanh nghiệp có thể mua license số lượng lớn không?": {
    href: "/contact/quote",
    label: "Yêu cầu báo giá",
  },
  "Tôi có thể gia hạn license trước khi hết hạn không?": {
    href: "/business/subscriptions",
    label: "Subscription và gia hạn",
  },
};

export function FaqHomeSection({ data }: { data: FaqHome }) {
  if (!data.visible || !data.items.length) return null;

  return (
    <section className="bg-[#f8fafc] home-section">
      <div className="home-container">
        <HomeSectionHeading
          title={data.title}
          viewAllHref="/faq"
          viewAllLabel="Xem tất cả FAQ →"
        />
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {data.items.map((item) => {
            const next = FAQ_NEXT[item.question];
            return (
            <li key={item.id}>
              <article
                className={`flex h-full flex-col rounded-2xl border border-border/80 bg-white px-5 py-4 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`}
              >
                <Link
                  href={`/faq?open=${encodeURIComponent(item.id)}`}
                  className={`group ${TRANSITION_UI}`}
                >
                  <p className={`${CARD_TITLE_CLASS} group-hover:text-accent`}>
                    {item.question}
                  </p>
                  <p
                    className={`mt-2 line-clamp-3 whitespace-pre-line ${CARD_META_CLASS} ${BODY_CLASS}`}
                  >
                    {normalizeFaqAnswerText(item.answer)}
                  </p>
                </Link>
                {next ? (
                  <Link href={next.href} className={`mt-3 ${LINK_ACCENT_CLASS}`}>
                    {next.label} →
                  </Link>
                ) : null}
              </article>
            </li>
            );
          })}
        </ul>
        <p className="mt-4 text-center text-sm">
          <Link href="/faq" className="font-medium text-accent hover:underline">
            Xem thêm câu hỏi →
          </Link>
        </p>
      </div>
    </section>
  );
}
