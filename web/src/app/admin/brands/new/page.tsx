import Link from "next/link";
import { prisma } from "@/lib/db";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { BrandForm } from "../brand-form";

export const dynamic = "force-dynamic";

export default async function AdminBrandNewPage() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-4">
      <div>
        <Link
          href="/admin/brands"
          className="text-sm font-medium text-accent hover:underline"
        >
          ← Thương hiệu
        </Link>
        <h1 className={`${ADMIN_PAGE_TITLE_CLASS} mt-2`}>Tạo brand</h1>
        <p className="text-sm text-muted">Tên · slug · default provider</p>
      </div>
      <BrandForm mode="create" suppliers={suppliers} />
    </div>
  );
}
