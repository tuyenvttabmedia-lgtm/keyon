"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  AuthCard,
  AuthOrDivider,
  AuthSubmitButton,
} from "@/storefront/components/auth/AuthCard";
import { AuthSplitShell } from "@/storefront/components/auth/AuthSplitShell";
import {
  AuthField,
  IconEye,
  IconLock,
} from "@/storefront/components/auth/AuthField";
import {
  BODY_MUTED_CLASS,
  FORM_ERROR_CLASS,
  LINK_ACCENT_CLASS,
} from "@/storefront/typography";

function ResetForm() {
  const router = useRouter();
  const search = useSearchParams();
  const token = search.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (!token) {
      setError("Thiếu token đặt lại mật khẩu");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Không đặt lại được");
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AuthField
        label="Mật khẩu mới"
        type={showPw ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Nhập mật khẩu mới"
        required
        minLength={8}
        autoComplete="new-password"
        leftIcon={<IconLock />}
        rightSlot={
          <button
            type="button"
            className="rounded p-1 text-muted hover:text-navy"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            <IconEye off={showPw} />
          </button>
        }
      />
      <AuthField
        label="Xác nhận mật khẩu"
        type={showConfirm ? "text" : "password"}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Nhập lại mật khẩu mới"
        required
        minLength={8}
        autoComplete="new-password"
        leftIcon={<IconLock />}
        rightSlot={
          <button
            type="button"
            className="rounded p-1 text-muted hover:text-navy"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            <IconEye off={showConfirm} />
          </button>
        }
      />
      {error && <p className={FORM_ERROR_CLASS}>{error}</p>}
      <AuthSubmitButton loading={loading} loadingLabel="Đang cập nhật…">
        Cập nhật mật khẩu
      </AuthSubmitButton>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthSplitShell headline="Quản lý giấy phép trong Tài khoản KEYON">
      <AuthCard
        title="Đặt lại mật khẩu"
        subtitle="Nhập mật khẩu mới cho tài khoản của bạn."
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
        <Suspense
          fallback={
            <p className={`text-center ${BODY_MUTED_CLASS}`}>Đang tải…</p>
          }
        >
          <ResetForm />
        </Suspense>
      </AuthCard>
    </AuthSplitShell>
  );
}
