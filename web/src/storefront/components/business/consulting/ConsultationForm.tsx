"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  BODY_MUTED_CLASS,
  CTA_LABEL_CLASS,
  FORM_ERROR_CLASS,
  FORM_LABEL_CLASS,
  INPUT_TEXT_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CTA_HOVER,
  ELEVATION_FLOAT,
  OPACITY_DISABLED_BUSY,
  TRANSITION_UI,
} from "@/storefront/effects";
import {
  ESTIMATED_USERS,
  ESTIMATED_USERS_LABEL,
  normalizePhone,
} from "@/lib/quote";
import {
  FORM_ID,
  INTEREST_OPTIONS,
  interestLabel,
  SECTION_PAD,
  type InterestId,
} from "./shared";

type CustomerType = "PERSONAL" | "BUSINESS";
type EstimatedUsers = (typeof ESTIMATED_USERS)[number];

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  customerType: CustomerType;
  companyName: string;
  estimatedUsers: EstimatedUsers;
  interestedIn: InterestId;
  message: string;
  privacyAccepted: boolean;
  companyUrl: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const INPUT =
  `mt-1.5 h-12 w-full rounded-xl border border-border bg-white px-3 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`;
const TEXTAREA =
  `mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-3 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`;
const SELECT =
  `mt-1.5 h-12 w-full rounded-xl border border-border bg-white px-3 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className={`mt-1.5 flex items-start gap-1.5 ${FORM_ERROR_CLASS}`} role="alert">
      <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden />
      <span>{message}</span>
    </p>
  );
}

export function ConsultationForm() {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    customerType: "BUSINESS",
    companyName: "",
    estimatedUsers: "10",
    interestedIn: "NOT_SURE",
    message: "",
    privacyAccepted: false,
    companyUrl: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);

  useEffect(() => {
    function onInterest(e: Event) {
      const detail = (e as CustomEvent<{ interest?: InterestId }>).detail;
      if (detail?.interest) {
        setForm((prev) => ({ ...prev, interestedIn: detail.interest! }));
      }
    }
    window.addEventListener("keyon:consult-interest", onInterest);
    return () => window.removeEventListener("keyon:consult-interest", onInterest);
  }, []);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validate(): FieldErrors {
    const e: FieldErrors = {};
    if (form.fullName.trim().length < 2) e.fullName = "Vui lòng nhập họ và tên.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "Email chưa đúng định dạng.";
    }
    const phone = normalizePhone(form.phone);
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 15) {
      e.phone = "Số điện thoại chưa hợp lệ.";
    }
    if (form.customerType === "BUSINESS" && form.companyName.trim().length < 2) {
      e.companyName = "Vui lòng nhập tên công ty.";
    }
    if (!form.privacyAccepted) {
      e.privacyAccepted = "Vui lòng đồng ý với Chính sách bảo mật.";
    }
    return e;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    setFormError(null);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    try {
      const companyName =
        form.customerType === "PERSONAL" ? "Cá nhân" : form.companyName.trim();
      const interestName = interestLabel(form.interestedIn);
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          companyName,
          jobTitle: form.customerType === "PERSONAL" ? "Cá nhân" : "",
          interestedProducts: [{ name: interestName, slug: form.interestedIn.toLowerCase() }],
          estimatedUsers: form.estimatedUsers,
          licenseType: "UNDECIDED",
          term: "UNDECIDED",
          message: form.message.trim(),
          privacyAccepted: true,
          requestType: "LICENSING_CONSULTING",
          sourcePath: "/business/licensing-consulting",
          companyUrl: form.companyUrl,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        referenceCode?: string | null;
        error?: string;
        fieldErrors?: Record<string, string>;
      };
      if (!res.ok) {
        if (data.fieldErrors) {
          setErrors(data.fieldErrors as FieldErrors);
        }
        setFormError(data.error || "Không gửi được yêu cầu. Thử lại sau.");
        return;
      }
      setSubmitted(true);
      setReferenceCode(data.referenceCode ?? null);
    } catch {
      setFormError("Không gửi được yêu cầu. Kiểm tra kết nối và thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id={FORM_ID} className={`scroll-mt-24 border-t border-border bg-white ${SECTION_PAD}`}>
      <div className="home-container">
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <header className="min-w-0 lg:col-span-5 lg:sticky lg:top-24">
            <h2 className={SECTION_TITLE_CLASS}>Mô tả nhu cầu của bạn</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Không cần đăng nhập hay thanh toán — KEYON sẽ liên hệ tư vấn dựa trên thông tin bạn
              gửi.
            </p>
          </header>

          <div className="min-w-0 lg:col-span-7">
          {submitted ? (
            <div
              className={`rounded-2xl border border-accent/25 bg-accent-soft/40 p-6 ${ELEVATION_FLOAT}`}
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 shrink-0 text-accent" size={22} aria-hidden />
                <div>
                  <p className="text-[16px] font-bold text-navy">Đã nhận yêu cầu tư vấn</p>
                  <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>
                    KEYON sẽ xem xét nhu cầu và liên hệ lại.{" "}
                    {referenceCode ? (
                      <>
                        Mã tham chiếu:{" "}
                        <span className="font-semibold text-navy">{referenceCode}</span>
                      </>
                    ) : null}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className={`space-y-4 rounded-2xl border border-border bg-[#F7FAFC] p-5 sm:p-6 ${ELEVATION_FLOAT}`}
              noValidate
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={FORM_LABEL_CLASS}>Họ và tên</span>
                  <input
                    className={`${INPUT} ${errors.fullName ? "border-red-400" : ""}`}
                    value={form.fullName}
                    onChange={(e) => setField("fullName", e.target.value)}
                    autoComplete="name"
                  />
                  <FieldError message={errors.fullName} />
                </label>
                <label className="block">
                  <span className={FORM_LABEL_CLASS}>Email</span>
                  <input
                    type="email"
                    className={`${INPUT} ${errors.email ? "border-red-400" : ""}`}
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    autoComplete="email"
                  />
                  <FieldError message={errors.email} />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={FORM_LABEL_CLASS}>Số điện thoại</span>
                  <input
                    className={`${INPUT} ${errors.phone ? "border-red-400" : ""}`}
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    autoComplete="tel"
                  />
                  <FieldError message={errors.phone} />
                </label>
                <fieldset>
                  <legend className={FORM_LABEL_CLASS}>Cá nhân / Doanh nghiệp</legend>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {(
                      [
                        { id: "PERSONAL", label: "Cá nhân" },
                        { id: "BUSINESS", label: "Doanh nghiệp" },
                      ] as const
                    ).map((opt) => {
                      const on = form.customerType === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setField("customerType", opt.id)}
                          className={`h-12 rounded-xl border text-[14px] font-semibold ${TRANSITION_UI} ${
                            on
                              ? "border-accent bg-accent-soft text-accent"
                              : "border-border bg-white text-navy hover:border-accent/35"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </div>

              {form.customerType === "BUSINESS" ? (
                <label className="block">
                  <span className={FORM_LABEL_CLASS}>Tên công ty</span>
                  <input
                    className={`${INPUT} ${errors.companyName ? "border-red-400" : ""}`}
                    value={form.companyName}
                    onChange={(e) => setField("companyName", e.target.value)}
                    autoComplete="organization"
                  />
                  <FieldError message={errors.companyName} />
                </label>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={FORM_LABEL_CLASS}>Số người dùng dự kiến</span>
                  <select
                    className={SELECT}
                    value={form.estimatedUsers}
                    onChange={(e) =>
                      setField("estimatedUsers", e.target.value as EstimatedUsers)
                    }
                  >
                    {ESTIMATED_USERS.filter((u) => u !== "OTHER").map((u) => (
                      <option key={u} value={u}>
                        {ESTIMATED_USERS_LABEL[u]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={FORM_LABEL_CLASS}>Đang quan tâm</span>
                  <select
                    className={SELECT}
                    value={form.interestedIn}
                    onChange={(e) => setField("interestedIn", e.target.value as InterestId)}
                  >
                    {INTEREST_OPTIONS.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className={FORM_LABEL_CLASS}>Bạn đang cần giải quyết vấn đề gì?</span>
                <textarea
                  rows={4}
                  className={TEXTAREA}
                  value={form.message}
                  onChange={(e) => setField("message", e.target.value)}
                  placeholder="Mô tả ngắn nhu cầu sử dụng, thiết bị, hoặc thắc mắc về bản quyền…"
                />
              </label>

              {/* Honeypot */}
              <input
                type="text"
                name="companyUrl"
                value={form.companyUrl}
                onChange={(e) => setField("companyUrl", e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
              />

              <label className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
                  checked={form.privacyAccepted}
                  onChange={(e) => setField("privacyAccepted", e.target.checked)}
                />
                <span className={`text-[13px] leading-relaxed text-muted`}>
                  Tôi đồng ý với{" "}
                  <Link href="/policy/privacy" className="font-semibold text-accent hover:underline">
                    Chính sách bảo mật
                  </Link>{" "}
                  của KEYON.
                </span>
              </label>
              <FieldError message={errors.privacyAccepted} />

              {formError ? (
                <p className={`flex items-start gap-1.5 ${FORM_ERROR_CLASS}`} role="alert">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden />
                  <span>{formError}</span>
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className={`inline-flex h-12 w-full items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white sm:w-auto ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER} ${
                  loading ? OPACITY_DISABLED_BUSY : ""
                }`}
              >
                {loading ? "Đang gửi…" : "Gửi yêu cầu tư vấn"}
              </button>
            </form>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}
