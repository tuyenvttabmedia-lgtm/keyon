import Link from "next/link";
import { notFound } from "next/navigation";
import {
  loadQuoteRequestDetail,
  loadStaffAssigneeOptions,
} from "@/server/admin/quote-request-detail";
import { QuoteRequestWorkspace } from "../quote-request-workspace";
import { LINK_ACCENT_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminQuoteRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [data, staffOptions] = await Promise.all([
    loadQuoteRequestDetail(id),
    loadStaffAssigneeOptions(),
  ]);
  if (!data) notFound();

  return (
    <div className="space-y-3">
      <Link href="/admin/quote-requests" className={LINK_ACCENT_CLASS}>
        ← Yêu cầu báo giá
      </Link>
      <QuoteRequestWorkspace data={data} staffOptions={staffOptions} />
    </div>
  );
}
