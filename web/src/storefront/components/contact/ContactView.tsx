"use client";

import Link from "next/link";
import { useState } from "react";
import type { CmsContact } from "@/server/cms/types";
import {
  BODY_CLASS,
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  FORM_ERROR_CLASS,
  FORM_LABEL_CLASS,
  FORM_SUCCESS_CLASS,
  INPUT_TEXT_CLASS,
  PAGE_LEAD_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_NONE,
  HOVER_LINK_ACCENT,
  HOVER_OUTLINE_FILL,
  OPACITY_DISABLED_BUSY,
  TRANSITION_UI,
} from "@/storefront/effects";
import { normalizeMapEmbedUrl } from "@/storefront/lib/map-embed";
import { TurnstileField } from "@/storefront/components/auth/TurnstileField";
import { useTurnstileSiteKey } from "@/storefront/components/auth/use-turnstile-site-key";
import { isPlaceholderHotline } from "@/storefront/components/support/shared";

const INPUT_ICON =
  `h-11 w-full rounded-xl border border-border bg-white pl-10 pr-3 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent focus:ring-2 focus:ring-accent/20`;
const TEXTAREA =
  `w-full rounded-xl border border-border bg-white px-3 py-2.5 pl-10 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent focus:ring-2 focus:ring-accent/20`;

