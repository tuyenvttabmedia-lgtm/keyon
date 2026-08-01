import { Suspense } from "react";
import {
  loadOrderFilterOptions,
  parseOrdersSearchParams,
  queryAdminOrders,
  queryOrdersSummary,
} from "@/server/admin/orders-query";
import { OrdersToolbar } from "./orders-toolbar";
import { OrdersList } from "./orders-list";
import {
  ADMIN_PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
} from "@/storefront/typography";

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
  };
  const [list, summary, options] = await Promise.all([
    queryAdminOrders(query),
    queryOrdersSummary(filterBase),
    loadOrderFilterOptions(),
  ]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className={ADMIN_PAGE_TITLE_CLASS}>Đơn hàng</h1>
          <p className={SECTION_LEAD_CLASS}>
            Order Workspace · dual status · xử lý nhanh
          </p>
        </div>
      </div>

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
          pageSize={list.pageSize}
          total={list.total}
          page={list.page}
          pageCount={list.pageCount}
          brands={options.brands}
          products={options.products}
          providers={options.providers}
          summary={summary}
        />
      </Suspense>

      <OrdersList rows={list.rows} />
    </div>
  );
}
