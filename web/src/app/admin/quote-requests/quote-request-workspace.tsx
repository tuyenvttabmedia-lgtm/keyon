"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminQuoteRequestDetail } from "@/server/admin/quote-request-detail";
import {
  QUOTE_REQUEST_STATUSES,
  QUOTE_REQUEST_STATUS_LABEL,
  quoteRequestTypeLabel,
  quoteStatusTone,
} from "@/lib/admin-quote-requests";
import {
  ESTIMATED_USERS_LABEL,
  LICENSE_TYPE_LABEL,
  TERM_LABEL,
} from "@/lib/quote";
import { CopyTextButton } from "@/app/admin/orders/copy-button";
import {
  BADGE_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  LINK_ACCENT_CLASS,
  SECTION_LEAD_CLASS,
} from "@/storefront/typography";
import { ADMIN_BTN_PRIMARY } from "../ui/tokens";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function usersLabel(
  estimatedUsers: string,
  estimatedUsersOther: number | null,
): string {
  if (estimatedUsers === "OTHER" && estimatedUsersOther != null) {
    return `${estimatedUsersOther.toLocaleString("vi-VN")} người dùng`;
  }
  const key = estimatedUsers as keyof typeof ESTIMATED_USERS_LABEL;
  return ESTIMATED_USERS_LABEL[key] ?? estimatedUsers;
}

export function QuoteRequestWorkspace({
  data,
}: {
  data: AdminQuoteRequestDetail;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(data.status);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const tone = quoteStatusTone(
    status as (typeof QUOTE_REQUEST_STATUSES)[number],
  );

  async function saveStatus() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/quote-requests/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Cập nhật thất bại");
      setMsg("Đã cập nhật trạng thái.");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setBusy(false);
    }
  }

  const licenseKey = data.licenseType as keyof typeof LICENSE_TYPE_LABEL;
  const termKey = data.term as keyof typeof TERM_LABEL;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-mono text-2xl font-bold text-navy">
              {data.referenceCode}
            </h1>
            <CopyTextButton text={data.referenceCode} label="Mã" />
            <span
              className={`rounded-full px-2.5 py-0.5 ${BADGE_CLASS} ${tone.bg} ${tone.text}`}
            >
              {QUOTE_REQUEST_STATUS_LABEL[
                data.status as (typeof QUOTE_REQUEST_STATUSES)[number]
              ] ?? data.status}
            </span>
          </div>
          <p className={`mt-1 ${SECTION_LEAD_CLASS}`}>
            {quoteRequestTypeLabel(data.requestType)} · Gửi lúc{" "}
            {fmtDate(data.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className={CARD_TITLE_CLASS}>Liên hệ</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <dt className={CARD_META_CLASS}>Họ tên</dt>
                <dd className="text-sm text-navy">{data.fullName}</dd>
              </div>
              <div>
                <dt className={CARD_META_CLASS}>Chức vụ</dt>
                <dd className="text-sm text-navy">{data.jobTitle || "—"}</dd>
              </div>
              <div>
                <dt className={CARD_META_CLASS}>Email</dt>
                <dd className="text-sm text-navy">
                  <a
                    href={`mailto:${data.email}`}
                    className={LINK_ACCENT_CLASS}
                  >
                    {data.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className={CARD_META_CLASS}>Số điện thoại</dt>
                <dd className="text-sm text-navy">
                  <a href={`tel:${data.phone}`} className={LINK_ACCENT_CLASS}>
                    {data.phone}
                  </a>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className={CARD_META_CLASS}>Công ty</dt>
                <dd className="text-sm font-medium text-navy">
                  {data.companyName}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className={CARD_TITLE_CLASS}>Nhu cầu báo giá</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className={CARD_META_CLASS}>Sản phẩm quan tâm</dt>
                <dd className="text-sm text-navy">
                  {data.interestedProducts.length === 0 ? (
                    "—"
                  ) : (
                    <ul className="list-inside list-disc space-y-0.5">
                      {data.interestedProducts.map((p) => (
                        <li key={`${p.slug ?? ""}-${p.name}`}>
                          {p.name}
                          {p.slug ? (
                            <span className="text-muted"> ({p.slug})</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </dd>
              </div>
              <div>
                <dt className={CARD_META_CLASS}>Quy mô</dt>
                <dd className="text-sm text-navy">
                  {usersLabel(data.estimatedUsers, data.estimatedUsersOther)}
                </dd>
              </div>
              <div>
                <dt className={CARD_META_CLASS}>Loại license</dt>
                <dd className="text-sm text-navy">
                  {LICENSE_TYPE_LABEL[licenseKey] ?? data.licenseType}
                </dd>
              </div>
              <div>
                <dt className={CARD_META_CLASS}>Thời hạn</dt>
                <dd className="text-sm text-navy">
                  {TERM_LABEL[termKey] ?? data.term}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className={CARD_META_CLASS}>Mô tả thêm</dt>
                <dd className="whitespace-pre-wrap text-sm text-navy">
                  {data.message?.trim() || "—"}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className={CARD_TITLE_CLASS}>Xử lý</h2>
            <p className={`mt-1 ${CARD_META_CLASS}`}>
              Luồng: Mới → Đang xử lý → Đã báo giá → Đóng
            </p>
            <label className="mt-3 block text-sm">
              <span className="font-medium text-navy">Trạng thái</span>
              <select
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
                value={status}
                disabled={busy}
                onChange={(e) => setStatus(e.target.value)}
              >
                {QUOTE_REQUEST_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {QUOTE_REQUEST_STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={busy || status === data.status}
              onClick={() => void saveStatus()}
              className={`mt-3 w-full ${ADMIN_BTN_PRIMARY}`}
            >
              {busy ? "Đang lưu…" : "Lưu trạng thái"}
            </button>
            {msg ? (
              <p
                className={`mt-2 text-sm ${
                  msg.includes("Lỗi") || msg.includes("thất bại")
                    ? "text-red-600"
                    : "text-emerald-700"
                }`}
              >
                {msg}
              </p>
            ) : null}
            <p className={`mt-3 ${CARD_META_CLASS}`}>
              Cập nhật lần cuối: {fmtDate(data.updatedAt)}
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className={CARD_TITLE_CLASS}>Nguồn</h2>
            <dl className="mt-3 space-y-2">
              <div>
                <dt className={CARD_META_CLASS}>Trang gửi</dt>
                <dd className="text-sm text-navy">
                  {data.sourcePath ? (
                    <Link
                      href={data.sourcePath}
                      className={LINK_ACCENT_CLASS}
                      target="_blank"
                    >
                      {data.sourcePath}
                    </Link>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
