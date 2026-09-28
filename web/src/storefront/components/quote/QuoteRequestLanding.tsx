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
  Send,
  ShieldCheck,
} from "lucide-react";
import { LANDING_CRUMB_GAP } from "@/storefront/components/marketing/hero-shell";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  FORM_ERROR_CLASS,
  FORM_LABEL_CLASS,
  HERO_TITLE_CLASS,
  LINK_FIELD_CLASS,
  INPUT_TEXT_CLASS,
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
import { isPlaceholderHotline } from "@/storefront/components/support/shared";
import { TurnstileField } from "@/storefront/components/auth/TurnstileField";
import { useTurnstileSiteKey } from "@/storefront/components/auth/use-turnstile-site-key";
import {
  ESTIMATED_USERS_LABEL,
  LICENSE_TYPE_LABEL,
  QUOTE_USER_RANGES,
} from "@/lib/quote";

type ProductOption = { slug?: string; name: string };
type EstimatedUsers = (typeof QUOTE_USER_RANGES)[number];
type NeedType = "NEW" | "RENEWAL" | "UPGRADE" | "MIGRATION" | "UNDECIDED";

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
  licenseType: NeedType;
  message: string;
  privacyAccepted: boolean;
  companyUrl: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const INPUT =
  `mt-1.5 h-12 w-full rounded-xl border border-border bg-white px-3 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`;
const INPUT_ERR = "border-red-400 focus:border-red-500";
const TEXTAREA =
  `mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-3 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`;
const STEPS = [
  { id: 1, label: "Thông tin" },
  { id: 2, label: "Nhu cầu" },
  { id: 3, label: "Xác nhận" },
] as const;

const PRODUCT_INTERESTS: ProductOption[] = [
  { name: "Microsoft 365" },
  { name: "Microsoft Office" },
  { name: "Windows" },
  { name: "Windows Server" },
  { name: "Bảo mật" },
  { name: "Backup & Khôi phục" },
  { name: "Khác" },
];

const NEED_OPTIONS: { id: NeedType; label: string }[] = [
  { id: "NEW", label: "Mua mới" },
  { id: "RENEWAL", label: "Gia hạn" },
  { id: "UPGRADE", label: "Nâng cấp" },
  { id: "MIGRATION", label: "Chuyển đổi license" },
  { id: "UNDECIDED", label: "Chưa xác định" },
];

const RANGE_SHORT: Record<EstimatedUsers, string> = {
  "1-5": "1–5",
  "6-25": "6–25",
  "26-50": "26–50",
  "51-100": "51–100",
  "100+": "100+",
};

type StepCopy = { title: string; body: string };
type UspCopy = { title: string; body: string; icon: "consult" | "quote" | "privacy" };

const QUOTE_USPS: UspCopy[] = [
  {
    title: "Tư vấn theo nhu cầu",
    body: "Đề xuất phương án phù hợp với sản phẩm và quy mô sử dụng.",
    icon: "consult",
  },
  {
    title: "Báo giá minh bạch",
    body: "Thông tin chi phí rõ ràng theo sản phẩm, số lượng và thời hạn.",
    icon: "quote",
  },
  {
    title: "Bảo mật thông tin",
    body: "Thông tin doanh nghiệp chỉ được sử dụng để tư vấn và báo giá.",
    icon: "privacy",
  },
];

const QUOTE_CARD_STEPS: StepCopy[] = [
  {
    title: "Tiếp nhận nhu cầu",
    body: "KEYON tiếp nhận thông tin sản phẩm và quy mô sử dụng.",
  },
  {
    title: "Tư vấn phương án",
    body: "Đề xuất loại bản quyền, số lượng và thời hạn phù hợp.",
  },
  {
    title: "Gửi báo giá",
    body: "Gửi thông tin giá và phương án sử dụng để doanh nghiệp tham khảo.",
  },
  {
    title: "Hỗ trợ mua và kích hoạt",
    body: "Hỗ trợ thanh toán, bàn giao và kích hoạt khi doanh nghiệp quyết định mua.",
  },
];

