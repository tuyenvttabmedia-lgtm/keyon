"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import {
  ageBucketFor,
  defaultPayloadFor,
  priorityLabel,
  validateDeliverablePayload,
  type InboxAgeBucket,
  type InboxJobRow,
  type InboxKpi,
  type InboxPriority,
} from "@/lib/admin-inbox";
import { OrderNotesForm } from "@/app/admin/orders/order-notes-form";
import {
  BADGE_CLASS,
  FIELD_CAPTION_CLASS,
  FIELD_VALUE_NUM_CLASS,
} from "@/storefront/typography";
import {
  ListPaginationBar,
  PageSizeSelect,
  useClientPagination,
} from "@/app/admin/ui/client-pagination";
import { jobStatusVi } from "@/lib/admin-glossary";

type Props = {
  jobs: InboxJobRow[];
  kpi: InboxKpi;
  staffLabel: string;
};

function fmtTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function priorityClass(p: InboxPriority) {
  if (p === "high") return "bg-red-50 text-red-700 ring-1 ring-red-200";
  if (p === "low") return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  return "bg-amber-50 text-amber-800 ring-1 ring-amber-200";
}

export function InboxWorkspace({ jobs, kpi, staffLabel }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [q, setQ] = useState("");
  const [provider, setProvider] = useState("all");
  const [deliveryType, setDeliveryType] = useState("all");
  const [priority, setPriority] = useState<InboxPriority | "all">("all");
  const [age, setAge] = useState<InboxAgeBucket>("all");
  const [skipped, setSkipped] = useState<Set<string>>(() => new Set());
  const [kpiFocus, setKpiFocus] = useState<
    "waiting" | "overdue" | "manual" | "pax8" | null
  >(null);

  const [payload, setPayload] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const providers = useMemo(() => {
    const set = new Set<string>();
    for (const j of jobs) {
      if (j.supplierName) set.add(j.supplierName);
    }
    return [...set].sort((a, b) => a.localeCompare(b, "vi"));
  }, [jobs]);

  const deliveryTypes = useMemo(() => {
    const set = new Set(jobs.map((j) => j.deliverableType));
    return [...set].sort();
  }, [jobs]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return jobs.filter((j) => {
      if (skipped.has(j.id)) return false;
      if (kpiFocus === "waiting" && j.status !== "WAITING_HUMAN") return false;
      if (kpiFocus === "overdue" && !j.overdue) return false;
      if (kpiFocus === "manual" && j.strategy !== "MANUAL") return false;
      if (kpiFocus === "pax8" && !j.isPax8) return false;
      if (provider !== "all" && (j.supplierName ?? "") !== provider) return false;
      if (deliveryType !== "all" && j.deliverableType !== deliveryType) return false;
      if (priority !== "all" && j.priority !== priority) return false;
      if (age !== "all" && ageBucketFor(j.waitingMs) !== age) return false;
      if (needle) {
        const hay = `${j.orderCode} ${j.orderEmail} ${j.productName} ${j.variantName}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [
    jobs,
    skipped,
    kpiFocus,
    provider,
    deliveryType,
    priority,
    age,
    q,
  ]);

  const listPage = useClientPagination(
    filtered,
    "keyon.admin.inbox.pageSize",
    `${q}|${provider}|${deliveryType}|${priority}|${age}|${kpiFocus ?? ""}|${skipped.size}`,
  );

  const selectedId = searchParams.get("job");
  const selected =
    filtered.find((j) => j.id === selectedId) ?? filtered[0] ?? null;

  const setSelected = useCallback(
    (jobId: string | null) => {
      const next = new URLSearchParams(searchParams.toString());
      if (jobId) next.set("job", jobId);
      else next.delete("job");
      startTransition(() => {
        router.replace(`${pathname}?${next.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  // Keep URL in sync when selection falls back to first filtered
  useEffect(() => {
    if (!selected) {
      if (selectedId) setSelected(null);
      return;
    }
    if (selectedId !== selected.id) {
      setSelected(selected.id);
    }
  }, [selected, selectedId, setSelected]);

  // Reset payload when switching jobs — single textarea only
  useEffect(() => {
    if (!selected) {
      setPayload("");
      setError(null);
      return;
    }
    setPayload(defaultPayloadFor(selected.deliverableType));
    setError(null);
  }, [selected?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const validation = useMemo(() => {
    if (!selected) return { ok: false as const, error: "" };
    return validateDeliverablePayload(selected.deliverableType, payload);
  }, [selected, payload]);

  async function retryInstant() {
    if (!selected || selected.status !== "WAITING_STOCK") return;
    if (selected.strategy !== "INSTANT") return;
    setLoading(true);
    setError(null);
    const currentId = selected.id;
    try {
      const res = await fetch("/api/admin/fulfillment/retry-instant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: currentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Retry thất bại");
      if (data.status === "SUCCEEDED") {
        const nextJob =
          filtered.find((j) => j.id !== currentId && j.actionable) ??
          filtered.find((j) => j.id !== currentId) ??
          null;
        if (nextJob) setSelected(nextJob.id);
        else setSelected(null);
      }
      startTransition(() => {
        router.refresh();
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Retry thất bại");
    } finally {
      setLoading(false);
    }
  }

  // After complete: both buttons auto-open next (#11)
  async function complete(_mode: "stay" | "next") {
    if (!selected || !selected.actionable) return;
    const check = validateDeliverablePayload(
      selected.deliverableType,
      payload,
    );
    if (!check.ok) {
      setError(check.error);
      return;
    }
    setLoading(true);
    setError(null);
    const currentId = selected.id;
    const nextJob =
      filtered.find((j) => j.id !== currentId && j.actionable) ??
      filtered.find((j) => j.id !== currentId) ??
      null;
    try {
      const res = await fetch("/api/admin/fulfillment/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: currentId,
          plainPayload: payload.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Complete thất bại");

      if (nextJob) setSelected(nextJob.id);
      else setSelected(null);
      startTransition(() => {
        router.refresh();
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  function skipCurrent() {
    if (!selected) return;
    const currentId = selected.id;
    const nextJob =
      filtered.find((j) => j.id !== currentId) ?? null;
    setSkipped((prev) => new Set(prev).add(currentId));
    if (nextJob) setSelected(nextJob.id);
    else setSelected(null);
  }

  const kpiCards: {
    key: "waiting" | "overdue" | "manual" | "pax8" | "done";
    label: string;
    value: number;
    tone: string;
    ring: string;
  }[] = [
    {
      key: "waiting",
      label: "Waiting",
      value: kpi.waiting,
      tone: "text-amber-700",
      ring: "ring-amber-100",
    },
    {
      key: "overdue",
      label: "Overdue",
      value: kpi.overdue,
      tone: "text-red-700",
      ring: "ring-red-100",
    },
    {
      key: "manual",
      label: "Manual",
      value: kpi.manual,
      tone: "text-navy",
      ring: "ring-slate-100",
    },
    {
      key: "pax8",
      label: "Pax8",
      value: kpi.pax8,
      tone: "text-navy",
      ring: "ring-slate-100",
    },
    {
      key: "done",
      label: "Completed Today",
      value: kpi.completedToday,
      tone: "text-emerald-700",
      ring: "ring-emerald-100",
    },
  ];

  return (
    <div className={`space-y-3 ${pending ? "opacity-90" : ""}`}>
      <p className="text-xs text-muted">{staffLabel}</p>

      {/* Sticky KPI + filters */}
      <div className="sticky top-0 z-20 -mx-4 space-y-2.5 border-b border-border bg-[#f5f7fa]/95 px-4 py-3 backdrop-blur md:-mx-6 md:px-6">
        <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-5">
          {kpiCards.map((c) => {
            const clickable = c.key !== "done";
            const active = clickable && kpiFocus === c.key;
            if (!clickable) {
              return (
                <div
                  key={c.key}
                  className={`rounded-xl border border-border bg-card px-3 py-2 ring-1 ${c.ring}`}
                >
                  <p className={FIELD_CAPTION_CLASS}>{c.label}</p>
                  <p className={`mt-0.5 ${FIELD_VALUE_NUM_CLASS} ${c.tone}`}>
                    {c.value.toLocaleString("vi-VN")}
                  </p>
                </div>
              );
            }
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => {
                  const key = c.key as "waiting" | "overdue" | "manual" | "pax8";
                  setKpiFocus((prev) => (prev === key ? null : key));
                }}
                className={`rounded-xl border bg-card px-3 py-2 text-left ring-1 transition ${c.ring} ${
                  active
                    ? "border-accent shadow-sm"
                    : "border-border hover:border-accent/40"
                }`}
              >
                <p className={FIELD_CAPTION_CLASS}>{c.label}</p>
                <p className={`mt-0.5 ${FIELD_VALUE_NUM_CLASS} ${c.tone}`}>
                  {c.value.toLocaleString("vi-VN")}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <label className="min-w-[180px] flex-1 text-xs">
            <span className="font-medium text-navy">Tìm kiếm</span>
            <input
              className="mt-1 w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
              placeholder="Order, khách, sản phẩm…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          <label className="text-xs">
            <span className="font-medium text-navy">NCC</span>
            <select
              className="mt-1 block max-w-[160px] rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            >
              <option value="all">Tất cả</option>
              {providers.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            <span className="font-medium text-navy">Delivery Type</span>
            <select
              className="mt-1 block rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
              value={deliveryType}
              onChange={(e) => setDeliveryType(e.target.value)}
            >
              <option value="all">Tất cả</option>
              {deliveryTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            <span className="font-medium text-navy">Priority</span>
            <select
              className="mt-1 block rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as InboxPriority | "all")
              }
            >
              <option value="all">Tất cả</option>
              <option value="high">Cao</option>
              <option value="normal">TB</option>
              <option value="low">Thấp</option>
            </select>
          </label>
          <label className="text-xs">
            <span className="font-medium text-navy">Age</span>
            <select
              className="mt-1 block rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm"
              value={age}
              onChange={(e) => setAge(e.target.value as InboxAgeBucket)}
            >
              <option value="all">Tất cả</option>
              <option value="fresh">&lt; 30 phút</option>
              <option value="aging">30 phút – 2 giờ</option>
              <option value="overdue">&gt; 2 giờ</option>
            </select>
          </label>
          <PageSizeSelect
            value={listPage.pageSize}
            onChange={listPage.setPageSize}
            unit="job"
          />
          <p className="text-xs text-muted sm:ml-auto">
            {filtered.length}/{jobs.length} job
            {skipped.size > 0 ? ` · đã skip ${skipped.size}` : ""}
            {" · "}
            trang {listPage.page}/{listPage.pageCount}
          </p>
        </div>
      </div>

      {/* 2-column workspace */}
      <div className="grid gap-3 lg:grid-cols-[minmax(280px,380px)_1fr] lg:items-start">
        {/* Job list */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted">
              Không có job phù hợp.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {listPage.pageItems.map((j) => {
                const active = selected?.id === j.id;
                return (
                  <li key={j.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(j.id)}
                      className={`w-full px-3 py-2.5 text-left transition hover:bg-[#f8fafc] ${
                        active ? "bg-accent-soft/60 ring-inset ring-1 ring-accent/30" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-navy">
                            {j.orderCode}
                          </p>
                          <p className="truncate text-[13px] text-navy/90">
                            {j.productName}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted">
                            {j.orderEmail}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted">
                            NCC {j.supplierName ?? "—"} · {j.receiveLabel} ·{" "}
                            {j.deliverableType}
                          </p>
                        </div>
                        <div className="shrink-0 space-y-1 text-right">
                          <span
                            className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${priorityClass(j.priority)}`}
                          >
                            {priorityLabel(j.priority)}
                          </span>
                          <p
                            className={`text-[11px] font-semibold ${
                              j.overdue ? "text-red-700" : "text-muted"
                            }`}
                          >
                            {j.waitingLabel}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {filtered.length > 0 ? (
            <div className="border-t border-border px-3 py-2">
              <ListPaginationBar
                page={listPage.page}
                pageCount={listPage.pageCount}
                from={listPage.from}
                to={listPage.to}
                total={listPage.total}
                unit="job"
                onPrev={() => listPage.setPage(listPage.page - 1)}
                onNext={() => listPage.setPage(listPage.page + 1)}
              />
            </div>
          ) : null}
        </div>

        {/* Editor */}
        <div className="min-w-0 space-y-3">
          {!selected ? (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center text-sm text-muted">
              Chọn một job bên trái để giao hàng.
            </div>
          ) : (
            <>
              <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-semibold text-navy">
                      {selected.orderCode}
                    </h2>
                    <p className="text-sm text-muted">
                      {jobStatusVi(selected.status)}
                      {selected.isPax8 ? " · Pax8" : ""}
                      {selected.strategy === "MANUAL" ? " · Thủ công" : ""}
                    </p>
                  </div>
                  <Link
                    href={`/admin/orders/${selected.orderId}`}
                    className="text-sm font-medium text-accent hover:underline"
                  >
                    Mở đơn
                  </Link>
                </div>

                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-muted">Customer</dt>
                    <dd className="font-medium text-navy">{selected.orderEmail}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Product</dt>
                    <dd className="font-medium text-navy">{selected.productName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Variant</dt>
                    <dd className="text-navy">
                      {selected.variantName} · {selected.variantSku}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">NCC (Provider)</dt>
                    <dd className="text-navy">{selected.supplierName ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Delivery Type</dt>
                    <dd className="text-navy">
                      {selected.deliverableType} · {selected.receiveLabel}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Waiting</dt>
                    <dd
                      className={
                        selected.overdue
                          ? "font-semibold text-red-700"
                          : "text-navy"
                      }
                    >
                      {selected.waitingLabel}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-muted">Instruction</dt>
                    <dd className="mt-0.5 rounded-lg bg-[#f8fafc] px-3 py-2 text-navy">
                      {selected.instruction || "—"}
                    </dd>
                  </div>
                </dl>

                {/* Mini timeline */}
                <ol className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4 text-xs">
                  {(
                    [
                      ["Created", selected.orderCreatedAt, true],
                      ["Paid", selected.orderPaidAt, Boolean(selected.orderPaidAt)],
                      [
                        "Waiting Human",
                        selected.createdAt,
                        selected.status === "WAITING_HUMAN" ||
                          selected.status === "WAITING_STOCK" ||
                          selected.status === "FAILED",
                      ],
                    ] as const
                  ).map(([label, at, done]) => (
                    <li
                      key={label}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${BADGE_CLASS} ${
                        done
                          ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
                          : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
                      }`}
                    >
                      <span className="font-semibold">{label}</span>
                      <span className="opacity-80">{fmtTime(at)}</span>
                    </li>
                  ))}
                </ol>
              </section>

              {selected.actionable &&
              selected.status === "WAITING_STOCK" &&
              selected.strategy === "INSTANT" ? (
                <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-amber-950">
                    Instant — hết kho (WAITING_STOCK)
                  </h3>
                  <p className="mt-1 text-xs text-amber-900/80">
                    Nhập key vào License Pool (Admin → Stock), rồi bấm Retry.
                    Không gọi lại NCC / buyCard.
                  </p>
                  {error ? (
                    <p className="mt-2 text-sm text-danger">{error}</p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => void retryInstant()}
                      className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {loading ? "…" : "Retry Instant"}
                    </button>
                    <Link
                      href="/admin/stock"
                      className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium text-navy"
                    >
                      Mở Stock
                    </Link>
                  </div>
                </section>
              ) : null}

              {selected.actionable &&
              !(
                selected.status === "WAITING_STOCK" &&
                selected.strategy === "INSTANT"
              ) ? (
                <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                  <label className="block text-sm font-semibold text-navy">
                    Deliverable — {selected.deliverableType}
                  </label>
                  <p className="mt-0.5 text-xs text-muted">
                    {selected.deliverableType === "KEY" &&
                      "Một dòng KEY thuần (không JSON)."}
                    {selected.deliverableType === "ACCOUNT" &&
                      'JSON: { "username", "password" }.'}
                    {selected.deliverableType !== "KEY" &&
                      selected.deliverableType !== "ACCOUNT" &&
                      "Nội dung kích hoạt / hướng dẫn cho khách."}
                  </p>
                  <textarea
                    key={selected.id}
                    value={payload}
                    onChange={(e) => {
                      setPayload(e.target.value);
                      setError(null);
                    }}
                    rows={7}
                    spellCheck={false}
                    className={`mt-2 w-full rounded-xl border bg-background px-3 py-2 font-mono text-sm ${
                      payload.trim() && !validation.ok
                        ? "border-red-300"
                        : "border-border"
                    }`}
                    placeholder={
                      selected.deliverableType === "KEY"
                        ? "XXXXX-XXXXX-XXXXX-XXXXX"
                        : selected.deliverableType === "ACCOUNT"
                          ? '{\n  "username": "",\n  "password": ""\n}'
                          : "URL / hướng dẫn kích hoạt"
                    }
                  />
                  {payload.trim() && !validation.ok ? (
                    <p className="mt-1 text-xs text-danger">{validation.error}</p>
                  ) : null}
                  {error ? (
                    <p className="mt-1 text-sm text-danger">{error}</p>
                  ) : null}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={loading || !validation.ok}
                      onClick={() => complete("stay")}
                      className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      {loading ? "…" : "Complete"}
                    </button>
                    <button
                      type="button"
                      disabled={loading || !validation.ok}
                      onClick={() => complete("next")}
                      className="rounded-xl border border-accent bg-accent-soft px-4 py-2 text-sm font-semibold text-accent disabled:opacity-50"
                    >
                      Complete + Next
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={skipCurrent}
                      className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-navy hover:bg-navy-soft disabled:opacity-50"
                      title="Ẩn job này trong phiên (không đổi DB)"
                    >
                      Skip
                    </button>
                  </div>
                </section>
              ) : (
                <section className="rounded-2xl border border-border bg-card p-4 text-sm text-muted">
                  Đang {jobStatusVi(selected.status).toLowerCase()} — chưa cần nhập
                  deliverable. Có thể bỏ qua phiên này hoặc theo dõi.
                </section>
              )}

              <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                <h3 className="font-semibold text-navy">Internal Notes</h3>
                <div className="mt-3">
                  <OrderNotesForm orderId={selected.orderId} />
                </div>
                <ul className="mt-3 space-y-2 border-t border-border pt-3">
                  {selected.notesList.length === 0 ? (
                    <li className="text-sm text-muted">Chưa có ghi chú.</li>
                  ) : (
                    selected.notesList.map((n) => (
                      <li key={n.id} className="text-sm">
                        <p className="whitespace-pre-wrap text-navy">{n.body}</p>
                        <p className="text-xs text-muted">
                          {n.authorLabel} · {fmtTime(n.createdAt)}
                        </p>
                      </li>
                    ))
                  )}
                </ul>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
