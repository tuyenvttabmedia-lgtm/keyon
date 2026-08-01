"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AccountCopy } from "@/storefront/lib/account-cms";
import {
  BADGE_CLASS,
  BODY_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  EMPTY_TITLE_CLASS,
  FORM_ERROR_CLASS,
  FORM_LABEL_CLASS,
  FORM_SUCCESS_CLASS,
  INPUT_TEXT_CLASS,
  PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
} from "@/storefront/typography";
import {
  CARD_PORTAL,
  CTA_PRIMARY_EFFECT,
  ELEVATION_NONE,
  OPACITY_DISABLED_BUSY,
} from "@/storefront/effects";

type Ticket = {
  id: string;
  subject: string;
  body: string;
  status: string;
  adminNote: string | null;
  orderId: string | null;
  createdAt: string;
};

const STATUS_VI: Record<string, string> = {
  OPEN: "Mới mở",
  IN_PROGRESS: "Đang xử lý",
  RESOLVED: "Đã xử lý",
  CLOSED: "Đã đóng",
};

const INPUT_CLASS = `mt-1 w-full rounded-xl border border-border px-3 py-2.5 ${INPUT_TEXT_CLASS}`;

export function TicketsView({
  cms,
  initial,
  defaultOrderId,
  defaultOrderCode,
}: {
  cms: AccountCopy;
  initial: Ticket[];
  defaultOrderId?: string;
  defaultOrderCode?: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [subject, setSubject] = useState(
    defaultOrderCode ? `Hỗ trợ đơn ${defaultOrderCode}` : "",
  );
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch("/api/account/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          body,
          orderId: defaultOrderId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setItems((prev) => [
        {
          id: data.ticket.id,
          subject: data.ticket.subject,
          body: data.ticket.body,
          status: data.ticket.status,
          adminNote: data.ticket.adminNote,
          orderId: data.ticket.orderId,
          createdAt: data.ticket.createdAt,
        },
        ...prev,
      ]);
      setSubject(defaultOrderCode ? `Hỗ trợ đơn ${defaultOrderCode}` : "");
      setBody("");
      setMsg("Đã gửi yêu cầu hỗ trợ");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className={PAGE_TITLE_CLASS}>{cms.ticketsTitle}</h1>
        <p className={`mt-1.5 ${SECTION_LEAD_CLASS}`}>{cms.ticketsLead}</p>
      </div>

      <form
        onSubmit={submit}
        className={`space-y-3 ${CARD_PORTAL}`}
      >
        <label className="block">
          <span className={FORM_LABEL_CLASS}>{cms.ticketFormSubjectLabel}</span>
          <input
            required
            className={INPUT_CLASS}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </label>
        <label className="block">
          <span className={FORM_LABEL_CLASS}>{cms.ticketFormBodyLabel}</span>
          <textarea
            required
            rows={4}
            className={INPUT_CLASS}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </label>
        {err ? <p className={FORM_ERROR_CLASS}>{err}</p> : null}
        {msg ? <p className={FORM_SUCCESS_CLASS}>{msg}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex h-11 items-center justify-center rounded-xl bg-navy px-5 ${CTA_LABEL_CLASS} text-white ${CTA_PRIMARY_EFFECT} ${OPACITY_DISABLED_BUSY}`}
        >
          {loading ? "Đang gửi…" : cms.ticketFormSubmit}
        </button>
      </form>

      {items.length === 0 ? (
        <div className={`rounded-2xl border border-dashed border-border bg-white px-6 py-12 text-center ${ELEVATION_NONE}`}>
          <p className={EMPTY_TITLE_CLASS}>{cms.ticketsEmpty}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((t) => (
            <li
              key={t.id}
              className={`rounded-2xl border border-border bg-white p-4 ${ELEVATION_NONE}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className={CARD_TITLE_CLASS}>{t.subject}</p>
                <span
                  className={`rounded-full bg-accent-soft px-2.5 py-0.5 ${BADGE_CLASS} text-accent`}
                >
                  {STATUS_VI[t.status] ?? t.status}
                </span>
              </div>
              <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>{t.body}</p>
              {t.adminNote ? (
                <p className={`mt-2 rounded-lg bg-surface px-3 py-2 ${BODY_CLASS}`}>
                  Phản hồi: {t.adminNote}
                </p>
              ) : null}
              <p className={`mt-2 ${CARD_META_CLASS}`}>
                {new Date(t.createdAt).toLocaleString("vi-VN")}
                {t.orderId ? ` · Đơn liên quan` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
