import type { ReactNode } from "react";
import {
  CARD_META_CLASS,
  CTA_LABEL_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
} from "@/storefront/typography";
import { CTA_PRIMARY_EFFECT } from "@/storefront/effects";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

/**
 * Form block on the right pane.
 * No nested logo/card chrome — SiteHeader carries brand; pane is already the frame.
 */
export function AuthCard({ title, subtitle, children, footer }: Props) {
  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-7 text-center">
        <h1 className={PAGE_TITLE_CLASS}>{title}</h1>
        {subtitle ? (
          <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>{subtitle}</p>
        ) : null}
      </div>
      {children}
      {footer ? <div className="mt-6">{footer}</div> : null}
    </div>
  );
}

export function AuthOrDivider() {
  return (
    <div className={`my-6 flex items-center gap-3 ${CARD_META_CLASS}`}>
      <span className="h-px flex-1 bg-border" />
      hoặc
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export function AuthSubmitButton({
  loading,
  children,
  loadingLabel,
}: {
  loading: boolean;
  children: ReactNode;
  loadingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`mt-1 inline-flex h-11 w-full items-center justify-center rounded-lg bg-accent text-white ${CTA_PRIMARY_EFFECT} hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 ${CTA_LABEL_CLASS}`}
    >
      {loading ? loadingLabel : children}
    </button>
  );
}
