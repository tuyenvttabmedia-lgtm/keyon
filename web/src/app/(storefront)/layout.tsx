import { readSession } from "@/lib/auth";
import { getHomeContent } from "@/storefront/content/get-home-content";
import { SiteHeader } from "@/storefront/components/SiteHeader";
import { SiteFooter } from "@/storefront/components/SiteFooter";

export default async function StorefrontLayout({
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
      <main className="flex-1">{children}</main>
      <SiteFooter
        logoUrl={home.footer.logoUrl}
        brandName={home.footer.brandName}
        blurb={home.footer.blurb}
        columns={home.footer.columns}
        copyright={home.footer.copyright}
        legalLinks={home.footer.legalLinks}
        supportEmail={home.footer.supportEmail}
        paymentBadges={home.footer.paymentBadges}
      />
    </>
  );
}
