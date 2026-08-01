import { formatOrderAge } from "@/lib/admin-orders";

export const INBOX_OVERDUE_MS = 2 * 60 * 60 * 1000; // 2h

export type InboxPriority = "high" | "normal" | "low";
export type InboxAgeBucket = "all" | "fresh" | "aging" | "overdue";

export type InboxJobRow = {
  id: string;
  status: string;
  strategy: string;
  notes: string | null;
  createdAt: string;
  startedAt: string | null;
  orderId: string;
  orderCode: string;
  orderEmail: string;
  orderPaidAt: string | null;
  orderCreatedAt: string;
  productName: string;
  variantName: string;
  variantSku: string;
  deliverableType: string;
  receiveLabel: string;
  supplierName: string | null;
  isPax8: boolean;
  priority: InboxPriority;
  waitingMs: number;
  waitingLabel: string;
  overdue: boolean;
  actionable: boolean;
  instruction: string | null;
  notesList: {
    id: string;
    body: string;
    createdAt: string;
    authorLabel: string;
  }[];
};

export type InboxKpi = {
  waiting: number;
  overdue: number;
  manual: number;
  pax8: number;
  completedToday: number;
};

export function deriveInboxPriority(input: {
  status: string;
  waitingMs: number;
}): InboxPriority {
  if (
    input.status === "FAILED" ||
    input.status === "WAITING_STOCK" ||
    input.waitingMs >= INBOX_OVERDUE_MS
  ) {
    return "high";
  }
  if (
    input.status === "QUEUED" ||
    input.status === "PROCESSING" ||
    input.status === "RESERVED"
  ) {
    return "low";
  }
  return "normal";
}

export function ageBucketFor(waitingMs: number): Exclude<InboxAgeBucket, "all"> {
  if (waitingMs >= INBOX_OVERDUE_MS) return "overdue";
  if (waitingMs >= 30 * 60 * 1000) return "aging";
  return "fresh";
}

export function waitingLabelFromMs(waitingMs: number, createdAt: string | Date): string {
  return formatOrderAge(
    typeof createdAt === "string" ? createdAt : createdAt.toISOString(),
    Date.now(),
  );
}

/** Client-side payload validation — does not change complete API. */
export function validateDeliverablePayload(
  deliverableType: string,
  plain: string,
): { ok: true } | { ok: false; error: string } {
  const text = plain.trim();
  if (!text) return { ok: false, error: "Nhập nội dung giao hàng" };

  if (deliverableType === "KEY") {
    if (text.startsWith("{") || text.startsWith("[")) {
      return { ok: false, error: "KEY không được là JSON — dán key thuần" };
    }
    if (text.length < 5) {
      return { ok: false, error: "KEY quá ngắn" };
    }
    if (/\s{2,}/.test(text) && text.includes("\n")) {
      return { ok: false, error: "KEY nên là một dòng" };
    }
    return { ok: true };
  }

  if (deliverableType === "ACCOUNT") {
    try {
      const obj = JSON.parse(text) as Record<string, unknown>;
      if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
        return { ok: false, error: "ACCOUNT cần JSON object" };
      }
      const user = obj.username ?? obj.email ?? obj.user;
      const pass = obj.password ?? obj.pass;
      if (!user || typeof user !== "string") {
        return { ok: false, error: "JSON thiếu username (hoặc email)" };
      }
      if (!pass || typeof pass !== "string") {
        return { ok: false, error: "JSON thiếu password" };
      }
      return { ok: true };
    } catch {
      return { ok: false, error: "ACCOUNT phải là JSON hợp lệ" };
    }
  }

  if (
    deliverableType === "EXTERNAL_PORTAL" ||
    deliverableType === "SUBSCRIPTION"
  ) {
    if (text.length < 3) {
      return { ok: false, error: "Nội dung kích hoạt quá ngắn" };
    }
    return { ok: true };
  }

  // DIGITAL_FILE / other — non-empty is enough
  return { ok: true };
}

export function defaultPayloadFor(deliverableType: string): string {
  if (deliverableType === "ACCOUNT") {
    return JSON.stringify(
      { username: "", password: "" },
      null,
      2,
    );
  }
  return "";
}

export function priorityLabel(p: InboxPriority): string {
  switch (p) {
    case "high":
      return "Cao";
    case "low":
      return "Thấp";
    default:
      return "TB";
  }
}
