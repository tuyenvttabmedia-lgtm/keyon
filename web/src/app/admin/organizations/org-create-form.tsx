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

export function OrgCreateForm({
  defaultMemberEmail,
}: {
  defaultMemberEmail?: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [note, setNote] = useState("");
  const [memberEmail, setMemberEmail] = useState(defaultMemberEmail ?? "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, taxId: taxId || null, note: note || null }),
      });
      const data = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !data.id) throw new Error(data.error ?? "Tạo tổ chức thất bại");
      const email = memberEmail.trim();
      if (email) {
        const m = await fetch(`/api/admin/organizations/${data.id}/members`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, role: "OWNER" }),
        });
        const md = (await m.json()) as { error?: string };
        if (!m.ok) throw new Error(md.error ?? "Gán thành viên thất bại");
      }
      router.push(`/admin/organizations/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo tổ chức thất bại");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-4 rounded-2xl border border-border bg-card p-5">
      <label className="block">
        <span className={FORM_LABEL_CLASS}>Tên tổ chức</span>
        <input className={INPUT} value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label className="block">
        <span className={FORM_LABEL_CLASS}>MST (tuỳ chọn)</span>
        <input className={INPUT} value={taxId} onChange={(e) => setTaxId(e.target.value)} />
      </label>
      <label className="block">
        <span className={FORM_LABEL_CLASS}>Ghi chú nội bộ</span>
        <textarea
          className={`${INPUT} h-24 py-2`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      <label className="block">
        <span className={FORM_LABEL_CLASS}>Thành viên đầu (email tài khoản đã có)</span>
        <input
          type="email"
          className={INPUT}
          value={memberEmail}
          onChange={(e) => setMemberEmail(e.target.value)}
          placeholder="bỏ trống nếu chỉ tạo org"
        />
      </label>
      {error ? <p className={FORM_ERROR_CLASS}>{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? "Đang lưu…" : "Tạo tổ chức"}
      </button>
    </form>
  );
}
