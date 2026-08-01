"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AccountCopy } from "@/storefront/lib/account-cms";
import {
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  EMPTY_TITLE_CLASS,
  LINK_MICRO_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_NONE,
  HOVER_OUTLINE_FILL,
  OPACITY_DISABLED,
  TRANSITION_UI,
} from "@/storefront/effects";

type Noti = {
  id: string;
  title: string;
  body: string;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

export function NotificationsView({
  cms,
  initial,
}: {
  cms: AccountCopy;
  initial: Noti[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [loading, setLoading] = useState(false);

  async function markAll() {
    setLoading(true);
    try {
      await fetch("/api/account/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      setItems((prev) =>
        prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })),
      );
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function markOne(id: string) {
    await fetch("/api/account/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    });
    setItems((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, readAt: n.readAt ?? new Date().toISOString() } : n,
      ),
    );
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className={PAGE_TITLE_CLASS}>{cms.notificationsTitle}</h1>
          <p className={`mt-1.5 ${SECTION_LEAD_CLASS}`}>{cms.notificationsLead}</p>
        </div>
        <button
          type="button"
          disabled={loading || items.every((n) => n.readAt)}
          onClick={markAll}
          className={`inline-flex h-10 items-center rounded-xl border border-border px-4 ${CTA_COMPACT_CLASS} text-navy ${TRANSITION_UI} ${HOVER_OUTLINE_FILL} ${OPACITY_DISABLED}`}
        >
          Đánh dấu đã đọc
        </button>
      </div>

      {items.length === 0 ? (
        <div className={`rounded-2xl border border-dashed border-border bg-white px-6 py-12 text-center ${ELEVATION_NONE}`}>
          <p className={EMPTY_TITLE_CLASS}>{cms.notificationsEmpty}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((n) => (
            <li
              key={n.id}
              className={`rounded-2xl border border-border bg-white p-4 ${ELEVATION_NONE} ${
                n.readAt ? "opacity-80" : "border-accent/30"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className={CARD_TITLE_CLASS}>{n.title}</p>
                  <p className={`mt-1 ${SECTION_LEAD_CLASS}`}>{n.body}</p>
                  <p className={`mt-2 ${CARD_META_CLASS}`}>
                    {new Date(n.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!n.readAt ? (
                    <button
                      type="button"
                      onClick={() => markOne(n.id)}
                      className={LINK_MICRO_CLASS}
                    >
                      Đã đọc
                    </button>
                  ) : null}
                  {n.href ? (
                    <Link href={n.href} className={LINK_MICRO_CLASS}>
                      Xem →
                    </Link>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
