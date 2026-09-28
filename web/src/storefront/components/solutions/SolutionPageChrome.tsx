import Link from "next/link";
import { LANDING_CRUMB_GAP } from "@/storefront/components/marketing/hero-shell";
import { BREADCRUMB_CLASS, OVERLINE_CLASS } from "@/storefront/typography";

type Crumb = { label: string; href?: string };

type Props = {
  /** Optional overline under breadcrumb — omit to avoid duplicating hub label. */
  kicker?: string | null;
  crumbs?: Crumb[];
};

/** Light shared chrome for Solutions landings (breadcrumb + optional overline). */
export function SolutionPageChrome({
  kicker = null,
  crumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Giải pháp", href: "/solutions" },
  ],
}: Props) {
  return (
    <div className={`${LANDING_CRUMB_GAP}${kicker ? " space-y-1" : ""}`}>
      <nav aria-label="Breadcrumb" className={BREADCRUMB_CLASS}>
        {crumbs.map((c, i) => (
          <span key={`${c.label}-${i}`}>
            {i > 0 ? <span className="mx-1.5 text-muted/50">/</span> : null}
            {c.href ? (
              <Link href={c.href} className="hover:text-accent">
                {c.label}
              </Link>
            ) : (
              <span className="text-navy">{c.label}</span>
            )}
          </span>
        ))}
      </nav>
      {kicker ? <p className={`${OVERLINE_CLASS} text-accent`}>{kicker}</p> : null}
    </div>
  );
}
