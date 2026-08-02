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
  CTA_LABEL_CLASS,
  FORM_ERROR_CLASS,
  FORM_LABEL_CLASS,
  FORM_SUCCESS_CLASS,
  INPUT_TEXT_CLASS,
  SECTION_LEAD_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_HAIRLINE,
  HOVER_LINK_ACCENT,
  HOVER_OUTLINE_FILL,
  OPACITY_DISABLED_BUSY,
  TRANSITION_UI,
} from "@/storefront/effects";

const INPUT =
  `h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-3 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent focus:bg-white`;
const TEXTAREA =
  `w-full rounded-xl border border-border bg-surface px-3 py-2.5 pl-10 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent focus:bg-white`;

export function ContactView({ cms }: { cms: CmsContact }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [privacy, setPrivacy] = useState(false);
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
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  const chatHref = cms.chatHref?.trim() || cms.instantCtaHref;
  const instantExternal = isExternalHref(cms.instantCtaHref);

  return (
    <div className="bg-white">
      {/* Hero — đồng bộ trang chính sách (navy full-bleed, gọn) */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 55% 80% at 90% 40%, rgba(14,165,164,0.22), transparent 55%)",
          }}
        />
        <div className="home-container relative py-5 md:py-6">
          <nav
            className={`flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS} !text-white/65`}
          >
            <Link href="/" className={`${TRANSITION_UI} hover:text-accent`}>
              Trang chủ
            </Link>
            <span aria-hidden>›</span>
            <span className={`${BREADCRUMB_CURRENT_CLASS} !text-white/90`}>
              Liên hệ
            </span>
          </nav>
          <h1 className={`mt-3 ${SUBSECTION_TITLE_CLASS} !text-white md:text-2xl`}>
            {cms.heroTitle}{" "}
            <span className="text-accent">{cms.heroTitleAccent}</span>
          </h1>
          <p className={`mt-2 max-w-2xl ${SECTION_LEAD_CLASS} !text-white/75`}>
            {cms.heroLead}
          </p>
        </div>
      </section>

      <div className="bg-[#F4F8FB]">
        <div className="home-container space-y-5 py-6 md:space-y-6 md:py-8">
          {/* Bản đồ — tách khỏi hero */}
          <ContactMap
            embedUrl={cms.mapEmbedUrl}
            company={cms.mapCompany}
            address={cms.mapAddress}
            mapsUrl={cms.mapMapsUrl}
            mapsCta={cms.mapMapsCta}
          />

          {/* Info + Form + Instant */}
          <section className="grid gap-5 lg:grid-cols-[minmax(15rem,0.9fr)_minmax(0,1.4fr)_minmax(14rem,0.85fr)] lg:items-stretch lg:gap-5">
            <aside className="relative overflow-hidden rounded-2xl bg-navy p-6 text-white sm:p-7 lg:p-8">
              <h2 className={`${SUBSECTION_TITLE_CLASS} !text-white`}>
                {cms.infoTitle}
              </h2>
              <p className={`mt-2 ${SECTION_LEAD_CLASS} !text-white/65`}>
                {cms.infoLead}
              </p>
              <ul className="mt-7 space-y-5">
                <InfoRow
                  icon={<PhoneIcon />}
                  label={cms.hotlineLabel}
                  value={
                    <a
                      href={`tel:${cms.hotlineValue.replace(/\s/g, "")}`}
                      className={`${TRANSITION_UI} hover:text-accent`}
                    >
                      {cms.hotlineValue}
                    </a>
                  }
                  hint={cms.hotlineHint}
                />
                <InfoRow
                  icon={<MailIcon />}
                  label={cms.emailLabel}
                  value={
                    <a
                      href={`mailto:${cms.emailValue}`}
                      className={`break-all ${TRANSITION_UI} hover:text-accent`}
                    >
                      {cms.emailValue}
                    </a>
                  }
                  hint={cms.emailHint}
                />
                <InfoRow
                  icon={<ChatIcon />}
                  label={cms.chatLabel}
                  value={
                    <a
                      href={chatHref}
                      className={`${TRANSITION_UI} hover:text-accent`}
                    >
                      {cms.chatValue}
                    </a>
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
            </aside>

          <div
            className={`rounded-2xl border border-border bg-white p-6 sm:p-7 lg:p-8 ${ELEVATION_HAIRLINE}`}
          >
            <h2 className={SUBSECTION_TITLE_CLASS}>{cms.formTitle}</h2>
            <p className={`mt-1.5 ${SECTION_LEAD_CLASS}`}>{cms.formLead}</p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={cms.formNameLabel} icon={<UserIcon />}>
                  <input
                    required
                    className={INPUT}
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
                    className={INPUT}
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
                    className={INPUT}
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
                      className={`${INPUT} appearance-none pr-9`}
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

              {err ? (
                <p id="contact-form-error" role="alert" className={FORM_ERROR_CLASS}>
                  {err}
                </p>
              ) : null}
              {ok ? (
                <p id="contact-form-success" role="status" className={FORM_SUCCESS_CLASS}>
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

          <aside
            className={`flex flex-col rounded-2xl border border-border bg-white p-6 sm:p-7 lg:p-8 ${ELEVATION_HAIRLINE}`}
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
              <HeadsetIcon />
            </span>
            <h2 className={`mt-4 ${SUBSECTION_TITLE_CLASS}`}>
              {cms.instantTitle}
            </h2>
            <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>{cms.instantBody}</p>
            {instantExternal ? (
              <a
                href={cms.instantCtaHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-accent bg-white px-4 ${CTA_LABEL_CLASS} text-accent ${TRANSITION_UI} ${HOVER_OUTLINE_FILL}`}
              >
                {cms.instantCta}
                <span aria-hidden>→</span>
              </a>
            ) : (
              <Link
                href={cms.instantCtaHref}
                className={`mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-accent bg-white px-4 ${CTA_LABEL_CLASS} text-accent ${TRANSITION_UI} ${HOVER_OUTLINE_FILL}`}
              >
                {cms.instantCta}
                <span aria-hidden>→</span>
              </Link>
            )}
            <ul className="mt-auto space-y-3 pt-6">
              {cms.instantPerks.map((perk) => (
                <li key={perk} className="flex items-start gap-2.5">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[11px] font-bold text-accent">
                    ✓
                  </span>
                  <span className={BODY_CLASS}>{perk}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>
        </div>
      </div>
    </div>
  );
}

function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/i.test(href.trim());
}

/** Bản đồ tách hero — click-to-interact để không chiếm scroll trang. */
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
      className={`relative overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_HAIRLINE}`}
      onMouseLeave={() => setActive(false)}
    >
      <div className="relative aspect-[2.35/1] min-h-[200px] max-h-[300px] w-full bg-surface sm:min-h-[220px]">
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
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-sky-50 to-teal-50" />
        )}

        {!active && embedUrl ? (
          <button
            type="button"
            onClick={() => setActive(true)}
            className={`absolute inset-0 z-[1] flex items-center justify-center bg-navy/[0.04] ${TRANSITION_UI} hover:bg-navy/[0.07]`}
            aria-label="Nhấn để tương tác bản đồ"
          >
            <span
              className={`inline-flex items-center gap-2 rounded-full border border-border bg-white/95 px-4 py-2 text-[13px] font-semibold text-navy ${ELEVATION_HAIRLINE}`}
            >
              <PinIcon />
              Nhấn để xem bản đồ
            </span>
          </button>
        ) : null}
      </div>

      <div
        className={`absolute left-4 top-4 z-[2] max-w-[min(100%-2rem,20rem)] rounded-2xl border border-border bg-white/95 p-4 backdrop-blur-[2px] sm:left-5 sm:top-5 sm:p-5 ${ELEVATION_HAIRLINE}`}
      >
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
            <PinIcon />
          </span>
          <div className="min-w-0">
            <p className={CARD_TITLE_CLASS}>{company}</p>
            <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{address}</p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent ${TRANSITION_UI} hover:underline`}
            >
              {mapsCta}
              <ExternalIcon />
            </a>
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
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-accent">
        {icon}
      </span>
      <div className="min-w-0">
        <p className={`text-xs font-medium uppercase tracking-wide text-white/50`}>
          {label}
        </p>
        <p className={`mt-0.5 ${CARD_TITLE_CLASS} !text-white`}>{value}</p>
        <p className={`mt-0.5 ${CARD_META_CLASS} !text-white/55`}>{hint}</p>
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

function ChatIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M5 6.5h14v9H9l-4 3v-12Z" />
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

function HeadsetIcon() {
  return (
    <svg {...iconProps(22)}>
      <path d="M4.5 13.5v-2a7.5 7.5 0 0 1 15 0v2" />
      <path d="M4.5 13.5a2 2 0 0 0 2 2H8v-5H6.5a2 2 0 0 0-2 2v1Z" />
      <path d="M19.5 13.5a2 2 0 0 1-2 2H16v-5h1.5a2 2 0 0 1 2 2v1Z" />
    </svg>
  );
}
