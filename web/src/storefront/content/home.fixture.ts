import type { HomeContent } from "./types";

/**
 * Fixture aligned to Digital License Home demo (home-v7).
 * Swap getHomeContent() to CMS publish payload later.
 */
export const homeFixture: HomeContent = {
  navigation: [
    { label: "Sản phẩm", href: "/products" },
    { label: "Doanh nghiệp", href: "/business" },
    { label: "Tài nguyên", href: "/resources" },
    { label: "Hỗ trợ", href: "/support" },
  ],
  brand: {
    brandName: "KEYON",
    tagline: "Digital License Platform",
  },
  hero: {
    visible: true,
    badge: "DIGITAL LICENSE PLATFORM",
    title: "Nền tảng phân phối bản quyền số",
    subtitle:
      "Mua, triển khai và quản lý bản quyền phần mềm, cloud và dịch vụ số trên một nền tảng duy nhất. Dành cho cá nhân, đội nhóm và doanh nghiệp.",
    ctaLabel: "Khám phá sản phẩm →",
    ctaHref: "/products",
    secondaryCtaLabel: "Dành cho doanh nghiệp",
    secondaryCtaHref: "/business",
    trustItems: [
      {
        title: "100% Chính hãng",
        description: "Nguồn cung rõ ràng, hóa đơn đầy đủ.",
      },
      {
        title: "Giao hàng tức thì",
        description: "Key / tài khoản / kích hoạt sau thanh toán.",
      },
      {
        title: "Hỗ trợ kích hoạt",
        description: "Ticket trong Tài khoản khi gặp sự cố.",
      },
    ],
  },
  partners: {
    title: "Thương hiệu phần mềm trên KEYON",
    badges: ["Bản quyền chính hãng", "Thanh toán rõ ràng"],
    items: [
      { id: "p1", name: "Microsoft", brandColor: "#00A4EF", visible: true },
      { id: "p2", name: "Adobe", brandColor: "#EB1000", visible: true },
      { id: "p3", name: "Autodesk", brandColor: "#0696D7", visible: true },
    ],
  },
  categories: {
    visible: true,
    title: "Danh mục sản phẩm",
    viewAllHref: "/products",
    viewAllLabel: "Xem tất cả",
    items: [
      {
        id: "c1",
        title: "Windows",
        countLabel: "18 sản phẩm",
        href: "/products",
        icon: "windows",
      },
      {
        id: "c2",
        title: "Microsoft Office",
        countLabel: "12 sản phẩm",
        href: "/products",
        icon: "office",
      },
      {
        id: "c3",
        title: "Adobe",
        countLabel: "10 sản phẩm",
        href: "/products",
        icon: "adobe",
      },
      {
        id: "c4",
        title: "Cloud & Server",
        countLabel: "8 sản phẩm",
        href: "/products",
        icon: "cloud",
      },
      {
        id: "c5",
        title: "Bảo mật",
        countLabel: "14 sản phẩm",
        href: "/products",
        icon: "security",
      },
      {
        id: "c6",
        title: "Autodesk",
        countLabel: "9 sản phẩm",
        href: "/products",
        icon: "autodesk",
      },
      {
        id: "c7",
        title: "Backup",
        countLabel: "7 sản phẩm",
        href: "/products",
        icon: "backup",
      },
    ],
  },
  valueProps: {
    visible: false,
    items: [],
  },
  howItWorks: {
    visible: true,
    title: "Cách KEYON hoạt động",
    subtitle:
      "Bốn bước rõ ràng — từ chọn gói đến quản lý giấy phép trong Tài khoản.",
    steps: [
      {
        id: "h1",
        title: "Chọn gói",
        description: "Xem loại nhận (key / tài khoản) và giá trước khi đặt.",
      },
      {
        id: "h2",
        title: "Thanh toán",
        description: "Chuyển khoản / VietQR theo hướng dẫn trên trang thanh toán.",
      },
      {
        id: "h3",
        title: "Nhận trong Tài khoản",
        description:
          "Sau khi xác nhận thanh toán, mở Đơn hàng / Tài sản để lấy deliverable.",
      },
      {
        id: "h4",
        title: "Quản lý & hỗ trợ",
        description:
          "Mở lại license khi cần; tạo ticket trong Tài khoản nếu cần hỗ trợ kích hoạt.",
      },
    ],
  },
  featured: {
    visible: true,
    title: "Sản phẩm nổi bật",
    viewAllHref: "/products",
    viewAllLabel: "Xem tất cả",
    /** Unused at runtime — Home featured comes from live catalog only (Wave 5). */
    items: [],
  },
  why: {
    visible: true,
    title: "Vì sao chọn KEYON?",
    subtitle:
      "Minh bạch trước khi mua, lưu license trong Tài khoản, hỗ trợ tiếng Việt.",
    ctaLabel: "Tìm hiểu thêm →",
    ctaHref: "/about",
    items: [
      {
        id: "w1",
        title: "Nguồn cung minh bạch",
        description:
          "Thông tin loại license và hình thức nhận được hiển thị rõ trước khi mua.",
        icon: "shield",
      },
      {
        id: "w2",
        title: "Quản lý tập trung",
        description: "Đơn hàng và license được lưu trong Tài khoản KEYON.",
        icon: "card",
      },
      {
        id: "w3",
        title: "Hóa đơn doanh nghiệp",
        description: "Hỗ trợ chứng từ/hóa đơn theo điều kiện áp dụng.",
        icon: "price",
      },
      {
        id: "w4",
        title: "Hỗ trợ tiếng Việt",
        description: "Hỗ trợ trước và sau khi mua qua ticket trong Tài khoản.",
        icon: "support",
      },
      {
        id: "w5",
        title: "Thanh toán rõ ràng",
        description:
          "VietQR / chuyển khoản theo hướng dẫn trên trang thanh toán — theo dõi trạng thái trong đơn hàng.",
        icon: "bolt",
      },
      {
        id: "w6",
        title: "Chính sách hoàn tiền rõ",
        description:
          "Điều kiện hoàn tiền được ghi trong chính sách / điều khoản — không ẩn sau khi mua.",
        icon: "refund",
      },
    ],
  },
  solutions: {
    visible: true,
    title: "Doanh nghiệp",
    subtitle:
      "Từ vài giấy phép đến hàng trăm người dùng — KEYON giúp tổ chức chọn đúng gói, mua theo quy mô và quản lý tập trung. Cá nhân mua lẻ trên Sản phẩm.",
    ctaLabel: "Khám phá giải pháp doanh nghiệp →",
    ctaHref: "/business",
    secondaryCtaLabel: "Liên hệ tư vấn",
    secondaryCtaHref: "/contact/quote",
    items: [
      {
        id: "productivity",
        title: "Năng suất & Cộng tác",
        description: "Office, Microsoft 365, làm việc nhóm.",
        href: "/solutions/productivity",
        art: "trend",
      },
      {
        id: "cloud",
        title: "Cloud",
        description: "Hạ tầng và dịch vụ cloud.",
        href: "/solutions/cloud",
        art: "cloud",
      },
      {
        id: "security",
        title: "Bảo mật",
        description: "Endpoint, antivirus, bảo vệ dữ liệu.",
        href: "/solutions/security",
        art: "shield",
      },
      {
        id: "backup",
        title: "Backup & Khôi phục",
        description: "Sao lưu endpoint, cloud và máy chủ.",
        href: "/solutions/backup",
        art: "backup",
      },
      {
        id: "license-management",
        title: "Quản lý bản quyền",
        description: "Theo dõi license, gia hạn, tài khoản KEYON.",
        href: "/solutions/license-management",
        art: "stack",
      },
      {
        id: "volume",
        title: "Mua số lượng lớn",
        description: "Volume licensing · báo giá theo quy mô.",
        href: "/business/volume-licensing",
        art: "bars",
      },
    ],
  },
  news: {
    visible: true,
    title: "Tin tức & cập nhật",
    viewAllHref: "/resources/news",
    viewAllLabel: "Xem tất cả bài viết",
    items: [
      {
        id: "n1",
        title: "5 lý do nên mua phần mềm bản quyền",
        excerpt: "An toàn, ổn định và hỗ trợ dài hạn cho doanh nghiệp.",
        dateLabel: "20/05/2024",
        href: "/blog",
        tag: "Windows",
        tagTone: "win",
      },
      {
        id: "n2",
        title: "Windows 11: tính năng mới nổi bật",
        excerpt: "Những điểm đáng chú ý khi nâng cấp máy làm việc.",
        dateLabel: "15/05/2024",
        href: "/blog",
        tag: "Microsoft",
        tagTone: "ms",
      },
      {
        id: "n3",
        title: "Bảo vệ thiết bị với Microsoft Defender",
        excerpt: "Cách bảo vệ máy tính và dữ liệu doanh nghiệp.",
        dateLabel: "10/05/2024",
        href: "/blog",
        tag: "Bảo mật",
        tagTone: "sec",
      },
      {
        id: "n4",
        title: "Chọn gói Creative Cloud phù hợp",
        excerpt: "So sánh gói Adobe theo nhu cầu cá nhân và team.",
        dateLabel: "05/05/2024",
        href: "/blog",
        tag: "Adobe",
        tagTone: "adobe",
      },
    ],
  },
  ctaBanner: {
    visible: true,
    title: "Cần giải pháp license cho doanh nghiệp?",
    subtitle:
      "KEYON hỗ trợ mua, triển khai và quản lý phần mềm / cloud theo nhu cầu tổ chức — vẫn giữ trải nghiệm mua lẻ rõ ràng cho cá nhân.",
    ctaLabel: "Liên hệ tư vấn →",
    ctaHref: "/contact/quote",
  },
  footer: {
    brandName: "KEYON",
    blurb:
      "Nền tảng phân phối và quản lý bản quyền phần mềm, cloud và dịch vụ số.",
    supportEmail: "support@keyon.vn",
    columns: [
      {
        title: "Sản phẩm",
        links: [
          { label: "Windows", href: "/products?cat=windows" },
          { label: "Microsoft Office", href: "/products?cat=office" },
          { label: "Adobe", href: "/products?cat=adobe" },
          { label: "Cloud & Server", href: "/products?cat=cloud" },
          { label: "Tất cả sản phẩm", href: "/products" },
        ],
      },
      {
        title: "Doanh nghiệp",
        links: [
          { label: "Tổng quan", href: "/business" },
          { label: "Volume licensing", href: "/business/volume-licensing" },
          { label: "Subscriptions", href: "/business/subscriptions" },
          { label: "Tư vấn bản quyền", href: "/business/licensing-consulting" },
          { label: "Báo giá doanh nghiệp", href: "/contact/quote" },
        ],
      },
      {
        title: "Hỗ trợ",
        links: [
          { label: "Trung tâm hỗ trợ", href: "/support" },
          { label: "FAQ", href: "/faq" },
          { label: "Tài nguyên", href: "/resources" },
          { label: "Liên hệ", href: "/contact" },
        ],
      },
      {
        title: "Công ty",
        links: [
          { label: "Về KEYON", href: "/about" },
          { label: "support@keyon.vn", href: "mailto:support@keyon.vn" },
          { label: "Hà Nội, Việt Nam", href: "/contact" },
        ],
      },
    ],
    copyright: "© 2026 KEYON. All rights reserved.",
    legalLinks: [
      { label: "Điều khoản", href: "/policy/terms" },
      { label: "Bảo mật", href: "/policy/privacy" },
      { label: "Thanh toán", href: "/policy/payment" },
      { label: "Giao hàng", href: "/policy/delivery" },
      { label: "Hoàn tiền", href: "/policy/refund" },
      { label: "Khiếu nại", href: "/policy/complaint" },
      { label: "Tất cả chính sách", href: "/policy" },
    ],
    contactLines: ["support@keyon.vn", "Hà Nội, Việt Nam"],
    bctVisible: false,
    bctHref: "https://online.gov.vn/",
    bctImageUrl: "",
    bctAlt: "Đã thông báo Bộ Công Thương",
  },
};
