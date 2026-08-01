import { Suspense } from "react";
import { parsePaymentsSearchParams } from "@/lib/admin-payments";
import { queryAdminPayments } from "@/server/admin/payments-query";
import { PaymentsToolbar } from "./payments-toolbar";
import { PaymentsList } from "./payments-list";
import {
  ADMIN_PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
} from "@/storefront/typography";

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
    <div className="space-y-3">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>Thanh toán</h1>
        <p className={SECTION_LEAD_CLASS}>
          Payment Workspace · tra cứu / đối soát nhẹ
        </p>
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
