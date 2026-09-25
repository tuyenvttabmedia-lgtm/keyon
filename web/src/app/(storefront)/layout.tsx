import { readSession } from "@/lib/auth";
import { getHomeContent } from "@/storefront/content/get-home-content";
import { SiteHeader } from "@/storefront/components/SiteHeader";
import { SiteFooter } from "@/storefront/components/SiteFooter";
import { SiteJsonLd } from "@/storefront/components/seo/SiteJsonLd";
import { AnalyticsScripts } from "@/storefront/components/seo/AnalyticsScripts";
import { loadSiteSettings } from "@/server/seo/settings";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, home, settings] = await Promise.all([
    readSession(),
    getHomeContent(),
    loadSiteSettings(),
  ]);
  const isStaff =
    session?.role === "ADMIN" ||
    session?.role === "FULFILLMENT" ||
    session?.role === "CS";

  return (
    <>
      <SiteJsonLd />
      <AnalyticsScripts
        ga4MeasurementId={settings.ga4MeasurementId}
        gtmContainerId={settings.gtmContainerId}
      />
      <SiteHeader
        brand={home.brand}
        sessionEmail={session?.email}
        isStaff={isStaff}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter
        logoUrl={home.footer.logoUrl}
        brandName={home.footer.brandName}
        blurb={home.footer.blurb}
        companyInfo={home.footer.companyInfo}
        columns={home.footer.columns}
        copyright={home.footer.copyright}
        socialLinks={home.footer.socialLinks}
        supportEmail={home.footer.supportEmail}
        bctVisible={home.footer.bctVisible}
        bctHref={home.footer.bctHref}
        bctImageUrl={home.footer.bctImageUrl}
        bctAlt={home.footer.bctAlt}
        dmcaVisible={home.footer.dmcaVisible}
        dmcaHref={home.footer.dmcaHref}
        dmcaImageUrl={home.footer.dmcaImageUrl}
        dmcaAlt={home.footer.dmcaAlt}
      />
    </>
  );
}
