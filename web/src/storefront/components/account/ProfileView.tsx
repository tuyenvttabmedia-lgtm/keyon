"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import type { AccountCopy } from "@/storefront/lib/account-cms";
import {
  IconReceipt,
  IconUser,
} from "@/storefront/components/icons/StoreIcons";
import {
  BADGE_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  FIELD_VALUE_CLASS,
  FIELD_VALUE_NUM_CLASS,
  FONT_DISPLAY,
  FORM_ERROR_CLASS,
  FORM_LABEL_CLASS,
  FORM_SUCCESS_CLASS,
  INLINE_PRICE_CLASS,
  INPUT_TEXT_CLASS,
  LINK_ACCENT_CLASS,
  LINK_FIELD_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  CARD_PORTAL,
  CTA_PRIMARY_EFFECT,
  ELEVATION_HAIRLINE,
  HOVER_FADE,
  HOVER_LINK_ACCENT,
  HOVER_OUTLINE_FILL,
  TRANSITION_UI,
} from "@/storefront/effects";

function formatVnd(n: number) {
  return `${n.toLocaleString("vi-VN")}đ`;
}

const CARD = CARD_PORTAL;

const BTN_OUTLINE = `inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} ${HOVER_OUTLINE_FILL}`;

const BTN_PRIMARY = `inline-flex h-11 items-center justify-center rounded-xl bg-navy px-4 ${CTA_LABEL_CLASS} text-white ${CTA_PRIMARY_EFFECT}`;

const INPUT_CLASS = `mt-1 w-full rounded-lg border border-border px-3 py-2 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`;

type EditableField = "name" | "phone" | "dateOfBirth" | "address";

export type ProfileActivity = {
  id: string;
  atLabel: string;
  title: string;
  meta: string;
  metaIsPrice?: boolean;
};

export type ProfileNoti = {
  id: string;
  title: string;
  dateLabel: string;
  href: string | null;
  tone: "success" | "info";
};

export type ProfileViewProps = {
  cms: AccountCopy;
  user: {
    name: string | null;
    email: string;
    phone: string | null;
    address: string | null;
    dateOfBirth: string | null;
    memberSinceLabel: string;
    initials: string;
  };
  stats: {
    completedOrders: number;
    totalSpendVnd: number;
  };
  security: {
    passwordUpdatedLabel: string;
    twoFactorEnabled: boolean;
    emailVerified: boolean;
  };
  activities: ProfileActivity[];
  notifications: ProfileNoti[];
};

