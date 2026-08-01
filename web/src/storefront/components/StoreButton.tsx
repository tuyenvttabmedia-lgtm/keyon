import Link from "next/link";
import { CTA_LABEL_CLASS } from "@/storefront/typography";
import { ELEVATION_CTA_HOVER, TRANSITION_UI } from "@/storefront/effects";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function StoreButton({
  href,
  children,
  variant = "primary",
  className = "",
}: Props) {
  const base = `inline-flex h-11 items-center justify-center rounded-xl px-5 ${CTA_LABEL_CLASS} ${TRANSITION_UI} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`;
  const styles =
    variant === "primary"
      ? `bg-accent text-white hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`
      : "border border-border bg-card text-navy hover:border-accent hover:text-accent";
  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}
