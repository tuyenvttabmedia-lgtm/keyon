import Link from "next/link";
import type { HomeContent } from "@/storefront/content/types";
import { HomeSectionHeading } from "../HomeSectionHeading";
import { BODY_CLASS, CARD_META_CLASS, CARD_TITLE_CLASS } from "@/storefront/typography";

type FaqHome = NonNullable<HomeContent["faqHome"]>;

export function FaqHomeSection({ data }: { data: FaqHome }) {
  if (!data.visible || !data.items.length) return null;

  return (
    <section className="bg-[#f8fafc] py-8 md:py-10">
      <div className="home-container">
        <HomeSectionHeading
          title={data.title}
          viewAllHref="/faq"
          viewAllLabel="Xem tất cả FAQ →"
        />
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {data.items.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-border bg-white px-5 py-4"
            >
              <p className={CARD_TITLE_CLASS}>{item.question}</p>
              <p className={`mt-2 line-clamp-3 ${CARD_META_CLASS} ${BODY_CLASS}`}>
                {item.answer}
              </p>
            </li>
          ))}
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
