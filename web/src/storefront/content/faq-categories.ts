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
  {
    id: "thanh-toan-giao-dich",
    label: "Thanh toán & Giao dịch",
    description:
      "Sự cố VietQR/CK SePay, trừ tiền, nội dung CK và trạng thái thanh toán trên KEYON.",
  },
  {
    id: "don-hang-fulfillment",
    label: "Đơn hàng & Fulfillment",
    description:
      "Trạng thái đơn, cấp license sau thanh toán và theo dõi tại Tài khoản.",
  },
  {
    id: "license-kich-hoat-su-co",
    label: "License & Kích hoạt (sự cố)",
    description:
      "Lỗi kích hoạt phía phần mềm/vendor — KEYON hỗ trợ đối chiếu đơn và license đã cấp.",
  },
  {
    id: "cai-dat-phan-mem",
    label: "Cài đặt phần mềm",
    description:
      "Cài đặt, phiên bản, yêu cầu hệ thống — thuộc phần mềm/vendor sau khi nhận license.",
  },
  {
    id: "cloud-server-su-co",
    label: "Cloud Server (sự cố)",
    description:
      "Troubleshooting máy chủ cloud của nhà cung cấp — không phải console IaaS trong KEYON.",
  },
  {
    id: "email-server-su-co",
    label: "Email Server (sự cố)",
    description:
      "Sự cố gửi/nhận email trên hệ thống email doanh nghiệp — KEYON chưa vận hành mailbox sẵn.",
  },
  {
    id: "backup-restore-su-co",
    label: "Backup & Restore (sự cố)",
    description:
      "Job backup/restore trên phần mềm hoặc hạ tầng của bạn — KEYON không lưu bản sao dữ liệu.",
  },
  {
    id: "api-tich-hop",
    label: "API & Tích hợp",
    description:
      "Kiến thức chung khi tích hợp API nhà cung cấp. Partner API KEYON hiện chưa mở công khai.",
  },
  {
    id: "doanh-nghiep-b2b",
    label: "Doanh nghiệp & B2B",
    description:
      "Giải pháp doanh nghiệp: tư vấn, volume, triển khai qua trang Doanh nghiệp và báo giá.",
  },
  {
    id: "mua-so-luong-lon",
    label: "Mua số lượng lớn",
    description: "Đơn volume, tồn kho, giao theo đợt và đầu mối hỗ trợ — qua báo giá B2B.",
  },
  {
    id: "reseller-dai-ly",
    label: "Reseller & Đại lý",
    description:
      "Hợp tác phân phối. API / portal đại lý: liên hệ — chưa tự đăng ký công khai.",
  },
  {
    id: "partner-hop-tac",
    label: "Partner & Hợp tác",
    description: "Nhà cung cấp, SI, tích hợp catalog — đề xuất qua kênh hợp tác KEYON.",
  },
  {
    id: "bao-gia-quotation",
    label: "Báo giá & Quotation",
    description: "Yêu cầu báo giá doanh nghiệp tại trang Báo giá và các bước sau khi đồng ý.",
  },
  {
    id: "procurement-doanh-nghiep",
    label: "Procurement & Doanh nghiệp",
    description: "PO, hợp đồng, NDA, vendor onboarding — trao đổi theo quy trình B2B.",
  },
  {
    id: "api-doanh-nghiep",
    label: "API dành cho doanh nghiệp",
    description:
      "Partner API KEYON chưa mở công khai. Nội dung định hướng khi có chương trình.",
  },
  {
    id: "enterprise-quan-tri",
    label: "Enterprise Account & Quản trị",
    description:
      "Quản trị tổ chức/license: phần trên KEYON còn giới hạn; seat tập trung thường thuộc nhà cung cấp.",
  },
];
