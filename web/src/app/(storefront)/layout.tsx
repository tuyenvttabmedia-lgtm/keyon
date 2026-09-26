import { getStorefrontChrome } from "@/storefront/content/get-storefront-chrome";
import { SiteHeader } from "@/storefront/components/SiteHeader";
import { SiteFooter } from "@/storefront/components/SiteFooter";
import { SiteJsonLd } from "@/storefront/components/seo/SiteJsonLd";

/**
 * Marketing shell — chrome only (no full HomeContent / catalog).
 * Auth chrome loads client-side via /api/auth/me.
 */
export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chrome = await getStorefrontChrome();

  return (
    <>
      <SiteJsonLd />
      <SiteHeader brand={chrome.brand} />
      <main className="flex-1">{children}</main>
      <SiteFooter
        logoUrl={chrome.footer.logoUrl}
        brandName={chrome.footer.brandName}
        blurb={chrome.footer.blurb}
        companyInfo={chrome.footer.companyInfo}
        columns={chrome.footer.columns}
        copyright={chrome.footer.copyright}
        socialLinks={chrome.footer.socialLinks}
        supportEmail={chrome.footer.supportEmail}
        bctVisible={chrome.footer.bctVisible}
        bctHref={chrome.footer.bctHref}
        bctImageUrl={chrome.footer.bctImageUrl}
        bctAlt={chrome.footer.bctAlt}
        dmcaVisible={chrome.footer.dmcaVisible}
        dmcaHref={chrome.footer.dmcaHref}
        dmcaImageUrl={chrome.footer.dmcaImageUrl}
        dmcaAlt={chrome.footer.dmcaAlt}
      />
    </>
  );
}
