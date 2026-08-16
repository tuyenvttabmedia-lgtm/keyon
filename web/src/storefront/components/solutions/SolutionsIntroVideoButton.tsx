"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { CTA_LABEL_CLASS } from "@/storefront/typography";
import { ELEVATION_MODAL, TRANSITION_UI, Z_MODAL, Z_OVERLAY } from "@/storefront/effects";

type Props = {
  embedUrl: string | null;
};

/** Hero secondary CTA: CMS video, else home how-it-works. */
export function SolutionsIntroVideoButton({ embedUrl }: Props) {
  const titleId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!embedUrl) {
    return (
      <Link
        href="/how-it-works"
        className={`inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
      >
        Xem cách KEYON hoạt động
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
      >
        Xem video giới thiệu
      </button>
      {open ? (
        <div className={`fixed inset-0 ${Z_OVERLAY}`}>
          <button
            type="button"
            aria-label="Đóng video"
            className="absolute inset-0 bg-navy/60"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={`absolute left-1/2 top-1/2 w-[min(920px,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-navy ${ELEVATION_MODAL} ${Z_MODAL}`}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <p id={titleId} className={`${CTA_LABEL_CLASS} text-white`}>
                Video giới thiệu
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={`rounded-lg px-2 py-1 text-sm font-semibold text-white/80 ${TRANSITION_UI} hover:text-white`}
              >
                Đóng
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                title="Video giới thiệu KEYON"
                src={embedUrl}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