const QUOTE_SIDEBAR = [
  "Tiếp nhận và phân tích nhu cầu",
  "Đề xuất phương án bản quyền",
  "Gửi báo giá chi tiết",
  "Hỗ trợ mua và kích hoạt",
] as const;

const IMPLEMENTATION_CARD_STEPS: StepCopy[] = [
  {
    title: "Tiếp nhận phạm vi",
    body: "KEYON tiếp nhận sản phẩm, số người dùng và đội IT phụ trách.",
  },
  {
    title: "Rà soát bản quyền",
    body: "Kiểm tra loại bản quyền và quy mô trước khi bàn giao.",
  },
  {
    title: "Bàn giao",
    body: "Chuẩn bị checklist và kế hoạch bàn giao cho đội IT.",
  },
  {
    title: "Hỗ trợ kích hoạt",
    body: "Hướng dẫn kích hoạt và các bước sau khi nhận bản quyền.",
  },
];

const IMPLEMENTATION_SIDEBAR = [
  "Tiếp nhận phạm vi bàn giao",
  "Rà soát bản quyền và quy mô",
  "Checklist bàn giao cho IT",
  "Hỗ trợ kích hoạt",
] as const;

function quoteHeroCopy(requestType: string): {
  title: string;
  lead: string;
  crumb: string;
  cardTitle: string;
  cardLead: string;
  cardSteps: readonly StepCopy[];
  sidebarTitle: string;
  sidebarSteps: readonly string[];
  usps: readonly UspCopy[];
  messagePlaceholder: string;
} {
  if (requestType === "IMPLEMENTATION") {
    return {
      title: "Yêu cầu hỗ trợ bàn giao và kích hoạt",
      lead: "Mô tả sản phẩm đã mua, số người dùng và đội IT phụ trách. KEYON tiếp nhận yêu cầu và hỗ trợ bàn giao, kích hoạt.",
      crumb: "Dịch vụ triển khai",
      cardTitle: "Quy trình bàn giao",
      cardLead: "Không cần tài khoản. Gửi phạm vi để KEYON hỗ trợ bàn giao và kích hoạt.",
      cardSteps: IMPLEMENTATION_CARD_STEPS,
      sidebarTitle: "KEYON hỗ trợ bạn từ bàn giao đến kích hoạt",
      sidebarSteps: IMPLEMENTATION_SIDEBAR,
      usps: QUOTE_USPS,
      messagePlaceholder:
        "Mô tả sản phẩm đã mua, số lượng người dùng và phần đội IT cần KEYON hỗ trợ kích hoạt.",
    };
  }
  return {
    title: "Nhận báo giá bản quyền phù hợp với nhu cầu doanh nghiệp",
    lead: "Cho KEYON biết sản phẩm, số lượng người dùng và nhu cầu của doanh nghiệp. Đội ngũ tư vấn sẽ đề xuất phương án bản quyền và gửi báo giá phù hợp để bạn tham khảo.",
    crumb: "Yêu cầu báo giá",
    cardTitle: "Quy trình báo giá",
    cardLead: "Không cần tài khoản. Gửi nhu cầu trực tiếp để KEYON tư vấn và báo giá.",
    cardSteps: QUOTE_CARD_STEPS,
    sidebarTitle: "KEYON hỗ trợ bạn từ tư vấn đến kích hoạt",
    sidebarSteps: QUOTE_SIDEBAR,
    usps: QUOTE_USPS,
    messagePlaceholder:
      "Mô tả sản phẩm, số lượng người dùng hoặc yêu cầu của doanh nghiệp...",
  };
}

