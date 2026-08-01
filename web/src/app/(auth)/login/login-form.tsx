"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthSubmitButton } from "@/storefront/components/auth/AuthCard";
import {
  AuthField,
  IconEye,
  IconLock,
  IconMail,
} from "@/storefront/components/auth/AuthField";
import {
  BODY_MUTED_CLASS,
  FORM_ERROR_CLASS,
  LINK_ACCENT_CLASS,
} from "@/storefront/typography";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [needsTotp, setNeedsTotp] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          remember,
          ...(needsTotp || totpCode ? { totpCode } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.requiresTotp) {
          setNeedsTotp(true);
          setError(data.error ?? "Nhập mã xác thực 2FA");
          return;
        }
        throw new Error(data.error ?? "Login failed");
      }
      if (data.totpRequired) {
        router.push("/account/security");
      } else {
        router.push(data.role === "CUSTOMER" ? "/account" : "/admin");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AuthField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Nhập email của bạn"
        required
        autoComplete="email"
        leftIcon={<IconMail />}
      />
      <AuthField
        label="Mật khẩu"
        type={showPw ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Nhập mật khẩu của bạn"
        required
        autoComplete="current-password"
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
      {needsTotp ? (
        <AuthField
          label="Mã 2FA / backup code"
          type="text"
          value={totpCode}
          onChange={(e) => setTotpCode(e.target.value)}
          placeholder="6 số hoặc backup code"
          required
          autoComplete="one-time-code"
          leftIcon={<IconLock />}
        />
      ) : null}
      <div className={`flex items-center justify-between gap-3 pt-0.5 ${BODY_MUTED_CLASS}`}>
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          Ghi nhớ đăng nhập
        </label>
        <Link href="/forgot-password" className={LINK_ACCENT_CLASS}>
          Quên mật khẩu?
        </Link>
      </div>
      {error && <p className={FORM_ERROR_CLASS}>{error}</p>}
      <AuthSubmitButton loading={loading} loadingLabel="Đang đăng nhập…">
        Đăng nhập
      </AuthSubmitButton>
    </form>
  );
}
