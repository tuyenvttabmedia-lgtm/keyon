import "server-only";

import { prisma } from "@/lib/db";

export type QuoteRequestProduct = { slug?: string; name: string };

export type StaffAssigneeOption = {
  id: string;
  label: string;
  email: string;
};

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
  adminNote: string | null;
  assigneeId: string | null;
  assigneeLabel: string | null;
  supportTicketId: string | null;
  customerUserId: string | null;
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

export async function loadStaffAssigneeOptions(): Promise<StaffAssigneeOption[]> {
  const rows = await prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "CS", "FULFILLMENT"] },
      disabledAt: null,
    },
    orderBy: [{ role: "asc" }, { name: "asc" }, { email: "asc" }],
    select: { id: true, name: true, email: true, role: true },
    take: 100,
  });
  return rows.map((u) => ({
    id: u.id,
    email: u.email,
    label: u.name?.trim()
      ? `${u.name.trim()} (${u.email})`
      : `${u.email} · ${u.role}`,
  }));
}

export async function loadQuoteRequestDetail(
  id: string,
): Promise<AdminQuoteRequestDetail | null> {
  const row = await prisma.quoteRequest.findUnique({
    where: { id },
    include: {
      assignee: { select: { name: true, email: true } },
    },
  });
  if (!row) return null;

  const customer = await prisma.user.findFirst({
    where: { email: row.email.toLowerCase(), role: "CUSTOMER" },
    select: { id: true },
  });

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
    adminNote: row.adminNote,
    assigneeId: row.assigneeId,
    assigneeLabel: row.assignee
      ? row.assignee.name?.trim() || row.assignee.email
      : null,
    supportTicketId: row.supportTicketId,
    customerUserId: customer?.id ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
