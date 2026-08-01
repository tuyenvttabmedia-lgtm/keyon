import Link from "next/link";
import { notFound } from "next/navigation";
import { loadCustomerWorkspace } from "@/server/admin/customer-detail";
import { CustomerWorkspace } from "../customer-workspace";
import { LINK_ACCENT_CLASS, SECTION_LEAD_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await loadCustomerWorkspace(id);
  if (!data) notFound();

  return (
    <div className="space-y-3">
      <div>
        <Link href="/admin/customers" className={LINK_ACCENT_CLASS}>
          ← Khách hàng
        </Link>
        <p className={`mt-1 ${SECTION_LEAD_CLASS}`}>Customer Workspace</p>
      </div>
      <CustomerWorkspace data={data} />
    </div>
  );
}
