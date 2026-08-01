import Link from "next/link";
import type { ReactNode } from "react";
import { EASE_STANDARD, MOTION_NORMAL } from "@/storefront/effects";

function normalizeLabel(children: ReactNode): ReactNode {
  if (typeof children !== "string") return children;
  return children.replace(/\s*→\s*$/u, "").trim();
}

/** Section header “Xem tất cả” — color + arrow nudge on hover. */
export function SectionViewAllLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-[color,transform,gap] ${MOTION_NORMAL} ${EASE_STANDARD} hover:gap-2.5 hover:text-navy`}
    >
      <span className="underline-offset-[3px] decoration-2 decoration-navy/40 group-hover:underline">
        {normalizeLabel(children)}
      </span>
      <span
        className={`inline-block ${MOTION_NORMAL} transition-transform ${EASE_STANDARD} group-hover:translate-x-1`}
        aria-hidden
      >
        →
      </span>
    </Link>
  );
}
