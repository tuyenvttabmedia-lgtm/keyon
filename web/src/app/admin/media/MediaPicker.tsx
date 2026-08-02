"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type MediaPickItem = {
  url: string;
  id?: string;
  altText?: string | null;
  name?: string;
};

type MediaFile = {
  id?: string;
  name: string;
  url: string;
  source?: string;
  publicUrl?: string;
  filename?: string;
  width?: number | null;
  height?: number | null;
  size?: number;
  altText?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (items: MediaPickItem[]) => void;
  multiple?: boolean;
  purpose?: string;
  title?: string;
};

function formatBytes(n?: number) {
  if (!n) return "";
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function normalizeFiles(list: MediaFile[]): MediaFile[] {
  return list.map((f) => ({
    ...f,
    url: f.publicUrl || f.url,
    name: f.filename || f.name,
  }));
}

export function MediaPicker({
  open,
  onClose,
  onSelect,
  multiple = true,
  purpose,
  title = "Chọn từ Thư viện Media",
}: Props) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const loadSeq = useRef(0);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!open) {
      wasOpen.current = false;
      return;
    }

    const justOpened = !wasOpen.current;
    if (justOpened) {
      wasOpen.current = true;
      setSelected(new Set());
      setFiles([]);
      setLoading(true);
      if (q !== "") setQ("");
    }

    const query = justOpened ? "" : q.trim();
    const seq = ++loadSeq.current;
    const delay = !justOpened && query ? 280 : 0;
    if (!justOpened) setLoading(true);
    const t = window.setTimeout(async () => {
      setError(null);
      try {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        const res = await fetch(`/api/admin/media?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Không tải được Media");
        if (seq !== loadSeq.current) return;
        setFiles(normalizeFiles((data.files ?? data.items ?? []) as MediaFile[]));
      } catch (e) {
        if (seq !== loadSeq.current) return;
        setError(e instanceof Error ? e.message : "Lỗi");
        setFiles([]);
      } finally {
        if (seq === loadSeq.current) setLoading(false);
      }
    }, delay);

    return () => {
      window.clearTimeout(t);
    };
  }, [open, q]);

  if (!open) return null;

  function toggle(url: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (multiple) {
        if (next.has(url)) next.delete(url);
        else next.add(url);
      } else {
        next.clear();
        next.add(url);
      }
      return next;
    });
  }

  function confirm() {
    const items: MediaPickItem[] = Array.from(selected).map((url) => {
      const f = files.find((x) => x.url === url);
      return {
        url,
        id: f?.id,
        altText: f?.altText ?? null,
        name: f?.name,
      };
    });
    onSelect(items);
    onClose();
  }

  async function onUpload(list: FileList | null) {
    if (!list?.[0]) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", list[0]);
      if (purpose) fd.append("purpose", purpose);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload thất bại");

      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      const listRes = await fetch(`/api/admin/media?${params.toString()}`);
      const listData = await listRes.json();
      if (listRes.ok) {
        setFiles(normalizeFiles((listData.files ?? listData.items ?? []) as MediaFile[]));
      }

      const url = (data.url || data.publicUrl) as string | undefined;
      if (url) {
        setSelected((prev) => {
          const next = multiple ? new Set(prev) : new Set<string>();
          next.add(url);
          return next;
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal
        aria-label={title}
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="font-semibold text-navy">{title}</p>
            <p className="text-xs text-muted">
              Tìm, tải lên hoặc chọn ảnh từ Thư viện Media
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-muted hover:bg-surface hover:text-navy"
          >
            Đóng
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
          <input
            className="min-w-[180px] flex-1 rounded-lg border border-border px-2.5 py-1.5 text-sm"
            placeholder="Tìm hình ảnh..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {uploading ? "Đang tải…" : "+ Tải ảnh lên"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => void onUpload(e.target.files)}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {loading ? <p className="text-sm text-muted">Đang tải…</p> : null}
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          {!loading && !error && files.length === 0 ? (
            <p className="text-sm text-muted">
              Chưa có ảnh. Tải lên ngay trong hộp thoại này.
            </p>
          ) : null}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {files.map((f) => {
              const url = f.url;
              const on = selected.has(url);
              return (
                <button
                  key={f.id || url}
                  type="button"
                  onClick={() => toggle(url)}
                  className={`overflow-hidden rounded-xl border-2 text-left transition ${
                    on
                      ? "border-accent ring-2 ring-accent/30"
                      : "border-border hover:border-accent/40"
                  }`}
                >
                  <div className="relative aspect-square bg-surface">
                    <Image
                      src={url}
                      alt={f.altText || f.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="px-2 py-1.5">
                    <p className="truncate text-[11px] text-navy">{f.name}</p>
                    <p className="text-[10px] text-muted">
                      {f.width && f.height ? `${f.width}×${f.height}` : ""}
                      {f.size ? ` · ${formatBytes(f.size)}` : ""}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
          <span className="text-xs text-muted">Đã chọn: {selected.size}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-navy"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={selected.size === 0}
              onClick={confirm}
              className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              {multiple ? "Sử dụng ảnh đã chọn" : "Sử dụng ảnh này"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
