/** Mask PII email for anonymous / non-owner views (ab***@domain). */
export function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at < 1) return "***";
  const user = email.slice(0, at);
  const domain = email.slice(at + 1);
  const keep = user.slice(0, Math.min(2, user.length));
  return `${keep}***@${domain}`;
}
