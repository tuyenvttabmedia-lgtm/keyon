import Link from "next/link";
import type { HomeContent } from "@/storefront/content/types";
import { HomeSectionHeading } from "../HomeSectionHeading";
import { CARD_TITLE_CLASS, SECTION_LEAD_CLASS } from "@/storefront/typography";
import {
  ELEVATION_HAIRLINE,
  HOVER_OUTLINE_FILL,
  TRANSITION_UI,
} from "@/storefront/effects";

type Partners = HomeContent["partners"];

/** Text labels only — do not draw vendor logo lockups or imply a partner badge. */
const ECOSYSTEM = [
  { id: "microsoft", label: "Microsoft", href: "/brands/microsoft" },
  { id: "adobe", label: "Adobe", href: "/brands/adobe" },
  { id: "autodesk", label: "Autodesk", href: "/brands/autodesk" },
  { id: "security", label: "Security", href: "/categories/security" },
  { id: "cloud", label: "Cloud", href: "/categories/cloud" },
  { id: "backup", label: "Backup", href: "/categories/backup" },
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
    <section className={`bg-white pb-5 pt-4 md:pb-6 md:pt-5 lg:pt-6 ${className}`}>
      <div className="home-container">
        <HomeSectionHeading title={title} variant="centered" className="mb-2" />
        <p className={`mx-auto mb-4 max-w-[46rem] text-center ${SECTION_LEAD_CLASS}`}>
          {subtitle}
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-2.5">
          {ECOSYSTEM.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={`inline-flex h-11 items-center rounded-full border border-border bg-white px-4 ${CARD_TITLE_CLASS} ${ELEVATION_HAIRLINE} ${TRANSITION_UI} ${HOVER_OUTLINE_FILL}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
