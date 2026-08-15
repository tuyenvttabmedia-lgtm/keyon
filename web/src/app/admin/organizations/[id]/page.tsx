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
      orderLinks: {
        orderBy: { createdAt: "desc" },
        include: {
          order: {
            select: { id: true, code: true, email: true, status: true },
          },
        },
      },
    },
  });
  if (!org) notFound();

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title={org.name}
        lead="Thành viên ACTIVE xem đơn đồng nghiệp và đơn staff ghim. Ghim không đổi trạng thái đơn."
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
        pinnedOrders={org.orderLinks.map((l) => ({
          orderId: l.order.id,
          code: l.order.code,
          email: l.order.email,
          status: l.order.status,
        }))}
      />
    </div>
  );
}
