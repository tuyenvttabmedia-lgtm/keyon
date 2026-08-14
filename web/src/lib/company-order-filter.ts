/** Heuristic company key from Order.email — no Core Company table. */

const CONSUMER_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.com.vn",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "me.com",
  "proton.me",
  "protonmail.com",
  "mail.com",
  "zoho.com",
  "yandex.com",
]);

export function emailDomain(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 1) return null;
  const d = email.slice(at + 1).trim().toLowerCase();
  return d.includes(".") ? d : null;
}

export function isConsumerEmailDomain(domain: string): boolean {
  return CONSUMER_EMAIL_DOMAINS.has(domain.trim().toLowerCase());
}

export function parseCompanyFilter(raw: string): {
  domain?: string;
  name?: string;
} {
  const s = raw.trim();
  if (!s) return {};
  const stripped = s.replace(/^@/, "").toLowerCase();
  if (
    stripped.length >= 3 &&
    !stripped.includes(" ") &&
    /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/i.test(stripped)
  ) {
    return { domain: stripped };
  }
  if (s.length < 2) return {};
  return { name: s };
}
