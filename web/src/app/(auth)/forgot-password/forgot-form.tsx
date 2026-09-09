"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthSubmitButton } from "@/storefront/components/auth/AuthCard";
import { AuthField, IconMail } from "@/storefront/components/auth/AuthField";
import { TurnstileField } from "@/storefront/components/auth/TurnstileField";
import {
  BODY_CLASS,
  BODY_MUTED_CLASS,
  FORM_ERROR_CLASS,
  FORM_SUCCESS_CLASS,
  LINK_ACCENT_CLASS,
} from "@/storefront/typography";

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (TURNSTILE_SITE_KEY && !turnstileToken) {
        throw new Error("Vui lòng xác nhận bạn không phải robot");
      }
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          turnstileToken: turnstileToken ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setDone(true);
      if (typeof data.resetUrl === "string") setResetUrl(data.resetUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className={`space-y-4 text-center ${BODY_CLASS}`}>
        <p>
          Nếu email tồn tại, chúng tôi đã chuẩn bị link đặt lại mật khẩu.
        </p>
        {resetUrl ? (
          <p
            className={`rounded-lg bg-accent-soft p-3 text-left ${FORM_SUCCESS_CLASS}`}
          >
            Dev:{" "}
            <Link href={resetUrl} className={LINK_ACCENT_CLASS}>
              Mở link đặt lại
            </Link>
          </p>
        ) : (
          <p className={BODY_MUTED_CLASS}>Kiểm tra hộp thư của bạn.</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <AuthField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Nhập email đã đăng ký"
        required
        autoComplete="email"
        leftIcon={<IconMail />}
      />
      {TURNSTILE_SITE_KEY ? (
        <TurnstileField
          siteKey={TURNSTILE_SITE_KEY}
          onToken={setTurnstileToken}
        />
      ) : null}
      {error && <p className={FORM_ERROR_CLASS}>{error}</p>}
      <AuthSubmitButton loading={loading} loadingLabel="Đang gửi…">
        Gửi link đặt lại
      </AuthSubmitButton>
    </form>
  );
}
