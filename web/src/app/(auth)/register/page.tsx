import Link from "next/link";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { AuthCard, AuthOrDivider } from "@/storefront/components/auth/AuthCard";
import { AuthSplitShell } from "@/storefront/components/auth/AuthSplitShell";
import {
  BODY_MUTED_CLASS,
  LINK_ACCENT_CLASS,
} from "@/storefront/typography";
import { RegisterForm } from "./register-form";

const REGISTER_FEATURES = [
  {
    title: "Hồ sơ dùng lại",
    detail: "Họ tên, SĐT, địa chỉ — hỗ trợ đơn nhanh hơn.",
  },
  {
    title: "Bảo mật sẵn sàng",
    detail: "Mật khẩu riêng; đổi sau trong mục Bảo mật.",
  },
  {
    title: "License & đơn một nơi",
    detail: "Key/license và trạng thái đơn trong Tài khoản.",
  },
];

export default async function RegisterPage() {
  const session = await readSession();
  if (session) redirect("/account");

  return (
    <AuthSplitShell
      headline="Tạo Tài khoản KEYON"
      subtext="Điền một lần — giao license, hỗ trợ và theo dõi đơn."
      features={REGISTER_FEATURES}
    >
      <AuthCard
        title="Tạo tài khoản"
        subtitle="Các trường khớp với Thông tin tài khoản"
        footer={
          <>
            <AuthOrDivider />
            <p className={`text-center ${BODY_MUTED_CLASS}`}>
              Đã có tài khoản?{" "}
              <Link href="/login" className={LINK_ACCENT_CLASS}>
                Đăng nhập
              </Link>
            </p>
          </>
        }
      >
        <RegisterForm />
      </AuthCard>
    </AuthSplitShell>
  );
}
