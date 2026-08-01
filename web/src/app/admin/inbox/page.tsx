import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isStaff, readSession } from "@/lib/auth";
import { loadInboxWorkspace } from "@/server/admin/inbox-query";
import { InboxWorkspace } from "./inbox-workspace";
import {
  ADMIN_PAGE_TITLE_CLASS,
  SECTION_LEAD_CLASS,
} from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminInboxPage() {
  const session = await readSession();
  if (!session || !isStaff(session.role)) redirect("/login");

  const { jobs, kpi } = await loadInboxWorkspace();

  return (
    <div className="space-y-3">
      <div>
        <h1 className={ADMIN_PAGE_TITLE_CLASS}>Inbox</h1>
        <p className={SECTION_LEAD_CLASS}>
          Fulfillment Workspace · giao nhanh · ít click
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-64 animate-pulse rounded-2xl border border-border bg-card" />
        }
      >
        <InboxWorkspace
          jobs={jobs}
          kpi={kpi}
          staffLabel={`${session.email} · ${session.role}`}
        />
      </Suspense>
    </div>
  );
}
