import { Suspense } from "react";
import { parseQuoteRequestsSearchParams } from "@/lib/admin-quote-requests";
import { queryAdminQuoteRequests } from "@/server/admin/quote-requests-query";
import { QuoteRequestsToolbar } from "./quote-requests-toolbar";
import { QuoteRequestsList } from "./quote-requests-list";
import { AdminPageHeader } from "../ui/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminQuoteRequestsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = parseQuoteRequestsSearchParams(sp);
  const { rows, totalMatched, kpi, requestTypes } =
    await queryAdminQuoteRequests(query);

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Yêu cầu báo giá"
        lead="Leads từ /contact/quote — email xác nhận khách + quản lý trạng thái"
        crumbs={[{ label: "Yêu cầu báo giá" }]}
      />

      <Suspense
        fallback={
          <div className="h-28 animate-pulse rounded-xl border border-border bg-card" />
        }
      >
        <QuoteRequestsToolbar
          q={query.q ?? ""}
          status={query.status ?? "all"}
          requestType={query.requestType ?? ""}
          from={query.from ?? ""}
          to={query.to ?? ""}
          requestTypes={requestTypes}
          kpi={kpi}
          shown={rows.length}
          totalMatched={totalMatched}
        />
      </Suspense>

      <QuoteRequestsList rows={rows} />
    </div>
  );
}
