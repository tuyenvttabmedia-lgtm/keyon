import Link from "next/link";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  LINK_ACCENT_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import { ELEVATION_HAIRLINE, TRANSITION_UI } from "@/storefront/effects";
import { FAQ_HREF } from "./shared";

export type SupportFaqItem = {
  id: string;
  question: string;
};

/** Short links into /faq — support is not a second FAQ library. */
export function SupportFAQ({ items }: { items: SupportFaqItem[] }) {
  const links = items.slice(0, 6);

  return (
    <div>
      <header>
        <h2 className={SECTION_TITLE_CLASS}>Câu hay gặp</h2>
        <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
          Mở câu trả lời trên trang FAQ. Tìm thêm bằng ô tìm kiếm phía trên.
        </p>
      </header>

      {links.length === 0 ? (
        <p className={`mt-6 ${BODY_MUTED_CLASS}`}>Chưa có câu hỏi để gợi ý.</p>
      ) : (
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {links.map((item) => (
            <li key={item.id}>
              <Link
                href={`${FAQ_HREF}?open=${encodeURIComponent(item.id)}`}
                className={`flex h-full items-start justify-between gap-3 rounded-xl border border-border bg-white px-4 py-3.5 ${ELEVATION_HAIRLINE} ${TRANSITION_UI} hover:border-accent/40`}
              >
                <span className={CARD_TITLE_CLASS}>{item.question}</span>
                <span className="shrink-0 text-accent" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link href={FAQ_HREF} className={`mt-4 inline-flex ${LINK_ACCENT_CLASS}`}>
        Mở trang FAQ →
      </Link>
    </div>
  );
}
