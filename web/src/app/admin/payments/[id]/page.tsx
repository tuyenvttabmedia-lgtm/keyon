import Link from "next/link";
import { notFound } from "next/navigation";
import { loadPaymentWorkspace } from "@/server/admin/payment-detail";
import { PaymentWorkspace } from "../payment-workspace";
import { LINK_ACCENT_CLASS, SECTION_LEAD_CLASS } from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminPaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await loadPaymentWorkspace(id);
  if (!data) notFound();

  return (
    <div className="space-y-3">
      <div>
        <Link href="/admin/payments" className={LINK_ACCENT_CLASS}>
          ← Thanh toán
        </Link>
        <p className={`mt-1 ${SECTION_LEAD_CLASS}`}>Payment Workspace</p>
      </div>
      <PaymentWorkspace data={data} />
    </div>
  );
}
