/** Integer VND from webhook JSON (number or numeric string). */
export function parseVndAmount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value);
  }
  if (typeof value === "string") {
    const n = Number(value.replace(/[,_\s]/g, "").trim());
    if (Number.isFinite(n)) return Math.round(n);
  }
  return null;
}
