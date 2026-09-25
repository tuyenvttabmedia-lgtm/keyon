import type { Metadata } from "next";
import { readSession } from "@/lib/auth";
import { getHomeContent } from "@/storefront/content/get-home-content";
import { SiteHeader } from "@/storefront/components/SiteHeader";
import { SiteFooter } from "@/storefront/components/SiteFooter";
import { noindexMetadata } from "@/server/seo/noindex";

export const metadata: Metadata = noindexMetadata("Xác thực");

/** Same shell as Home: header + navy footer. Auth pages own the split body. */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await readSession();
  const home = await getHomeContent();
  const isStaff =
    session?.role === "ADMIN" ||
    session?.role === "FULFILLMENT" ||
    session?.role === "CS";

  return (
    <>
      <SiteHeader
        navItems={home.navigation}
        brand={home.brand}
        sessionEmail={session?.email}
        isStaff={isStaff}
      />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
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
