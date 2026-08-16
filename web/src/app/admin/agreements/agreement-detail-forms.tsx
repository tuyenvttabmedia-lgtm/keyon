"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BODY_MUTED_CLASS,
  CTA_COMPACT_CLASS,
  FORM_ERROR_CLASS,
  FORM_LABEL_CLASS,
  INPUT_TEXT_CLASS,
  TABLE_CELL_CLASS,
  TABLE_HEADER_CLASS,
} from "@/storefront/typography";
import { TRANSITION_UI } from "@/storefront/effects";

const INPUT = `mt-1.5 h-11 w-full rounded-xl border border-border bg-white px-3 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`;

type OrgOpt = { id: string; name: string };

type LinkedOrder = {
  orderId: string;
  code: string;
  email: string;
  status: string;
  totalVnd: number;
};

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Nháp",
  ACTIVE: "Hiệu lực",
  CLOSED: "Đóng",
};

export function AgreementDetailForms({
  agreementId,
  initialTitle,
  initialReference,
  initialOrganizationId,
  initialStatus,
  initialStartsAt,
  initialEndsAt,
  initialNote,
  orgs,
  orders,
}: {
  agreementId: string;
  initialTitle: string;
  initialReference: string;
  initialOrganizationId: string;
  initialStatus: string;
  initialStartsAt: string;
  initialEndsAt: string;
  initialNote: string;
  orgs: OrgOpt[];
  orders: LinkedOrder[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [reference, setReference] = useState(initialReference);
  const [organizationId, setOrganizationId] = useState(initialOrganizationId);
  const [status, setStatus] = useState(initialStatus);
  const [startsAt, setStartsAt] = useState(initialStartsAt);
  const [endsAt, setEndsAt] = useState(initialEndsAt);
  const [note, setNote] = useState(initialNote);
  const [orderCode, setOrderCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/agreements/${agreementId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          reference: reference || null,
          organizationId: organizationId || null,
          status,
          startsAt: startsAt || null,
          endsAt: endsAt || null,
          note: note || null,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Không lưu được");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setBusy(false);
    }
  }

  async function linkOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/agreements/${agreementId}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderCode }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Không gắn được đơn");
      setOrderCode("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setBusy(false);
    }
  }

  async function unlink(orderId: string) {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/agreements/${agreementId}/orders/${orderId}`,
        { method: "DELETE" },
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Không gỡ được đơn");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi");
    } finally {
      setBusy(false);
    }
  }

  async function deleteAgreement() {
    if (
      !window.confirm(
        "Xóa khung HĐ này? Đơn hàng không bị xóa — chỉ gỡ liên kết khung.",
      )
    ) {
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/agreements/${agreementId}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Xóa khung HĐ thất bại");
      router.push("/admin/agreements");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xóa khung HĐ thất bại");
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <form onSubmit={save} className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold text-navy">Thông tin khung</h2>
        <label className="block">
          <span className={FORM_LABEL_CLASS}>Tên</span>
          <input className={INPUT} value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="block">
          <span className={FORM_LABEL_CLASS}>Số HĐ / PO khung</span>
          <input className={INPUT} value={reference} onChange={(e) => setReference(e.target.value)} />
        </label>
        <label className="block">
          <span className={FORM_LABEL_CLASS}>Tổ chức</span>
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
        <label className="block">
          <span className={FORM_LABEL_CLASS}>Trạng thái khung (không phải trạng thái đơn)</span>
          <select className={INPUT} value={status} onChange={(e) => setStatus(e.target.value)}>
            {Object.entries(STATUS_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={FORM_LABEL_CLASS}>Từ ngày</span>
            <input type="date" className={INPUT} value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
          </label>
          <label className="block">
            <span className={FORM_LABEL_CLASS}>Đến ngày</span>
            <input type="date" className={INPUT} value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
          </label>
        </div>
        <label className="block">
          <span className={FORM_LABEL_CLASS}>Ghi chú</span>
          <textarea
            className={`mt-1.5 min-h-[88px] w-full rounded-xl border border-border bg-white px-3 py-2 ${INPUT_TEXT_CLASS}`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Đang lưu…" : "Lưu khung"}
        </button>
      </form>

      <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-semibold text-navy">Đơn gắn khung</h2>
        <form onSubmit={linkOrder} className="flex flex-wrap items-end gap-2">
          <label className="min-w-[160px] flex-1 text-xs">
            <span className={FORM_LABEL_CLASS}>Mã đơn</span>
            <input
              className={INPUT}
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value)}
              placeholder="VD. KN-1001"
            />
          </label>
          <button
            type="submit"
            disabled={busy || !orderCode.trim() || status === "CLOSED"}
            className="rounded-lg bg-navy px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Gắn đơn
          </button>
        </form>
        {orders.length === 0 ? (
          <p className="text-sm text-muted">Chưa gắn đơn nào. Order vẫn độc lập.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className={TABLE_HEADER_CLASS}>Mã</th>
                <th className={TABLE_HEADER_CLASS}>Email</th>
                <th className={TABLE_HEADER_CLASS}>Trạng thái đơn</th>
                <th className={TABLE_HEADER_CLASS} />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((o) => (
                <tr key={o.orderId}>
                  <td className="py-2">
                    <Link href={`/admin/orders/${o.orderId}`} className="font-semibold text-navy hover:text-accent">
                      {o.code}
                    </Link>
                  </td>
                  <td className={`py-2 ${TABLE_CELL_CLASS}`}>{o.email}</td>
                  <td className={`py-2 ${TABLE_CELL_CLASS}`}>{o.status}</td>
                  <td className="py-2 text-right">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => unlink(o.orderId)}
                      className="text-xs font-medium text-muted hover:text-danger"
                    >
                      Gỡ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {error ? <p className={FORM_ERROR_CLASS}>{error}</p> : null}

        <div className="border-t border-border pt-4">
          <p className="font-semibold text-navy">Xóa khung HĐ</p>
          <p className={`mt-1 ${BODY_MUTED_CLASS}`}>
            Không xóa Order hay thanh toán. Chỉ xóa khung và các dòng gắn đơn.
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => void deleteAgreement()}
            className={`mt-3 rounded-xl border border-danger/30 bg-white px-4 py-2 ${CTA_COMPACT_CLASS} text-danger disabled:opacity-50`}
          >
            Xóa khung HĐ
          </button>
        </div>
      </section>
    </div>
  );
}
