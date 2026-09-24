/** Confirm permanent product delete — accept XÓA / XOA / xóa (case & accent insensitive). */
export function confirmPermanentDeletePhrase(raw: string | null): {
  ok: boolean;
  cancelled: boolean;
} {
  if (raw == null) return { ok: false, cancelled: true };
  const normalized = raw
    .trim()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toUpperCase();
  if (normalized === "XOA") return { ok: true, cancelled: false };
  return { ok: false, cancelled: false };
}

export const PERMANENT_DELETE_PROMPT_HINT =
  "Gõ XOA (hoặc XÓA) để xác nhận — không phân biệt hoa/thường, có/không dấu:";
