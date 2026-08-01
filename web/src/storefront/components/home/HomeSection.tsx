import type { ReactNode } from "react";
import Link from "next/link";
import {
  LINK_ACCENT_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";

type Props = {
  id?: string;
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
  children: ReactNode;
  className?: string;
};

/**
 * home-v5 section shell — container 1120 only for width.
 * Inner: left intro (~260) + right content. Do NOT put flex on .home-container.
 */
export function HomeSection({
  id,
  title,
  subtitle,
  actionHref,
  actionLabel,
  children,
  className = "",
}: Props) {
  return (
    <section id={id} className={`bg-white ${className}`}>
      <div className="home-container">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
          <div className="w-full shrink-0 lg:w-[260px]">
            <h2 className={SECTION_TITLE_CLASS}>{title}</h2>
            {subtitle ? (
              <p className={`mt-3 ${SECTION_LEAD_CLASS}`}>{subtitle}</p>
            ) : null}
            {actionHref && actionLabel ? (
              <Link
                href={actionHref}
                className={`mt-5 inline-flex ${LINK_ACCENT_CLASS}`}
              >
                {actionLabel} →
              </Link>
            ) : null}
          </div>
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </section>
  );
}
