"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { IntegrationMode, SupplierType } from "@prisma/client";

export function SupplierForm({
  mode,
  supplierId,
  initial,
}: {
  mode: "create" | "edit";
  supplierId?: string;
  initial?: {
    name: string;
    supplierType: SupplierType;
    integrationMode: IntegrationMode;
    active: boolean;
    contactName: string | null;
    contactEmail: string | null;
    website: string | null;
    notes: string | null;
  };
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [supplierType, setSupplierType] = useState<SupplierType>(
    initial?.supplierType ?? "EXTERNAL",
  );
  const [integrationMode, setIntegrationMode] = useState<IntegrationMode>(
    initial?.integrationMode ?? "MANUAL_OPS",
  );
  const [active, setActive] = useState(initial?.active ?? true);
  const [contactName, setContactName] = useState(initial?.contactName ?? "");
  const [contactEmail, setContactEmail] = useState(initial?.contactEmail ?? "");
  const [website, setWebsite] = useState(initial?.website ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const url =
        mode === "create"
          ? "/api/admin/suppliers"
          : `/api/admin/suppliers/${supplierId}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          supplierType,
          integrationMode,
          active,
          contactName: contactName.trim() || null,
          contactEmail: contactEmail.trim() || null,
          website: website.trim() || null,
          notes: notes.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lưu thất bại");
      router.push(`/admin/suppliers/${data.id}`);
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      <label className="block text-sm">
        <span className="font-medium text-navy">Tên</span>
        <input
          required
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
          placeholder="VD: PACISOFT"
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium text-navy">Loại nhà cung cấp</span>
        <select
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          value={supplierType}
          onChange={(e) => setSupplierType(e.target.value as SupplierType)}
        >
          <option value="INTERNAL">Kho KEYON</option>
          <option value="EXTERNAL">Nhà cung cấp ngoài</option>
          <option value="DISTRIBUTOR">Nhà phân phối</option>
          <option value="MARKETPLACE">Sàn thương mại</option>
        </select>
      </label>

      <label className="block text-sm">
        <span className="font-medium text-navy">Phương thức xử lý</span>
        <select
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          value={integrationMode}
          onChange={(e) =>
            setIntegrationMode(e.target.value as IntegrationMode)
          }
        >
          <option value="NONE">Không tích hợp</option>
          <option value="MANUAL_OPS">Xử lý thủ công</option>
          <option value="API">API tự động</option>
        </select>
      </label>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          className="mt-1"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        <span>
          <span className="font-medium text-navy">Đang dùng (Active)</span>
          <span className="mt-0.5 block text-xs text-muted">
            Tắt chỉ ẩn/đánh dấu trên Admin — không chặn fulfillment Core.
          </span>
        </span>
      </label>

      {integrationMode === "API" ? (
        <p className="rounded-lg border border-dashed border-border bg-[#f8fafc] px-3 py-2 text-xs text-muted">
          Credential API (Pax8 / PACISOFT) cấu hình tại{" "}
          <Link
            href="/admin/settings?tab=ncc"
            className="text-accent hover:underline"
          >
            Cài đặt → NCC / Pax8
          </Link>
          . Không lưu secret trên hồ sơ nhà cung cấp.
        </p>
      ) : null}

      <fieldset className="space-y-3 rounded-xl border border-border px-3 py-3">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">
          Liên hệ vận hành
        </legend>
        <label className="block text-sm">
          <span className="font-medium text-navy">Người liên hệ</span>
          <input
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            maxLength={200}
            placeholder="Tên đầu mối"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-navy">Email</span>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            maxLength={200}
            placeholder="ops@example.com"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-navy">Website</span>
          <input
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            maxLength={300}
            placeholder="https://…"
          />
        </label>
      </fieldset>

      <label className="block text-sm">
        <span className="font-medium text-navy">Ghi chú nội bộ</span>
        <textarea
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={2000}
          placeholder="Ghi chú vận hành cho team…"
        />
      </label>

      {msg ? <p className="text-sm text-danger">{msg}</p> : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Đang lưu…" : mode === "create" ? "Tạo nhà cung cấp" : "Lưu"}
        </button>
        <Link
          href={
            mode === "edit" && supplierId
              ? `/admin/suppliers/${supplierId}`
              : "/admin/suppliers"
          }
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-navy"
        >
          Hủy
        </Link>
      </div>
    </form>
  );
}
