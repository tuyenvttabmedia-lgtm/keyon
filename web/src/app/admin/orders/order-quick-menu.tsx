"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminOrderListRow } from "@/lib/admin-orders";
import { CancelOrderButton } from "./cancel-button";

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

export function OrderQuickMenu({ row }: { row: AdminOrderListRow }) {
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toast(msg: string) {
    setFlash(msg);
    setTimeout(() => setFlash(null), 1600);
  }

  async function resendDeliverable() {
    if (!row.primaryDeliveryId) {
      toast("Chưa có delivery");
      return;
    }
    if (!confirm("Gửi lại deliverable + email cho khách?")) return;
    startTransition(async () => {
      try {
        const res = await fetch("/api/deliveries/resend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deliveryId: row.primaryDeliveryId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Resend thất bại");
        toast("Đã gửi lại");
        setOpen(false);
        router.refresh();
      } catch (e) {
        toast(e instanceof Error ? e.message : "Lỗi");
      }
    });
  }

  const customerHref = row.userId
    ? `/admin/customers?q=${encodeURIComponent(row.email)}`
    : `/admin/customers?q=${encodeURIComponent(row.email)}`;

  const itemClass =
    "block w-full px-3 py-2 text-left text-sm text-navy hover:bg-[#f8fafc] disabled:opacity-40";

  return (
    <div className="relative flex items-center gap-1.5" ref={rootRef}>
      {row.waitingInbox ||
      row.jobStatus === "WAITING_HUMAN" ||
      row.jobStatus === "WAITING_STOCK" ||
      row.jobStatus === "FAILED" ? (
        <Link
          href="/admin/inbox"
          className="rounded-md bg-amber-500 px-2 py-1 text-xs font-semibold text-white hover:bg-amber-600"
        >
          Inbox
        </Link>
      ) : null}
      {row.status === "PENDING_PAYMENT" ? (
        <CancelOrderButton orderId={row.id} />
      ) : null}

      <button
        type="button"
        aria-label="Thao tác nhanh"
        aria-expanded={open}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-navy hover:bg-navy-soft"
        onClick={() => setOpen((v) => !v)}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="12" cy="19" r="1.6" />
        </svg>
      </button>

      {flash ? (
        <span className="absolute -top-7 right-0 whitespace-nowrap rounded bg-navy px-2 py-0.5 text-[10px] text-white">
          {flash}
        </span>
      ) : null}

      {open ? (
        <div className="absolute right-0 top-full z-30 mt-1 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <Link
            href={`/admin/orders/${row.id}`}
            className={itemClass}
            onClick={() => setOpen(false)}
          >
            Xem chi tiết
          </Link>
          <Link
            href={customerHref}
            className={itemClass}
            onClick={() => setOpen(false)}
          >
            Mở khách hàng
          </Link>
          <button
            type="button"
            className={itemClass}
            onClick={async () => {
              await copyText(row.code);
              toast("Đã copy Order ID");
              setOpen(false);
            }}
          >
            Copy Order ID
          </button>
          <button
            type="button"
            className={itemClass}
            disabled={!row.paymentReference}
            onClick={async () => {
              if (!row.paymentReference) return;
              await copyText(row.paymentReference);
              toast("Đã copy Payment Ref");
              setOpen(false);
            }}
          >
            Copy Payment Ref
          </button>
          <button
            type="button"
            className={itemClass}
            disabled={!row.primaryDeliveryId || pending}
            onClick={resendDeliverable}
          >
            Gửi lại Deliverable
          </button>
          <Link
            href={`/admin/orders/${row.id}#notes`}
            className={itemClass}
            onClick={() => setOpen(false)}
          >
            Thêm ghi chú
          </Link>
        </div>
      ) : null}
    </div>
  );
}
