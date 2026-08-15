import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "../../ui/AdminPageHeader";
import { OrgDetailForms } from "../org-detail-forms";

export const dynamic = "force-dynamic";

export default async function AdminOrganizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const org = await prisma.organization.findUnique({
    where: { id },
    include: {
      memberships: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { id: true, email: true, name: true } } },
      },
    },
  });
  if (!org) notFound();

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title={org.name}
        lead="Membership chưa mở xem đơn/license chung."
        crumbs={[
          { label: "Tổ chức", href: "/admin/organizations" },
          { label: org.name },
        ]}
      />
      <OrgDetailForms
        orgId={org.id}
        initialName={org.name}
        initialTaxId={org.taxId ?? ""}
        initialNote={org.note ?? ""}
        members={org.memberships.map((m) => ({
          id: m.id,
          role: m.role,
          status: m.status,
          userId: m.user.id,
          email: m.user.email,
          name: m.user.name,
        }))}
      />
    </div>
  );
}
