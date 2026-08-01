import Link from "next/link";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { SupplierForm } from "../supplier-form";

export const dynamic = "force-dynamic";

export default function AdminSupplierNewPage() {
  return (
    <div className="space-y-4">
      <div>
        <Link
          href="/admin/suppliers"
          className="text-sm font-medium text-accent hover:underline"
        >
          ← Nhà cung cấp
        </Link>
        <h1 className={`mt-2 ${ADMIN_PAGE_TITLE_CLASS}`}>Thêm nhà cung cấp</h1>
        <p className="text-sm text-muted">
          Fields tối thiểu theo schema hiện có — credential API ở Cài đặt.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <SupplierForm mode="create" />
      </div>
    </div>
  );
}
