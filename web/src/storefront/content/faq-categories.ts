export type FaqCategoryId = "payment" | "delivery" | "account" | "general";

export const FAQ_CATEGORIES: {
  id: FaqCategoryId;
  label: string;
  description: string;
}[] = [
  { id: "payment", label: "Thanh toán", description: "Chuyển khoản, xác nhận tiền" },
  { id: "delivery", label: "Nhận hàng", description: "Giao key / tài khoản / kích hoạt" },
  { id: "account", label: "Tài khoản", description: "Đăng nhập, đơn hàng, tài sản" },
  { id: "general", label: "Chung", description: "KEYON bán gì, chính sách" },
];
