import { Suspense } from "react";
import { redirect } from "next/navigation";
import { isStaff, readSession } from "@/lib/auth";
import { loadInboxWorkspace } from "@/server/admin/inbox-query";
import { InboxWorkspace } from "./inbox-workspace";
import { AdminPageHeader } from "../ui/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function AdminInboxPage() {
  const session = await readSession();
  if (!session || !isStaff(session.role)) redirect("/login");

  const { jobs, kpi } = await loadInboxWorkspace();

  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Inbox"
        lead="Fulfillment Workspace · giao nhanh · ít click"
        crumbs={[{ label: "Inbox" }]}
      />

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