const PROCESS = [
  {
    title: "Gửi yêu cầu",
    body: "Cung cấp thông tin liên hệ và nhu cầu bản quyền.",
  },
  {
    title: "Tiếp nhận & phân tích",
    body: "KEYON kiểm tra sản phẩm, số lượng và thời hạn sử dụng.",
  },
  {
    title: "Tư vấn giải pháp",
    body: "Đề xuất phương án license phù hợp với nhu cầu thực tế.",
  },
  {
    title: "Gửi báo giá",
    body: "Gửi thông tin giá và điều kiện áp dụng để doanh nghiệp tham khảo.",
  },
  {
    title: "Hỗ trợ mua và kích hoạt",
    body: "Hỗ trợ hoàn tất đơn hàng, bàn giao và kích hoạt license.",
  },
] as const;

function mapEstimatedUsers(raw?: string): EstimatedUsers {
  if (raw && (QUOTE_USER_RANGES as readonly string[]).includes(raw)) {
    return raw as EstimatedUsers;
  }
  if (raw === "5") return "1-5";
  if (raw === "10") return "6-25";
  if (raw === "50") return "26-50";
  if (raw === "100") return "51-100";
  if (raw === "100+") return "100+";
  const n = Number(raw);
  if (Number.isFinite(n) && n > 0) {
    if (n <= 5) return "1-5";
    if (n <= 25) return "6-25";
    if (n <= 50) return "26-50";
    if (n <= 100) return "51-100";
    return "100+";
  }
  return "6-25";
}

