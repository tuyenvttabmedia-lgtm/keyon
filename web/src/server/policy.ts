/** Phase A policy constants — chỉnh bằng ENV khi cần, chưa cần CMS. */
export const POLICY = {
  sla: {
    instant: process.env.POLICY_SLA_INSTANT ?? "≤ 15–30 phút sau thanh toán",
    manual: process.env.POLICY_SLA_MANUAL ?? "2–8 giờ làm việc",
  },
  resend: {
    max: Number(process.env.POLICY_RESEND_MAX ?? 5),
  },
  warranty: {
    days: Number(process.env.POLICY_WARRANTY_DAYS ?? 7),
  },
  refund: {
    note:
      "Thanh toán OK nhưng giao fail → không auto-refund. Staff xử lý tay theo từng case.",
  },
  inbox: {
    hours: process.env.POLICY_INBOX_HOURS ?? "T2–T7 · 08:00–18:00 (giờ VN)",
  },
} as const;
