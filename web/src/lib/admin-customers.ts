export type CustomerVerifiedFilter = "all" | "verified" | "unverified";
export type CustomerBoolFilter = "all" | "yes" | "no";

export type CustomersListQuery = {
  q?: string;
  verified?: CustomerVerifiedFilter;
  awaiting?: CustomerBoolFilter;
  ticket?: CustomerBoolFilter;
  isNew?: CustomerBoolFilter;
  minSpend?: string;
  maxSpend?: string;
  from?: string; // YYYY-MM-DD registered
  to?: string;
};

export type AdminCustomerListRow = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  createdAt: string;
  emailVerified: boolean;
  totpEnabled: boolean;
  orderCount: number;
  totalSpendVnd: number;
  lastOrderAt: string | null;
  lastOrderCode: string | null;
  hasAwaiting: boolean;
  openTicketCount: number;
  lastSeenAt: string | null;
};

export function parseCustomersSearchParams(
  sp: Record<string, string | string[] | undefined>,
): CustomersListQuery {
  const one = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const verified = one("verified") ?? "all";
  const awaiting = one("awaiting") ?? "all";
  const ticket = one("ticket") ?? "all";
  const isNew = one("isNew") ?? "all";
  const bools: CustomerBoolFilter[] = ["all", "yes", "no"];
  const verifieds: CustomerVerifiedFilter[] = ["all", "verified", "unverified"];

  return {
    q: one("q") ?? "",
    verified: verifieds.includes(verified as CustomerVerifiedFilter)
      ? (verified as CustomerVerifiedFilter)
      : "all",
    awaiting: bools.includes(awaiting as CustomerBoolFilter)
      ? (awaiting as CustomerBoolFilter)
      : "all",
    ticket: bools.includes(ticket as CustomerBoolFilter)
      ? (ticket as CustomerBoolFilter)
      : "all",
    isNew: bools.includes(isNew as CustomerBoolFilter)
      ? (isNew as CustomerBoolFilter)
      : "all",
    minSpend: one("minSpend") ?? "",
    maxSpend: one("maxSpend") ?? "",
    from: one("from") ?? "",
    to: one("to") ?? "",
  };
}

export function customerInitials(name: string | null, email: string): string {
  const src = (name?.trim() || email).trim();
  const parts = src.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  }
  return src.slice(0, 2).toUpperCase();
}

export function parseVndBound(s: string | undefined): number | null {
  if (!s || !/^\d+$/.test(s.trim())) return null;
  const n = Number(s.trim());
  return Number.isFinite(n) && n >= 0 ? n : null;
}
