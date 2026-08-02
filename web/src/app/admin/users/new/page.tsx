import Link from "next/link";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { UserForm } from "../user-form";

export const dynamic = "force-dynamic";

export default async function AdminUsersNewPage() {
  const session = await readSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/users");
  }

  return (
    <div className="space-y-4">
      <div>
        <Link
          href="/admin/users"
          className="text-sm font-medium text-accent hover:underline"
        >
          ← Người dùng
        </Link>
        <h1 className={`mt-2 ${ADMIN_PAGE_TITLE_CLASS}`}>Thêm nhân viên</h1>
        <p className="text-sm text-muted">
          Tạo tài khoản nội bộ — nhân viên tự đặt mật khẩu qua email
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <UserForm mode="create" />
      </div>
    </div>
  );
}