export function ContactView({ cms }: { cms: CmsContact }) {
  const turnstileSiteKey = useTurnstileSiteKey();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    if (!privacy) {
      setErr("Vui lòng đồng ý với Chính sách bảo mật.");
      return;
    }
    if (turnstileSiteKey && !turnstileToken) {
      setErr("Vui lòng xác nhận bạn không phải robot");
      return;
    }
    setLoading(true);
    try {
      const topicLabel =
        cms.formTopics.find((t) => t.id === topic)?.label ?? topic;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          topic: topicLabel,
          message,
          turnstileToken: turnstileToken ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gửi thất bại");
      setOk(cms.formSuccess);
      setName("");
      setEmail("");
      setPhone("");
      setTopic("");
      setMessage("");
      setPrivacy(false);
      setTurnstileToken(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  const chatHref = cms.chatHref?.trim() || cms.instantCtaHref;
  const instantExternal = isExternalHref(cms.instantCtaHref);
  const showHotline =
    Boolean(cms.hotlineValue.trim()) &&
    !isPlaceholderHotline(cms.hotlineValue);

  return (
    <div className="bg-white">
      <section className="relative overflow-x-clip border-b border-border bg-[#F7FAFC]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(14,165,164,0.07),transparent_55%)]"
          aria-hidden
        />
        <div className="home-container relative py-8 md:py-10">
          <nav
            className={`mb-5 flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}
          >
            <Link href="/" className={HOVER_LINK_ACCENT}>
              Trang chủ
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <span className={BREADCRUMB_CURRENT_CLASS}>Liên hệ</span>
          </nav>
          <h1 className={PAGE_TITLE_CLASS}>
            {cms.heroTitle}{" "}
            <span className="text-accent">{cms.heroTitleAccent}</span>
          </h1>
          <p className={`mt-3 max-w-2xl ${PAGE_LEAD_CLASS}`}>{cms.heroLead}</p>
        </div>
      </section>

      <div className="home-container space-y-8 py-8 md:space-y-10 md:py-10">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(16rem,0.9fr)] lg:items-start lg:gap-8">
          <div
            className={`rounded-2xl border border-border bg-white p-5 sm:p-6 lg:p-7 ${ELEVATION_NONE}`}
          >
            <h2 className={SUBSECTION_TITLE_CLASS}>{cms.formTitle}</h2>
            <p className={`mt-1.5 ${SECTION_LEAD_CLASS}`}>{cms.formLead}</p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={cms.formNameLabel} icon={<UserIcon />}>
                  <input
                    required
                    className={INPUT_ICON}
                    placeholder={cms.formNamePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    aria-invalid={err ? true : undefined}
                    aria-describedby={err ? "contact-form-error" : undefined}
                  />
                </Field>
                <Field label={cms.formEmailLabel} icon={<MailIcon />}>
                  <input
                    type="email"
                    required
                    className={INPUT_ICON}
                    placeholder={cms.formEmailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    aria-invalid={err ? true : undefined}
                    aria-describedby={err ? "contact-form-error" : undefined}
                  />
                </Field>
                <Field label={cms.formPhoneLabel} icon={<PhoneIcon />}>
                  <input
                    type="tel"
                    className={INPUT_ICON}
                    placeholder={cms.formPhonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                  />
                </Field>
                <Field label={cms.formTopicLabel} icon={<TagIcon />}>
                  <div className="relative">
                    <select
                      required
                      className={`${INPUT_ICON} appearance-none pr-9`}
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    >
                      <option value="">{cms.formTopicPlaceholder}</option>
                      {cms.formTopics.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                      <ChevronIcon />
                    </span>
                  </div>
                </Field>
              </div>

              <Field label={cms.formMessageLabel} icon={<PenIcon />}>
                <textarea
                  required
                  rows={5}
                  className={TEXTAREA}
                  placeholder={cms.formMessagePlaceholder}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Field>

              <label className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={privacy}
                  onChange={(e) => setPrivacy(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border accent-accent"
                />
                <span className={BODY_MUTED_CLASS}>
                  Tôi đồng ý với{" "}
                  <Link
                    href={cms.formPrivacyHref}
                    className={HOVER_LINK_ACCENT}
                  >
                    Chính sách bảo mật
                  </Link>{" "}
                  và cho phép KEYON xử lý thông tin của tôi.
                </span>
              </label>

              {turnstileSiteKey ? (
                <TurnstileField
                  siteKey={turnstileSiteKey}
                  onToken={setTurnstileToken}
                />
              ) : null}

              {err ? (
                <p
                  id="contact-form-error"
                  role="alert"
                  className={FORM_ERROR_CLASS}
                >
                  {err}
                </p>
              ) : null}
              {ok ? (
                <p
                  id="contact-form-success"
                  role="status"
                  className={FORM_SUCCESS_CLASS}
                >
                  {ok}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${OPACITY_DISABLED_BUSY}`}
              >
                {loading ? "Đang gửi…" : cms.formSubmit}
                <SendIcon />
              </button>
            </form>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div
              className={`rounded-2xl border border-border bg-[#F7FAFC] p-5 sm:p-6 ${ELEVATION_NONE}`}
            >
              <h2 className={SUBSECTION_TITLE_CLASS}>{cms.infoTitle}</h2>
              <p className={`mt-1.5 ${SECTION_LEAD_CLASS}`}>{cms.infoLead}</p>
              <ul className="mt-5 space-y-4">
                {showHotline ? (
                  <InfoRow
                    icon={<PhoneIcon />}
                    label={cms.hotlineLabel}
                    value={
                      <a
                        href={`tel:${cms.hotlineValue.replace(/\s/g, "")}`}
                        className={HOVER_LINK_ACCENT}
                      >
                        {cms.hotlineValue}
                      </a>
                    }
                    hint={cms.hotlineHint}
                  />
                ) : null}
                <InfoRow
                  icon={<MailIcon />}
                  label={cms.emailLabel}
                  value={
                    <a
                      href={`mailto:${cms.emailValue}`}
                      className={`break-all ${HOVER_LINK_ACCENT}`}
                    >
                      {cms.emailValue}
                    </a>
                  }
                  hint={cms.emailHint}
                />
                <InfoRow
                  icon={<TicketIcon />}
                  label={cms.chatLabel}
                  value={
                    <Link href={chatHref} className={HOVER_LINK_ACCENT}>
                      {cms.chatValue}
                    </Link>
                  }
                  hint={cms.chatHint}
                />
                <InfoRow
                  icon={<ClockIcon />}
                  label={cms.hoursLabel}
                  value={cms.hoursValue}
                  hint={cms.hoursHint}
                />
              </ul>
            </div>

            <div
              className={`rounded-2xl border border-border bg-white p-5 sm:p-6 ${ELEVATION_NONE}`}
            >
              <h2 className={SUBSECTION_TITLE_CLASS}>{cms.instantTitle}</h2>
              <p className={`mt-1.5 ${SECTION_LEAD_CLASS}`}>{cms.instantBody}</p>
              {instantExternal ? (
                <a
                  href={cms.instantCtaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-accent bg-white px-4 ${CTA_COMPACT_CLASS} text-accent ${TRANSITION_UI} ${HOVER_OUTLINE_FILL}`}
                >
                  {cms.instantCta}
                  <span aria-hidden>→</span>
                </a>
              ) : (
                <Link
                  href={cms.instantCtaHref}
                  className={`mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-accent bg-white px-4 ${CTA_COMPACT_CLASS} text-accent ${TRANSITION_UI} ${HOVER_OUTLINE_FILL}`}
                >
                  {cms.instantCta}
                  <span aria-hidden>→</span>
                </Link>
              )}
              <ul className="mt-4 space-y-2 border-t border-border pt-4">
                <QuickLink href="/support" label="Trung tâm hỗ trợ" />
                <QuickLink href="/faq" label="Câu hỏi thường gặp" />
                <QuickLink href="/contact/quote" label="Báo giá doanh nghiệp" />
              </ul>
              {cms.instantPerks.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {cms.instantPerks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                        <CheckIcon />
                      </span>
                      <span className={BODY_MUTED_CLASS}>{perk}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </aside>
        </section>

        <ContactMap
          embedUrl={normalizeMapEmbedUrl(cms.mapEmbedUrl)}
          company={cms.mapCompany}
          address={cms.mapAddress}
          mapsUrl={cms.mapMapsUrl}
          mapsCta={cms.mapMapsCta}
        />
      </div>
    </div>
  );
}

function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/i.test(href.trim());
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className={`inline-flex items-center gap-1.5 ${BODY_CLASS} font-medium text-navy ${TRANSITION_UI} hover:text-accent`}
      >
        <span aria-hidden className="text-accent">
          →
        </span>
        {label}
      </Link>
    </li>
  );
}

/** Click-to-interact map so page scroll is not captured by the iframe. */
function ContactMap({
  embedUrl,
  company,
  address,
  mapsUrl,
  mapsCta,
}: {
  embedUrl: string;
  company: string;
  address: string;
  mapsUrl: string;
  mapsCta: string;
}) {
  const [active, setActive] = useState(false);

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_NONE}`}
      onMouseLeave={() => setActive(false)}
    >
      <div className="relative aspect-[2.35/1] min-h-[200px] max-h-[300px] w-full bg-[#F7FAFC] sm:min-h-[220px]">
        {embedUrl ? (
          <iframe
            title="Bản đồ KEYON"
            src={embedUrl}
            className={`absolute inset-0 h-full w-full border-0 ${
              active ? "pointer-events-auto" : "pointer-events-none"
            }`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            tabIndex={active ? 0 : -1}
          />
        ) : (
          <div className="absolute inset-0 bg-[#F7FAFC]" />
        )}

        {!active && embedUrl ? (
          <button
            type="button"
            onClick={() => setActive(true)}
            className={`absolute inset-0 z-[1] flex items-center justify-center bg-navy/[0.03] ${TRANSITION_UI} hover:bg-navy/[0.06]`}
            aria-label="Nhấn để tương tác bản đồ"
          >
            <span
              className={`inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 ${CTA_COMPACT_CLASS} text-navy`}
            >
              <PinIcon />
              Nhấn để xem bản đồ
            </span>
          </button>
        ) : null}
      </div>

      <div
        className={`absolute left-4 top-4 z-[2] max-w-[min(100%-2rem,20rem)] rounded-2xl border border-border bg-white/95 p-4 backdrop-blur-[2px] sm:left-5 sm:top-5 sm:p-5 ${ELEVATION_NONE}`}
      >
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
            <PinIcon />
          </span>
          <div className="min-w-0">
            <p className={CARD_TITLE_CLASS}>{company}</p>
            {address.trim() ? (
              <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{address}</p>
            ) : null}
            {mapsUrl.trim() ? (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-3 inline-flex items-center gap-1.5 ${CTA_COMPACT_CLASS} text-accent ${TRANSITION_UI} hover:underline`}
              >
                {mapsCta}
                <ExternalIcon />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="relative block">
      <span className={FORM_LABEL_CLASS}>{label}</span>
      <span className="pointer-events-none absolute left-3 top-[2.15rem] text-muted">
        {icon}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function InfoRow({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint: string;
}) {
  return (
    <li className="flex gap-3">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-accent">
        {icon}
      </span>
      <div className="min-w-0">
        <p className={CARD_META_CLASS}>{label}</p>
        <p className={`mt-0.5 ${CARD_TITLE_CLASS}`}>{value}</p>
        {hint ? (
          <p className={`mt-0.5 ${BODY_MUTED_CLASS}`}>{hint}</p>
        ) : null}
      </div>
    </li>
  );
}

function iconProps(size = 16) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    "aria-hidden": true as const,
  };
}

function ChevronIcon() {
  return (
    <svg {...iconProps(14)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg {...iconProps(18)}>
      <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg {...iconProps(14)}>
      <path d="M14 4h6v6M20 4 10 14" />
      <path d="M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M7.5 3.5h3L12 8l-2 1.5a12 12 0 0 0 4.5 4.5L16 12l4.5 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h13A1.5 1.5 0 0 1 20 8.5V11a1.5 1.5 0 0 0 0 3v2.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5V14a1.5 1.5 0 0 0 0-3V8.5Z" />
      <path d="M12 7v11" strokeDasharray="2 2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.5l3 2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M4 12V5.5A1.5 1.5 0 0 1 5.5 4H12l8 8-6.5 6.5L4 12Z" />
      <circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
      <path d="m13 5 4 4" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg {...iconProps(16)}>
      <path d="m4 12 16-8-8 16-2-6-6-2Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg {...iconProps(10)}>
      <path d="m5 8.5 2 2 4.5-5" />
    </svg>
  );
}
