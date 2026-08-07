"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Lock,
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  FORM_ERROR_CLASS,
  FORM_LABEL_CLASS,
  HERO_TITLE_CLASS,
  INPUT_TEXT_CLASS,
  OVERLINE_CLASS,
  PAGE_LEAD_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LINK_ACCENT,
  HOVER_LIFT_CARD,
  ELEVATION_CARD_HOVER,
  OPACITY_DISABLED_BUSY,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";
import {
  ESTIMATED_USERS,
  ESTIMATED_USERS_LABEL,
  LICENSE_TYPE_LABEL,
  LICENSE_TYPES,
  TERM_LABEL,
  TERMS,
} from "@/lib/quote";

type ProductOption = { slug: string; name: string };
type EstimatedUsers = (typeof ESTIMATED_USERS)[number];

export type QuoteContactInfo = {
  hotlineValue?: string;
  hotlineHint?: string;
  emailValue?: string;
  hoursValue?: string;
  mapAddress?: string;
  privacyHref: string;
};

export type QuoteInitial = {
  estimatedUsers?: string;
  productSlug?: string;
  requestType?: string;
  sourcePath?: string;
};

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  jobTitle: string;
  interestedProducts: ProductOption[];
  estimatedUsers: EstimatedUsers;
  estimatedUsersOther: string;
  licenseType: (typeof LICENSE_TYPES)[number];
  term: (typeof TERMS)[number];
  message: string;
  privacyAccepted: boolean;
  companyUrl: string;
};

type FieldErrors = Partial<Record<keyof FormState | "estimatedUsersOther", string>>;

const INPUT =
  `mt-1.5 h-12 w-full rounded-xl border border-border bg-white px-3 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`;
const INPUT_ERR = "border-red-400 focus:border-red-500";
const TEXTAREA =
  `mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-3 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`;
const SELECT =
  `mt-1.5 h-12 w-full rounded-xl border border-border bg-white px-3 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`;

const STEPS = [
  { id: 1, label: "Thông tin" },
  { id: 2, label: "Nhu cầu" },
  { id: 3, label: "Xác nhận" },
] as const;

const SUPPORT_STEPS = [
  "Tiếp nhận và phân tích nhu cầu",
  "Đề xuất phương án cấp phép phù hợp",
  "Gửi báo giá chi tiết",
  "Hỗ trợ triển khai sau khi chốt",
] as const;

const PROCESS = [
  { title: "Gửi yêu cầu", body: "Điền thông tin và nhu cầu bản quyền." },
  { title: "Tiếp nhận & phân tích", body: "KEYON rà soát quy mô và sản phẩm quan tâm." },
  { title: "Tư vấn giải pháp", body: "Đề xuất hình thức cấp phép phù hợp." },
  { title: "Gửi báo giá", body: "Báo giá rõ ràng trước khi quyết định." },
  { title: "Hỗ trợ triển khai", body: "Đồng hành khi kích hoạt và vận hành." },
] as const;

function mapEstimatedUsers(raw?: string): {
  estimatedUsers: EstimatedUsers;
  estimatedUsersOther: string;
} {
  if (!raw) return { estimatedUsers: "10", estimatedUsersOther: "" };
  if ((ESTIMATED_USERS as readonly string[]).includes(raw)) {
    return { estimatedUsers: raw as EstimatedUsers, estimatedUsersOther: "" };
  }
  if (raw === "100") {
    return { estimatedUsers: "100+", estimatedUsersOther: "" };
  }
  const n = Number(raw);
  if (Number.isFinite(n) && n > 0) {
    return { estimatedUsers: "OTHER", estimatedUsersOther: String(Math.floor(n)) };
  }
  return { estimatedUsers: "10", estimatedUsersOther: "" };
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className={`mt-1.5 flex items-start gap-1.5 ${FORM_ERROR_CLASS}`} role="alert">
      <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden />
      <span>{message}</span>
    </p>
  );
}

