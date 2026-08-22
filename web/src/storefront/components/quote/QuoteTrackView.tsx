"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import {
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  FORM_ERROR_CLASS,
  FORM_LABEL_CLASS,
  INPUT_TEXT_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
} from "@/storefront/typography";
import {
  CARD_PORTAL,
  CTA_PRIMARY_EFFECT,
  ELEVATION_HAIRLINE,
  TRANSITION_UI,
} from "@/storefront/effects";

const INPUT_CLASS = `mt-1 w-full rounded-xl border border-border px-3 py-2.5 ${INPUT_TEXT_CLASS}`;

type QuoteView = {
  referenceCode: string;
  statusLabel: string;
  requestTypeLabel: string;
  companyName: string;
  estimatedUsersLabel: string;
  licenseTypeLabel: string;
  termLabel: string;
  productSummary: string;
  createdAt: string;
  updatedAt: string;
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function QuoteTrackView({
  enabled,
  initialRef,
}: {
  enabled: boolean;
  initialRef?: string;
}) {
  const [step, setStep] = useState<"form" | "otp" | "result">("form");
  const [referenceCode, setReferenceCode] = useState(initialRef ?? "");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [quote, setQuote] = useState<QuoteView | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(enabled);

  const loadSession = useCallback(async () => {
    if (!enabled) {
      setCheckingSession(false);
      return;
    }
    try {
      const res = await fetch("/api/quote/track/status");
      if (res.ok) {
        const data = (await res.json()) as { quote?: QuoteView };
        if (data.quote) {
          setQuote(data.quote);
          setStep("result");
        }
      }
    } catch {
      // ignore
    } finally {
      setCheckingSession(false);
    }
  }, [enabled]);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  async function requestOtp() {
    setLoading(true);
    setErr(null);
    setInfo(null);
    try {
      const res = await fetch("/api/quote/track/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceCode: referenceCode.trim(),
          email: email.trim(),
        }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) throw new Error(data.error ?? "Không gửi được mã");
      setInfo(
        data.message ??
          "Nếu mã và email khớp, bạn sẽ nhận OTP trong vài phút.",
      );
      setStep("otp");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/quote/track/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceCode: referenceCode.trim(),
          email: email.trim(),
          code: code.trim(),
        }),
      });
      const data = (await res.json()) as { error?: string; quote?: QuoteView };
      if (!res.ok) throw new Error(data.error ?? "Xác minh thất bại");
      setQuote(data.quote ?? null);
      setStep("result");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  if (!enabled) {
    return (
      <div className={`rounded-2xl border border-border bg-white p-6 sm:p-8 ${ELEVATION_HAIRLINE}`}>
        <h1 className={PAGE_TITLE_CLASS}>Tra cứu yêu cầu báo giá</h1>
        <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
          Tính năng tra cứu công khai hiện chưa được bật. Vui lòng liên hệ KEYON
          qua hotline hoặc email hỗ trợ để được cập nhật.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/contact" className={`${CTA_COMPACT_CLASS} ${CTA_PRIMARY_EFFECT}`}>
            Liên hệ KEYON
          </Link>
          <Link
            href="/contact/quote"
            className={`inline-flex h-11 items-center rounded-xl border border-border px-5 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
          >
            Gửi yêu cầu báo giá
          </Link>
        </div>
      </div>
    );
  }

  if (checkingSession) {
    return (
      <div className={`flex items-center justify-center gap-2 rounded-2xl border border-border bg-white p-12 ${ELEVATION_HAIRLINE}`}>
        <Loader2 className="h-5 w-5 animate-spin text-accent" aria-hidden />
        <span className={BODY_MUTED_CLASS}>Đang tải…</span>
      </div>
    );
  }

  if (step === "result" && quote) {
    return (
      <div className="space-y-4">
        <div className={`rounded-2xl border border-border bg-white p-6 sm:p-8 ${ELEVATION_HAIRLINE}`}>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-accent" aria-hidden />
            <div>
              <h1 className={PAGE_TITLE_CLASS}>Trạng thái yêu cầu</h1>
              <p className={`mt-1 font-mono text-sm font-semibold text-accent`}>
                {quote.referenceCode}
              </p>
            </div>
          </div>
          <dl className={`mt-6 grid gap-4 sm:grid-cols-2 ${CARD_PORTAL} p-4`}>
            <div>
              <dt className={CARD_META_CLASS}>Trạng thái</dt>
              <dd className={`mt-0.5 ${CARD_TITLE_CLASS}`}>{quote.statusLabel}</dd>
            </div>
            <div>
              <dt className={CARD_META_CLASS}>Loại yêu cầu</dt>
              <dd className="mt-0.5 text-sm text-navy">{quote.requestTypeLabel}</dd>
            </div>
            <div>
              <dt className={CARD_META_CLASS}>Công ty</dt>
              <dd className="mt-0.5 text-sm text-navy">{quote.companyName}</dd>
            </div>
            <div>
              <dt className={CARD_META_CLASS}>Quy mô</dt>
              <dd className="mt-0.5 text-sm text-navy">{quote.estimatedUsersLabel}</dd>
            </div>
            <div>
              <dt className={CARD_META_CLASS}>Sản phẩm</dt>
              <dd className="mt-0.5 text-sm text-navy">{quote.productSummary}</dd>
            </div>
            <div>
              <dt className={CARD_META_CLASS}>License / thời hạn</dt>
              <dd className="mt-0.5 text-sm text-navy">
                {quote.licenseTypeLabel} · {quote.termLabel}
              </dd>
            </div>
            <div>
              <dt className={CARD_META_CLASS}>Gửi lúc</dt>
              <dd className="mt-0.5 text-sm text-navy">{fmtDate(quote.createdAt)}</dd>
            </div>
            <div>
              <dt className={CARD_META_CLASS}>Cập nhật</dt>
              <dd className="mt-0.5 text-sm text-navy">{fmtDate(quote.updatedAt)}</dd>
            </div>
          </dl>
          <p className={`mt-4 ${CARD_META_CLASS}`}>
            KEYON sẽ liên hệ qua email hoặc số điện thoại bạn đã cung cấp khi gửi
            yêu cầu. Phiên tra cứu có hiệu lực 1 giờ.
          </p>
        </div>
        <Link href="/contact/quote" className={`inline-flex ${CTA_COMPACT_CLASS}`}>
          Gửi yêu cầu mới
        </Link>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-border bg-white p-6 sm:p-8 ${ELEVATION_HAIRLINE}`}>
      <h1 className={PAGE_TITLE_CLASS}>Tra cứu yêu cầu báo giá</h1>
      <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
        Nhập mã <strong>QT-…</strong> và email đã dùng khi gửi form. Hệ thống gửi mã
        OTP 6 số qua email để xác minh.
      </p>

      {step === "form" ? (
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className={FORM_LABEL_CLASS}>Mã yêu cầu</span>
            <input
              className={INPUT_CLASS}
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value.toUpperCase())}
              placeholder="QT-XXXXXXXX"
              autoComplete="off"
            />
          </label>
          <label className="block">
            <span className={FORM_LABEL_CLASS}>Email</span>
            <input
              type="email"
              className={INPUT_CLASS}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@congty.vn"
              autoComplete="email"
            />
          </label>
          {err ? (
            <p className={`flex items-start gap-1.5 ${FORM_ERROR_CLASS}`} role="alert">
              <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden />
              {err}
            </p>
          ) : null}
          <button
            type="button"
            disabled={loading || !referenceCode.trim() || !email.trim()}
            onClick={() => void requestOtp()}
            className={`h-12 w-full rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white disabled:opacity-50 ${CTA_PRIMARY_EFFECT}`}
          >
            {loading ? "Đang gửi…" : "Gửi mã OTP"}
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <p className={CARD_META_CLASS}>
            Mã: <span className="font-mono font-semibold text-navy">{referenceCode}</span>
            {" · "}
            {email}
          </p>
          {info ? <p className="text-sm text-emerald-700">{info}</p> : null}
          <label className="block">
            <span className={FORM_LABEL_CLASS}>Mã OTP (6 số)</span>
            <input
              className={INPUT_CLASS}
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              autoComplete="one-time-code"
            />
          </label>
          {err ? (
            <p className={`flex items-start gap-1.5 ${FORM_ERROR_CLASS}`} role="alert">
              <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden />
              {err}
            </p>
          ) : null}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              disabled={loading || code.length !== 6}
              onClick={() => void verifyOtp()}
              className={`h-12 flex-1 rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white disabled:opacity-50 ${CTA_PRIMARY_EFFECT}`}
            >
              {loading ? "Đang xác minh…" : "Xác minh"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setStep("form");
                setCode("");
                setErr(null);
              }}
              className={`h-12 rounded-xl border border-border px-6 text-sm font-semibold text-navy ${TRANSITION_UI} hover:border-accent`}
            >
              Quay lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
