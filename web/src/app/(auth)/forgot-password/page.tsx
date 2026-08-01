import Link from "next/link";
import { AuthCard, AuthOrDivider } from "@/storefront/components/auth/AuthCard";
import { AuthSplitShell } from "@/storefront/components/auth/AuthSplitShell";
import { LINK_ACCENT_CLASS } from "@/storefront/typography";
import { ForgotPasswordForm } from "./forgot-form";

export default function ForgotPasswordPage() {
  return (
    <AuthSplitShell headline="Quản lý giấy phép trong Tài khoản KEYON">
      <AuthCard
        title="Quên mật khẩu"
        subtitle="Nhập email đã đăng ký — chúng tôi gửi link đặt lại."
        footer={
          <>
            <AuthOrDivider />
            <p className="text-center">
              <Link href="/login" className={LINK_ACCENT_CLASS}>
                Quay lại đăng nhập
              </Link>
            </p>
          </>
        }
      >
        <ForgotPasswordForm />
      </AuthCard>
    </AuthSplitShell>
  );
}
