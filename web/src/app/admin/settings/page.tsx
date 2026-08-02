import Link from "next/link";
import { getStorageSettingsPublic } from "@/server/storage/config";
import { getPaymentSettingsPublic } from "@/server/payment/config";
import { getSupplierApiSettingsPublic } from "@/server/supplier/config";
import { getMailSettingsPublic } from "@/server/mail/config";
import {
  buildSettingsStatus,
  parseSettingsTab,
} from "@/lib/admin-settings";
import { loadSiteSettings } from "@/server/seo/settings";
import {
  allowSearchIndexing,
  getSiteHostname,
  getSiteOrigin,
} from "@/server/seo/site-url";
import { SettingsForm } from "./settings-form";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

const toneClass: Record<string, string> = {
  ok: "text-emerald-700",
  warn: "text-amber-800",
  bad: "text-red-700",
  neutral: "text-navy",
};

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const sp = await searchParams;
  const initialTab = parseSettingsTab(sp.tab);

  const [settings, storage, payment, supplierApi, mail] = await Promise.all([
    loadSiteSettings(),
    getStorageSettingsPublic(),
    getPaymentSettingsPublic(),
    getSupplierApiSettingsPublic(),
    getMailSettingsPublic(),
  ]);

  const statusCards = buildSettingsStatus({
    siteName: settings.siteName,
    mail,
    payment,
    storage,
    supplierApi,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className={ADMIN_PAGE_TITLE_CLASS}>Cài đặt</h1>
          <p className="text-sm text-muted">
            Hệ thống · SEO · Email · SePay · NCC API · Storage
          </p>
        </div>
        <Link
          href="/admin/monitoring"
          className="text-sm font-medium text-accent hover:underline"
        >
          Xem Monitoring →
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {statusCards.map((c) => (
          <Link
            key={c.label}
            href={`/admin/settings?tab=${c.tab}`}
            className="rounded-xl border border-border bg-card px-4 py-3 transition hover:border-accent"
          >
            <p className="text-xs text-muted">{c.label}</p>
            <p
              className={`mt-1 truncate text-lg font-bold ${toneClass[c.tone]}`}
            >
              {c.value}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted">{c.hint}</p>
          </Link>
        ))}
      </div>

      <SettingsForm
        initial={settings}
        initialStorage={storage}
        initialPayment={payment}
        initialSupplierApi={supplierApi}
        initialMail={mail}
        initialTab={initialTab}
        siteOrigin={getSiteOrigin()}
        siteHostname={getSiteHostname()}
        indexingAllowed={allowSearchIndexing()}
      />
    </div>
  );
}
