import Link from "next/link";
import { BREADCRUMB_CLASS, OVERLINE_CLASS } from "@/storefront/typography";

type Crumb = { label: string; href?: string };

type Props = {
  kicker?: string;
  crumbs?: Crumb[];
};

/** Light shared chrome for Solutions landings (breadcrumb + optional overline). */
export function SolutionPageChrome({
  kicker = "Giải pháp",
  crumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Giải pháp", href: "/solutions" },
  ],
}: Props) {
  return (
    <div className="mb-4 space-y-2">
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
