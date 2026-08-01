import { Suspense } from "react";
import { parseNotifTab } from "@/lib/admin-notifications";
import { loadNotificationHistory } from "@/server/admin/notifications-query";
import { NotificationCenter } from "./notification-center";
import {
  ADMIN_PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
} from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const tabRaw = Array.isArray(sp.tab) ? sp.tab[0] : sp.tab;
  const tab = parseNotifTab(tabRaw);
  const history = await loadNotificationHistory();

  return (
    <div className="space-y-3">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>Thông báo</h1>
        <p className={SECTION_LEAD_CLASS}>
          Notification Center · in-app ops · không marketing
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-64 animate-pulse rounded-2xl border border-border bg-card" />
        }
      >
        <NotificationCenter initialTab={tab} history={history} />
      </Suspense>
    </div>
  );
}
