import type { ShopCategoryId } from "@/storefront/components/shop/types";

export const PDP_CATEGORY_BADGE: Record<ShopCategoryId, string> = {
  windows: "HỆ ĐIỀU HÀNH",
  office: "VĂN PHÒNG",
  adobe: "THIẾT KẾ",
  cloud: "CLOUD & SERVER",
  security: "BẢO MẬT",
  other: "SẢN PHẨM",
};

export function defaultFeatures(categoryId: ShopCategoryId, productName: string): string[] {
  const base = [
    "Bản quyền chính hãng — nguồn cung rõ ràng",
    "Thanh toán rõ — theo dõi trạng thái trong Tài khoản",
    "Lưu license trong Tài sản sau khi giao",
    "Hỗ trợ gửi lại / hướng dẫn kích hoạt khi cần",
  ];
  if (categoryId === "windows") {
    return [
      "Giao diện hiện đại, tối ưu hiệu năng",
      "Bảo mật nâng cao với Windows Hello & BitLocker",
      "Kích hoạt toàn cầu, dùng lâu dài",
      "Tương thích phần mềm doanh nghiệp phổ biến",
      ...base.slice(2),
    ];
  }
  if (categoryId === "office") {
    return [
      "Bộ ứng dụng văn phòng đầy đủ",
      "File tương thích chuẩn Microsoft Office",
      "Phù hợp học tập & làm việc cá nhân",
      ...base.slice(1),
    ];
  }
  if (categoryId === "security") {
    return [
      "Bảo vệ máy tính / thiết bị thời gian thực",
      "Cập nhật định nghĩa virus thường xuyên",
      "Hỗ trợ kích hoạt qua Tài khoản KEYON",
      ...base.slice(2),
    ];
  }
  return [`Ưu điểm nổi bật của ${productName}`, ...base];
}

export function defaultGuides(instant: boolean): string[] {
  return [
    "Chọn gói phù hợp → nhấn Thanh toán ngay",
    "Quét QR / chuyển khoản đúng số tiền trên trang checkout",
    instant
      ? "Sau khi thanh toán thành công, key/license xuất hiện trong Tài sản (thường 1–5 phút)"
      : "KEYON xử lý đơn — theo dõi trạng thái giao trong Đơn hàng / Tài sản",
    "Mở Tài sản → sao chép key hoặc làm theo hướng dẫn kích hoạt",
  ];
}
