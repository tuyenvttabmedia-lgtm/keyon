import { POLICY } from "@/server/policy";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";

export default function AdminPolicyPage() {
  return (
    <div className="max-w-2xl space-y-6 rounded-2xl border border-border bg-card p-6">
      <h2 className={ADMIN_PAGE_TITLE_CLASS}>Policy vận hành</h2>
      <section className="space-y-2 text-sm">
        <h3 className="font-semibold text-accent">SLA</h3>
        <p>Instant: {POLICY.sla.instant}</p>
        <p>Manual: {POLICY.sla.manual}</p>
      </section>
      <section className="space-y-2 text-sm">
        <h3 className="font-semibold text-accent">Resend / Replace / Warranty</h3>
        <p>Resend tối đa: {POLICY.resend.max} lần / delivery</p>
        <p>Replace: chỉ staff · ghi audit · không hoàn tiền tự động</p>
        <p>Warranty: {POLICY.warranty.days} ngày · khiếu nại qua CS + mã đơn</p>
      </section>
      <section className="space-y-2 text-sm">
        <h3 className="font-semibold text-accent">Hoàn tiền</h3>
        <p>{POLICY.refund.note}</p>
      </section>
      <section className="space-y-2 text-sm">
        <h3 className="font-semibold text-accent">Giờ Inbox</h3>
        <p>{POLICY.inbox.hours}</p>
      </section>
    </div>
  );
}
