import type { ReactNode } from "react";
import { SECTION_TITLE_CLASS } from "../typography";
import { SectionViewAllLink } from "./SectionViewAllLink";

export { SECTION_TITLE_CLASS } from "../typography";

/** @deprecated Use SECTION_TITLE_CLASS from `@/storefront/typography`. */
export const HOME_SECTION_TITLE_CLASS = SECTION_TITLE_CLASS;

type Props = {
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  /**
   * row: title + optional view-all (default)
   * centered: title alone, centered (e.g. Partners)
   */
  variant?: "row" | "centered";
  /** Vertical align of row items when variant=row. */
  align?: "center" | "end";
  className?: string;
  children?: ReactNode;
};

export function HomeSectionHeading({
  title,
  viewAllHref,
  viewAllLabel,
  variant = "row",
  align = "center",
  className = "",
  children,
}: Props) {
  if (variant === "centered") {
    return (
      <div className={`mb-4 ${className}`}>
        <h2 className={`${SECTION_TITLE_CLASS} text-center`}>{title}</h2>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`mb-4 flex flex-wrap gap-2 ${
        align === "end" ? "items-end justify-between" : "items-center justify-between"
      } ${className}`}
    >
      <h2 className={SECTION_TITLE_CLASS}>{title}</h2>
      {viewAllHref && viewAllLabel ? (
        <SectionViewAllLink href={viewAllHref}>{viewAllLabel}</SectionViewAllLink>
      ) : null}
      {children}
    </div>
  );
}
