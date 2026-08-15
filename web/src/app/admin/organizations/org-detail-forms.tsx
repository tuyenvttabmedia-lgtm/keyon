"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  BADGE_CLASS,
  FORM_ERROR_CLASS,
  FORM_LABEL_CLASS,
  INPUT_TEXT_CLASS,
  TABLE_CELL_CLASS,
  TABLE_HEADER_CLASS,
} from "@/storefront/typography";
import { TRANSITION_UI } from "@/storefront/effects";

const INPUT = `mt-1.5 h-11 w-full rounded-xl border border-border bg-white px-3 ${INPUT_TEXT_CLASS} outline-none ${TRANSITION_UI} focus:border-accent`;

export type OrgMemberRow = {
  id: string;
  role: string;
  status: string;
  userId: string;
  email: string;
  name: string | null;
};

export type OrgPinnedOrder = {
  orderId: string;
  code: string;
  email: string;
  status: string;
};

export function OrgDetailForms({
  orgId,
  initialName,
  initialTaxId,
  initialNote,
  members,
  pinnedOrders,
}: {
  orgId: string;
  initialName: string;
  initialTaxId: string;
  initialNote: string;
  members: OrgMemberRow[];
  pinnedOrders: OrgPinnedOrder[];
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [taxId, setTaxId] = useState(initialTaxId);
  const [note, setNote] = useState(initialNote);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"OWNER" | "MEMBER">("MEMBER");
  const [orderCode, setOrderCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function refresh() {
    router.refresh();
  }

  async function saveOrg(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/organizations/${orgId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, taxId: taxId || null, note: note || null }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Cập nhật thất bại");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật thất bại");
    } finally {
      setBusy(false);
    }
  }

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/organizations/${orgId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Gán thành viên thất bại");
      setEmail("");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gán thành viên thất bại");
    } finally {
      setBusy(false);
    }
  }

  async function patchMember(
    membershipId: string,
    body: { role?: string; status?: string },
  ) {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/organizations/${orgId}/members/${membershipId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Cập nhật thành viên thất bại");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật thành viên thất bại");
    } finally {
      setBusy(false);
    }
  }

  async function pinOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/organizations/${orgId}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderCode }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Gắn đơn thất bại");
      setOrderCode("");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gắn đơn thất bại");
    } finally {
      setBusy(false);
    }
  }

  async function unpinOrder(orderId: string) {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/organizations/${orgId}/orders/${orderId}`,
        { method: "DELETE" },
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Gỡ đơn thất bại");
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gỡ đơn thất bại");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {error ? <p className={FORM_ERROR_CLASS}>{error}</p> : null}

      <form
        onSubmit={saveOrg}
        className="max-w-lg space-y-4 rounded-2xl border border-border bg-card p-5"
      >
        <p className="font-semibold text-navy">Hồ sơ tổ chức</p>
        <label className="block">
          <span className={FORM_LABEL_CLASS}>Tên</span>
          <input className={INPUT} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block">
          <span className={FORM_LABEL_CLASS}>MST</span>
          <input className={INPUT} value={taxId} onChange={(e) => setTaxId(e.target.value)} />
        </label>
        <label className="block">
          <span className={FORM_LABEL_CLASS}>Ghi chú</span>
          <textarea
            className={`${INPUT} h-24 py-2`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          Lưu
        </button>
      </form>

      <section className="rounded-2xl border border-border bg-card p-5">
        <p className="font-semibold text-navy">Thành viên</p>
        <p className="mt-1 text-sm text-muted">
          Thành viên ACTIVE xem đơn của đồng nghiệp và đơn staff ghim vào tổ chức.
          Không suy từ email domain.
        </p>
        <form onSubmit={addMember} className="mt-4 flex flex-wrap items-end gap-2">
          <label className="min-w-[200px] flex-1">
            <span className={FORM_LABEL_CLASS}>Email khách đã có tài khoản</span>
            <input
              type="email"
              className={INPUT}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            <span className={FORM_LABEL_CLASS}>Vai trò</span>
            <select
              className={INPUT}
              value={role}
              onChange={(e) => setRole(e.target.value as "OWNER" | "MEMBER")}
            >
              <option value="MEMBER">MEMBER</option>
              <option value="OWNER">OWNER</option>
            </select>
          </label>
          <button
            type="submit"
            disabled={busy}
            className="h-11 rounded-xl bg-navy px-4 text-sm font-semibold text-white disabled:opacity-60"
          >
            Gán
          </button>
        </form>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className={`py-2 ${TABLE_HEADER_CLASS}`}>Khách</th>
                <th className={`py-2 ${TABLE_HEADER_CLASS}`}>Role</th>
                <th className={`py-2 ${TABLE_HEADER_CLASS}`}>Status</th>
                <th className={`py-2 ${TABLE_HEADER_CLASS}`} />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="py-2.5">
                    <Link
                      href={`/admin/customers/${m.userId}`}
                      className="font-medium text-navy hover:text-accent"
                    >
                      {m.name || m.email}
                    </Link>
                    <p className={`mt-0.5 ${TABLE_CELL_CLASS}`}>{m.email}</p>
                  </td>
                  <td className="py-2.5">
                    <span className={`${BADGE_CLASS} rounded-full bg-slate-100 px-2 py-0.5`}>
                      {m.role}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <span className={`${BADGE_CLASS} rounded-full bg-slate-100 px-2 py-0.5`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    {m.status !== "DISABLED" ? (
                      <button
                        type="button"
                        disabled={busy}
                        className="text-sm font-medium text-red-700 hover:underline disabled:opacity-50"
                        onClick={() => patchMember(m.id, { status: "DISABLED" })}
                      >
                        Vô hiệu
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={busy}
                        className="text-sm font-medium text-accent hover:underline disabled:opacity-50"
                        onClick={() => patchMember(m.id, { status: "ACTIVE" })}
                      >
                        Kích hoạt lại
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <p className="font-semibold text-navy">Đơn ghim</p>
        <p className="mt-1 text-sm text-muted">
          Gắn / gỡ không đổi trạng thái đơn hay thanh toán. Không tự ghim từ domain.
        </p>
        <form onSubmit={pinOrder} className="mt-4 flex flex-wrap items-end gap-2">
          <label className="min-w-[160px] flex-1">
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
            disabled={busy || !orderCode.trim()}
            className="h-11 rounded-xl bg-navy px-4 text-sm font-semibold text-white disabled:opacity-60"
          >
            Ghim đơn
          </button>
        </form>
        {pinnedOrders.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Chưa ghim đơn nào.</p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className={`py-2 ${TABLE_HEADER_CLASS}`}>Mã</th>
                  <th className={`py-2 ${TABLE_HEADER_CLASS}`}>Email</th>
                  <th className={`py-2 ${TABLE_HEADER_CLASS}`}>Trạng thái</th>
                  <th className={`py-2 ${TABLE_HEADER_CLASS}`} />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pinnedOrders.map((o) => (
                  <tr key={o.orderId}>
                    <td className="py-2.5">
                      <Link
                        href={`/admin/orders/${o.orderId}`}
                        className="font-medium text-navy hover:text-accent"
                      >
                        {o.code}
                      </Link>
                    </td>
                    <td className={`py-2.5 ${TABLE_CELL_CLASS}`}>{o.email}</td>
                    <td className={`py-2.5 ${TABLE_CELL_CLASS}`}>{o.status}</td>
                    <td className="py-2.5 text-right">
                      <button
                        type="button"
                        disabled={busy}
                        className="text-sm font-medium text-red-700 hover:underline disabled:opacity-50"
                        onClick={() => unpinOrder(o.orderId)}
                      >
                        Gỡ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
