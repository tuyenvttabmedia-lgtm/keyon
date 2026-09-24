/** Confirm permanent product delete — accept DELETE (case insensitive). */
export function confirmPermanentDeletePhrase(raw: string | null): {
  ok: boolean;
  cancelled: boolean;
} {
  if (raw == null) return { ok: false, cancelled: true };
  const normalized = raw.trim().toUpperCase();
  if (normalized === "DELETE") return { ok: true, cancelled: false };
  return { ok: false, cancelled: false };
}

export const PERMANENT_DELETE_PROMPT_HINT =
  "Gõ DELETE để xác nhận (không phân biệt hoa/thường):";
