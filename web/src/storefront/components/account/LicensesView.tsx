"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { AccountCopy } from "@/storefront/lib/account-cms";
import { LicenseKeyReveal } from "@/storefront/components/checkout/LicenseKeyReveal";
import { IconShieldCheck } from "@/storefront/components/icons/StoreIcons";
import { StoreButton } from "@/storefront/components/StoreButton";
import { PortalMenu } from "@/components/PortalMenu";
import {
  BADGE_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  EMPTY_BODY_CLASS,
  EMPTY_TITLE_CLASS,
  FIELD_VALUE_CLASS,
  FORM_LABEL_CLASS,
  INPUT_TEXT_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  TAB_ACTIVE_CLASS,
  TAB_CLASS,
} from "@/storefront/typography";
import {
  CARD_PORTAL,
  ELEVATION_NONE,
  HOVER_LINK_ACCENT,
  HOVER_OUTLINE_FILL,
  HOVER_SOFT,
  OPACITY_DISABLED,
  TRANSITION_UI,
} from "@/storefront/effects";

const CARD = CARD_PORTAL;

const BTN_OUTLINE = `inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-white px-3 ${CTA_COMPACT_CLASS} text-navy ${TRANSITION_UI} ${HOVER_OUTLINE_FILL}`;

const LINK_MENU = `block px-3 py-2 ${CTA_COMPACT_CLASS} text-navy ${TRANSITION_UI} ${HOVER_SOFT}`;

const PAGE_SIZE = 8;

export type LicenseListStatus = "active" | "pending" | "expired";

export type LicenseListItem = {
  id: string;
  title: string;
  brandName: string;
  categoryLabel: string;
  imageUrl: string | null;
  quantity: number;
  status: LicenseListStatus;
  payloadPlain: string | null;
  receiveLabel: string;
  purchasedAtLabel: string;
  expiryLabel: string;
  activatedAtLabel: string | null;
  orderId: string;
  orderCode: string;
  /** Soft-gate: true when email not verified — payload hidden. */
  locked?: boolean;
};

type TabId = "all" | LicenseListStatus;

