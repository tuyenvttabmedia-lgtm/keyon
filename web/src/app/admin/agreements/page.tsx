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

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Nháp",
  ACTIVE: "Hiệu lực",
  CLOSED: "Đóng",
};

export default async function AdminAgreementsPage() {
  const rows = await prisma.commercialAgreement.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      organization: { select: { name: true } },
      _count: { select: { orderLinks: true } },
    },
  });

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Khung HĐ"
        lead="Một khung gắn nhiều Order. Xóa khung ở trang chi tiết — không xóa đơn, không thanh toán trên HĐ."
        crumbs={[{ label: "Khung HĐ" }]}
        actions={
          <Link
            href="/admin/agreements/new"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            + Tạo khung
          </Link>
        }
      />

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <p className={EMPTY_TITLE_CLASS}>Chưa có khung HĐ</p>
          <p className={`mt-1 ${EMPTY_BODY_CLASS}`}>
            Dùng khi một PO/HĐ khung phủ nhiều đơn. Số HĐ trên từng đơn vẫn ghi ở Notes.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-[#f8fafc]">
              <tr>
                <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Khung</th>
                <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Số HĐ</th>
                <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Tổ chức</th>
                <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Trạng thái khung</th>
                <th className={`px-4 py-3 ${TABLE_HEADER_CLASS}`}>Số đơn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-[#f8fafc]/60">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/agreements/${r.id}`}
                      className="font-semibold text-navy hover:text-accent"
                    >
                      {r.title}
                    </Link>
                  </td>
                  <td className={`px-4 py-3 ${TABLE_CELL_CLASS}`}>{r.reference || "—"}</td>
                  <td className={`px-4 py-3 ${TABLE_CELL_CLASS}`}>
                    {r.organization?.name || "—"}
                  </td>
                  <td className={`px-4 py-3 ${TABLE_CELL_CLASS}`}>
                    {STATUS_LABEL[r.status] ?? r.status}
                  </td>
                  <td className={`px-4 py-3 ${TABLE_CELL_CLASS}`}>{r._count.orderLinks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
