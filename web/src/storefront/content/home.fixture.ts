import type { HomeContent } from "./types";

/**
 * Fixture aligned to Digital License Home demo (home-v7).
 * Swap getHomeContent() to CMS publish payload later.
 */
export const homeFixture: HomeContent = {
  navigation: [
    { label: "Sản phẩm", href: "/products" },
    { label: "Giải pháp", href: "/solutions" },
    { label: "Doanh nghiệp", href: "/business" },
    { label: "Kiến thức", href: "/kien-thuc" },
    { label: "Hỗ trợ", href: "/support" },
  ],
  brand: {
    brandName: "KEYON",
    tagline: "Digital License Platform",
  },
  hero: {
    visible: true,
    badge: "DIGITAL LICENSE PLATFORM",
    title: "Nền tảng phân phối và quản lý bản quyền số",
    subtitle:
      "Mua, triển khai và quản lý license, subscription, cloud và hạ tầng số trên một nền tảng — dành cho cá nhân, doanh nghiệp và đội ngũ IT.",
    ctaLabel: "Khám phá sản phẩm →",
    ctaHref: "/products",
    secondaryCtaLabel: "Dành cho doanh nghiệp →",
    secondaryCtaHref: "/business",
    trustItems: [
      {
        title: "Nguồn cung rõ ràng",
        description: "License từ nhà cung cấp hoặc đối tác phân phối phù hợp.",
      },
      {
        title: "Giao license đúng gói",
        description: "Nội dung bàn giao rõ theo từng sản phẩm.",
      },
      {
        title: "Hỗ trợ kích hoạt",
        description: "Hỗ trợ tiếng Việt trong quá trình sử dụng.",
      },
    ],
  },
  partners: {
    title: "Nền tảng & thương hiệu phần mềm",
    subtitle:
      "Các nền tảng phần mềm, bảo mật, cloud và hạ tầng KEYON hỗ trợ phân phối và triển khai.",
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
        title: "Microsoft 365 & Office",
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
      "Chọn sản phẩm, thanh toán hoặc báo giá, nhận bàn giao, rồi quản lý và gia hạn trong Tài khoản.",
    steps: [
      {
        id: "h1",
        title: "Chọn sản phẩm",
        description: "License, subscription hoặc dịch vụ phù hợp nhu cầu.",
      },
      {
        id: "h2",
        title: "Đặt hàng & thanh toán",
        description:
          "Thanh toán trực tuyến hoặc gửi yêu cầu dành cho doanh nghiệp.",
      },
      {
        id: "h3",
        title: "Nhận & kích hoạt",
        description: "Nhận license và hướng dẫn kích hoạt theo từng sản phẩm.",
      },
      {
        id: "h4",
        title: "Quản lý & gia hạn",
        description:
          "Theo dõi license, thời hạn và subscription trong tài khoản.",
      },
    ],
  },
  featured: {
    visible: true,
    title: "Sản phẩm & dịch vụ nổi bật",
    viewAllHref: "/products",
    viewAllLabel: "Xem tất cả",
    /** Unused at runtime — Home featured comes from live catalog only (Wave 5). */
    items: [],
  },
  why: {
    visible: true,
    title: "Vì sao chọn KEYON?",
    subtitle:
      "Từ mua license đến quản lý, gia hạn và hỗ trợ — KEYON giúp doanh nghiệp kiểm soát toàn bộ vòng đời bản quyền trên một nền tảng.",
    ctaLabel: "Tìm hiểu thêm →",
    ctaHref: "/about",
    items: [
      {
        id: "w1",
        title: "Bàn giao đúng theo sản phẩm",
        description:
          "License, subscription hoặc nội dung bàn giao được gửi đúng hình thức của từng sản phẩm.",
        icon: "bolt",
      },
      {
        id: "w2",
        title: "Quản lý license tập trung",
        description:
          "Theo dõi license, đơn hàng và thời hạn tập trung trong Tài khoản.",
        icon: "card",
      },
      {
        id: "w3",
        title: "Hỗ trợ doanh nghiệp",
        description:
          "Tư vấn, báo giá, triển khai và hỗ trợ nhu cầu doanh nghiệp.",
        icon: "support",
      },
      {
        id: "w4",
        title: "Thông tin license minh bạch",
        description:
          "Loại license và hình thức nhận được hiển thị trước khi mua.",
        icon: "shield",
      },
      {
        id: "w5",
        title: "Thanh toán minh bạch",
        description:
          "VietQR và chuyển khoản theo hướng dẫn trên trang thanh toán.",
        icon: "price",
      },
      {
        id: "w6",
        title: "Gia hạn & subscription rõ ràng",
        description:
          "Theo dõi thời hạn và gia hạn subscription trong Tài khoản hoặc qua báo giá.",
        icon: "refund",
      },
    ],
  },
  solutions: {
    visible: true,
    title: "Giải pháp theo nhu cầu vận hành",
    subtitle:
      "Từ năng suất, cloud, bảo mật đến backup và quản lý bản quyền — KEYON giúp doanh nghiệp lựa chọn, triển khai và quản lý các giải pháp số phù hợp.",
    ctaLabel: "Khám phá giải pháp →",
    ctaHref: "/solutions",
    secondaryCtaLabel: "Dành cho doanh nghiệp",
    secondaryCtaHref: "/business",
    items: [
      {
        id: "microsoft-365-office",
        title: "Microsoft 365 & Office",
        description:
          "Khám phá Microsoft 365 và Office bản quyền cho cá nhân, doanh nghiệp với Word, Excel, PowerPoint, Teams, OneDrive và nhiều công cụ khác.",
        href: "/solutions/microsoft-365-office",
        art: "trend",
      },
      {
        id: "cloud",
        title: "Cloud & Hạ tầng",
        description: "Gói cloud / hạ tầng trên catalog KEYON.",
        href: "/solutions/cloud",
        art: "cloud",
      },
      {
        id: "security",
        title: "Bảo mật",
        description: "Gói endpoint / antivirus chính hãng.",
        href: "/solutions/security",
        art: "shield",
      },
      {
        id: "backup",
        title: "Backup & Khôi phục",
        description: "License backup trên catalog — kích hoạt trên hạ tầng của bạn.",
        href: "/solutions/backup",
        art: "backup",
      },
      {
        id: "license-management",
        title: "Quản lý bản quyền",
        description: "Theo dõi license đã mua và gia hạn trên Tài khoản.",
        href: "/solutions/license-management",
        art: "stack",
      },
      {
        id: "by-need",
        title: "Giải pháp theo nhu cầu",
        description: "Kết hợp sản phẩm phù hợp với quy mô sử dụng",
        href: "/solutions/by-need",
        art: "bars",
      },
    ],
  },
  news: {
    visible: true,
    title: "Tin tức & cập nhật",
    viewAllHref: "/kien-thuc/tin-tuc",
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
    title: "Cần giải pháp bản quyền cho doanh nghiệp?",
    subtitle:
      "KEYON hỗ trợ license, subscription, cloud và hạ tầng số — từ lựa chọn sản phẩm đến triển khai và quản lý.",
    ctaLabel: "Nhận tư vấn doanh nghiệp →",
    ctaHref: "/contact/quote",
  },
  footer: {
    brandName: "KEYON",
    blurb:
      "KEYON bán và bàn giao bản quyền phần mềm / cloud — quản lý license trong Tài khoản.",
    companyInfo: {
      companyName: "",
      address: "",
      taxCode: "",
      phone: "",
      email: "support@keyon.vn",
    },
    supportEmail: "support@keyon.vn",
    columns: [
      {
        title: "Sản phẩm",
        links: [
          { label: "Windows", href: "/categories/windows" },
          { label: "Microsoft 365 & Office", href: "/categories/office" },
          { label: "Adobe", href: "/categories/adobe" },
          { label: "Cloud & Server", href: "/categories/cloud" },
          { label: "Tất cả sản phẩm", href: "/products" },
        ],
      },
      {
        title: "Doanh nghiệp",
        links: [
          { label: "Tổng quan", href: "/business" },
          { label: "Giải pháp", href: "/solutions" },
          { label: "Volume licensing", href: "/business/volume-licensing" },
          { label: "Subscriptions", href: "/business/subscriptions" },
          { label: "Tư vấn bản quyền", href: "/business/licensing-consulting" },
          { label: "Dịch vụ triển khai", href: "/business/implementation" },
          { label: "Hợp đồng & đơn hàng", href: "/business/contracts" },
          { label: "Báo giá doanh nghiệp", href: "/contact/quote" },
        ],
      },
      {
        title: "Hỗ trợ",
        links: [
          { label: "Trung tâm hỗ trợ", href: "/support" },
          { label: "FAQ", href: "/faq" },
          { label: "Kiến thức", href: "/kien-thuc" },
          { label: "Liên hệ", href: "/contact" },
        ],
      },
      {
        title: "Công ty",
        links: [
          { label: "Về KEYON", href: "/about" },
          { label: "Điều khoản", href: "/policy/terms" },
          { label: "Bảo mật", href: "/policy/privacy" },
          { label: "Thanh toán", href: "/policy/payment" },
          { label: "Giao hàng", href: "/policy/delivery" },
          { label: "Hoàn tiền", href: "/policy/refund" },
          { label: "Khiếu nại", href: "/policy/complaint" },
          { label: "Tất cả chính sách", href: "/policy" },
        ],
      },
    ],
    copyright: "© 2026 KEYON. All rights reserved.",
    socialLinks: [
      { network: "facebook", href: "" },
      { network: "youtube", href: "" },
      { network: "linkedin", href: "" },
      { network: "zalo", href: "" },
    ],
    legalLinks: [],
    contactLines: ["support@keyon.vn", "Hà Nội, Việt Nam"],
    bctVisible: false,
    bctHref: "https://online.gov.vn/",
    bctImageUrl: "",
    bctAlt: "Đã thông báo Bộ Công Thương",
    dmcaVisible: false,
    dmcaHref: "",
    dmcaImageUrl: "",
    dmcaAlt: "DMCA protected",
  },
};
