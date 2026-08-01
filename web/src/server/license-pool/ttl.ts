/** Parse LICENSE_RESERVE_TTL — e.g. 15m, 900s, 900000ms, 15 */
export function parseReserveTtlMs(raw?: string): number {
  const s = (raw ?? process.env.LICENSE_RESERVE_TTL ?? "15m").trim().toLowerCase();
  const m = /^(\d+)\s*(ms|s|m|h)?$/.exec(s);
  if (!m) return 15 * 60 * 1000;
  const n = Number(m[1]);
  const unit = m[2] ?? "m";
  switch (unit) {
    case "ms":
      return n;
    case "s":
      return n * 1000;
    case "h":
      return n * 60 * 60 * 1000;
    case "m":
    default:
      return n * 60 * 1000;
  }
}

export function reserveExpiresAt(from = new Date()): Date {
  return new Date(from.getTime() + parseReserveTtlMs());
}
