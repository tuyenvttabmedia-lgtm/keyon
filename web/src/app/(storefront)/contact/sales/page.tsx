import type { Metadata } from "next";
import Link from "next/link";
import { buildMainPageMetadata } from "@/server/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...(await buildMainPageMetadata("/contact/sales")),
    title: "Liên hệ kinh doanh | KEYON",
    description: "Tư vấn bản quyền doanh nghiệp, volume licensing và báo giá KEYON.",
  };
}

export default function ContactSalesPage() {
  return (
    <div className="bg-[var(--background)]">
      <section className="border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Doanh nghiệp
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Liên hệ kinh doanh
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            Volume licensing, subscription, tư vấn chọn gói Office / Windows / Security — đội ngũ KEYON hỗ trợ báo giá và triển khai.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-foreground)]"
            >
              Mở form liên hệ
            </Link>
            <a
              href="mailto:support@keyon.vn?subject=KEYON%20-%20Tu%20van%20doanh%20nghiep"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-semibold text-[var(--foreground)]"
            >
              Email support@keyon.vn
            </a>
          </div>
          <ul className="mt-10 space-y-2 text-sm text-[var(--muted)]">
            <li>
              <Link href="/business/volume-licensing" className="text-[var(--foreground)] underline-offset-4 hover:underline">
                Mua bản quyền số lượng lớn
              </Link>
            </li>
            <li>
              <Link href="/business/licensing-consulting" className="text-[var(--foreground)] underline-offset-4 hover:underline">
                Tư vấn bản quyền
              </Link>
            </li>
            <li>
              <Link href="/solutions/license-management" className="text-[var(--foreground)] underline-offset-4 hover:underline">
                Quản lý bản quyền
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
