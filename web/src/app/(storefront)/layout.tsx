import { getHomeContent } from "@/storefront/content/get-home-content";
import { SiteHeader } from "@/storefront/components/SiteHeader";
import { SiteFooter } from "@/storefront/components/SiteFooter";
import { SiteJsonLd } from "@/storefront/components/seo/SiteJsonLd";

/**
 * Marketing shell — no cookies()/readSession here so pages can use ISR.
 * Auth chrome loads client-side via /api/auth/me.
 */
export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const home = await getHomeContent();

  return (
    <>
      <SiteJsonLd />
      <SiteHeader brand={home.brand} />
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
