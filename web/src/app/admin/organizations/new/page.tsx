import Link from "next/link";
import { AdminPageHeader } from "../../ui/AdminPageHeader";
import { OrgCreateForm } from "../org-create-form";

export const dynamic = "force-dynamic";

export default async function AdminOrganizationNewPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Tạo tổ chức"
        lead="Không suy org từ domain. Thành viên phải là tài khoản khách đã tồn tại."
        crumbs={[
          { label: "Tổ chức", href: "/admin/organizations" },
          { label: "Tạo mới" },
        ]}
      />
      <Link href="/admin/organizations" className="text-sm font-medium text-accent hover:underline">
        ← Danh sách
      </Link>
      <OrgCreateForm defaultMemberEmail={sp.email?.trim() || undefined} />
    </div>
  );
}
