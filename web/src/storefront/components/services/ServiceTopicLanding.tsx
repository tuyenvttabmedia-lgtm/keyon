import Link from "next/link";
import { ELEVATION_CTA_HOVER, HOVER_LIFT_CARD } from "@/storefront/effects";
import { SERVICE_TOPICS, type ServiceTopic } from "@/storefront/nav/ia";
import {
  BODY_CLASS,
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  OVERLINE_CLASS,
  PAGE_LEAD_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";

export function ServiceTopicLanding({ topic }: { topic: ServiceTopic }) {
  const related = SERVICE_TOPICS.filter(
    (item) => item.column === topic.column && item.slug !== topic.slug,
  );

  return (
    <div className="bg-background">
      <section className="border-b border-border pb-8 pt-5 md:pb-10 md:pt-8">
        <div className="home-container">
          <p className={`${OVERLINE_CLASS} text-muted`}>
            <Link href="/dich-vu" className="hover:text-navy">
              Dịch vụ
            </Link>
          </p>
          <h1 className={`mt-3 max-w-3xl ${PAGE_TITLE_CLASS}`}>{topic.label}</h1>
          <p className={`mt-4 max-w-2xl ${PAGE_LEAD_CLASS}`}>{topic.description}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact/quote"
              className={`inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 text-white ${CTA_LABEL_CLASS} ${ELEVATION_CTA_HOVER}`}
            >
              Nhận tư vấn dịch vụ
            </Link>
            <Link
              href="/dich-vu"
              className={`inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-navy ${CTA_LABEL_CLASS}`}
            >
              Tất cả dịch vụ
            </Link>
          </div>
        </div>
      </section>

      <section className="home-container py-8 md:py-10">
        <h2 className={SECTION_TITLE_CLASS}>Phạm vi thực hiện</h2>
        <ul className="mt-4 max-w-2xl space-y-3">
          {topic.bullets.map((bullet) => (
            <li key={bullet} className={`flex gap-3 ${BODY_CLASS}`}>
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-border">
          <div className="home-container py-8 md:py-10">
            <h2 className={SECTION_TITLE_CLASS}>Dịch vụ cùng nhóm</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/dich-vu/${item.slug}`}
                    className={`block rounded-2xl border border-border bg-white p-4 motion-safe:transition-transform ${HOVER_LIFT_CARD}`}
                  >
                    <span className={`block ${CARD_TITLE_CLASS}`}>{item.label}</span>
                    <span className={`mt-1 block ${BODY_MUTED_CLASS}`}>{item.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
