"use client";

import type { OrderTimelinePreview } from "@/lib/admin-orders";

function fmt(d: string | Date | null | undefined) {
  if (!d) return null;
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STEPS: {
  key: keyof OrderTimelinePreview;
  label: string;
}[] = [
  { key: "createdAt", label: "Created" },
  { key: "paidAt", label: "Payment" },
  { key: "fulfillmentAt", label: "Fulfillment" },
  { key: "deliveredAt", label: "Delivery" },
];

/** Desktop-only hover preview — data already on the row */
export function OrderTimelinePreviewTip({
  timeline,
}: {
  timeline: OrderTimelinePreview;
}) {
  return (
    <div className="pointer-events-none absolute left-0 top-full z-20 hidden w-[280px] pt-1 group-hover/order:md:block">
      <div className="rounded-xl border border-border bg-card p-3 shadow-lg">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted">
          Timeline
        </p>
        <ol className="space-y-2">
          {STEPS.map((s, i) => {
            const at = fmt(timeline[s.key]);
            const done = Boolean(at) || s.key === "createdAt";
            return (
              <li key={s.key} className="flex items-start gap-2 text-xs">
                <span
                  className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                    done ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-navy">{s.label}</span>
                    {i < STEPS.length - 1 ? (
                      <span className="text-[10px] text-muted">→</span>
                    ) : null}
                  </div>
                  <p className="text-muted">{at ?? "—"}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
