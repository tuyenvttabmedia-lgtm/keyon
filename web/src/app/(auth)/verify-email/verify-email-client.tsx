"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BODY_MUTED_CLASS,
  CTA_LABEL_CLASS,
  FORM_ERROR_CLASS,
  FORM_SUCCESS_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
} from "@/storefront/typography";
import { CARD_PORTAL, CTA_PRIMARY_EFFECT, TRANSITION_UI } from "@/storefront/effects";

export function VerifyEmailClient() {
  const sp = useSearchParams();
  const token = sp.get("token") ?? "";
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("err");
      setMsg("Thiếu token xác thực");
      return;
    }
    let cancelled = false;
    (async () => {
      setStatus("loading");
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) throw new Error(data.error ?? "Xác thực thất bại");
        setStatus("ok");
        setMsg(
          `Đã xác thực ${data.email ?? "email"}. Bạn có thể xem license trong tài khoản.`,
        );
      } catch (e) {
        if (cancelled) return;
        setStatus("err");
        setMsg(e instanceof Error ? e.message : "Lỗi");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="home-container py-12 md:py-16">
      <div className={`mx-auto max-w-md space-y-4 ${CARD_PORTAL}`}>
        <h1 className={PAGE_TITLE_CLASS}>Xác thực email</h1>
        <p className={SECTION_LEAD_CLASS}>
          {status === "loading"
            ? "Đang xác thực…"
            : "Hoàn tất xác thực để mở khóa xem license đã mua."}
        </p>
        {status === "ok" && msg ? (
          <p className={FORM_SUCCESS_CLASS}>{msg}</p>
        ) : null}
        {status === "err" && msg ? (
          <p className={FORM_ERROR_CLASS}>{msg}</p>
        ) : null}
        {status === "ok" ? (
          <Link
            href="/account/assets"
            className={`inline-flex h-11 items-center justify-center rounded-xl bg-navy px-5 ${CTA_LABEL_CLASS} text-white ${CTA_PRIMARY_EFFECT}`}
          >
            Xem license
          </Link>
        ) : (
          <p className={BODY_MUTED_CLASS}>
            Không nhận được mail? Vào{" "}
            <Link
              href="/account/security"
              className={`text-accent ${TRANSITION_UI} hover:underline`}
            >
              Bảo mật tài khoản
            </Link>{" "}
            để gửi lại.
          </p>
        )}
      </div>
    </div>
  );
}
