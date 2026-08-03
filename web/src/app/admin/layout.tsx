import { redirect } from "next/navigation";
import { isStaff, readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { roleRequiresTotp } from "@/server/auth/sessions";
import { AdminSidebar } from "./AdminSidebar";
import { AdminPathGuard } from "./admin-path-guard";
import { AdminPaymentStubBanner } from "./admin-payment-stub-banner";

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
    <div className="flex min-h-screen flex-col bg-[#f5f7fa] md:flex-row">
      <AdminPathGuard role={session.role} />
      <AdminSidebar email={session.email} role={session.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminPaymentStubBanner />
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 md:px-6">
          <p className="text-sm text-muted">Vận hành KEYON</p>
          <p className="text-sm font-medium text-navy md:hidden">{session.email}</p>
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
