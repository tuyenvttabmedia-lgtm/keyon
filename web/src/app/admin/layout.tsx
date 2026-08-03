import { redirect } from "next/navigation";
import { isStaff, readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { roleRequiresTotp } from "@/server/auth/sessions";
import { AdminChrome } from "./AdminChrome";
import { AdminPathGuard } from "./admin-path-guard";
import { AdminPaymentStubBanner } from "./admin-payment-stub-banner";
import "./admin.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await readSession();
  if (!session || !isStaff(session.role)) redirect("/login");

  if (roleRequiresTotp(session.role)) {
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { totpEnabledAt: true },
    });
    if (!user?.totpEnabledAt) {
      redirect("/account/security?reason=admin_2fa");
    }
  }

  return (
    <>
      <AdminPathGuard role={session.role} />
      <AdminChrome
        email={session.email}
        role={session.role}
        banner={<AdminPaymentStubBanner />}
      >
        {children}
      </AdminChrome>
    </>
  );
}
