import Link from "next/link";
import type { HomeContent } from "@/storefront/content/types";
import { HomeSectionHeading } from "../HomeSectionHeading";
import { BODY_CLASS, CARD_META_CLASS, CARD_TITLE_CLASS } from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";

type FaqHome = NonNullable<HomeContent["faqHome"]>;

export function FaqHomeSection({ data }: { data: FaqHome }) {
  if (!data.visible || !data.items.length) return null;

  return (
    <section className="bg-[#f8fafc] py-8 md:py-10">
      <div className="home-container">
        <HomeSectionHeading
          title={data.title}
          viewAllHref="/support"
          viewAllLabel="Xem tất cả FAQ →"
        />
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {data.items.map((item) => (
            <li key={item.id}>
              <Link
                href="/support"
                className={`group block h-full rounded-2xl border border-border/80 bg-white px-5 py-4 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`}
              >
                <p
                  className={`${CARD_TITLE_CLASS} ${TRANSITION_UI} group-hover:text-accent`}
                >
                  {item.question}
                </p>
                <p className={`mt-2 line-clamp-3 ${CARD_META_CLASS} ${BODY_CLASS}`}>
                  {item.answer}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-sm">
          <Link href="/support" className="font-medium text-accent hover:underline">
            Xem thêm câu hỏi →
          </Link>
        </p>
      </div>
    </section>
  );
}
