import { headers } from "next/headers";
import { AppError } from "@/lib/errors";

function allowedHosts(): Set<string> {
  const hosts = new Set<string>();
  const add = (raw: string | undefined) => {
    if (!raw?.trim()) return;
    try {
      const u = new URL(raw.includes("://") ? raw : `https://${raw}`);
      if (u.hostname) hosts.add(u.hostname.toLowerCase());
    } catch {
      /* ignore */
    }
  };
  add(process.env.NEXT_PUBLIC_APP_URL);
  add(process.env.APP_URL);
  hosts.add("keyon.vn");
  hosts.add("www.keyon.vn");
  if (process.env.NODE_ENV !== "production") {
    hosts.add("localhost");
    hosts.add("127.0.0.1");
  }
  return hosts;
}

/**
 * Reject cross-site cookie-authenticated mutations (classic form CSRF).
 * Safe for curl/ops without Origin; browsers send Origin on cross-origin POST.
 */
export async function assertSameOriginMutation(opts?: {
  /** When set, skip check for GET/HEAD/OPTIONS (default: infer from request). */
  method?: string;
}): Promise<void> {
  const method = (opts?.method ?? "POST").toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return;

  const h = await headers();
  const secFetchSite = (h.get("sec-fetch-site") ?? "").toLowerCase();
  if (secFetchSite === "cross-site") {
    throw new AppError("Forbidden", 403);
  }

  const origin = h.get("origin");
  if (!origin) return;

  let hostname = "";
  try {
    hostname = new URL(origin).hostname.toLowerCase();
  } catch {
    throw new AppError("Forbidden", 403);
  }

  if (!allowedHosts().has(hostname)) {
    throw new AppError("Forbidden", 403);
  }
}

/** Relative same-origin path only (blocks //evil.com and https://…). */
export function assertSafeInternalHref(
  href: string | null | undefined,
  field = "href",
): string | undefined {
  if (href == null || href === "") return undefined;
  const v = href.trim();
  if (!v.startsWith("/") || v.startsWith("//") || v.includes("://")) {
    throw new AppError(`${field} phải là đường dẫn nội bộ (bắt đầu bằng /)`, 400);
  }
  if (v.includes("\\") || v.includes("\0")) {
    throw new AppError(`${field} không hợp lệ`, 400);
  }
  return v;
}
