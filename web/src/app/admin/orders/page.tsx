import { Suspense } from "react";
import {
  loadOrderFilterOptions,
  parseOrdersSearchParams,
  queryAdminOrders,
  queryOrdersSummary,
} from "@/server/admin/orders-query";
import { OrdersToolbar } from "./orders-toolbar";
import { OrdersList } from "./orders-list";
import { AdminPageHeader } from "../ui/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = parseOrdersSearchParams(sp);
  const filterBase = {
    q: query.q,
    date: query.date,
    from: query.from,
    to: query.to,
    brandId: query.brandId,
    productId: query.productId,
    receive: query.receive,
    provider: query.provider,
    salesMotion: query.salesMotion,
    minVnd: query.minVnd,
    maxVnd: query.maxVnd,
    company: query.company,
    ref: query.ref,
  };
  const [list, summary, options] = await Promise.all([
    queryAdminOrders(query),
    queryOrdersSummary(filterBase),
    loadOrderFilterOptions(),
  ]);

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Đơn hàng"
        lead="Order Workspace · gợi ý tìm theo domain/tên lead — không phải quyền công ty"
        crumbs={[{ label: "Đơn hàng" }]}
      />

      <Suspense
        fallback={
          <div className="h-40 animate-pulse rounded-xl border border-border bg-card" />
        }
      >
        <OrdersToolbar
          q={query.q ?? ""}
          chip={query.chip ?? "all"}
          date={query.date ?? "all"}
          from={query.from ?? ""}
          to={query.to ?? ""}
          brandId={query.brandId ?? ""}
          productId={query.productId ?? ""}
          receive={query.receive ?? "all"}
          provider={query.provider ?? ""}
          salesMotion={query.salesMotion ?? "all"}
          minVnd={query.minVnd ?? ""}
          maxVnd={query.maxVnd ?? ""}
          company={query.company ?? ""}
          commercialRef={query.ref ?? ""}
          pageSize={list.pageSize}
          total={list.total}
          page={list.page}
          pageCount={list.pageCount}
          brands={options.brands}
          products={options.products}
          providers={options.providers}
          companies={options.companies}
          summary={summary}
        />
      </Suspense>

      <OrdersList rows={list.rows} />
    </div>
  );
}
