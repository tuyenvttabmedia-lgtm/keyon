import Link from "next/link";
import { prisma } from "@/lib/db";
import type { AdminSupplierListRow } from "@/lib/admin-suppliers";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { SuppliersConsole } from "./suppliers-console";

export const dynamic = "force-dynamic";

export default async function AdminSuppliersPage() {
  const [suppliers, waitingJobs] = await Promise.all([
    prisma.supplier.findMany({
      orderBy: [{ active: "desc" }, { name: "asc" }],
      include: { _count: { select: { variants: true } } },
    }),
    prisma.fulfillmentJob.findMany({
      where: { status: "WAITING_HUMAN" },
      select: {
        orderItem: {
          select: {
            variant: { select: { supplierId: true } },
          },
        },
      },
    }),
  ]);

  const waitingBySupplier = new Map<string, number>();
  for (const job of waitingJobs) {
    const sid = job.orderItem?.variant?.supplierId;
    if (!sid) continue;
    waitingBySupplier.set(sid, (waitingBySupplier.get(sid) ?? 0) + 1);
  }

  const rows: AdminSupplierListRow[] = suppliers.map((s) => ({
    id: s.id,
    name: s.name,
    supplierType: s.supplierType,
    integrationMode: s.integrationMode,
    active: s.active,
    contactName: s.contactName,
    contactEmail: s.contactEmail,
    website: s.website,
    notes: s.notes,
    skuCount: s._count.variants,
    waitingHumanCount: waitingBySupplier.get(s.id) ?? 0,
  }));

  const summary = {
    total: rows.length,
    api: rows.filter((r) => r.integrationMode === "API").length,
    manual: rows.filter((r) => r.integrationMode === "MANUAL_OPS").length,
    needsAction: waitingJobs.length,
    inactive: rows.filter((r) => !r.active).length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className={ADMIN_PAGE_TITLE_CLASS}>Nhà cung cấp</h1>
          <p className="text-sm text-muted">
            Quản lý nguồn cung và phương thức xử lý đơn hàng
          </p>
        </div>
        <Link
          href="/admin/suppliers/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          + Thêm nhà cung cấp
        </Link>
      </div>

      <SuppliersConsole rows={rows} summary={summary} />
    </div>
  );
}