export function ProfileView({
  cms,
  user,
  stats,
  security,
  activities,
  notifications,
}: ProfileViewProps) {
  const router = useRouter();
  const personalRef = useRef<HTMLElement>(null);
  const [editing, setEditing] = useState<EditableField | "all" | null>(null);
  const [name, setName] = useState(user.name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [address, setAddress] = useState(user.address ?? "");
  const [dob, setDob] = useState(user.dateOfBirth ?? "");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function startEdit(field: EditableField | "all") {
    setEditing(field);
    setErr(null);
    setMsg(null);
    personalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function cancelEdit() {
    setEditing(null);
    setName(user.name ?? "");
    setPhone(user.phone ?? "");
    setAddress(user.address ?? "");
    setDob(user.dateOfBirth ?? "");
    setErr(null);
  }

  async function save() {
    setSaving(true);
    setErr(null);
    setMsg(null);
    try {
      const payload: Record<string, string | null> = {};
      if (editing === "all" || editing === "name") payload.name = name.trim();
      if (editing === "all" || editing === "phone") payload.phone = phone.trim();
      if (editing === "all" || editing === "address")
        payload.address = address.trim();
      if (editing === "all" || editing === "dateOfBirth")
        payload.dateOfBirth = dob || null;

      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Không lưu được");
      setMsg("Đã cập nhật thông tin");
      setEditing(null);
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  }

  const display = (v: string | null | undefined) =>
    v && v.trim() ? v : cms.profileEmptyValue;

  const isEditing = (f: EditableField) =>
    editing === "all" || editing === f;

  return (
    <div className="space-y-5">
      <nav className={`flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
        <Link
          href="/account"
          className={HOVER_LINK_ACCENT}
        >
          Tài khoản
        </Link>
        <span aria-hidden>›</span>
        <span className={BREADCRUMB_CURRENT_CLASS}>{cms.profilePageTitle}</span>
      </nav>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className={PAGE_TITLE_CLASS}>{cms.profilePageTitle}</h1>
          <p className={`mt-1.5 ${SECTION_LEAD_CLASS}`}>{cms.profilePageLead}</p>
        </div>
        <button
          type="button"
          onClick={() => startEdit("all")}
          className={`${BTN_OUTLINE} shrink-0`}
        >
          <PencilIcon />
          {cms.profileEditCta}
        </button>
      </div>

      {/* Top: same 2-col grid as personal + security below */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className={CARD}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative mx-auto shrink-0 sm:mx-0">
              <span
                className={`inline-flex h-20 w-20 items-center justify-center rounded-full bg-navy ${FONT_DISPLAY} text-xl font-bold text-white sm:h-24 sm:w-24 sm:text-2xl`}
              >
                {user.initials}
              </span>
              <button
                type="button"
                title="Ảnh đại diện sắp có"
                className={`absolute bottom-0 right-0 inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-accent text-white ${ELEVATION_HAIRLINE} ${TRANSITION_UI} hover:bg-accent-hover`}
                onClick={() =>
                  setMsg("Tải ảnh đại diện sẽ có trong bản cập nhật tới.")
                }
              >
                <CameraIcon />
              </button>
            </div>
            <div className="min-w-0 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <p className={SUBSECTION_TITLE_CLASS}>{display(user.name)}</p>
                <span
                  className={`inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 ${BADGE_CLASS} text-emerald-700`}
                >
                  {cms.profileVerifiedBadge}
                </span>
              </div>
              <p className={`mt-1 ${SECTION_LEAD_CLASS}`}>{user.email}</p>
              <p className={`mt-0.5 ${CARD_META_CLASS}`}>
                {cms.profileMemberSincePrefix} {user.memberSinceLabel}
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            icon={<IconReceipt size={18} />}
            label={cms.profileOrdersStatLabel}
            value={String(stats.completedOrders)}
            sub={cms.profileOrdersStatSub}
            valueClass={FIELD_VALUE_NUM_CLASS}
          />
          <StatCard
            icon={<StarIcon />}
            label={cms.profileSpendStatLabel}
            value={formatVnd(stats.totalSpendVnd)}
            sub={cms.profileSpendStatSub}
            valueClass={INLINE_PRICE_CLASS}
          />
        </div>
      </div>

      {/* Personal + Security */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section ref={personalRef} className={CARD}>
          <h2 className={SUBSECTION_TITLE_CLASS}>{cms.profilePersonalTitle}</h2>
          <ul className="mt-4 divide-y divide-border">
            <FieldRow
              icon={<IconUser size={16} />}
              label={cms.profileFieldName}
              editing={isEditing("name")}
              onEdit={() => startEdit("name")}
              editCta={cms.profileEditCta}
            >
              {isEditing("name") ? (
                <input
                  className={INPUT_CLASS}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus={editing === "name"}
                />
              ) : (
                <p className={`mt-0.5 ${FIELD_VALUE_CLASS}`}>{display(user.name)}</p>
              )}
            </FieldRow>
            <FieldRow
              icon={<MailIcon />}
              label={cms.profileFieldEmail}
              editCta={cms.profileEditCta}
            >
              <p className={`mt-0.5 ${FIELD_VALUE_CLASS}`}>{user.email}</p>
            </FieldRow>
            <FieldRow
              icon={<PhoneIcon />}
              label={cms.profileFieldPhone}
              editing={isEditing("phone")}
              onEdit={() => startEdit("phone")}
              editCta={cms.profileEditCta}
            >
              {isEditing("phone") ? (
                <input
                  className={INPUT_CLASS}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoFocus={editing === "phone"}
                />
              ) : (
                <p className={`mt-0.5 ${FIELD_VALUE_CLASS}`}>{display(user.phone)}</p>
              )}
            </FieldRow>
            <FieldRow
              icon={<CalendarIcon />}
              label={cms.profileFieldDob}
              editing={isEditing("dateOfBirth")}
              onEdit={() => startEdit("dateOfBirth")}
              editCta={cms.profileEditCta}
            >
              {isEditing("dateOfBirth") ? (
                <input
                  type="date"
                  className={INPUT_CLASS}
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  autoFocus={editing === "dateOfBirth"}
                />
              ) : (
                <p className={`mt-0.5 ${FIELD_VALUE_CLASS}`}>
                  {user.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
                    : cms.profileEmptyValue}
                </p>
              )}
            </FieldRow>
            <FieldRow
              icon={<MapIcon />}
              label={cms.profileFieldAddress}
              editing={isEditing("address")}
              onEdit={() => startEdit("address")}
              editCta={cms.profileEditCta}
            >
              {isEditing("address") ? (
                <textarea
                  className={`${INPUT_CLASS} min-h-[4.5rem]`}
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  autoFocus={editing === "address"}
                />
              ) : (
                <p className={`mt-0.5 ${FIELD_VALUE_CLASS}`}>
                  {display(user.address)}
                </p>
              )}
            </FieldRow>
          </ul>

          {editing ? (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <button
                type="button"
                disabled={saving}
                onClick={save}
                className={BTN_PRIMARY}
              >
                {saving ? "Đang lưu…" : "Lưu thay đổi"}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={cancelEdit}
                className={BTN_OUTLINE}
              >
                Hủy
              </button>
            </div>
          ) : null}
          {err ? <p className={`mt-3 ${FORM_ERROR_CLASS}`}>{err}</p> : null}
          {msg ? <p className={`mt-3 ${FORM_SUCCESS_CLASS}`}>{msg}</p> : null}
        </section>

        <section className={CARD}>
          <h2 className={SUBSECTION_TITLE_CLASS}>
            {cms.profileSecurityCardTitle}
          </h2>

          {!security.emailVerified ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3">
              <p className={CARD_TITLE_CLASS}>Email chưa xác thực</p>
              <p className={`mt-1 ${CARD_META_CLASS} !text-amber-900`}>
                Xác thực email để xem license đã mua.{" "}
                <Link href="/account/security" className={LINK_ACCENT_CLASS}>
                  Xác thực ngay →
                </Link>
              </p>
            </div>
          ) : null}

          <ul className="mt-4 divide-y divide-border">
            <li>
              <Link
                href="/account/security"
                className={`flex items-center gap-3 py-3.5 ${TRANSITION_UI} ${HOVER_FADE}`}
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <LockIcon />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={FORM_LABEL_CLASS}>{cms.profilePasswordLabel}</p>
                  <p className={`mt-0.5 ${FIELD_VALUE_CLASS}`}>••••••••</p>
                  <p className={`mt-0.5 ${CARD_META_CLASS}`}>
                    {security.passwordUpdatedLabel}
                  </p>
                </div>
                <ChevronIcon />
              </Link>
            </li>
            <li>
              <Link
                href="/account/security#email"
                className={`flex items-center gap-3 py-3.5 ${TRANSITION_UI} ${HOVER_FADE}`}
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <MailIcon />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={FORM_LABEL_CLASS}>{cms.profileEmailVerifiedLabel}</p>
                  <p className={`mt-0.5 inline-flex flex-wrap items-center gap-1.5 break-all ${FIELD_VALUE_CLASS}`}>
                    {user.email}
                    {security.emailVerified ? (
                      <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        Đã xác thực
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
                        Chưa xác thực
                      </span>
                    )}
                  </p>
                </div>
                <ChevronIcon />
              </Link>
            </li>
            <li>
              <Link
                href="/account/security#2fa"
                className={`flex items-center gap-3 py-3.5 ${TRANSITION_UI} ${HOVER_FADE}`}
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <ShieldIcon />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={FORM_LABEL_CLASS}>{cms.profile2faLabel}</p>
                  <p className={`mt-0.5 inline-flex items-center gap-1.5 ${FIELD_VALUE_CLASS}`}>
                    {security.twoFactorEnabled ? cms.profile2faOn : cms.profile2faOff}
                    {security.twoFactorEnabled ? (
                      <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        ON
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-xs font-semibold text-muted">
                        OFF
                      </span>
                    )}
                  </p>
                </div>
                <ChevronIcon />
              </Link>
            </li>
            <li>
              <Link
                href="/account/security#sessions"
                className={`flex items-center gap-3 py-3.5 ${TRANSITION_UI} ${HOVER_FADE}`}
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <DevicesIcon />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={FORM_LABEL_CLASS}>Phiên đăng nhập</p>
                  <p className={`mt-0.5 ${FIELD_VALUE_CLASS}`}>
                    Quản lý thiết bị đang đăng nhập
                  </p>
                </div>
                <ChevronIcon />
              </Link>
            </li>
          </ul>
          <Link
            href="/account/security"
            className={`mt-3 inline-flex items-center gap-1 ${LINK_ACCENT_CLASS}`}
          >
            {cms.profileSecurityManageCta}
            <ChevronIcon />
          </Link>
        </section>
      </div>

      {/* Activity + Notifications */}
      <div className="grid gap-4 lg:grid-cols-2">
        <section className={CARD}>
          <h2 className={SUBSECTION_TITLE_CLASS}>{cms.profileActivityTitle}</h2>
          {activities.length === 0 ? (
            <p className={`mt-4 ${SECTION_LEAD_CLASS}`}>
              Chưa có hoạt động gần đây.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {activities.map((a) => (
                <li
                  key={a.id}
                  className="grid grid-cols-1 gap-1 py-3.5 sm:grid-cols-[8.5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-3"
                >
                  <p className={CARD_META_CLASS}>{a.atLabel}</p>
                  <p className={`min-w-0 ${CARD_TITLE_CLASS}`}>{a.title}</p>
                  <p
                    className={`sm:text-right ${
                      a.metaIsPrice ? INLINE_PRICE_CLASS : CARD_META_CLASS
                    }`}
                  >
                    {a.meta}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/account/orders"
            className={`mt-3 inline-flex items-center gap-1 ${LINK_ACCENT_CLASS}`}
          >
            {cms.profileActivityViewAll}
            <ChevronIcon />
          </Link>
        </section>

        <section className={CARD}>
          <div className="flex items-center justify-between gap-3">
            <h2 className={SUBSECTION_TITLE_CLASS}>{cms.profileNotiTitle}</h2>
            <Link href="/account/notifications" className={LINK_ACCENT_CLASS}>
              {cms.profileNotiViewAll}
            </Link>
          </div>
          {notifications.length === 0 ? (
            <p className={`mt-4 ${SECTION_LEAD_CLASS}`}>
              {cms.notificationsEmpty}
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {notifications.map((n) => (
                <li key={n.id}>
                  <Link
                    href={n.href || "/account/notifications"}
                    className={`flex items-start gap-3 py-3.5 ${TRANSITION_UI} ${HOVER_FADE}`}
                  >
                    <span
                      className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        n.tone === "success"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-sky-50 text-sky-600"
                      }`}
                    >
                      {n.tone === "success" ? "✓" : "i"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={CARD_TITLE_CLASS}>{n.title}</p>
                      <p className={`mt-0.5 ${CARD_META_CLASS}`}>{n.dateLabel}</p>
                    </div>
                    <ChevronIcon className="mt-1 shrink-0 text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  valueClass,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
  valueClass?: string;
}) {
  return (
    <section className={`${CARD} h-full`}>
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
          {icon}
        </span>
        <div className="min-w-0">
          <p className={FORM_LABEL_CLASS}>{label}</p>
          <p className={`mt-1 break-words ${valueClass ?? FIELD_VALUE_CLASS}`}>{value}</p>
          <p className={`mt-0.5 ${CARD_META_CLASS}`}>{sub}</p>
        </div>
      </div>
    </section>
  );
}

function FieldRow({
  icon,
  label,
  children,
  onEdit,
  editing,
  editCta,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  onEdit?: () => void;
  editing?: boolean;
  editCta: string;
}) {
  return (
    <li className="flex items-start gap-3 py-3.5">
      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-muted">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className={FORM_LABEL_CLASS}>{label}</p>
        {children}
      </div>
      {onEdit && !editing ? (
        <button
          type="button"
          onClick={onEdit}
          className={`shrink-0 ${LINK_FIELD_CLASS}`}
        >
          {editCta}
        </button>
      ) : null}
    </li>
  );
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20h4L19 9l-4-4L4 16v4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="m13 5 4 4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 8.5h3l1.5-2h7l1.5 2h3v10H4v-10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m12 3.5 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8 7.2 18.4l.9-5.4-3.9-3.8 5.4-.8L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7.5 3.5h3L12 8l-2 1.5a12 12 0 0 0 4.5 4.5L16 12l4.5 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3.5 10h17M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3 4.5 6v5.5c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function DevicesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8 20h8M12 16.5V20"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
