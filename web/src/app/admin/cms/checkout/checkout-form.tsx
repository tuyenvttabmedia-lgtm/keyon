"use client";

import { useState } from "react";
import type { CmsCheckout } from "@/server/cms/types";

/** Ops-only Admin — UI chrome labels stay in defaultCmsCheckout / code. */
export function CheckoutCmsForm({ initial }: { initial: CmsCheckout }) {
  const [form, setForm] = useState(initial);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/cms/checkout", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setMsg("Đã lưu CMS Checkout (field ops).");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="rounded-xl border border-border bg-[#f8fafc] px-4 py-3 text-sm text-muted">
        Chỉ cấu hình vận hành: PTTT bật/tắt, số hỗ trợ, ghi chú pháp lý/marketing,
        bước QR, upsell. Nhãn nút/cột UI đã hardcode — không hiện ở đây.
      </p>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-navy">
          Phương thức thanh toán
        </h2>
        <p className="mt-1 text-xs text-muted">
          Chỉ <strong>Enabled</strong> hiện ở checkout.{" "}
          <code>sepay_qr</code> + enabled → bước VietQR.
        </p>
        <ul className="mt-4 space-y-3">
          {form.paymentMethods.map((m, i) => (
            <li
              key={m.id}
              className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-2"
            >
              <input
                className="rounded-lg border border-border px-2 py-1.5 text-sm"
                value={m.title}
                onChange={(e) => {
                  const paymentMethods = [...form.paymentMethods];
                  paymentMethods[i] = { ...m, title: e.target.value };
                  setForm({ ...form, paymentMethods });
                }}
              />
              <input
                className="rounded-lg border border-border px-2 py-1.5 text-sm"
                value={m.subtitle}
                onChange={(e) => {
                  const paymentMethods = [...form.paymentMethods];
                  paymentMethods[i] = { ...m, subtitle: e.target.value };
                  setForm({ ...form, paymentMethods });
                }}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={m.enabled}
                  onChange={(e) => {
                    const paymentMethods = [...form.paymentMethods];
                    paymentMethods[i] = { ...m, enabled: e.target.checked };
                    setForm({ ...form, paymentMethods });
                  }}
                />
                Enabled · {m.provider}
              </label>
              <input
                className="rounded-lg border border-border px-2 py-1.5 text-sm"
                placeholder="Badge (tuỳ chọn)"
                value={m.badge ?? ""}
                onChange={(e) => {
                  const paymentMethods = [...form.paymentMethods];
                  paymentMethods[i] = {
                    ...m,
                    badge: e.target.value || undefined,
                  };
                  setForm({ ...form, paymentMethods });
                }}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
        <h2 className="text-sm font-semibold text-navy sm:col-span-2">
          Ghi chú vận hành / pháp lý
        </h2>
        {(
          [
            ["securityLine", "Dòng bảo mật"],
            ["warrantyBadge", "Badge bảo hành"],
            ["paidNote", "Đã trả ≠ đã giao"],
            ["expireHint", "Gợi ý giữ đơn / hết hạn"],
            ["comingSoonNote", "Khi chọn cổng chưa bật"],
            ["licensePendingNote", "Khi chưa giao license"],
            ["feeValue", "Phí giao dịch (hiển thị)"],
            ["confirmLead", "Mô tả trang xác nhận QR"],
            ["successLead", "Mô tả trang thành công"],
          ] as const
        ).map(([key, label]) => (
          <label
            key={key}
            className={`block text-sm ${
              key.endsWith("Note") || key.endsWith("Lead") || key === "paidNote"
                ? "sm:col-span-2"
                : ""
            }`}
          >
            <span className="font-medium text-muted">{label}</span>
            {key.endsWith("Note") ||
            key.endsWith("Lead") ||
            key === "paidNote" ? (
              <textarea
                rows={2}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            ) : (
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            )}
          </label>
        ))}
      </section>

      <section className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
        <h2 className="text-sm font-semibold text-navy sm:col-span-2">
          Hỗ trợ checkout
        </h2>
        {(
          [
            ["supportTitle", "Tiêu đề"],
            ["supportPhone", "Hotline"],
            ["supportLiveChatLabel", "Live chat — nhãn"],
            ["supportLiveChatHref", "Live chat — link"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block text-sm">
            <span className="font-medium text-muted">{label}</span>
            <input
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </label>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-navy">
          3 bước hướng dẫn QR ({`{{amount}}`} trong mô tả)
        </h2>
        <ul className="mt-3 space-y-2">
          {form.nextSteps.map((s, i) => (
            <li key={s.id} className="grid gap-2 sm:grid-cols-2">
              <input
                className="rounded-lg border border-border px-2 py-1.5 text-sm"
                value={s.title}
                onChange={(e) => {
                  const nextSteps = [...form.nextSteps];
                  nextSteps[i] = { ...s, title: e.target.value };
                  setForm({ ...form, nextSteps });
                }}
              />
              <input
                className="rounded-lg border border-border px-2 py-1.5 text-sm"
                value={s.description}
                onChange={(e) => {
                  const nextSteps = [...form.nextSteps];
                  nextSteps[i] = { ...s, description: e.target.value };
                  setForm({ ...form, nextSteps });
                }}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-navy">Vì sao chọn KEYON</h2>
        <input
          className="mt-3 w-full rounded-lg border border-border px-3 py-2 text-sm"
          value={form.whyTitle}
          onChange={(e) => setForm({ ...form, whyTitle: e.target.value })}
        />
        <ul className="mt-3 space-y-2">
          {form.whyItems.map((w, i) => (
            <li key={w.id} className="grid gap-2 sm:grid-cols-2">
              <input
                className="rounded-lg border border-border px-2 py-1.5 text-sm"
                value={w.title}
                onChange={(e) => {
                  const whyItems = [...form.whyItems];
                  whyItems[i] = { ...w, title: e.target.value };
                  setForm({ ...form, whyItems });
                }}
              />
              <input
                className="rounded-lg border border-border px-2 py-1.5 text-sm"
                value={w.description}
                onChange={(e) => {
                  const whyItems = [...form.whyItems];
                  whyItems[i] = { ...w, description: e.target.value };
                  setForm({ ...form, whyItems });
                }}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2">
        <h2 className="text-sm font-semibold text-navy sm:col-span-2">
          Sau thanh toán — kích hoạt & upsell
        </h2>
        {(
          [
            ["activationGuideCta", "CTA hướng dẫn kích hoạt"],
            ["activationGuideHref", "Link hướng dẫn"],
            ["accountUpsellTitle", "Upsell — tiêu đề"],
            ["accountUpsellBody", "Upsell — nội dung"],
            ["accountUpsellCta", "Upsell — nút"],
            ["accountUpsellHref", "Upsell — link"],
          ] as const
        ).map(([key, label]) => (
          <label
            key={key}
            className={`block text-sm ${key === "accountUpsellBody" ? "sm:col-span-2" : ""}`}
          >
            <span className="font-medium text-muted">{label}</span>
            {key === "accountUpsellBody" ? (
              <textarea
                rows={2}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            ) : (
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            )}
          </label>
        ))}
        <div className="sm:col-span-2">
          <h3 className="mb-2 text-xs font-semibold text-navy">
            Các bước kích hoạt nhanh
          </h3>
          <ul className="space-y-2">
            {form.activationSteps.map((s, i) => (
              <li key={s.id}>
                <input
                  className="w-full rounded-lg border border-border px-2 py-1.5 text-sm"
                  value={s.text}
                  onChange={(e) => {
                    const activationSteps = [...form.activationSteps];
                    activationSteps[i] = { ...s, text: e.target.value };
                    setForm({ ...form, activationSteps });
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={save}
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? "Đang lưu…" : "Lưu Checkout CMS"}
        </button>
        {msg ? <span className="text-sm text-muted">{msg}</span> : null}
      </div>
    </div>
  );
}
