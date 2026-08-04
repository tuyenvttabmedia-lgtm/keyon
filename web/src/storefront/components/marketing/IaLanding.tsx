import Link from "next/link";
import type { IaPage } from "@/storefront/nav/ia-pages";

export function IaLandingPage({
  page,
  hubLabel,
  hubHref,
}: {
  page: IaPage;
  hubLabel: string;
  hubHref: string;
}) {
  return (
    <div className="bg-[var(--background)]">
      <section className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            <Link href={hubHref} className="hover:text-[var(--foreground)]">
              {hubLabel}
            </Link>
            {page.kicker ? ` · ${page.kicker}` : null}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {page.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            {page.subtitle}
          </p>
          {page.draftCapable ? (
            <p className="mt-3 text-sm text-amber-800/90 dark:text-amber-200/90">
              Một phần nội dung / catalog đang mở rộng — ưu tiên tư vấn trước khi mua nếu chưa thấy SKU phù hợp.
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            {page.primaryCta ? (
              <Link
                href={page.primaryCta.href}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-foreground)]"
              >
                {page.primaryCta.label}
              </Link>
            ) : null}
            {page.secondaryCta ? (
              <Link
                href={page.secondaryCta.href}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-semibold text-[var(--foreground)]"
              >
                {page.secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {page.bullets && page.bullets.length > 0 ? (
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-xl font-semibold text-[var(--foreground)]">Bạn nhận được gì</h2>
          <ul className="mt-5 space-y-3">
            {page.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-sm leading-relaxed text-[var(--muted)]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {page.related && page.related.length > 0 ? (
        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">Liên quan</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {page.related.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)]"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function ResourceStub({
  title,
  subtitle,
  note,
  primary,
}: {
  title: string;
  subtitle: string;
  note?: string;
  primary: { label: string; href: string };
}) {
  return (
    <div className="bg-[var(--background)]">
      <section className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            <Link href="/resources" className="hover:text-[var(--foreground)]">
              Tài nguyên
            </Link>
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            {subtitle}
          </p>
          {note ? <p className="mt-3 text-sm text-[var(--muted)]">{note}</p> : null}
          <div className="mt-8">
            <Link
              href={primary.href}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-foreground)]"
            >
              {primary.label}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export function IaHubPage({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: { label: string; href: string; description?: string }[];
}) {
  return (
    <div className="bg-[var(--background)]">
      <section className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">{subtitle}</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)] hover:shadow-sm"
              >
                <span className="font-display text-lg font-semibold text-[var(--foreground)]">{item.label}</span>
                {item.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.description}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
