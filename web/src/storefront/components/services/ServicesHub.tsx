import Link from "next/link";
import { HOVER_LIFT_CARD } from "@/storefront/effects";
import { LANDING_HERO_PAD } from "@/storefront/components/marketing/hero-shell";
import {
  SERVICE_COLUMNS,
  SERVICE_TOPICS,
  type ServiceColumnId,
} from "@/storefront/nav/ia";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  OVERLINE_CLASS,
  PAGE_LEAD_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";

function topicsIn(column: ServiceColumnId) {
  return SERVICE_TOPICS.filter((topic) => topic.column === column);
}

export function ServicesHub() {
  return (
    <div className="bg-background">
      <section className={`border-b border-border ${LANDING_HERO_PAD}`}>
        <div className="home-container">
          <p className={`${OVERLINE_CLASS} text-muted`}>Dịch vụ</p>
          <h1 className={`mt-3 ${PAGE_TITLE_CLASS}`}>Dịch vụ triển khai và quản lý</h1>
          <p className={`mt-4 max-w-2xl ${PAGE_LEAD_CLASS}`}>
            Triển khai, chuyển đổi, quản lý và bảo mật hệ thống cho doanh nghiệp. Phạm vi và thời hạn được chốt trước khi thực hiện.
          </p>
        </div>
      </section>

      <section className="home-container py-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          {SERVICE_COLUMNS.map((column) => (
            <div key={column.id} className="min-w-0">
              <h2 className={SECTION_TITLE_CLASS}>{column.title}</h2>
              <ul className="mt-4 space-y-3">
                {topicsIn(column.id).map((topic) => (
                  <li key={topic.slug}>
                    <Link
                      href={`/services/${topic.slug}`}
                      className={`block rounded-2xl border border-border bg-white p-4 motion-safe:transition-transform ${HOVER_LIFT_CARD}`}
                    >
                      <span className={`block ${CARD_TITLE_CLASS}`}>{topic.label}</span>
                      <span className={`mt-1 block ${BODY_MUTED_CLASS}`}>{topic.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