export function LicensesView({
  cms,
  items,
  emailVerified = true,
}: {
  cms: AccountCopy;
  items: LicenseListItem[];
  emailVerified?: boolean;
}) {
  const [tab, setTab] = useState<TabId>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const counts = useMemo(() => {
    const c = { all: items.length, active: 0, pending: 0, expired: 0 };
    for (const it of items) c[it.status] += 1;
    return c;
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (tab !== "all" && it.status !== tab) return false;
      if (!q) return true;
      return (
        it.title.toLowerCase().includes(q) ||
        it.brandName.toLowerCase().includes(q) ||
        it.orderCode.toLowerCase().includes(q) ||
        it.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [items, tab, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const from = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const to = Math.min(safePage * PAGE_SIZE, filtered.length);

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: "all", label: cms.licensesTabAll, count: counts.all },
    { id: "active", label: cms.licensesTabActive, count: counts.active },
    { id: "expired", label: cms.licensesTabExpired, count: counts.expired },
    { id: "pending", label: cms.licensesTabPending, count: counts.pending },
  ];

  function statusBadge(status: LicenseListStatus) {
    if (status === "active") {
      return (
        <span
          className={`inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 ${BADGE_CLASS} text-emerald-700`}
        >
          {cms.licensesStatusActive}
        </span>
      );
    }
    if (status === "pending") {
      return (
        <span
          className={`inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 ${BADGE_CLASS} text-amber-800`}
        >
          {cms.licensesStatusPending}
        </span>
      );
    }
    return (
      <span
        className={`inline-flex rounded-full bg-rose-50 px-2.5 py-0.5 ${BADGE_CLASS} text-rose-700`}
      >
        {cms.licensesStatusExpired}
      </span>
    );
  }

  return (
    <div className="space-y-5">
      <nav className={`flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
        <Link href="/" className={HOVER_LINK_ACCENT}>
          Trang chủ
        </Link>
        <span aria-hidden>›</span>
        <Link
          href="/account"
          className={HOVER_LINK_ACCENT}
        >
          Tài khoản
        </Link>
        <span aria-hidden>›</span>
        <span className={BREADCRUMB_CURRENT_CLASS}>
          {cms.licensesPageTitle}
        </span>
      </nav>

      <div>
        <h1 className={PAGE_TITLE_CLASS}>{cms.licensesPageTitle}</h1>
        <p className={`mt-1.5 ${SECTION_LEAD_CLASS}`}>{cms.licensesPageLead}</p>
      </div>

      {!emailVerified ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 sm:px-5">
          <p className={CARD_TITLE_CLASS}>Xác thực email để xem license</p>
          <p className={`mt-1 ${CARD_META_CLASS} !text-amber-900`}>
            Đơn hàng và giao hàng vẫn hoàn tất. Bạn cần xác thực email trước khi
            xem key/license.{" "}
            <Link href="/account/security" className="font-semibold text-accent underline">
              Xác thực ngay
            </Link>
          </p>
        </div>
      ) : null}

      {/* Tabs + search */}
      <div className="flex flex-col gap-3 border-b border-border pb-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTab(t.id);
                  setPage(1);
                }}
                className={`shrink-0 border-b-2 px-3 py-2 ${TRANSITION_UI} ${
                  active
                    ? `${TAB_ACTIVE_CLASS} border-navy`
                    : `${TAB_CLASS} border-transparent hover:text-navy`
                }`}
              >
                {t.label} ({t.count})
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="relative min-w-0 flex-1 sm:w-64">
            <span className="sr-only">{cms.licensesSearchPlaceholder}</span>
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              <SearchIcon />
            </span>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={cms.licensesSearchPlaceholder}
              className={`h-10 w-full rounded-xl border border-border bg-white pl-9 pr-3 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`}
            />
          </label>
          <button
            type="button"
            className={BTN_OUTLINE}
            title="Bộ lọc nâng cao sẽ bổ sung sau"
          >
            <FilterIcon />
            {cms.licensesFilterCta}
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className={`rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center ${ELEVATION_NONE}`}>
          <p className={EMPTY_TITLE_CLASS}>{cms.licensesEmptyTitle}</p>
          <p className={`mx-auto mt-2 max-w-md ${EMPTY_BODY_CLASS}`}>
            {cms.licensesEmptyBody}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <StoreButton href="/account/orders" variant="secondary">
              Xem đơn hàng
            </StoreButton>
            <StoreButton href="/products">Mua sản phẩm</StoreButton>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className={`${CARD} text-center`}>
          <p className={EMPTY_TITLE_CLASS}>Không tìm thấy license phù hợp</p>
          <p className={`mt-1 ${EMPTY_BODY_CLASS}`}>
            Thử đổi tab hoặc từ khóa tìm kiếm.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {slice.map((it) => (
            <li key={it.id} className={`${CARD} !p-4 sm:!p-5`}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
                {/* Product */}
                <div className="flex min-w-0 gap-3 lg:w-[17rem] lg:shrink-0">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface sm:h-16 sm:w-16">
                    {it.imageUrl ? (
                      <Image
                        src={it.imageUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="64px"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-bold text-navy">
                        {it.brandName.slice(0, 3)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 space-y-1.5">
                    <p className={`line-clamp-2 ${CARD_TITLE_CLASS}`}>{it.title}</p>
                    <p className={CARD_META_CLASS}>
                      {cms.licensesQtyLabel}: {it.quantity} License
                      {" · "}
                      {it.categoryLabel}
                    </p>
                    {statusBadge(it.status)}
                  </div>
                </div>

                {/* Key — takes remaining space */}
                <div className="min-w-0 flex-1 space-y-2">
                  {it.locked || !emailVerified ? (
                    <p className={`rounded-xl border border-amber-100 bg-amber-50 px-3.5 py-3 ${SECTION_LEAD_CLASS} !text-amber-950`}>
                      License đã giao — xác thực email để xem nội dung.
                    </p>
                  ) : it.payloadPlain ? (
                    <LicenseKeyReveal
                      value={it.payloadPlain}
                      label={cms.licensesKeyLabel}
                      showLabel="Hiện"
                      hideLabel="Ẩn"
                      copyLabel="Chép"
                    />
                  ) : (
                    <p className={`rounded-xl bg-surface px-3.5 py-3 ${SECTION_LEAD_CLASS}`}>
                      Không đọc được nội dung license
                    </p>
                  )}
                  {it.status === "pending" ? (
                    <p
                      className={`rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 ${CARD_META_CLASS} !text-amber-900`}
                    >
                      ⚠ {cms.licensesPendingNote}
                    </p>
                  ) : it.activatedAtLabel ? (
                    <p className={CARD_META_CLASS}>
                      {cms.licensesActivatedLabel}: {it.activatedAtLabel}
                    </p>
                  ) : null}
                </div>

                {/* Dates */}
                <div className="flex shrink-0 gap-4 sm:gap-6 lg:w-[7.25rem] lg:flex-col lg:gap-2 lg:text-right">
                  <div>
                    <p className={FORM_LABEL_CLASS}>{cms.licensesPurchasedLabel}</p>
                    <p className={`mt-0.5 ${FIELD_VALUE_CLASS}`}>
                      {it.purchasedAtLabel}
                    </p>
                  </div>
                  <div>
                    <p className={FORM_LABEL_CLASS}>{cms.licensesExpiryLabel}</p>
                    <p className={`mt-0.5 ${FIELD_VALUE_CLASS}`}>{it.expiryLabel}</p>
                  </div>
                </div>

                {/* Menu */}
                <LicenseRowMenu cms={cms} item={it} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className={CARD_META_CLASS}>
            Hiển thị {from} đến {to} của {filtered.length} license
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-navy ${TRANSITION_UI} enabled:hover:border-accent enabled:hover:bg-accent enabled:hover:text-white ${OPACITY_DISABLED}`}
            >
              ‹
            </button>
            <span
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-navy px-2 ${CTA_COMPACT_CLASS} text-white`}
            >
              {safePage}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-navy ${TRANSITION_UI} enabled:hover:border-accent enabled:hover:bg-accent enabled:hover:text-white ${OPACITY_DISABLED}`}
            >
              ›
            </button>
          </div>
        </div>
      ) : null}

      {/* Trust bar */}
      <div className={`grid gap-4 rounded-2xl border border-border bg-white p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6 ${ELEVATION_NONE}`}>
        {[
          { t: cms.licensesTrust1Title, b: cms.licensesTrust1Body },
          { t: cms.licensesTrust2Title, b: cms.licensesTrust2Body },
          { t: cms.licensesTrust3Title, b: cms.licensesTrust3Body },
          { t: cms.licensesTrust4Title, b: cms.licensesTrust4Body },
        ].map((x) => (
          <div key={x.t} className="flex gap-3">
            <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
              <IconShieldCheck size={16} />
            </span>
            <div>
              <p className={CARD_TITLE_CLASS}>{x.t}</p>
              <p className={`mt-0.5 ${CARD_META_CLASS}`}>{x.b}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LicenseRowMenu({
  cms,
  item,
}: {
  cms: AccountCopy;
  item: LicenseListItem;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative flex shrink-0 justify-end">
      <button
        ref={btnRef}
        type="button"
        aria-label="Thêm thao tác"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-navy ${TRANSITION_UI} ${HOVER_OUTLINE_FILL}`}
      >
        ⋮
      </button>
      <PortalMenu
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={btnRef}
        width={168}
        className="bg-white py-1"
      >
        <Link
          href={`/account/assets/${item.id}`}
          className={LINK_MENU}
          onClick={() => setOpen(false)}
        >
          Xem chi tiết
        </Link>
        <Link
          href={`/account/orders/${item.orderId}`}
          className={LINK_MENU}
          onClick={() => setOpen(false)}
        >
          Đơn {item.orderCode}
        </Link>
        <Link
          href={cms.activationGuideHref}
          className={LINK_MENU}
          onClick={() => setOpen(false)}
        >
          {cms.activationGuideCta}
        </Link>
      </PortalMenu>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
