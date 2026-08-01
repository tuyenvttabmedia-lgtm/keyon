import { readSession } from "@/lib/auth";
import { getHomeContent } from "@/storefront/content/get-home-content";
import { SiteHeader } from "@/storefront/components/SiteHeader";
import { SiteFooter } from "@/storefront/components/SiteFooter";

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
        sessionEmail={session?.email}
        isStaff={isStaff}
      />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <SiteFooter
        blurb={home.footer.blurb}
        columns={home.footer.columns}
        copyright={home.footer.copyright}
        legalLinks={home.footer.legalLinks}
      />
    </>
  );
}
