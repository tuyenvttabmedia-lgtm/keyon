"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ListPaginationBar,
  PageSizeSelect,
  useClientPagination,
} from "@/app/admin/ui/client-pagination";

type MediaFile = { name: string; url: string; source: string };

export function MediaUpload({ initial }: { initial: MediaFile[] }) {
  const router = useRouter();
  const [files, setFiles] = useState(initial);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const page = useClientPagination(
    files,
    "keyon.admin.media.pageSize",
    files.length,
  );

  async function onUpload(fileList: FileList | null) {
    if (!fileList?.[0]) return;
    setLoading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", fileList[0]);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setFiles((prev) => [
        { name: data.name, url: data.url, source: data.driver ?? "uploads" },
        ...prev,
      ]);
      setMsg(`Đã upload (${data.driver ?? "local"}): ${data.url}`);
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center hover:border-accent">
        <p className="font-medium text-navy">Kéo thả hoặc chọn ảnh</p>
        <p className="mt-1 text-sm text-muted">PNG/JPEG/WebP/GIF · tối đa 2MB</p>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          disabled={loading}
          onChange={(e) => onUpload(e.target.files)}
        />
        {loading && <p className="mt-3 text-sm text-accent">Đang upload…</p>}
        {msg && <p className="mt-3 text-sm text-muted">{msg}</p>}
      </label>

      {files.length > 0 ? (
        <div className="flex justify-end">
          <PageSizeSelect
            value={page.pageSize}
            onChange={page.setPageSize}
          />
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {page.pageItems.map((f) => (
          <div key={f.url} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="relative aspect-video bg-navy-soft">
              <Image src={f.url} alt={f.name} fill className="object-contain p-3" unoptimized />
            </div>
            <div className="space-y-1 px-3 py-2">
              <p className="truncate text-xs text-muted">{f.name}</p>
              <button
                type="button"
                className="text-xs font-medium text-accent hover:underline"
                onClick={() => navigator.clipboard.writeText(f.url)}
              >
                Copy URL
              </button>
            </div>
          </div>
        ))}
      </div>

      <ListPaginationBar
        page={page.page}
        pageCount={page.pageCount}
        from={page.from}
        to={page.to}
        total={page.total}
        unit="file"
        onPrev={() => page.setPage(page.page - 1)}
        onNext={() => page.setPage(page.page + 1)}
      />
    </div>
  );
}
