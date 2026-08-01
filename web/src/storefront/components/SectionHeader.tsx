import { SECTION_LEAD_CLASS, SECTION_TITLE_CLASS } from "@/storefront/typography";

type Props = {
  title: string;
  subtitle?: string;
  className?: string;
};

/** Page/section header — same title token as Home (`SECTION_TITLE_CLASS`). */
export function SectionHeader({ title, subtitle, className = "" }: Props) {
  return (
    <div className={`mb-6 md:mb-8 ${className}`}>
      <h2 className={SECTION_TITLE_CLASS}>{title}</h2>
      {subtitle ? <p className={`mt-2 max-w-2xl ${SECTION_LEAD_CLASS}`}>{subtitle}</p> : null}
    </div>
  );
}
