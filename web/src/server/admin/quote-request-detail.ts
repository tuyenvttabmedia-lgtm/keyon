import "server-only";

import { prisma } from "@/lib/db";

export type QuoteRequestProduct = { slug?: string; name: string };

export type AdminQuoteRequestDetail = {
  id: string;
  referenceCode: string;
  status: string;
  requestType: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  jobTitle: string | null;
  interestedProducts: QuoteRequestProduct[];
  estimatedUsers: string;
  estimatedUsersOther: number | null;
  licenseType: string;
  term: string;
  message: string | null;
  sourcePath: string | null;
  createdAt: string;
  updatedAt: string;
};

function parseProducts(raw: unknown): QuoteRequestProduct[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((p): QuoteRequestProduct | null => {
      if (!p || typeof p !== "object") return null;
      const name =
        typeof (p as { name?: unknown }).name === "string"
          ? (p as { name: string }).name.trim()
          : "";
      if (!name) return null;
      const slug =
        typeof (p as { slug?: unknown }).slug === "string"
          ? (p as { slug: string }).slug.trim() || undefined
          : undefined;
      return { name, slug };
    })
    .filter((x): x is QuoteRequestProduct => x != null);
}

export async function loadQuoteRequestDetail(
  id: string,
): Promise<AdminQuoteRequestDetail | null> {
  const row = await prisma.quoteRequest.findUnique({ where: { id } });
  if (!row) return null;

  return {
    id: row.id,
    referenceCode: row.referenceCode,
    status: row.status,
    requestType: row.requestType,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    companyName: row.companyName,
    jobTitle: row.jobTitle,
    interestedProducts: parseProducts(row.interestedProducts),
    estimatedUsers: row.estimatedUsers,
    estimatedUsersOther: row.estimatedUsersOther,
    licenseType: row.licenseType,
    term: row.term,
    message: row.message,
    sourcePath: row.sourcePath,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
