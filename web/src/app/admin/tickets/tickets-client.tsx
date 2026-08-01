"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import {
  ListPaginationBar,
  PageSizeSelect,
  useClientPagination,
} from "@/app/admin/ui/client-pagination";

type TicketRow = {
  id: string;
  subject: string;
  body: string;
  status: string;
  adminNote: string | null;
  orderId: string | null;
  createdAt: string;
  user: { email: string; name: string | null };
};

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

export function AdminTicketsClient({ initial }: { initial: TicketRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const page = useClientPagination(
    rows,
    "keyon.admin.tickets.pageSize",
    rows.length,
  );

  async function update(id: string, status: string, adminNote: string) {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNote }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setRows((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: data.ticket.status, adminNote: data.ticket.adminNote }
            : r,
        ),
      );
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>Yêu cầu hỗ trợ</h1>
        <p className="text-sm text-muted">Ticket từ portal khách hàng</p>
      </div>
      {rows.length > 0 ? (
        <div className="flex justify-end">
          <PageSizeSelect
            value={page.pageSize}
            onChange={page.setPageSize}
          />
        </div>
      ) : null}
      <ul className="space-y-3">
        {page.pageItems.map((t) => (
          <TicketAdminCard
            key={t.id}
            ticket={t}
            busy={busy === t.id}
            onSave={(status, note) => update(t.id, status, note)}
          />
        ))}
        {rows.length === 0 ? (
          <li className="rounded-xl border border-border bg-card p-6 text-sm text-muted">
            Chưa có yêu cầu nào.
          </li>
        ) : null}
      </ul>
      <ListPaginationBar
        page={page.page}
        pageCount={page.pageCount}
        from={page.from}
        to={page.to}
        total={page.total}
        unit="ticket"
        onPrev={() => page.setPage(page.page - 1)}
        onNext={() => page.setPage(page.page + 1)}
      />
    </div>
  );
}

function TicketAdminCard({
  ticket,
  busy,
  onSave,
}: {
  ticket: TicketRow;
  busy: boolean;
  onSave: (status: string, note: string) => void;
}) {
  const [status, setStatus] = useState(ticket.status);
  const [note, setNote] = useState(ticket.adminNote ?? "");

  return (
    <li className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap justify-between gap-2">
        <div>
          <p className="font-semibold text-navy">{ticket.subject}</p>
          <p className="mt-1 text-sm text-muted">
            {ticket.user.email}
            {ticket.user.name ? ` · ${ticket.user.name}` : ""} ·{" "}
            {new Date(ticket.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>
        <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
          {ticket.status}
        </span>
      </div>
      <p className="mt-3 text-sm text-navy">{ticket.body}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-[180px_1fr_auto]">
        <select
          className="rounded-lg border border-border px-2 py-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          className="rounded-lg border border-border px-3 py-2 text-sm"
          placeholder="Ghi chú phản hồi cho khách"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => onSave(status, note)}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {busy ? "…" : "Lưu"}
        </button>
      </div>
    </li>
  );
}
