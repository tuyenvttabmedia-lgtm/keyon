"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FORM_ERROR_CLASS,
  FORM_LABEL_CLASS,
  INPUT_TEXT_CLASS,
} from "@/storefront/typography";
import { TRANSITION_UI } from "@/storefront/effects";

const INPUT = `mt-1.5 h-11 w-full rounded-xl border border-border bg-white px-3 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`;

type OrgOpt = { id: string; name: string };

export function AgreementCreateForm({ orgs }: { orgs: OrgOpt[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [reference, setReference] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/agreements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          reference: reference || null,
          organizationId: organizationId || null,
          startsAt: startsAt || null,
          endsAt: endsAt || null,
          note: note || null,
        }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !data.id) throw new Error(data.error ?? "Tạo khung HĐ thất bại");
      router.push(`/admin/agreements/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4 rounded-2xl border border-border bg-card p-5">
      <p className="text-xs text-muted">
        Khung HĐ gắn nhiều đơn. Không thay thế Order, không thu tiền trên HĐ.
      </p>
      <label className="block">
        <span className={FORM_LABEL_CLASS}>Tên khung</span>
        <input className={INPUT} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label className="block">
        <span className={FORM_LABEL_CLASS}>Số HĐ / PO khung</span>
        <input className={INPUT} value={reference} onChange={(e) => setReference(e.target.value)} />
      </label>
      <label className="block">
        <span className={FORM_LABEL_CLASS}>Tổ chức (tuỳ chọn)</span>
        <select
          className={INPUT}
          value={organizationId}
          onChange={(e) => setOrganizationId(e.target.value)}
        >
          <option value="">— Không gắn org —</option>
          {orgs.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={FORM_LABEL_CLASS}>Hiệu lực từ</span>
          <input
            type="date"
            className={INPUT}
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />
        </label>
        <label className="block">
          <span className={FORM_LABEL_CLASS}>Hiệu lực đến</span>
          <input
            type="date"
            className={INPUT}
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
          />
        </label>
      </div>
      <label className="block">
        <span className={FORM_LABEL_CLASS}>Ghi chú nội bộ</span>
        <textarea
          className={`mt-1.5 min-h-[88px] w-full rounded-xl border border-border bg-white px-3 py-2 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={2000}
        />
      </label>
      {error ? <p className={FORM_ERROR_CLASS}>{error}</p> : null}
      <button
        type="submit"
        disabled={busy || title.trim().length < 2}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Đang tạo…" : "Tạo khung HĐ"}
      </button>
    </form>
  );
}
