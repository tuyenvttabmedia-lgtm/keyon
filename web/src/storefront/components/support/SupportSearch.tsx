"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useId, useRef, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { BODY_MUTED_CLASS, CARD_META_CLASS, CARD_TITLE_CLASS } from "@/storefront/typography";
import { ELEVATION_FLOAT, TRANSITION_UI } from "@/storefront/effects";
import {
  FAQ_HREF,
  GUIDES_HREF,
  TICKETS_HREF,
  searchSupportDocs,
  type SuggestChip,
  type SupportSearchDoc,
} from "./shared";

type Props = {
  docs: SupportSearchDoc[];
  suggestions: SuggestChip[];
  /** Larger desktop hero search vs compact mobile. */
  size?: "hero" | "compact";
};

export function SupportSearch({ docs, suggestions, size = "hero" }: Props) {
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query.trim());
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const searching = deferred.length >= 2;
  const results = searching ? searchSupportDocs(docs, deferred) : [];

  useEffect(() => {
    if (!searching) {
      setBusy(false);
      return;
    }
    setBusy(true);
    const t = window.setTimeout(() => setBusy(false), 120);
    return () => window.clearTimeout(t);
  }, [deferred, searching]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const inputH = size === "hero" ? "h-14" : "h-12";

  return (
    <div ref={wrapRef} className="relative w-full">
      <label className="block">
        <span className="sr-only">Tìm kiếm hướng dẫn, câu hỏi hoặc vấn đề</span>
        <span
          className="pointer-events-none absolute left-4 top-1/2 z-[1] -translate-y-1/2 text-muted"
          aria-hidden
        >
          <Search size={18} strokeWidth={1.85} />
        </span>
        <input
          type="search"
          role="combobox"
          aria-expanded={open && searching}
          aria-controls={listId}
          aria-autocomplete="list"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={
            size === "hero"
              ? "Tìm kiếm hướng dẫn, câu hỏi hoặc vấn đề..."
              : "Tìm kiếm vấn đề..."
          }
          className={`${inputH} w-full rounded-2xl border border-border bg-white pl-11 pr-11 text-[15px] text-navy outline-none ${TRANSITION_UI} placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20`}
        />
        {query ? (
          <button
            type="button"
            className="absolute right-3.5 top-1/2 z-[1] -translate-y-1/2 rounded-lg p-1 text-muted hover:text-navy"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            aria-label="Xóa tìm kiếm"
          >
            <X size={16} />
          </button>
        ) : null}
      </label>

      {open && searching ? (
        <div
          id={listId}
          role="listbox"
          className={`absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_FLOAT}`}
        >
          {busy ? (
            <div className="flex items-center gap-2 px-4 py-4 text-[13px] text-muted">
              <Loader2 size={16} className="animate-spin" aria-hidden />
              Đang tìm…
            </div>
          ) : results.length > 0 ? (
            <ul className="max-h-[min(60vh,320px)] overflow-y-auto py-1">
              <li className={`px-4 py-2 ${CARD_META_CLASS}`}>Kết quả gợi ý</li>
              {results.map((r) => (
                <li key={r.id} role="option" aria-selected={false}>
                  <Link
                    href={r.kind === "faq" ? `${FAQ_HREF}?q=${encodeURIComponent(r.title)}` : r.href}
                    className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-accent-soft/50"
                    onClick={() => setOpen(false)}
                  >
                    <span className="min-w-0">
                      <span className={`block ${CARD_TITLE_CLASS}`}>{r.title}</span>
                      <span className={`mt-0.5 block ${CARD_META_CLASS}`}>
                        {r.kind === "faq" ? "FAQ" : "Hướng dẫn"}
                      </span>
                    </span>
                    <span className="shrink-0 text-accent" aria-hidden>
                      →
                    </span>
                  </Link>
                </li>
              ))}
              <li className="border-t border-border">
                <Link
                  href={`${FAQ_HREF}?q=${encodeURIComponent(deferred)}`}
                  className="block px-4 py-3 text-[13px] font-semibold text-accent hover:bg-accent-soft/40"
                  onClick={() => setOpen(false)}
                >
                  Xem tất cả kết quả →
                </Link>
              </li>
            </ul>
          ) : (
            <div className="px-4 py-5">
              <p className="text-[14px] font-semibold text-navy">
                Không tìm thấy kết quả phù hợp
              </p>
              <p className={`mt-1 ${BODY_MUTED_CLASS}`}>
                Thử từ khóa khác hoặc gửi yêu cầu hỗ trợ.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={TICKETS_HREF}
                  className="inline-flex h-10 items-center rounded-xl bg-accent px-4 text-[13px] font-semibold text-white"
                  onClick={() => setOpen(false)}
                >
                  Tạo ticket
                </Link>
                <Link
                  href={GUIDES_HREF}
                  className="inline-flex h-10 items-center rounded-xl border border-border bg-white px-4 text-[13px] font-semibold text-navy"
                  onClick={() => setOpen(false)}
                >
                  Xem hướng dẫn
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {suggestions.length > 0 && !searching ? (
        <div className="mt-3">
          <p className={`mb-2 ${CARD_META_CLASS}`}>Gợi ý</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => {
                  setQuery(s.label);
                  setOpen(true);
                }}
                className={`inline-flex h-9 items-center rounded-full border border-border bg-white px-3.5 text-[12px] font-semibold text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
