import Link from "next/link";
import type { HomeContent } from "@/storefront/content/types";
import { HomeSectionHeading } from "../HomeSectionHeading";
import { CARD_TITLE_CLASS, SECTION_LEAD_CLASS } from "@/storefront/typography";
import { TRANSITION_UI } from "@/storefront/effects";

type Partners = HomeContent["partners"];

/** Brand names only. Categories stay in the catalog row below. */
const ECOSYSTEM = [
  { id: "microsoft", label: "Microsoft", href: "/brands/microsoft" },
  { id: "adobe", label: "Adobe", href: "/brands/adobe" },
  { id: "autodesk", label: "Autodesk", href: "/brands/autodesk" },
] as const;

/**
 * Static ecosystem row. Vendor logos are not repeated in a slider.
 */
export function TrustPartnersSection({
  data,
  className = "",
}: {
  data: Partners;
  className?: string;
}) {
  const title = data.title?.trim() || "Hệ sinh thái công nghệ";
  const subtitle =
    data.subtitle?.trim() ||
    "Các nền tảng phần mềm, bảo mật, cloud và hạ tầng KEYON hỗ trợ phân phối và triển khai.";

  return (
    <section className={`bg-white pb-4 pt-3 md:pb-5 md:pt-4 lg:pt-5 ${className}`}>
      <div className="home-container">
        <HomeSectionHeading title={title} variant="centered" className="mb-2" />
        <p className={`mx-auto mb-3 max-w-[46rem] text-center ${SECTION_LEAD_CLASS}`}>
          {subtitle}
        </p>
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
          {ECOSYSTEM.map((item, index) => (
            <span key={item.id} className="inline-flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden="true" className="text-muted">
                  ·
                </span>
              ) : null}
              <Link
                href={item.href}
                className={`${CARD_TITLE_CLASS} ${TRANSITION_UI} hover:text-accent`}
              >
                {item.label}
              </Link>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
