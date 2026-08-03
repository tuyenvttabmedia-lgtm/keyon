import Link from "next/link";
import {
  FORM_LABEL_CLASS,
  STAT_VALUE_CLASS,
} from "@/storefront/typography";

export function AdminStatCard({
  label,
  value,
  href,
  warn,
  hint,
}: {
  label: string;
  value: string | number;
  href: string;
  warn?: boolean;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      className={`admin-stat-card rounded-2xl border bg-card p-5 ${
        warn ? "admin-stat-card--warn" : "border-border"
      }`}
    >
      <p className={FORM_LABEL_CLASS}>{label}</p>
      <p
        className={`mt-2 tabular-nums ${STAT_VALUE_CLASS} ${
          warn ? "text-amber-700" : ""
        }`}
      >
        {value}
      </p>
      {hint ? (
        <p className="mt-1.5 text-[11px] text-muted-soft">{hint}</p>
      ) : null}
    </Link>
  );
}
