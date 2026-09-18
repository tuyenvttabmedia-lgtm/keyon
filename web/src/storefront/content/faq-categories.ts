/** Default FAQ categories — storefront falls back when CMS has none. */

export type FaqCategoryId = string;

export type FaqCategoryMeta = {
  id: FaqCategoryId;
  label: string;
  description: string;
};

export const FAQ_CATEGORIES: FaqCategoryMeta[] = [
  { id: "payment", label: "Thanh toán", description: "Chuyển khoản, xác nhận tiền" },
  { id: "delivery", label: "Nhận hàng", description: "Giao key / tài khoản / kích hoạt" },
  { id: "account", label: "Tài khoản", description: "Đăng nhập, đơn hàng, tài sản" },
  { id: "general", label: "Chung", description: "KEYON bán gì, chính sách" },
];