export function QuoteRequestLanding({
  products,
  contact,
  initial,
}: {
  products: ProductOption[];
  contact: QuoteContactInfo;
  initial: QuoteInitial;
}) {
  const mapped = mapEstimatedUsers(initial.estimatedUsers);
  const prefillProduct = useMemo(() => {
    if (!initial.productSlug) return null;
    return products.find((p) => p.slug === initial.productSlug) ?? null;
  }, [initial.productSlug, products]);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(() => ({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    jobTitle: "",
    interestedProducts: prefillProduct ? [prefillProduct] : [],
    estimatedUsers: mapped.estimatedUsers,
    estimatedUsersOther: mapped.estimatedUsersOther,
    licenseType: "UNDECIDED",
    term: "UNDECIDED",
    message: "",
    privacyAccepted: false,
    companyUrl: "",
  }));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);
  const [productQuery, setProductQuery] = useState("");
  const [productOpen, setProductOpen] = useState(false);

  const requestType = (initial.requestType || "GENERAL").toUpperCase();
  const sourcePath = initial.sourcePath || "/contact/quote";

  const productResults = useMemo(() => {
    const q = productQuery.trim().toLowerCase();
    const selected = new Set(form.interestedProducts.map((p) => p.slug));
    return products
      .filter((p) => !selected.has(p.slug))
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.slug.includes(q))
      .slice(0, 8);
  }, [productQuery, products, form.interestedProducts]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function validateStep1(): FieldErrors {
    const e: FieldErrors = {};
    if (form.fullName.trim().length < 2) e.fullName = "Vui lòng nhập họ và tên.";
    else if (form.fullName.trim().length > 100) e.fullName = "Họ và tên tối đa 100 ký tự.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "Email chưa đúng định dạng.";
    }
    if (!form.phone.trim()) e.phone = "Vui lòng nhập số điện thoại.";
    if (form.companyName.trim().length < 2) e.companyName = "Vui lòng nhập tên công ty.";
    else if (form.companyName.trim().length > 200) e.companyName = "Tên công ty tối đa 200 ký tự.";
    return e;
  }

  function validateStep2(): FieldErrors {
    const e: FieldErrors = {};
    if (!form.estimatedUsers) e.estimatedUsers = "Vui lòng chọn quy mô dự kiến.";
    if (form.estimatedUsers === "OTHER") {
      const n = Number(form.estimatedUsersOther);
      if (!Number.isFinite(n) || n < 1) {
        e.estimatedUsersOther = "Vui lòng nhập số lượng người dùng.";
      }
    }
    if (form.message.length > 2000) e.message = "Mô tả tối đa 2.000 ký tự.";
    return e;
  }

  function validateStep3(): FieldErrors {
    const e: FieldErrors = {};
    if (!form.privacyAccepted) {
      e.privacyAccepted = "Vui lòng đồng ý với Chính sách bảo mật.";
    }
    return e;
  }

  function focusFirstError(next: FieldErrors) {
    const order: (keyof FieldErrors)[] = [
      "fullName",
      "email",
      "phone",
      "companyName",
      "estimatedUsers",
      "estimatedUsersOther",
      "message",
      "privacyAccepted",
    ];
    const key = order.find((k) => next[k]);
    if (!key) return;
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(`[data-field="${key}"]`);
      el?.focus();
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function goNext() {
    setFormError(null);
    const next = step === 1 ? validateStep1() : validateStep2();
    setErrors(next);
    if (Object.keys(next).length) {
      focusFirstError(next);
      return;
    }
    setStep((s) => Math.min(3, s + 1));
  }

  function goBack() {
    setFormError(null);
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  }

  async function onSubmit() {
    setFormError(null);
    const next = { ...validateStep1(), ...validateStep2(), ...validateStep3() };
    setErrors(next);
    if (Object.keys(next).length) {
      if (next.fullName || next.email || next.phone || next.companyName) setStep(1);
      else if (next.estimatedUsers || next.estimatedUsersOther || next.message) setStep(2);
      else setStep(3);
      focusFirstError(next);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          companyName: form.companyName.trim(),
          jobTitle: form.jobTitle.trim(),
          interestedProducts: form.interestedProducts,
          estimatedUsers: form.estimatedUsers,
          estimatedUsersOther:
            form.estimatedUsers === "OTHER" ? Number(form.estimatedUsersOther) : null,
          licenseType: form.licenseType,
          term: form.term,
          message: form.message.trim(),
          privacyAccepted: true,
          requestType,
          sourcePath,
          companyUrl: form.companyUrl,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        fields?: Record<string, string>;
        referenceCode?: string | null;
        ok?: boolean;
      };
      if (!res.ok) {
        if (data.fields) {
          const mappedErr: FieldErrors = {};
          for (const [k, v] of Object.entries(data.fields)) {
            mappedErr[k as keyof FieldErrors] = v;
          }
          setErrors(mappedErr);
          focusFirstError(mappedErr);
        }
        throw new Error(data.error ?? "Gửi yêu cầu thất bại");
      }
      setReferenceCode(data.referenceCode ?? null);
      setSubmitted(true);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Gửi yêu cầu thất bại");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (prefillProduct && form.interestedProducts.length === 0) {
      setForm((prev) => ({ ...prev, interestedProducts: [prefillProduct] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillProduct]);

  const usersSummary =
    form.estimatedUsers === "OTHER"
      ? `${form.estimatedUsersOther || "—"} người dùng`
      : ESTIMATED_USERS_LABEL[form.estimatedUsers];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-border bg-[#F7FAFC]">
        <div className="home-container py-8 md:py-10 lg:py-11">
          <nav className={`mb-5 flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
            <Link href="/" className={HOVER_LINK_ACCENT}>
              Trang chủ
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <Link href="/business" className={HOVER_LINK_ACCENT}>
              Doanh nghiệp
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <span className={BREADCRUMB_CURRENT_CLASS}>Yêu cầu báo giá</span>
          </nav>

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)] lg:gap-12">
            <div className="min-w-0 max-w-xl">
              <p className={`${OVERLINE_CLASS} tracking-[0.18em] text-accent`}>Yêu cầu báo giá</p>
              <h1 className={`mt-3 ${HERO_TITLE_CLASS}`}>
                Nhận tư vấn và báo giá phù hợp với nhu cầu doanh nghiệp
              </h1>
              <p className={`mt-3 ${PAGE_LEAD_CLASS}`}>
                Cho KEYON biết nhu cầu của bạn. Đội ngũ tư vấn sẽ dựa trên thông tin cung cấp để
                đề xuất phương án bản quyền phù hợp.
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
                {[
                  { label: "Tư vấn theo nhu cầu", Icon: MessageCircle },
                  { label: "Báo giá rõ ràng", Icon: CheckCircle2 },
                  { label: "Bảo mật thông tin", Icon: ShieldCheck },
                ].map(({ label, Icon }) => (
                  <li key={label} className="inline-flex items-center gap-2 text-[13px] font-medium text-navy">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <Icon size={15} strokeWidth={1.9} aria-hidden />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className={`hidden rounded-2xl border border-border bg-white p-5 sm:p-6 lg:block ${ELEVATION_HAIRLINE}`}
              aria-hidden
            >
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Send size={20} strokeWidth={1.8} />
                </span>
                <div>
                  <p className={CARD_TITLE_CLASS}>Luồng báo giá doanh nghiệp</p>
                  <p className={`mt-1 ${CARD_META_CLASS}`}>
                    Không cần tài khoản · Không đưa vào giỏ hàng · Báo giá trước khi thanh toán
                  </p>
                </div>
              </div>
              <ol className="mt-5 space-y-2.5">
                {SUPPORT_STEPS.map((s, i) => (
                  <li key={s} className="flex items-start gap-2.5 text-[13px] text-navy">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="home-container py-9 md:py-11">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-8">
            {submitted ? (
              <SuccessPanel referenceCode={referenceCode} />
            ) : (
              <div className={`rounded-2xl border border-border bg-white p-5 sm:p-6 md:p-7 ${ELEVATION_HAIRLINE}`}>
                <Stepper step={step} />

                {step === 1 ? (
                  <div className="mt-7 space-y-4">
                    <h2 className={CARD_TITLE_CLASS}>Thông tin liên hệ & doanh nghiệp</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        id="fullName"
                        label="Họ và tên"
                        required
                        error={errors.fullName}
                      >
                        <input
                          id="fullName"
                          data-field="fullName"
                          className={`${INPUT} ${errors.fullName ? INPUT_ERR : ""}`}
                          value={form.fullName}
                          onChange={(e) => setField("fullName", e.target.value)}
                          autoComplete="name"
                          maxLength={100}
                        />
                      </Field>
                      <Field id="jobTitle" label="Chức vụ" error={errors.jobTitle}>
                        <input
                          id="jobTitle"
                          data-field="jobTitle"
                          className={INPUT}
                          value={form.jobTitle}
                          onChange={(e) => setField("jobTitle", e.target.value)}
                          autoComplete="organization-title"
                          maxLength={120}
                        />
                      </Field>
                      <Field id="email" label="Email công việc" required error={errors.email}>
                        <input
                          id="email"
                          data-field="email"
                          type="email"
                          className={`${INPUT} ${errors.email ? INPUT_ERR : ""}`}
                          value={form.email}
                          onChange={(e) => setField("email", e.target.value)}
                          autoComplete="email"
                          maxLength={200}
                        />
                      </Field>
                      <Field id="phone" label="Số điện thoại" required error={errors.phone}>
                        <input
                          id="phone"
                          data-field="phone"
                          className={`${INPUT} ${errors.phone ? INPUT_ERR : ""}`}
                          value={form.phone}
                          onChange={(e) => setField("phone", e.target.value)}
                          autoComplete="tel"
                          inputMode="tel"
                          maxLength={40}
                        />
                      </Field>
                      <Field
                        id="companyName"
                        label="Tên công ty"
                        required
                        error={errors.companyName}
                        className="sm:col-span-2"
                      >
                        <input
                          id="companyName"
                          data-field="companyName"
                          className={`${INPUT} ${errors.companyName ? INPUT_ERR : ""}`}
                          value={form.companyName}
                          onChange={(e) => setField("companyName", e.target.value)}
                          autoComplete="organization"
                          maxLength={200}
                        />
                      </Field>
                    </div>

                    {/* Honeypot */}
                    <div className="sr-only" aria-hidden>
                      <label>
                        Website công ty
                        <input
                          tabIndex={-1}
                          autoComplete="off"
                          value={form.companyUrl}
                          onChange={(e) => setField("companyUrl", e.target.value)}
                        />
                      </label>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={goNext}
                        className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                      >
                        Tiếp tục
                        <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
                      </button>
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="mt-7 space-y-5">
                    <h2 className={CARD_TITLE_CLASS}>Nhu cầu bản quyền</h2>

                    <div>
                      <span className={FORM_LABEL_CLASS}>Sản phẩm / Dịch vụ quan tâm</span>
                      <div className="relative mt-1.5">
                        <Search
                          size={16}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                          aria-hidden
                        />
                        <input
                          className={`${INPUT} !mt-0 pl-9`}
                          placeholder="Tìm sản phẩm…"
                          value={productQuery}
                          onChange={(e) => {
                            setProductQuery(e.target.value);
                            setProductOpen(true);
                          }}
                          onFocus={() => setProductOpen(true)}
                          onBlur={() => setTimeout(() => setProductOpen(false), 150)}
                        />
                        {productOpen && productResults.length > 0 ? (
                          <ul
                            className={`absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-border bg-white py-1 ${ELEVATION_HAIRLINE}`}
                          >
                            {productResults.map((p) => (
                              <li key={p.slug}>
                                <button
                                  type="button"
                                  className="flex w-full px-3 py-2.5 text-left text-[14px] text-navy hover:bg-accent-soft"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    setField("interestedProducts", [
                                      ...form.interestedProducts,
                                      p,
                                    ]);
                                    setProductQuery("");
                                    setProductOpen(false);
                                  }}
                                >
                                  {p.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                      {form.interestedProducts.length > 0 ? (
                        <ul className="mt-2.5 flex flex-wrap gap-2">
                          {form.interestedProducts.map((p) => (
                            <li
                              key={p.slug}
                              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[#F7FAFC] px-2.5 py-1 text-[13px] text-navy"
                            >
                              {p.name}
                              <button
                                type="button"
                                className="text-muted hover:text-navy"
                                aria-label={`Bỏ ${p.name}`}
                                onClick={() =>
                                  setField(
                                    "interestedProducts",
                                    form.interestedProducts.filter((x) => x.slug !== p.slug),
                                  )
                                }
                              >
                                <X size={14} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={`mt-2 ${CARD_META_CLASS}`}>
                          Tùy chọn — bạn có thể mô tả thêm ở phần bên dưới.
                        </p>
                      )}
                    </div>

                    <div>
                      <span className={FORM_LABEL_CLASS}>
                        Quy mô dự kiến <span className="text-red-500">*</span>
                      </span>
                      <div
                        className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5"
                        role="group"
                        aria-label="Quy mô người dùng dự kiến"
                      >
                        {ESTIMATED_USERS.map((v) => {
                          const active = form.estimatedUsers === v;
                          return (
                            <button
                              key={v}
                              type="button"
                              data-field={v === "OTHER" ? "estimatedUsersOther" : "estimatedUsers"}
                              onClick={() => setField("estimatedUsers", v)}
                              className={`inline-flex h-12 items-center justify-center rounded-xl border text-[14px] font-semibold ${TRANSITION_UI} ${
                                active
                                  ? "border-accent bg-accent-soft text-accent"
                                  : "border-border bg-white text-navy hover:border-accent/40"
                              }`}
                            >
                              {v === "OTHER" ? "Khác" : v}
                            </button>
                          );
                        })}
                      </div>
                      <FieldError message={errors.estimatedUsers} />
                      {form.estimatedUsers === "OTHER" ? (
                        <div className="mt-3 max-w-xs">
                          <label className={FORM_LABEL_CLASS} htmlFor="estimatedUsersOther">
                            Số lượng người dùng
                          </label>
                          <input
                            id="estimatedUsersOther"
                            data-field="estimatedUsersOther"
                            type="number"
                            min={1}
                            inputMode="numeric"
                            className={`${INPUT} ${errors.estimatedUsersOther ? INPUT_ERR : ""}`}
                            value={form.estimatedUsersOther}
                            onChange={(e) => setField("estimatedUsersOther", e.target.value)}
                          />
                          <FieldError message={errors.estimatedUsersOther} />
                        </div>
                      ) : null}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className={FORM_LABEL_CLASS}>Loại hình cấp phép</span>
                        <select
                          className={SELECT}
                          value={form.licenseType}
                          onChange={(e) =>
                            setField("licenseType", e.target.value as FormState["licenseType"])
                          }
                        >
                          {LICENSE_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {LICENSE_TYPE_LABEL[t]}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className={FORM_LABEL_CLASS}>Thời hạn dự kiến</span>
                        <select
                          className={SELECT}
                          value={form.term}
                          onChange={(e) => setField("term", e.target.value as FormState["term"])}
                        >
                          {TERMS.map((t) => (
                            <option key={t} value={t}>
                              {TERM_LABEL[t]}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className="block">
                      <span className={FORM_LABEL_CLASS}>Mô tả nhu cầu</span>
                      <textarea
                        data-field="message"
                        rows={5}
                        maxLength={2000}
                        className={`${TEXTAREA} ${errors.message ? INPUT_ERR : ""}`}
                        value={form.message}
                        onChange={(e) => setField("message", e.target.value)}
                        placeholder="Ví dụ: sản phẩm đang quan tâm, số lượng người dùng, thời gian dự kiến triển khai hoặc yêu cầu đặc biệt…"
                      />
                      <div className="mt-1 flex items-center justify-between gap-3">
                        <FieldError message={errors.message} />
                        <span className={CARD_META_CLASS}>{form.message.length}/2000</span>
                      </div>
                    </label>

                    <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
                      <button
                        type="button"
                        onClick={goBack}
                        className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 text-[14px] font-semibold text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                      >
                        <ArrowLeft size={16} strokeWidth={2.2} aria-hidden />
                        Quay lại
                      </button>
                      <button
                        type="button"
                        onClick={goNext}
                        className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                      >
                        Xem lại yêu cầu
                        <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
                      </button>
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="mt-7 space-y-5">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className={CARD_TITLE_CLASS}>Xác nhận yêu cầu</h2>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className={`text-[13px] font-semibold text-accent ${HOVER_LINK_ACCENT}`}
                      >
                        Chỉnh sửa
                      </button>
                    </div>

                    <dl className="grid gap-3 rounded-xl border border-border bg-[#F7FAFC] p-4 sm:p-5">
                      <SummaryRow label="Họ và tên" value={form.fullName} />
                      <SummaryRow label="Email" value={form.email} />
                      <SummaryRow label="Số điện thoại" value={form.phone} />
                      <SummaryRow label="Công ty" value={form.companyName} />
                      {form.jobTitle ? <SummaryRow label="Chức vụ" value={form.jobTitle} /> : null}
                      <SummaryRow
                        label="Sản phẩm quan tâm"
                        value={
                          form.interestedProducts.length
                            ? form.interestedProducts.map((p) => p.name).join(", ")
                            : "—"
                        }
                      />
                      <SummaryRow label="Quy mô" value={usersSummary} />
                      <SummaryRow
                        label="Loại license"
                        value={LICENSE_TYPE_LABEL[form.licenseType]}
                      />
                      <SummaryRow label="Thời hạn" value={TERM_LABEL[form.term]} />
                      <SummaryRow label="Nhu cầu" value={form.message.trim() || "—"} />
                    </dl>

                    <label className="flex items-start gap-3" data-field="privacyAccepted">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
                        checked={form.privacyAccepted}
                        onChange={(e) => setField("privacyAccepted", e.target.checked)}
                      />
                      <span className={`text-[13px] leading-relaxed text-navy`}>
                        Tôi đồng ý với{" "}
                        <Link
                          href={contact.privacyHref || "/policy/privacy"}
                          className="font-semibold text-accent hover:underline"
                          target="_blank"
                        >
                          Chính sách bảo mật
                        </Link>{" "}
                        và cho phép KEYON sử dụng thông tin này để xử lý yêu cầu tư vấn/báo giá.
                      </span>
                    </label>
                    <FieldError message={errors.privacyAccepted} />

                    {formError ? (
                      <p className={`flex items-start gap-1.5 ${FORM_ERROR_CLASS}`} role="alert">
                        <AlertCircle size={14} className="mt-0.5 shrink-0" aria-hidden />
                        {formError}
                      </p>
                    ) : null}

                    <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-between">
                      <button
                        type="button"
                        onClick={goBack}
                        disabled={loading}
                        className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 text-[14px] font-semibold text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent ${OPACITY_DISABLED_BUSY}`}
                      >
                        <ArrowLeft size={16} strokeWidth={2.2} aria-hidden />
                        Quay lại
                      </button>
                      <button
                        type="button"
                        onClick={onSubmit}
                        disabled={loading}
                        className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER} ${OPACITY_DISABLED_BUSY}`}
                      >
                        {loading ? (
                          "Đang gửi…"
                        ) : (
                          <>
                            <Send size={16} strokeWidth={2} aria-hidden />
                            Gửi yêu cầu báo giá
                          </>
                        )}
                      </button>
                    </div>

                    <p className={`flex items-center justify-center gap-1.5 text-center ${CARD_META_CLASS}`}>
                      <Lock size={12} aria-hidden />
                      KEYON chỉ dùng thông tin này để xử lý yêu cầu tư vấn/báo giá.
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <aside className="min-w-0 space-y-4 lg:col-span-4">
            <div className={`rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE}`}>
              <h2 className={CARD_TITLE_CLASS}>Chúng tôi sẽ hỗ trợ bạn</h2>
              <ul className="mt-4 space-y-3">
                {SUPPORT_STEPS.map((s, i) => (
                  <li key={s} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <Check size={11} strokeWidth={3} aria-hidden />
                    </span>
                    <span className="text-[13px] leading-snug text-navy">
                      <span className="font-semibold">{i + 1}. </span>
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {(contact.hotlineValue || contact.emailValue || contact.mapAddress) && (
              <div className={`rounded-2xl border border-border bg-[#F7FAFC] p-5 ${ELEVATION_HAIRLINE}`}>
                <h2 className={CARD_TITLE_CLASS}>Liên hệ trực tiếp</h2>
                <ul className="mt-4 space-y-3 text-[13px] text-navy">
                  {contact.hoursValue ? (
                    <li>
                      <span className="font-semibold">Giờ hỗ trợ: </span>
                      {contact.hoursValue}
                    </li>
                  ) : null}
                  {contact.hotlineValue ? (
                    <li>
                      <span className="font-semibold">Hotline: </span>
                      <a
                        href={`tel:${contact.hotlineValue.replace(/\s/g, "")}`}
                        className="text-accent hover:underline"
                      >
                        {contact.hotlineValue}
                      </a>
                      {contact.hotlineHint ? (
                        <span className={`mt-0.5 block ${CARD_META_CLASS}`}>{contact.hotlineHint}</span>
                      ) : null}
                    </li>
                  ) : null}
                  {contact.emailValue ? (
                    <li>
                      <span className="font-semibold">Email: </span>
                      <a
                        href={`mailto:${contact.emailValue}`}
                        className="text-accent hover:underline"
                      >
                        {contact.emailValue}
                      </a>
                    </li>
                  ) : null}
                  {contact.mapAddress ? (
                    <li>
                      <span className="font-semibold">Địa chỉ: </span>
                      {contact.mapAddress}
                    </li>
                  ) : null}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-border bg-[#F7FAFC] py-10 md:py-12">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình nhận báo giá tại KEYON</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Từ gửi yêu cầu đến hỗ trợ triển khai — rõ ràng từng bước.
            </p>
          </header>
          <div className="relative mt-10">
            <div
              className="pointer-events-none absolute left-[10%] right-[10%] top-6 z-0 hidden h-px border-t border-dashed border-border lg:block"
              aria-hidden
            />
            <ol className="relative z-[1] grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
              {PROCESS.map((p, i) => (
                <li
                  key={p.title}
                  className={`group flex flex-col items-center rounded-2xl px-2 py-3 text-center ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:bg-white`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent/40 bg-white text-[13px] font-bold text-accent ${ELEVATION_HAIRLINE} ${TRANSITION_UI} ${ELEVATION_CARD_HOVER} group-hover:border-accent group-hover:bg-accent group-hover:text-white`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={`mt-3.5 ${CARD_TITLE_CLASS} ${TRANSITION_UI} group-hover:text-accent`}>
                    {p.title}
                  </h3>
                  <p className={`mt-1.5 max-w-[16rem] ${BODY_MUTED_CLASS}`}>{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3" aria-label="Các bước gửi yêu cầu">
      {STEPS.map((s, i) => {
        const done = step > s.id;
        const active = step === s.id;
        return (
          <li key={s.id} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                  done || active
                    ? "bg-accent text-white"
                    : "border border-border bg-white text-muted"
                }`}
              >
                {done ? <Check size={14} strokeWidth={3} aria-hidden /> : s.id}
              </span>
              <span
                className={`truncate text-[13px] font-semibold ${
                  active || done ? "text-navy" : "text-muted"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 ? (
              <span className="hidden h-px flex-1 bg-border sm:block" aria-hidden />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
  className = "",
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`} htmlFor={id}>
      <span className={FORM_LABEL_CLASS}>
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </span>
      {children}
      <FieldError message={error} />
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-0.5 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-3">
      <dt className={`${CARD_META_CLASS} font-medium`}>{label}</dt>
      <dd className="text-[14px] text-navy whitespace-pre-wrap break-words">{value}</dd>
    </div>
  );
}

function SuccessPanel({ referenceCode }: { referenceCode: string | null }) {
  return (
    <div className={`rounded-2xl border border-border bg-white p-6 sm:p-8 text-center ${ELEVATION_HAIRLINE}`}>
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
        <CheckCircle2 size={28} strokeWidth={1.8} aria-hidden />
      </span>
      <h2 className={`mt-4 ${SECTION_TITLE_CLASS}`}>Yêu cầu đã được gửi</h2>
      <p className={`mx-auto mt-2 max-w-md ${SECTION_LEAD_CLASS}`}>
        KEYON đã nhận được thông tin yêu cầu báo giá của bạn.
      </p>
      {referenceCode ? (
        <p className={`mt-4 text-[15px] font-semibold text-navy`}>
          Mã yêu cầu: <span className="text-accent">{referenceCode}</span>
        </p>
      ) : null}
      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/"
          className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
        >
          Về trang chủ
        </Link>
        <Link
          href="/business/volume-licensing"
          className={`inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-6 text-[14px] font-semibold text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
        >
          Quay lại Volume Licensing
        </Link>
      </div>
    </div>
  );
}
