/** Staff PO/HĐ on an Order via OrderNote. Not Core Order columns. Not authorization. */

export const COMMERCIAL_REF_MARKER = "[KEYON-COMMERCIAL]";

export type CommercialRef = {
  poNumber: string;
  contractRef: string;
};

const MAX_PART = 80;

export function sanitizeCommercialPart(raw: string): string {
  return raw.replace(/[\r\n|]/g, " ").replace(/\s+/g, " ").trim().slice(0, MAX_PART);
}

export function formatCommercialRefNote(ref: CommercialRef): string {
  const po = sanitizeCommercialPart(ref.poNumber);
  const contract = sanitizeCommercialPart(ref.contractRef);
  return `${COMMERCIAL_REF_MARKER} PO=${po} | CONTRACT=${contract}`;
}

export function parseCommercialRefNote(body: string): CommercialRef | null {
  const trimmed = body.trim();
  if (!trimmed.startsWith(COMMERCIAL_REF_MARKER)) return null;
  const rest = trimmed.slice(COMMERCIAL_REF_MARKER.length).trim();
  const m = /^PO=([^|]*)\|\s*CONTRACT=(.*)$/.exec(rest);
  if (!m) return null;
  return {
    poNumber: m[1].trim(),
    contractRef: m[2].trim(),
  };
}

export function latestCommercialRef(
  notes: { body: string; createdAt: Date }[],
): CommercialRef | null {
  const sorted = [...notes].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );
  for (const n of sorted) {
    const parsed = parseCommercialRefNote(n.body);
    if (parsed && (parsed.poNumber || parsed.contractRef)) return parsed;
  }
  return null;
}

export function commercialRefLabel(ref: CommercialRef | null): string | null {
  if (!ref) return null;
  const parts = [
    ref.poNumber ? `PO ${ref.poNumber}` : null,
    ref.contractRef ? `HĐ ${ref.contractRef}` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}
