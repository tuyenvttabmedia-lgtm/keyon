import Link from "next/link";
import type { ReactNode } from "react";
import {
  ADMIN_PAGE_TITLE_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  SECTION_LEAD_CLASS,
} from "@/storefront/typography";
import { HOVER_LINK_ACCENT } from "@/storefront/effects";

export type AdminCrumb = { label: string; href?: string };

export function AdminPageHeader({
  title,
  lead,
  crumbs,
  actions,
}: {
  title: string;
  lead?: string;
  crumbs?: AdminCrumb[];
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-1.5">
        {crumbs && crumbs.length > 0 ? (
          <nav className={`flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
            <Link href="/admin" className={HOVER_LINK_ACCENT}>
              Admin
            </Link>
            {crumbs.map((c) => (
              <span key={c.label} className="contents">
                <span aria-hidden>›</span>
                {c.href ? (
                  <Link href={c.href} className={HOVER_LINK_ACCENT}>
                    {c.label}
                  </Link>
                ) : (
                  <span className={BREADCRUMB_CURRENT_CLASS}>{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>{title}</h1>
        {lead ? <p className={SECTION_LEAD_CLASS}>{lead}</p> : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
