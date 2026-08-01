import { Suspense } from "react";
import {
  parseCustomersSearchParams,
} from "@/lib/admin-customers";
import { queryAdminCustomers } from "@/server/admin/customers-query";
import { CustomersToolbar } from "./customers-toolbar";
import { CustomersList } from "./customers-list";
import {
  ADMIN_PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
} from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = parseCustomersSearchParams(sp);
  const { rows, totalMatched } = await queryAdminCustomers(query);

  return (
    <div className="space-y-3">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>Khách hàng</h1>
        <p className={SECTION_LEAD_CLASS}>
          Customer Workspace · hỗ trợ CS / vận hành
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-24 animate-pulse rounded-xl border border-border bg-card" />
        }
      >
        <CustomersToolbar
          q={query.q ?? ""}
          verified={query.verified ?? "all"}
          awaiting={query.awaiting ?? "all"}
          ticket={query.ticket ?? "all"}
          isNew={query.isNew ?? "all"}
          minSpend={query.minSpend ?? ""}
          maxSpend={query.maxSpend ?? ""}
          from={query.from ?? ""}
          to={query.to ?? ""}
          totalMatched={totalMatched}
          shown={rows.length}
        />
      </Suspense>

      <CustomersList rows={rows} />
    </div>
  );
}