function UspIcon({ kind }: { kind: UspCopy["icon"] }) {
  if (kind === "consult") return <MessageCircle size={15} strokeWidth={1.9} aria-hidden />;
  if (kind === "quote") return <CheckCircle2 size={15} strokeWidth={1.9} aria-hidden />;
  return <ShieldCheck size={15} strokeWidth={1.9} aria-hidden />;
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
  publicTrackingEnabled = false,
}: {
  products: ProductOption[];
  contact: QuoteContactInfo;
  initial: QuoteInitial;
  publicTrackingEnabled?: boolean;
}) {
  const mappedUsers = mapEstimatedUsers(initial.estimatedUsers);
  const showHotline =
    Boolean(contact.hotlineValue?.trim()) &&
    !isPlaceholderHotline(contact.hotlineValue!);
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
    estimatedUsers: mappedUsers,
    licenseType: "UNDECIDED",
    message: "",
    privacyAccepted: false,
    companyUrl: "",
  }));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const turnstileSiteKey = useTurnstileSiteKey();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);

  const requestType = (initial.requestType || "GENERAL").toUpperCase();
  const sourcePath = initial.sourcePath || "/contact/quote";
  const hero = quoteHeroCopy(requestType);

  const interestChoices = useMemo(() => {
    const names = new Set(PRODUCT_INTERESTS.map((p) => p.name));
    const extra = form.interestedProducts.filter((p) => !names.has(p.name));
    return [...extra, ...PRODUCT_INTERESTS];
  }, [form.interestedProducts]);

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
    if (form.companyName.trim().length < 2) e.companyName = "Vui lòng nhập tên doanh nghiệp.";
    else if (form.companyName.trim().length > 200) {
      e.companyName = "Tên doanh nghiệp tối đa 200 ký tự.";
    }
    return e;
  }

  function validateStep2(): FieldErrors {
    const e: FieldErrors = {};
    if (!form.estimatedUsers) e.estimatedUsers = "Vui lòng chọn số lượng người dùng.";
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
      else if (next.estimatedUsers || next.message) setStep(2);
      else setStep(3);
      focusFirstError(next);
      return;
    }

    setLoading(true);
    try {
      if (turnstileSiteKey && !turnstileToken) {
        throw new Error("Vui lòng xác nhận bạn không phải robot");
      }
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
          estimatedUsersOther: null,
          licenseType: form.licenseType,
          term: "UNDECIDED",
          message: form.message.trim(),
          privacyAccepted: true,
          requestType,
          sourcePath,
          companyUrl: form.companyUrl,
          turnstileToken: turnstileToken ?? undefined,
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

  const usersSummary = ESTIMATED_USERS_LABEL[form.estimatedUsers];

  function toggleInterest(option: ProductOption) {
    const selected = form.interestedProducts.some((p) => p.name === option.name);
    setField(
      "interestedProducts",
      selected
        ? form.interestedProducts.filter((p) => p.name !== option.name)
        : [...form.interestedProducts, option],
    );
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-border bg-[#F7FAFC]">
        <div className="home-container home-section">
          <nav className={`${LANDING_CRUMB_GAP} flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
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
            <span className={BREADCRUMB_CURRENT_CLASS}>{hero.crumb}</span>
          </nav>

          <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-10 xl:gap-12">
            <div className="flex h-full min-w-0 flex-col">
              <h1 className={HERO_TITLE_CLASS}>{hero.title}</h1>
              <p className={`mt-3 max-w-xl ${PAGE_LEAD_CLASS}`}>{hero.lead}</p>
              <ul className="mt-6 space-y-4">
                {hero.usps.map((usp) => (
                  <li key={usp.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                      <UspIcon kind={usp.icon} />
                    </span>
                    <span>
                      <span className={`block ${CARD_TITLE_CLASS}`}>{usp.title}</span>
                      <span className={`mt-0.5 block ${BODY_MUTED_CLASS}`}>{usp.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden h-full min-w-0 lg:block" aria-hidden>
              <div
                className={`flex h-full flex-col rounded-2xl border border-border bg-white p-5 sm:p-6 ${ELEVATION_HAIRLINE}`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Send size={20} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className={CARD_TITLE_CLASS}>{hero.cardTitle}</p>
                    <p className={`mt-1 ${BODY_MUTED_CLASS}`}>{hero.cardLead}</p>
                  </div>
                </div>
                <ol className="mt-5 flex flex-1 flex-col justify-between gap-3">
                  {hero.cardSteps.map((s, i) => (
                    <li key={s.title} className="flex flex-1 items-center gap-2.5">
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy text-white ${BADGE_CLASS}`}>
                        {i + 1}
                      </span>
                      <span>
                        <span className={`block ${CARD_TITLE_CLASS}`}>{s.title}</span>
                        <span className={`mt-0.5 block ${BODY_MUTED_CLASS}`}>{s.body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="home-container home-section">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-8">
            {submitted ? (
              <SuccessPanel
                referenceCode={referenceCode}
                publicTrackingEnabled={publicTrackingEnabled}
              />
            ) : (
              <div className={`rounded-2xl border border-border bg-white p-5 sm:p-6 md:p-7 ${ELEVATION_HAIRLINE}`}>
                <Stepper step={step} />

                {step === 1 ? (
                  <div className="mt-7 space-y-4">
                    <div>
                      <h2 className={CARD_TITLE_CLASS}>Thông tin liên hệ</h2>
                      <p className={`mt-1 ${BODY_MUTED_CLASS}`}>
                        Cho KEYON biết cách liên hệ với bạn.
                      </p>
                    </div>
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
                          placeholder="Nguyễn Văn A"
                          maxLength={100}
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
                          placeholder="you@company.com"
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
                          placeholder="09xx xxx xxx"
                          maxLength={40}
                        />
                      </Field>
                      <Field
                        id="companyName"
                        label="Tên doanh nghiệp"
                        required
                        error={errors.companyName}
                      >
                        <input
                          id="companyName"
                          data-field="companyName"
                          className={`${INPUT} ${errors.companyName ? INPUT_ERR : ""}`}
                          value={form.companyName}
                          onChange={(e) => setField("companyName", e.target.value)}
                          autoComplete="organization"
                          placeholder="Tên công ty / tổ chức"
                          maxLength={200}
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
                          placeholder="Ví dụ: IT Manager, Procurement..."
                          maxLength={120}
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
                    <div>
                      <h2 className={CARD_TITLE_CLASS}>Nhu cầu bản quyền</h2>
                      <p className={`mt-1 ${BODY_MUTED_CLASS}`}>
                        Thông tin này giúp KEYON đề xuất phương án và báo giá sát nhu cầu.
                      </p>
                    </div>

                    <div>
                      <span className={FORM_LABEL_CLASS}>Sản phẩm bạn quan tâm</span>
                      <div
                        className="mt-2 flex flex-wrap gap-2"
                        role="group"
                        aria-label="Sản phẩm bạn quan tâm"
                      >
                        {interestChoices.map((p) => {
                          const active = form.interestedProducts.some((x) => x.name === p.name);
                          return (
                            <button
                              key={p.name}
                              type="button"
                              aria-pressed={active}
                              onClick={() => toggleInterest(p)}
                              className={`inline-flex h-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold ${TRANSITION_UI} ${
                                active
                                  ? "border-accent bg-accent-soft text-accent"
                                  : "border-border bg-white text-navy hover:border-accent/40"
                              }`}
                            >
                              {p.name}
                            </button>
                          );
                        })}
                      </div>
                      <p className={`mt-2 ${CARD_META_CLASS}`}>
                        Có thể chọn nhiều mục. Chi tiết thêm ở phần mô tả bên dưới.
                      </p>
                    </div>

                    <div>
                      <span className={FORM_LABEL_CLASS}>
                        Số lượng người dùng <span className="text-red-500">*</span>
                      </span>
                      <div
                        className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5"
                        role="group"
                        aria-label="Số lượng người dùng"
                      >
                        {QUOTE_USER_RANGES.map((v) => {
                          const active = form.estimatedUsers === v;
                          return (
                            <button
                              key={v}
                              type="button"
                              data-field="estimatedUsers"
                              onClick={() => setField("estimatedUsers", v)}
                              className={`inline-flex h-12 items-center justify-center rounded-xl border text-sm font-semibold ${TRANSITION_UI} ${
                                active
                                  ? "border-accent bg-accent-soft text-accent"
                                  : "border-border bg-white text-navy hover:border-accent/40"
                              }`}
                            >
                              {RANGE_SHORT[v]}
                            </button>
                          );
                        })}
                      </div>
                      <FieldError message={errors.estimatedUsers} />
                    </div>

                    <div>
                      <span className={FORM_LABEL_CLASS}>Hình thức nhu cầu</span>
                      <div
                        className="mt-2 flex flex-wrap gap-2"
                        role="group"
                        aria-label="Hình thức nhu cầu"
                      >
                        {NEED_OPTIONS.map((opt) => {
                          const active = form.licenseType === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              aria-pressed={active}
                              onClick={() => setField("licenseType", opt.id)}
                              className={`inline-flex h-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold ${TRANSITION_UI} ${
                                active
                                  ? "border-accent bg-accent-soft text-accent"
                                  : "border-border bg-white text-navy hover:border-accent/40"
                              }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <label className="block">
                      <span className={FORM_LABEL_CLASS}>Nội dung cần tư vấn</span>
                      <textarea
                        data-field="message"
                        rows={5}
                        maxLength={2000}
                        className={`${TEXTAREA} ${errors.message ? INPUT_ERR : ""}`}
                        value={form.message}
                        onChange={(e) => setField("message", e.target.value)}
                        placeholder={hero.messagePlaceholder}
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
                        className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 text-sm font-semibold text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                      >
                        <ArrowLeft size={16} strokeWidth={2.2} aria-hidden />
                        Quay lại
                      </button>
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

                {step === 3 ? (
                  <div className="mt-7 space-y-5">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className={CARD_TITLE_CLASS}>Xác nhận yêu cầu</h2>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className={LINK_FIELD_CLASS}
                      >
                        Chỉnh sửa
                      </button>
                    </div>

                    <div className="space-y-4 rounded-xl border border-border bg-[#F7FAFC] p-4 sm:p-5">
                      <div>
                        <h3 className={CARD_TITLE_CLASS}>Thông tin liên hệ</h3>
                        <dl className="mt-3 grid gap-3">
                          <SummaryRow label="Họ và tên" value={form.fullName} />
                          <SummaryRow label="Email" value={form.email} />
                          <SummaryRow label="Số điện thoại" value={form.phone} />
                          <SummaryRow label="Doanh nghiệp" value={form.companyName} />
                          {form.jobTitle ? (
                            <SummaryRow label="Chức vụ" value={form.jobTitle} />
                          ) : null}
                        </dl>
                      </div>
                      <div className="border-t border-border pt-4">
                        <h3 className={CARD_TITLE_CLASS}>Nhu cầu</h3>
                        <dl className="mt-3 grid gap-3">
                          <SummaryRow
                            label="Sản phẩm"
                            value={
                              form.interestedProducts.length
                                ? form.interestedProducts.map((p) => p.name).join(", ")
                                : "—"
                            }
                          />
                          <SummaryRow label="Số người dùng" value={usersSummary} />
                          <SummaryRow
                            label="Hình thức"
                            value={LICENSE_TYPE_LABEL[form.licenseType]}
                          />
                          <SummaryRow label="Nội dung" value={form.message.trim() || "—"} />
                        </dl>
                      </div>
                    </div>

                    <label className="flex items-start gap-3" data-field="privacyAccepted">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
                        checked={form.privacyAccepted}
                        onChange={(e) => setField("privacyAccepted", e.target.checked)}
                      />
                      <span className="text-sm leading-relaxed text-navy">
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

                    {turnstileSiteKey ? (
                      <TurnstileField
                        siteKey={turnstileSiteKey}
                        onToken={setTurnstileToken}
                      />
                    ) : null}

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
                        className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 text-sm font-semibold text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent ${OPACITY_DISABLED_BUSY}`}
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
                            Gửi yêu cầu báo giá
                            <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
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
              <h2 className={CARD_TITLE_CLASS}>{hero.sidebarTitle}</h2>
              <ul className="mt-4 space-y-3">
                {hero.sidebarSteps.map((s) => (
                  <li key={s} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <Check size={11} strokeWidth={3} aria-hidden />
                    </span>
                    <span className="text-sm leading-snug text-navy">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {(showHotline || contact.emailValue || contact.mapAddress) && (
              <div className={`rounded-2xl border border-border bg-[#F7FAFC] p-5 ${ELEVATION_HAIRLINE}`}>
                <h2 className={CARD_TITLE_CLASS}>Liên hệ trực tiếp</h2>
                <ul className="mt-4 space-y-3 text-[13px] text-navy">
                  {contact.hoursValue ? (
                    <li>
                      <span className="font-semibold">Giờ hỗ trợ: </span>
                      {contact.hoursValue}
                    </li>
                  ) : null}
                  {showHotline ? (
                    <li>
                      <span className="font-semibold">Hotline: </span>
                      <a
                        href={`tel:${contact.hotlineValue!.replace(/\s/g, "")}`}
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
      <section className="border-t border-border bg-[#F7FAFC] home-section">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình nhận báo giá tại KEYON</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Từ khi gửi yêu cầu đến khi nhận báo giá và hỗ trợ kích hoạt — rõ ràng theo từng bước.
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

function SuccessPanel({
  referenceCode,
  publicTrackingEnabled,
}: {
  referenceCode: string | null;
  publicTrackingEnabled: boolean;
}) {
  const trackHref =
    referenceCode && publicTrackingEnabled
      ? `/contact/quote/status?ref=${encodeURIComponent(referenceCode)}`
      : null;
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
      {trackHref ? (
        <p className={`mx-auto mt-3 max-w-md ${CARD_META_CLASS}`}>
          Kiểm tra email xác nhận hoặc{" "}
          <Link href={trackHref} className={HOVER_LINK_ACCENT}>
            tra cứu trạng thái
          </Link>{" "}
          bằng mã QT- và OTP.
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
