import { prisma } from "@/lib/db";
import { AdminPageHeader } from "../../ui/AdminPageHeader";
import { AgreementCreateForm } from "../agreement-create-form";

export const dynamic = "force-dynamic";

export default async function AdminAgreementNewPage() {
  const orgs = await prisma.organization.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Tạo khung HĐ"
        lead="Header thương mại — chưa thu tiền, chưa thay Order."
        crumbs={[
          { label: "Khung HĐ", href: "/admin/agreements" },
          { label: "Tạo mới" },
        ]}
      />
      <AgreementCreateForm orgs={orgs} />
    </div>
  );
}
