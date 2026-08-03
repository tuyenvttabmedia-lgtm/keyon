import { Suspense } from "react";
import { parsePaymentsSearchParams } from "@/lib/admin-payments";
import { queryAdminPayments } from "@/server/admin/payments-query";
import { PaymentsToolbar } from "./payments-toolbar";
import { PaymentsList } from "./payments-list";
import { AdminPageHeader } from "../ui/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = parsePaymentsSearchParams(sp);
  const { rows, totalMatched, providers, kpi } =
    await queryAdminPayments(query);

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Thanh toán"
        lead="Payment Workspace · tra cứu / đối soát nhẹ (PL5 CSV)"
        crumbs={[{ label: "Thanh toán" }]}
      />

      <div className="admin-panel rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted">
        <p className="font-medium text-navy">Checklist đối soát pilot (PL5)</p>
        <ol className="mt-1 list-decimal space-y-0.5 pl-5">
          <li>Lọc khoảng ngày pilot → Export CSV</li>
          <li>Khớp cột reference với SePay (PG IPN / sao kê)</li>
          <li>SUCCEEDED + deliveryCount ≥ 1 = đã giao; = 0 → mở Inbox / Stock</li>
        </ol>
      </div>
      <Suspense
        fallback={
          <div className="h-28 animate-pulse rounded-xl border border-border bg-card" />
        }
      >
        <PaymentsToolbar
          q={query.q ?? ""}
          status={query.status ?? "all"}
          provider={query.provider ?? ""}
          from={query.from ?? ""}
          to={query.to ?? ""}
          minVnd={query.minVnd ?? ""}
          maxVnd={query.maxVnd ?? ""}
          providers={providers}
          kpi={kpi}
          shown={rows.length}
          totalMatched={totalMatched}
        />
      </Suspense>

      <PaymentsList rows={rows} />
    </div>
  );
}
