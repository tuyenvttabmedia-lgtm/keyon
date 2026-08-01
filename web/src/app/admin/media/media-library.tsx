"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MediaDto } from "@/lib/media-types";
import {
  ListPaginationBar,
  PageSizeSelect,
  useClientPagination,
} from "@/app/admin/ui/client-pagination";

type DateFilter = "all" | "today" | "7d" | "30d" | "custom";
type MimeFilter = "all" | "image" | "png" | "jpeg" | "webp" | "gif";
type SortKey = "newest" | "oldest" | "name" | "size";
type PurposeFilter = "all" | "product" | "blog" | "brand" | "ui";

function formatBytes(n: number) {
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function storageLabel(driver: string) {
  return driver === "wasabi" ? "Wasabi" : "Local";
}

export function MediaLibrary({
  initial,
  driver,
}: {
  initial: MediaDto[];
  driver: string;
}) {
  const [items, setItems] = useState(initial);
  const [q, setQ] = useState("");
  const [mime, setMime] = useState<MimeFilter>("all");
  const [purpose, setPurpose] = useState<PurposeFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [detail, setDetail] = useState<MediaDto | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const now = Date.now();
    return items
      .filter((m) => {
        if (needle) {
          const hay = `${m.filename} ${m.originalName} ${m.altText ?? ""}`.toLowerCase();
          if (!hay.includes(needle)) return false;
        }
        if (mime === "image" && !m.mimeType.startsWith("image/")) return false;
        if (mime === "png" && m.mimeType !== "image/png") return false;
        if (mime === "jpeg" && m.mimeType !== "image/jpeg") return false;
        if (mime === "webp" && m.mimeType !== "image/webp") return false;
        if (mime === "gif" && m.mimeType !== "image/gif") return false;
        if (purpose !== "all" && m.purpose !== purpose && !(purpose === "brand" && m.source === "brand"))
          return false;
        const t = new Date(m.createdAt).getTime();
        if (dateFilter === "today") {
          const start = new Date();
          start.setHours(0, 0, 0, 0);
          if (t < start.getTime()) return false;
        } else if (dateFilter === "7d") {
          if (t < now - 7 * 86400000) return false;
        } else if (dateFilter === "30d") {
          if (t < now - 30 * 86400000) return false;
        } else if (dateFilter === "custom") {
          if (from) {
            const f = new Date(from);
            f.setHours(0, 0, 0, 0);
            if (t < f.getTime()) return false;
          }
          if (to) {
            const end = new Date(to);
            end.setHours(23, 59, 59, 999);
            if (t > end.getTime()) return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sort === "oldest")
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sort === "name") return a.filename.localeCompare(b.filename);
        if (sort === "size") return b.size - a.size;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [items, q, mime, purpose, dateFilter, from, to, sort]);

  const page = useClientPagination(
    filtered,
    "keyon.admin.media.pageSize",
    `${q}|${mime}|${purpose}|${dateFilter}|${sort}|${filtered.length}`,
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Không tải được");
      setItems(data.files ?? []);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }, []);

  async function uploadFiles(list: FileList | File[] | null) {
    if (!list || list.length === 0) return;
    const file = list[0];
    setUploading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload thất bại");
      setMsg("Đã tải ảnh lên thành công");
      await refresh();
      if (data.asset) setDetail(data.asset);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted">
          Lưu trữ:{" "}
          <span className="font-semibold text-navy">{storageLabel(driver)}</span>
          <span className="mx-1.5 text-border">·</span>
          Cấu hình tại Cài đặt → Storage
        </div>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {uploading ? "Đang tải lên…" : "+ Tải ảnh lên"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          disabled={uploading}
          onChange={(e) => void uploadFiles(e.target.files)}
        />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void uploadFiles(e.dataTransfer.files);
        }}
        className={`rounded-2xl border border-dashed px-6 py-10 text-center transition ${
          dragOver
            ? "border-accent bg-accent-soft/40"
            : "border-border bg-card"
        }`}
      >
        <p className="font-medium text-navy">Kéo thả ảnh vào đây</p>
        <p className="mt-1 text-sm text-muted">hoặc</p>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="mt-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-navy disabled:opacity-50"
        >
          Chọn ảnh
        </button>
        <p className="mt-3 text-xs text-muted">PNG · JPG/JPEG · WebP · GIF · tối đa 2MB</p>
        {uploading ? (
          <p className="mt-3 text-sm font-medium text-accent">Đang tải lên…</p>
        ) : null}
        {msg ? <p className="mt-2 text-sm text-muted">{msg}</p> : null}
      </div>

      <div className="flex flex-wrap items-end gap-2 rounded-2xl border border-border bg-card p-4">
        <label className="min-w-[180px] flex-1 text-xs">
          <span className="font-medium text-navy">Tìm kiếm</span>
          <input
            className="mt-1 w-full rounded-lg border border-border px-2.5 py-1.5 text-sm"
            placeholder="Tìm hình ảnh..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Loại</span>
          <select
            className="mt-1 block rounded-lg border border-border px-2.5 py-1.5 text-sm"
            value={mime}
            onChange={(e) => setMime(e.target.value as MimeFilter)}
          >
            <option value="all">Tất cả</option>
            <option value="image">Hình ảnh</option>
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WebP</option>
            <option value="gif">GIF</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Mục đích</span>
          <select
            className="mt-1 block rounded-lg border border-border px-2.5 py-1.5 text-sm"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as PurposeFilter)}
          >
            <option value="all">Tất cả</option>
            <option value="product">Sản phẩm</option>
            <option value="blog">Bài viết</option>
            <option value="brand">Thương hiệu</option>
            <option value="ui">Giao diện</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="font-medium text-navy">Thời gian</span>
          <select
            className="mt-1 block rounded-lg border border-border px-2.5 py-1.5 text-sm"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilter)}
          >
            <option value="all">Tất cả</option>
            <option value="today">Hôm nay</option>
            <option value="7d">7 ngày</option>
            <option value="30d">30 ngày</option>
            <option value="custom">Tùy chọn</option>
          </select>
        </label>
        {dateFilter === "custom" ? (
          <>
            <label className="text-xs">
              Từ ngày
              <input
                type="date"
                className="mt-1 block rounded-lg border border-border px-2 py-1.5 text-sm"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </label>
            <label className="text-xs">
              Đến ngày
              <input
                type="date"
                className="mt-1 block rounded-lg border border-border px-2 py-1.5 text-sm"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </label>
          </>
        ) : null}
        <label className="text-xs">
          <span className="font-medium text-navy">Sắp xếp</span>
          <select
            className="mt-1 block rounded-lg border border-border px-2.5 py-1.5 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="name">Tên A-Z</option>
            <option value="size">Dung lượng</option>
          </select>
        </label>
        <PageSizeSelect
          value={page.pageSize}
          onChange={page.setPageSize}
          unit="ảnh"
        />
      </div>

      {loading ? <p className="text-sm text-muted">Đang tải…</p> : null}

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {page.pageItems.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setDetail(m)}
            className="group overflow-hidden rounded-xl border border-border bg-card text-left transition hover:border-accent/50"
          >
            <div className="relative aspect-square bg-[#f1f5f9]">
              <Image
                src={m.publicUrl}
                alt={m.altText || m.filename}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="space-y-0.5 px-2.5 py-2">
              <p className="truncate text-xs font-medium text-navy">{m.filename}</p>
              <p className="text-[11px] text-muted">
                {m.width && m.height ? `${m.width} × ${m.height}` : "—"}
                {" · "}
                {formatBytes(m.size)}
              </p>
            </div>
          </button>
        ))}
      </div>

      {page.pageItems.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">Không có ảnh phù hợp.</p>
      ) : null}

      <ListPaginationBar
        page={page.page}
        pageCount={page.pageCount}
        from={page.from}
        to={page.to}
        total={page.total}
        unit="ảnh"
        onPrev={() => page.setPage(page.page - 1)}
        onNext={() => page.setPage(page.page + 1)}
      />

      {detail ? (
        <MediaDetailDrawer
          item={detail}
          onClose={() => setDetail(null)}
          onUpdated={(next) => {
            setItems((prev) => prev.map((x) => (x.id === next.id ? next : x)));
            setDetail(next);
          }}
          onDeleted={(id) => {
            setItems((prev) => prev.filter((x) => x.id !== id));
            setDetail(null);
          }}
        />
      ) : null}
    </div>
  );
}

