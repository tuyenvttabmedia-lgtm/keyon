export type NotifCenterTab = "broadcast" | "templates" | "history";

export type NotifType = "info" | "promo" | "maintenance" | "urgent";

export type NotifAudience = "one" | "all";

export type NotifTemplateId =
  | "paid"
  | "delivered"
  | "maintenance"
  | "promo"
  | "ticket";

export type NotifTemplate = {
  id: NotifTemplateId;
  label: string;
  type: NotifType;
  title: string;
  body: string;
  href: string;
};

export const NOTIF_TYPE_LABEL: Record<NotifType, string> = {
  info: "Thông tin",
  promo: "Khuyến mãi",
  maintenance: "Bảo trì",
  urgent: "Khẩn cấp",
};

export const NOTIF_TYPE_PREFIX: Record<NotifType, string> = {
  info: "[Thông tin]",
  promo: "[Khuyến mãi]",
  maintenance: "[Bảo trì]",
  urgent: "[Khẩn cấp]",
};

/** Presets for ops — not persisted (no template DB). */
export const NOTIF_TEMPLATES: NotifTemplate[] = [
  {
    id: "paid",
    label: "Đã thanh toán",
    type: "info",
    title: "Thanh toán thành công",
    body: "Đơn hàng của bạn đã được thanh toán. KEYON đang xử lý giao hàng — theo dõi tại Tài khoản › Đơn hàng.",
    href: "/account/orders",
  },
  {
    id: "delivered",
    label: "Đã giao",
    type: "info",
    title: "Đã giao hàng",
    body: "Sản phẩm đã sẵn sàng. Đăng nhập tài khoản để xem license / thông tin giao hàng.",
    href: "/account/orders",
  },
  {
    id: "maintenance",
    label: "Bảo trì",
    type: "maintenance",
    title: "Bảo trì hệ thống",
    body: "KEYON sẽ bảo trì trong khung giờ đã công bố. Một số tính năng có thể tạm gián đoạn. Xin cảm ơn sự thông cảm.",
    href: "/account",
  },
  {
    id: "promo",
    label: "Khuyến mãi",
    type: "promo",
    title: "Ưu đãi từ KEYON",
    body: "Có ưu đãi mới dành cho bạn. Xem danh mục sản phẩm để biết thêm chi tiết.",
    href: "/products",
  },
  {
    id: "ticket",
    label: "Ticket",
    type: "info",
    title: "Cập nhật yêu cầu hỗ trợ",
    body: "Yêu cầu hỗ trợ của bạn đã được cập nhật. Mở Tài khoản › Hỗ trợ để xem phản hồi.",
    href: "/account/tickets",
  },
];

export type NotifHistoryRow = {
  id: string;
  title: string;
  body: string;
  href: string | null;
  createdAt: string;
  readAt: string | null;
  userEmail: string;
  userName: string | null;
};

export function applyTypePrefix(title: string, type: NotifType): string {
  const t = title.trim();
  const prefix = NOTIF_TYPE_PREFIX[type];
  if (t.startsWith("[")) return t;
  return `${prefix} ${t}`.slice(0, 200);
}

export function parseNotifTab(raw: string | undefined): NotifCenterTab {
  const tabs: NotifCenterTab[] = ["broadcast", "templates", "history"];
  if (raw && tabs.includes(raw as NotifCenterTab)) return raw as NotifCenterTab;
  return "broadcast";
}
