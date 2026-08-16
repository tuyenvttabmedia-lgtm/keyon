import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { readSession } from "@/lib/auth";
import { AdminPageHeader } from "../../ui/AdminPageHeader";
import { AgreementDetailForms } from "../agreement-detail-forms";

export const dynamic = "force-dynamic";

function ymd(d: Date | null) {
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}

export default async function AdminAgreementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await readSession();
  const [row, orgs] = await Promise.all([
    prisma.commercialAgreement.findUnique({
      where: { id },
      include: {
        organization: { select: { id: true, name: true } },
        orderLinks: {
          orderBy: { createdAt: "desc" },
          include: {
            order: {
              select: {
                id: true,
                code: true,
                email: true,
                status: true,
                totalVnd: true,
              },
            },
          },
        },
      },
    }),
    prisma.organization.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!row) notFound();

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title={row.title}
        lead="Gắn / gỡ Order không đổi trạng thái đơn hay thanh toán."
        crumbs={[
          { label: "Khung HĐ", href: "/admin/agreements" },
          { label: row.title },
        ]}
      />
      <AgreementDetailForms
        agreementId={row.id}
        initialTitle={row.title}
        initialReference={row.reference ?? ""}
        initialOrganizationId={row.organizationId ?? ""}
        initialStatus={row.status}
        initialStartsAt={ymd(row.startsAt)}
        initialEndsAt={ymd(row.endsAt)}
        initialNote={row.note ?? ""}
        orgs={orgs}
        orders={row.orderLinks.map((l) => ({
          orderId: l.order.id,
          code: l.order.code,
          email: l.order.email,
          status: l.order.status,
          totalVnd: l.order.totalVnd,
        }))}
        canDelete={session?.role === "ADMIN"}
      />
    </div>
  );
}
