import Link from "next/link";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { AuthCard, AuthOrDivider } from "@/storefront/components/auth/AuthCard";
import { AuthSplitShell } from "@/storefront/components/auth/AuthSplitShell";
import {
  BODY_MUTED_CLASS,
  LINK_ACCENT_CLASS,
} from "@/storefront/typography";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await readSession();
  if (session) redirect(session.role === "CUSTOMER" ? "/account" : "/admin");

  return (
    <AuthSplitShell headline="Quản lý giấy phép trong Tài khoản KEYON">
      <AuthCard
        title="Đăng nhập"
        footer={
          <>
            <AuthOrDivider />
            <p className={`text-center ${BODY_MUTED_CLASS}`}>
              Chưa có tài khoản?{" "}
              <Link href="/register" className={LINK_ACCENT_CLASS}>
                Đăng ký
              </Link>
            </p>
          </>
        }
      >
        <LoginForm />
      </AuthCard>
    </AuthSplitShell>
  );
}
