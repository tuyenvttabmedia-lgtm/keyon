import {
  IconBolt,
  IconCheck,
  IconKey,
  IconShieldCheck,
  IconUser,
} from "@/storefront/components/icons/StoreIcons";

/** Clean hero panel — matches about-locked illustration language */
export function AboutHeroVisual() {
  return (
    <div className="rounded-2xl border border-border bg-[#f3f6f9] p-5 md:p-6">
      <div className="rounded-xl border border-border bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Tài sản trong Tài khoản
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent">
            <IconShieldCheck size={14} />
            Bảo mật
          </span>
        </div>
        <ul className="mt-3 space-y-2">
          {[
            { Icon: IconKey, label: "Office 365 — Key" },
            { Icon: IconUser, label: "Windows — Tài khoản" },
            { Icon: IconBolt, label: "Bảo mật — Kích hoạt" },
          ].map((row) => (
            <li
              key={row.label}
              className="flex items-center gap-3 rounded-lg border border-border bg-[#f8fafc] px-3 py-2.5"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <row.Icon size={16} />
              </span>
              <span className="min-w-0 flex-1 text-sm font-medium text-navy">{row.label}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                <IconCheck size={12} />
                Đã nhận
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white">
          <IconShieldCheck size={18} />
        </span>
        <p className="text-sm font-medium text-navy">
          Thanh toán rõ · Giao đúng loại · Lưu an toàn
        </p>
      </div>
    </div>
  );
}
