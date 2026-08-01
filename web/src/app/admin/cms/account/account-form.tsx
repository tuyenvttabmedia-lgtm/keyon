"use client";

import { useState } from "react";
import type { CmsAccount } from "@/server/cms/types";

type FieldDef = {
  key: keyof CmsAccount;
  label: string;
  multiline?: boolean;
};

const GROUPS: { title: string; hint?: string; fields: FieldDef[] }[] = [
  {
    title: "Liên hệ trên portal",
    hint: "Hiện ở thanh liên hệ / card hỗ trợ",
    fields: [
      { key: "contactPhone", label: "Hotline" },
      { key: "contactEmail", label: "Email hỗ trợ" },
      { key: "contactBarLead", label: "Dòng dẫn thanh liên hệ" },
      { key: "warrantyBadge", label: "Badge bảo hành" },
    ],
  },
  {
    title: "Card hỗ trợ",
    fields: [
      { key: "supportCardTitle", label: "Tiêu đề" },
      { key: "supportCardBody", label: "Nội dung", multiline: true },
      { key: "supportCardCta", label: "CTA" },
    ],
  },
  {
    title: "Promo",
    fields: [
      { key: "promoTitle", label: "Tiêu đề" },
      { key: "promoBody", label: "Nội dung", multiline: true },
      { key: "promoCta", label: "CTA" },
      { key: "promoHref", label: "Link" },
    ],
  },
  {
    title: "Tổng quan & License",
    fields: [
      { key: "overviewWelcomeHi", label: "Lời chào" },
      { key: "overviewWelcomeBody", label: "Lời chào phụ", multiline: true },
      { key: "licensesBannerTitle", label: "Banner license — tiêu đề" },
      {
        key: "licensesBannerBody",
        label: "Banner license — nội dung",
        multiline: true,
      },
      { key: "licenseSecurityNote", label: "Ghi chú bảo mật key", multiline: true },
      { key: "feeValue", label: "Giá trị phí giao dịch (hiển thị)" },
      { key: "activationGuideCta", label: "CTA hướng dẫn kích hoạt" },
      { key: "activationGuideHref", label: "Link hướng dẫn" },
    ],
  },
  {
    title: "Trust blocks (License)",
    fields: [
      { key: "licensesTrust1Title", label: "1 — tiêu đề" },
      { key: "licensesTrust1Body", label: "1 — nội dung", multiline: true },
      { key: "licensesTrust2Title", label: "2 — tiêu đề" },
      { key: "licensesTrust2Body", label: "2 — nội dung", multiline: true },
      { key: "licensesTrust3Title", label: "3 — tiêu đề" },
      { key: "licensesTrust3Body", label: "3 — nội dung", multiline: true },
      { key: "licensesTrust4Title", label: "4 — tiêu đề" },
      { key: "licensesTrust4Body", label: "4 — nội dung", multiline: true },
    ],
  },
  {
    title: "Mô tả trang (tuỳ chọn)",
    fields: [
      { key: "securityLead", label: "Bảo mật — mô tả", multiline: true },
      { key: "notificationsLead", label: "Thông báo — mô tả", multiline: true },
      { key: "ticketsLead", label: "Tickets — mô tả", multiline: true },
    ],
  },
];

export function AccountCmsForm({ initial }: { initial: CmsAccount }) {
  const [form, setForm] = useState(initial);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/cms/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setMsg("Đã lưu — chỉ field vận hành (UI chrome đã hardcode).");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-border bg-[#f8fafc] px-4 py-3 text-sm text-muted">
        Chỉ giữ field ops đổi được (liên hệ, promo, banner…). Nhãn tab/cột/form
        portal đã hardcode trong code — không cấu hình Admin.
      </p>

      {GROUPS.map((g) => (
        <section
          key={g.title}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <h2 className="text-sm font-semibold text-navy">{g.title}</h2>
          {g.hint ? (
            <p className="mt-1 text-xs text-muted">{g.hint}</p>
          ) : null}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {g.fields.map((f) => (
              <label
                key={f.key}
                className={`block text-sm ${f.multiline ? "sm:col-span-2" : ""}`}
              >
                <span className="font-medium text-muted">{f.label}</span>
                {f.multiline ? (
                  <textarea
                    rows={2}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.value })
                    }
                  />
                ) : (
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.value })
                    }
                  />
                )}
              </label>
            ))}
          </div>
        </section>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={save}
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? "Đang lưu…" : "Lưu Account CMS"}
        </button>
        {msg ? <span className="text-sm text-muted">{msg}</span> : null}
      </div>
    </div>
  );
}
