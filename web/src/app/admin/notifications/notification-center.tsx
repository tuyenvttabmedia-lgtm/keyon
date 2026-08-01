"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  NOTIF_TEMPLATES,
  NOTIF_TYPE_LABEL,
  applyTypePrefix,
  type NotifAudience,
  type NotifCenterTab,
  type NotifHistoryRow,
  type NotifTemplate,
  type NotifType,
} from "@/lib/admin-notifications";
import { BADGE_CLASS } from "@/storefront/typography";
import {
  ListPaginationBar,
  PageSizeSelect,
  useClientPagination,
} from "@/app/admin/ui/client-pagination";

const TABS: { id: NotifCenterTab; label: string }[] = [
  { id: "broadcast", label: "Broadcast" },
  { id: "templates", label: "Templates" },
  { id: "history", label: "History" },
  { id: "scheduled", label: "Scheduled" },
  { id: "draft", label: "Draft" },
];

export function NotificationCenter({
  initialTab,
  history,
}: {
  initialTab: NotifCenterTab;
  history: NotifHistoryRow[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pendingNav, startTransition] = useTransition();

  const tab = (searchParams.get("tab") as NotifCenterTab) || initialTab;

  function setTab(next: NotifCenterTab) {
    const sp = new URLSearchParams(searchParams.toString());
    if (next === "broadcast") sp.delete("tab");
    else sp.set("tab", next);
    startTransition(() => {
      router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    });
  }

  const [audience, setAudience] = useState<NotifAudience>("one");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<NotifType>("info");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [href, setHref] = useState("/account/orders");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const historyPage = useClientPagination(
    history,
    "keyon.admin.notifications.historyPageSize",
    history.length,
  );

  function applyTemplate(t: NotifTemplate) {
    setType(t.type);
    setTitle(t.title);
    setBody(t.body);
    setHref(t.href);
    setTab("broadcast");
    setMsg(`Đã áp dụng template “${t.label}”`);
  }

  const previewTitle = useMemo(
    () => (title.trim() ? applyTypePrefix(title, type) : "Tiêu đề thông báo"),
    [title, type],
  );

  async function send() {
    setLoading(true);
    setMsg(null);
    try {
      const finalTitle = applyTypePrefix(title, type);
      const res = await fetch("/api/account/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: audience === "all" ? undefined : email.trim(),
          title: finalTitle,
          body: body.trim(),
          href: href.trim() || undefined,
          broadcast: audience === "all",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setMsg(
        audience === "all"
          ? `Đã gửi in-app tới ${data.count} khách`
          : "Đã gửi in-app tới khách",
      );
      setTitle("");
      setBody("");
      startTransition(() => router.refresh());
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`space-y-4 ${pendingNav ? "opacity-90" : ""}`}>
      <div className="flex flex-wrap gap-1.5 border-b border-border pb-2">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={
                active
                  ? "rounded-full bg-navy px-3 py-1.5 text-sm font-semibold text-white"
                  : "rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-navy hover:bg-navy-soft"
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "broadcast" ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <section className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div>
              <p className="text-sm font-semibold text-navy">Audience</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(
                  [
                    ["one", "Một khách hàng"],
                    ["all", "Toàn bộ khách (≤500)"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setAudience(id)}
                    className={
                      audience === id
                        ? "rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white"
                        : "rounded-lg border border-border px-3 py-1.5 text-sm text-navy hover:bg-navy-soft"
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
              {audience === "one" ? (
                <input
                  className="mt-3 w-full rounded-lg border border-border px-3 py-2 text-sm"
                  placeholder="Email khách hàng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              ) : (
                <p className="mt-2 text-xs text-muted">
                  Gửi tới tối đa 500 tài khoản role CUSTOMER — không CRM filter.
                </p>
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-navy">Loại</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(Object.keys(NOTIF_TYPE_LABEL) as NotifType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={
                      type === t
                        ? "rounded-full bg-navy px-2.5 py-1 text-xs font-semibold text-white"
                        : `rounded-full border border-border px-2.5 py-1 text-xs font-medium text-navy ${BADGE_CLASS}`
                    }
                  >
                    {NOTIF_TYPE_LABEL[t]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-navy">Delivery</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-lg bg-accent-soft px-3 py-1.5 text-sm font-semibold text-accent">
                  In-App
                </span>
                <span
                  className="cursor-not-allowed rounded-lg border border-dashed border-border px-3 py-1.5 text-sm text-muted"
                  title="Chưa hỗ trợ MVP — không đổi API/queue"
                >
                  Email (chưa hỗ trợ)
                </span>
                <span
                  className="cursor-not-allowed rounded-lg border border-dashed border-border px-3 py-1.5 text-sm text-muted"
                  title="Chưa hỗ trợ MVP"
                >
                  Cả hai (chưa hỗ trợ)
                </span>
              </div>
            </div>

            <label className="block text-sm">
              <span className="font-medium text-navy">Tiêu đề</span>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tiêu đề hiển thị"
                maxLength={180}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-navy">Nội dung</span>
              <textarea
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Nội dung thông báo"
                maxLength={2000}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-navy">Link (href)</span>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 font-mono text-sm"
                value={href}
                onChange={(e) => setHref(e.target.value)}
                placeholder="/account/orders"
              />
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={
                  loading ||
                  !title.trim() ||
                  !body.trim() ||
                  (audience === "one" && !email.trim())
                }
                onClick={send}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {loading ? "Đang gửi…" : "Gửi thông báo"}
              </button>
              {msg ? <p className="text-sm text-muted">{msg}</p> : null}
            </div>
          </section>

          <aside className="space-y-3">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={
                    previewMode === "desktop"
                      ? "rounded-md bg-navy px-2.5 py-1 text-xs font-semibold text-white"
                      : "rounded-md border border-border px-2.5 py-1 text-xs text-navy"
                  }
                >
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={
                    previewMode === "mobile"
                      ? "rounded-md bg-navy px-2.5 py-1 text-xs font-semibold text-white"
                      : "rounded-md border border-border px-2.5 py-1 text-xs text-navy"
                  }
                >
                  Mobile
                </button>
              </div>
              <div
                className={`mx-auto mt-3 rounded-xl border border-border bg-[#f8fafc] p-3 ${
                  previewMode === "mobile" ? "max-w-[240px]" : "w-full"
                }`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  In-app preview
                </p>
                <p className="mt-2 text-sm font-semibold text-navy">
                  {previewTitle}
                </p>
                <p className="mt-1 text-sm text-muted whitespace-pre-wrap">
                  {body.trim() || "Nội dung…"}
                </p>
                {href.trim() ? (
                  <p className="mt-2 font-mono text-[11px] text-accent">
                    {href}
                  </p>
                ) : null}
              </div>
            </div>
            <p className="text-xs text-muted">
              Prefix loại được gắn lúc gửi (vd. [Bảo trì]) — không lưu field
              riêng trên DB.
            </p>
          </aside>
        </div>
      ) : null}

      {tab === "templates" ? (
        <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <p className="text-sm text-muted">
            Chọn nhanh → điền form Broadcast. Không lưu template DB.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {NOTIF_TEMPLATES.map((t) => (
              <li
                key={t.id}
                className="flex flex-col rounded-xl border border-border p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-navy">{t.label}</p>
                  <span
                    className={`rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 ${BADGE_CLASS}`}
                  >
                    {NOTIF_TYPE_LABEL[t.type]}
                  </span>
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{t.body}</p>
                <button
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className="mt-3 rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white"
                >
                  Dùng template
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === "history" ? (
        <div className="space-y-3">
          {history.length > 0 ? (
            <div className="flex justify-end">
              <PageSizeSelect
                value={historyPage.pageSize}
                onChange={historyPage.setPageSize}
              />
            </div>
          ) : null}
          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            {history.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-muted">
                Chưa có thông báo in-app.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b border-border bg-[#f8fafc] text-xs uppercase text-muted">
                    <tr>
                      <th className="px-4 py-3">Tiêu đề</th>
                      <th className="px-4 py-3">Người nhận</th>
                      <th className="px-4 py-3">Đã đọc</th>
                      <th className="px-4 py-3">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {historyPage.pageItems.map((h) => (
                      <tr key={h.id} className="hover:bg-[#f8fafc]/50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-navy">{h.title}</p>
                          <p className="line-clamp-1 text-xs text-muted">
                            {h.body}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-navy">
                          {h.userName || h.userEmail}
                          <p className="text-xs text-muted">{h.userEmail}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              h.readAt
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-800"
                            }`}
                          >
                            {h.readAt ? "Đã đọc" : "Chưa đọc"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted">
                          {new Date(h.createdAt).toLocaleString("vi-VN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          <ListPaginationBar
            page={historyPage.page}
            pageCount={historyPage.pageCount}
            from={historyPage.from}
            to={historyPage.to}
            total={historyPage.total}
            unit="thông báo"
            onPrev={() => historyPage.setPage(historyPage.page - 1)}
            onNext={() => historyPage.setPage(historyPage.page + 1)}
          />
        </div>
      ) : null}

      {tab === "scheduled" ? (
        <EmptyTab
          title="Scheduled chưa hỗ trợ MVP"
          body="Không có bảng / worker lên lịch. Sẽ bổ sung khi nới constraint DB + queue."
        />
      ) : null}

      {tab === "draft" ? (
        <EmptyTab
          title="Draft chưa hỗ trợ MVP"
          body="Không lưu nháp trên DB. Soạn và gửi ngay từ Broadcast, hoặc dùng Templates."
        />
      ) : null}
    </div>
  );
}

function EmptyTab({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <p className="font-semibold text-navy">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{body}</p>
    </section>
  );
}
