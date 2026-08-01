"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ListPaginationBar,
  PageSizeSelect,
  useClientPagination,
} from "@/app/admin/ui/client-pagination";

export type KeyRow = {
  id: string;
  masked: string;
  status: string;
  createdAt: string;
  reservedAt: string | null;
  consumedAt: string | null;
  disabledAt: string | null;
  orderCode: string | null;
  orderId: string | null;
  reservationToken: string | null;
};

const STATUS_TONE: Record<string, string> = {
  AVAILABLE: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  RESERVED: "bg-amber-50 text-amber-900 ring-amber-200",
  CONSUMED: "bg-slate-100 text-slate-700 ring-slate-200",
  DISABLED: "bg-red-50 text-red-700 ring-red-200",
};

function MaskCell({ id, masked }: { id: string; masked: string }) {
  const [plain, setPlain] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function reveal() {
    if (plain) {
      setPlain(null);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/stock/items/${id}/reveal`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Reveal thất bại");
      setPlain(data.plain as string);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      <span className="break-all">{plain ?? masked}</span>
      <button
        type="button"
        disabled={busy}
        onClick={reveal}
        className="shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] font-semibold text-navy hover:bg-navy-soft disabled:opacity-40"
        title={plain ? "Ẩn" : "Hiện đầy đủ"}
      >
        {plain ? "Ẩn" : "Hiện"}
      </button>
    </div>
  );
}

function downloadCsv(filename: string, rows: string[][]) {
  const body = rows
    .map((r) =>
      r
        .map((c) => {
          const s = String(c ?? "");
          if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
          return s;
        })
        .join(","),
    )
    .join("\n");
  const blob = new Blob([body], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function KeysTable({
  rows,
  sku,
}: {
  rows: KeyRow[];
  sku: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (!qq) return true;
      return (
        r.id.toLowerCase().includes(qq) ||
        r.masked.toLowerCase().includes(qq) ||
        (r.orderCode?.toLowerCase().includes(qq) ?? false) ||
        (r.reservationToken?.toLowerCase().includes(qq) ?? false) ||
        (r.orderId?.toLowerCase().includes(qq) ?? false)
      );
    });
  }, [rows, status, q]);

  const page = useClientPagination(
    filtered,
    "keyon.admin.stock.keysPageSize",
    `${status}|${q}`,
  );
  const pageIds = page.pageItems.map((r) => r.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.has(id));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        for (const id of pageIds) next.delete(id);
      } else {
        for (const id of pageIds) next.add(id);
      }
      return next;
    });
  }

  async function bulkDisable() {
    const ids = Array.from(selected).filter((id) => {
      const row = rows.find((r) => r.id === id);
      return row?.status === "AVAILABLE";
    });
    if (ids.length === 0) {
      setMsg("Chỉ Disable được key AVAILABLE (bỏ RESERVED/CONSUMED)");
      return;
    }
    if (!window.confirm(`Disable ${ids.length} key AVAILABLE?`)) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/stock/bulk-disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseIds: ids,
          reason: "admin_bulk_disable",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Disable thất bại");
      setMsg(`Đã disable ${data.disabled}${data.failed ? ` · lỗi ${data.failed}` : ""}`);
      setSelected(new Set());
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setBusy(false);
    }
  }

  function exportCsv(mode: "masked" | "full") {
    void (async () => {
      const source =
        selected.size > 0
          ? filtered.filter((r) => selected.has(r.id))
          : filtered;
      if (source.length === 0) return;

      const header = [
        "id",
        "sku",
        "license",
        "status",
        "createdAt",
        "reservedAt",
        "consumedAt",
        "orderCode",
        "reservationToken",
      ];
      const dataRows: string[][] = [header];

      for (const r of source) {
        let license = r.masked;
        if (mode === "full") {
          try {
            const res = await fetch(`/api/admin/stock/items/${r.id}/reveal`, {
              method: "POST",
            });
            const data = await res.json();
            if (res.ok) license = data.plain as string;
          } catch {
            /* keep masked */
          }
        }
        dataRows.push([
          r.id,
          sku,
          license,
          r.status,
          r.createdAt,
          r.reservedAt ?? "",
          r.consumedAt ?? "",
          r.orderCode ?? "",
          r.reservationToken ?? "",
        ]);
      }

      downloadCsv(
        `${sku}-${mode}-${new Date().toISOString().slice(0, 10)}.csv`,
        dataRows,
      );
      setMsg(`Đã export ${source.length} dòng (${mode})`);
    })();
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-2 rounded-2xl border border-border bg-card px-3 py-3">
        <label className="text-xs">
          <span className="text-muted">Status</span>
          <select
            className="mt-1 block rounded-lg border border-border px-2 py-1.5 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="RESERVED">RESERVED</option>
            <option value="CONSUMED">CONSUMED</option>
            <option value="DISABLED">DISABLED</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="text-muted">Search</span>
          <input
            className="mt-1 block w-56 rounded-lg border border-border px-2 py-1.5 text-sm"
            placeholder="Order / token / id…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <PageSizeSelect
          value={page.pageSize}
          onChange={page.setPageSize}
          unit="key"
        />
        <button
          type="button"
          disabled={busy || selected.size === 0}
          onClick={bulkDisable}
          className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-navy disabled:opacity-40"
        >
          Disable
        </button>
        <button
          type="button"
          disabled={filtered.length === 0}
          onClick={() => exportCsv("masked")}
          className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-navy disabled:opacity-40"
        >
          Export (masked)
        </button>
        <button
          type="button"
          disabled={filtered.length === 0}
          onClick={() => exportCsv("full")}
          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-950 disabled:opacity-40"
          title="Reveal từng key rồi xuất — có audit"
        >
          Export (full)
        </button>
        <span className="ml-auto text-xs text-muted">
          Chọn {selected.size} · {filtered.length}/{rows.length} key · trang{" "}
          {page.page}/{page.pageCount}
        </span>
      </div>
      {msg ? <p className="text-xs text-muted">{msg}</p> : null}

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-3 py-2">License</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2">Reserved</th>
              <th className="px-3 py-2">Consumed</th>
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {page.pageItems.map((r) => (
              <tr key={r.id} className="border-b border-border/70 align-top">
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(r.id)}
                    onChange={() => toggle(r.id)}
                  />
                </td>
                <td className="px-3 py-3">
                  <MaskCell id={r.id} masked={r.masked} />
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
                      STATUS_TONE[r.status] ?? "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs text-muted">{r.createdAt}</td>
                <td className="px-3 py-3 text-xs text-muted">
                  {r.reservedAt ?? "—"}
                </td>
                <td className="px-3 py-3 text-xs text-muted">
                  {r.consumedAt ?? "—"}
                </td>
                <td className="px-3 py-3 text-xs">
                  {r.orderId && r.orderCode ? (
                    <Link
                      href={`/admin/orders/${r.orderId}`}
                      className="font-mono text-accent hover:underline"
                    >
                      {r.orderCode}
                    </Link>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                  {r.reservationToken ? (
                    <p className="mt-0.5 font-mono text-[10px] text-muted">
                      tok {r.reservationToken.slice(0, 10)}…
                    </p>
                  ) : null}
                </td>
                <td className="px-3 py-3 text-right">
                  <Link
                    href={`/admin/stock/items/${r.id}`}
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    Chi tiết
                  </Link>
                </td>
              </tr>
            ))}
            {page.pageItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-sm text-muted">
                  Không có key
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <ListPaginationBar
        page={page.page}
        pageCount={page.pageCount}
        from={page.from}
        to={page.to}
        total={page.total}
        unit="key"
        onPrev={() => page.setPage(page.page - 1)}
        onNext={() => page.setPage(page.page + 1)}
      />
    </div>
  );
}