function MediaDetailDrawer({
  item,
  onClose,
  onUpdated,
  onDeleted,
}: {
  item: MediaDto;
  onClose: () => void;
  onUpdated: (m: MediaDto) => void;
  onDeleted: (id: string) => void;
}) {
  const [altText, setAltText] = useState(item.altText ?? "");
  const [caption, setCaption] = useState(item.caption ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const readonly = item.source === "brand";

  useEffect(() => {
    setAltText(item.altText ?? "");
    setCaption(item.caption ?? "");
    setMsg(null);
  }, [item]);

  async function saveMeta() {
    if (readonly) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/media/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ altText, caption }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi lưu");
      onUpdated(data.asset);
      setMsg("Đã lưu");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (readonly) return;
    if (
      !confirm(
        "Bạn có chắc muốn xóa ảnh này?\n\nXóa ảnh có thể làm mất hình tại nơi đang sử dụng.",
      )
    ) {
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/media/${item.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi xóa");
      onDeleted(item.id);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy/40 backdrop-blur-[1px]">
      <button
        type="button"
        className="flex-1"
        aria-label="Đóng"
        onClick={onClose}
      />
      <aside className="flex h-full w-full max-w-md flex-col border-l border-border bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="font-semibold text-navy">Chi tiết ảnh</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-muted hover:bg-surface"
          >
            Đóng
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-[#f1f5f9]">
            <Image
              src={item.publicUrl}
              alt={altText || item.filename}
              fill
              className="object-contain p-2"
              unoptimized
            />
          </div>
          <dl className="space-y-1.5 text-sm">
            <Row label="Tên file" value={item.filename} />
            <Row label="Tên gốc" value={item.originalName} />
            <Row label="Loại file" value={item.mimeType} />
            <Row label="Dung lượng" value={formatBytes(item.size)} />
            <Row
              label="Kích thước"
              value={
                item.width && item.height
                  ? `${item.width} × ${item.height}`
                  : "—"
              }
            />
            <Row
              label="Ngày tải lên"
              value={
                item.source === "brand"
                  ? "—"
                  : new Date(item.createdAt).toLocaleString("vi-VN")
              }
            />
            <Row label="Lưu trữ" value={storageLabel(item.storageDriver)} />
          </dl>

          <label className="block text-xs text-muted">
            Alt text
            <input
              disabled={readonly}
              className="mt-1 w-full rounded-lg border border-border px-2.5 py-1.5 text-sm text-navy disabled:bg-surface"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </label>
          <label className="block text-xs text-muted">
            Caption
            <textarea
              disabled={readonly}
              rows={2}
              className="mt-1 w-full rounded-lg border border-border px-2.5 py-1.5 text-sm text-navy disabled:bg-surface"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </label>
          {msg ? <p className="text-xs text-muted">{msg}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2 border-t border-border p-4">
          <button
            type="button"
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium"
            onClick={() => void navigator.clipboard.writeText(item.publicUrl)}
          >
            Sao chép URL
          </button>
          <a
            href={item.publicUrl}
            download={item.filename}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium"
          >
            Tải xuống
          </a>
          {!readonly ? (
            <>
              <button
                type="button"
                disabled={saving}
                onClick={() => void saveMeta()}
                className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Lưu
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void remove()}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 disabled:opacity-50"
              >
                Xóa
              </button>
            </>
          ) : (
            <p className="w-full text-xs text-muted">
              Ảnh brand tĩnh — không xóa/sửa tại thư viện.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border/50 py-1">
      <dt className="text-muted">{label}</dt>
      <dd className="truncate text-right font-medium text-navy">{value}</dd>
    </div>
  );
}
