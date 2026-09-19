/** Default FAQ categories — storefront falls back when CMS has none. */

export type FaqCategoryId = string;

export type FaqCategoryMeta = {
  id: FaqCategoryId;
  label: string;
  description: string;
};

export const FAQ_CATEGORIES: FaqCategoryMeta[] = [
  {
    id: "tong-quan-keyon",
    label: "Tổng quan KEYON",
    description: "Giới thiệu nền tảng, sản phẩm và đối tượng phục vụ.",
  },
  {
    id: "account",
    label: "Tài khoản",
    description: "Đăng ký, đăng nhập, xác minh email và bảo mật tài khoản.",
  },
  {
    id: "san-pham-license",
    label: "Sản phẩm & License",
    description: "Loại license, SKU, thời hạn, thiết bị, phiên bản và khu vực.",
  },
  {
    id: "mua-hang",
    label: "Mua hàng",
    description: "Quy trình đặt mua, số lượng, thông tin đơn và hủy đơn chưa thanh toán.",
  },
  {
    id: "payment",
    label: "Thanh toán",
    description: "VietQR / chuyển khoản, trạng thái thanh toán và chứng từ.",
  },
  {
    id: "nhan-kich-hoat-license",
    label: "Nhận & Kích hoạt License",
    description: "Nơi nhận license, thời gian cấp và hướng dẫn kích hoạt.",
  },
  {
    id: "quan-ly-license",
    label: "Quản lý License",
    description: "Xem, lưu và quản lý license đã mua trong tài khoản.",
  },
  {
    id: "gia-han-thay-doi",
    label: "Gia hạn & Thay đổi",
    description: "Gia hạn, nâng cấp gói và xử lý khi sắp/hết hạn.",
  },
  {
    id: "loi-xu-ly-su-co",
    label: "Lỗi & Xử lý sự cố",
    description: "Lỗi website, đăng nhập, kích hoạt và đơn hàng bất thường.",
  },
  {
    id: "doi-tra-hoan-tien",
    label: "Đổi trả & Hoàn tiền",
    description: "Hoàn tiền, đổi sản phẩm/license và thay thế khi lỗi cấp phát.",
  },
  {
    id: "doanh-nghiep-dai-ly-api",
    label: "Doanh nghiệp & Đại lý / API",
    description: "Mua số lượng lớn, báo giá B2B, hợp tác đối tác.",
  },
  {
    id: "bao-mat-chinh-sach",
    label: "Bảo mật & Chính sách",
    description: "Bảo vệ dữ liệu, chống lừa đảo và các chính sách trên website.",
  },
  {
    id: "ho-tro-khach-hang",
    label: "Hỗ trợ khách hàng",
    description: "Kênh liên hệ, thông tin cần cung cấp và xử lý khiếu nại.",
  },
  {
    id: "cloud-server",
    label: "Cloud & Server",
    description:
      "Khái niệm cloud/server và gói license trên catalog KEYON — không phải IaaS tự quản trên website.",
  },
  {
    id: "security",
    label: "Security",
    description: "License phần mềm bảo mật trên KEYON: loại gói, thiết bị, hết hạn và kích hoạt.",
  },
  {
    id: "backup",
    label: "Backup",
    description:
      "Khái niệm backup và license phần mềm backup — KEYON không lưu bản sao dữ liệu của bạn.",
  },
  {
    id: "email-server",
    label: "Email Server",
    description:
      "Khái niệm email doanh nghiệp. KEYON chưa có shop Email Server riêng; chỉ áp dụng nếu có SKU trên catalog.",
  },
  {
    id: "saas",
    label: "SaaS",
    description:
      "Mua license/gói SaaS trên catalog — không phải cổng quản trị tenant hay seat self-serve.",
  },
  {
    id: "software-license",
    label: "Software License",
    description: "Các loại license số và checklist trước khi mua trên KEYON.",
  },
];
