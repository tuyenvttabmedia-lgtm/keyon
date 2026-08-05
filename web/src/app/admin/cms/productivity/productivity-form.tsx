"use client";

import Image from "next/image";
import { useState } from "react";
import type { CmsProductivity } from "@/server/cms/types";
import { MediaPicker } from "@/app/admin/media/MediaPicker";
import { CmsSaveForm } from "../CmsSaveForm";

export function ProductivityCmsForm({ initial }: { initial: CmsProductivity }) {
  return (
    <CmsSaveForm initial={initial} apiKey="productivity">
      {(form, setForm) => <ProductivityFields form={form} setForm={setForm} />}
    </CmsSaveForm>
  );
}

function ProductivityFields({
  form,
  setForm,
}: {
  form: CmsProductivity;
  setForm: (v: CmsProductivity) => void;
}) {
  const [picker, setPicker] = useState<"hero" | "consult" | "work" | null>(null);

  return (
    <div className="space-y-6">
      <p className="rounded-xl bg-accent-soft/60 px-3 py-2 text-sm text-navy">
        Ảnh dùng trên landing{" "}
        <strong>/solutions/productivity</strong>. Hero nằm trong khung blob (banner
        viewBox); ảnh tư vấn hiện ở card cột phải section hệ sinh thái.
      </p>

      <ImageField
        label="Hero — banner cột phải"
        hint="Khuyến nghị ~960×720 (ngang). Ảnh sẽ clip theo hình organic blob; floating cards xếp absolute phía trên."
        url={form.heroImageUrl}
        aspect="aspect-[4/3]"
        onPick={() => setPicker("hero")}
        onClear={() => setForm({ ...form, heroImageUrl: "" })}
      />

      <ImageField
        label="Tư vấn — ảnh người (ecosystem cột phải)"
        hint="Khuyến nghị chân dung dọc ~480×640 hoặc gần 3:4."
        url={form.consultImageUrl}
        aspect="aspect-[3/4]"
        onPick={() => setPicker("consult")}
        onClear={() => setForm({ ...form, consultImageUrl: "" })}
      />

      <ImageField
        label="Work mode — ảnh cột trái panel (tuỳ chọn)"
        hint="Ảnh người làm việc cho “Giải pháp theo cách bạn làm việc”. Để trống thì dùng illustration."
        url={form.workSceneImageUrl}
        aspect="aspect-[4/5]"
        onPick={() => setPicker("work")}
        onClear={() => setForm({ ...form, workSceneImageUrl: "" })}
      />

      <MediaPicker
        open={picker !== null}
        onClose={() => setPicker(null)}
        multiple={false}
        purpose="ui"
        title="Chọn ảnh Productivity"
        onSelect={(items) => {
          const url = items[0]?.url ?? "";
          if (!url || !picker) return;
          if (picker === "hero") setForm({ ...form, heroImageUrl: url });
          if (picker === "consult") setForm({ ...form, consultImageUrl: url });
          if (picker === "work") setForm({ ...form, workSceneImageUrl: url });
          setPicker(null);
        }}
      />
    </div>
  );
}

function ImageField({
  label,
  hint,
  url,
  aspect,
  onPick,
  onClear,
}: {
  label: string;
  hint: string;
  url: string;
  aspect: string;
  onPick: () => void;
  onClear: () => void;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-5">
      <div>
        <p className="text-sm font-medium text-navy">{label}</p>
        <p className="mt-1 text-xs text-muted">{hint}</p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          className={`relative mx-auto w-full max-w-[220px] overflow-hidden rounded-2xl border border-border bg-surface sm:mx-0 ${aspect}`}
        >
          {url ? (
            <Image src={url} alt={label} fill className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center text-xs text-muted">
              Chưa có ảnh — chọn từ Media
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onPick}
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white"
            >
              Chọn từ Media
            </button>
            {url ? (
              <button
                type="button"
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-danger hover:text-danger"
                onClick={onClear}
              >
                Xóa ảnh
              </button>
            ) : null}
          </div>
          <p className="break-all text-xs text-muted">
            URL: <span className="font-mono text-navy">{url || "—"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
