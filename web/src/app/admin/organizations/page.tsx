import Link from "next/link";
import { prisma } from "@/lib/db";
import { AdminPageHeader } from "../ui/AdminPageHeader";
import {
  EMPTY_BODY_CLASS,
  EMPTY_TITLE_CLASS,
  TABLE_CELL_CLASS,
  TABLE_HEADER_CLASS,
} from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminOrganizationsPage() {
  const orgs = await prisma.organization.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { memberships: { where: { status: "ACTIVE" } } },
      },
    },
  });

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Tổ chức"
        lead="Gán tay thành viên ACTIVE và ghim đơn. Không suy từ email domain."
        crumbs={[{ label: "Tổ chức" }]}
        actions={
          <Link
            href="/admin/organizations/new"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            + Tạo tổ chức
          </Link>
        }
      />

      {orgs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <p className={EMPTY_TITLE_CLASS}>Chưa có tổ chức</p>
          <p className={`mt-1 ${EMPTY_BODY_CLASS}`}>
            Tạo org rồi gán tài khoản khách đã có. Không join tự động theo domain.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-[#f8fafc]">
              <tr>
                <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Tên</th>
                <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>MST</th>
                <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Thành viên active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orgs.map((o) => (
                <tr key={o.id} className="hover:bg-[#f8fafc]/60">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/organizations/${o.id}`}
                      className="font-semibold text-navy hover:text-accent"
                    >
                      {o.name}
                    </Link>
                  </td>
                  <td className={`px-4 py-3 ${TABLE_CELL_CLASS}`}>{o.taxId || "—"}</td>
                  <td className={`px-4 py-3 ${TABLE_CELL_CLASS}`}>
                    {o._count.memberships}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
