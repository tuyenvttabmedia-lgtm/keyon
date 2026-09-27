/**
 * Phase 1 landing copy for Solutions / Business / Resources hubs.
 * Stub-friendly: no fake inventory claims.
 */

export type IaPage = {
  slug: string;
  title: string;
  kicker?: string;
  subtitle: string;
  bullets?: string[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  related?: { label: string; href: string }[];
  /** When true, show “đang mở rộng / liên hệ tư vấn” tone */
  draftCapable?: boolean;
};

/** Topic landings (`/solutions/{slug}`). Hub is `/solutions`. */
export const ACTIVE_SOLUTION_SLUGS = [
  "microsoft-365-office",
  "cloud",
  "security",
  "backup",
  "license-management",
  "by-need",
] as const;

export const SOLUTION_PAGES: Record<string, IaPage> = {
  "by-need": {
    slug: "by-need",
    kicker: "Giải pháp",
    title: "Giải pháp theo nhu cầu",
    subtitle:
      "Chưa biết nên kết hợp sản phẩm nào? KEYON hỗ trợ chọn giải pháp theo số người dùng, nhu cầu và ngân sách.",
    bullets: [
      "Kết hợp nhiều sản phẩm theo nhu cầu thực tế",
      "Phù hợp cá nhân, đội nhóm và doanh nghiệp",
      "Tư vấn trước khi mua",
    ],
    primaryCta: { label: "Liên hệ tư vấn", href: "/business/licensing-consulting" },
    secondaryCta: { label: "Tất cả giải pháp", href: "/solutions" },
    related: [
      { label: "Microsoft 365 & Office", href: "/solutions/microsoft-365-office" },
      { label: "Cloud & Hạ tầng", href: "/solutions/cloud" },
      { label: "Bảo mật", href: "/solutions/security" },
    ],
  },
  "microsoft-365-office": {
    slug: "microsoft-365-office",
    kicker: "Giải pháp",
    title: "Microsoft 365 & Office cho công việc hiện đại",
    subtitle:
      "Khám phá Microsoft 365 và Office bản quyền cho cá nhân, doanh nghiệp với Word, Excel, PowerPoint, Teams, OneDrive và nhiều công cụ khác.",
    bullets: [
      "Microsoft Office / Microsoft 365",
      "Teams, Outlook, OneDrive",
      "Gói cá nhân, đội nhóm và doanh nghiệp",
    ],
    primaryCta: { label: "Khám phá sản phẩm", href: "/categories/office" },
    secondaryCta: { label: "Tư vấn giải pháp", href: "/contact/quote" },
    related: [
      { label: "Microsoft", href: "/brands/microsoft" },
      { label: "Tất cả giải pháp", href: "/solutions" },
    ],
  },
  cloud: {
    slug: "cloud",
    kicker: "Giải pháp",
    title: "Cloud & Hạ tầng cho doanh nghiệp",
    subtitle:
      "Khám phá license Cloud, gói hạ tầng và các sản phẩm liên quan trên KEYON, với thông tin rõ ràng, bàn giao minh bạch và hỗ trợ tiếng Việt.",
    bullets: [
      "License và gói Cloud trên KEYON",
      "Thông tin bàn giao rõ trước khi mua",
      "Hỗ trợ kích hoạt bằng tiếng Việt",
    ],
    primaryCta: { label: "Xem sản phẩm cloud", href: "/categories/cloud" },
    secondaryCta: { label: "Gửi yêu cầu tư vấn", href: "/contact/quote" },
  },
  security: {
    slug: "security",
    kicker: "Giải pháp",
    title: "Bảo mật",
    subtitle:
      "Khám phá các sản phẩm và license bảo mật cho thiết bị, email, dữ liệu, danh tính và mạng trên KEYON, với thông tin rõ ràng và hỗ trợ tiếng Việt.",
    bullets: [
      "License cho thiết bị, email, dữ liệu, danh tính và mạng",
      "Thông tin gói rõ trước khi mua",
      "Bàn giao và hướng dẫn kích hoạt bằng tiếng Việt",
    ],
    primaryCta: { label: "Xem sản phẩm bảo mật", href: "/categories/security" },
    secondaryCta: { label: "Gửi yêu cầu tư vấn", href: "/contact/quote" },
  },
  backup: {
    slug: "backup",
    kicker: "Giải pháp",
    title: "Backup & Khôi phục",
    subtitle:
      "Khám phá phần mềm và license backup cho PC, máy chủ, Microsoft 365 và dữ liệu Cloud trên KEYON, với thông tin rõ ràng và hỗ trợ kích hoạt tiếng Việt.",
    bullets: [
      "License backup cho PC, server và Cloud",
      "Tính năng theo từng sản phẩm",
      "Hướng dẫn kích hoạt bằng tiếng Việt",
    ],
    primaryCta: { label: "Tìm sản phẩm backup", href: "/categories/backup" },
    secondaryCta: { label: "Gửi yêu cầu tư vấn", href: "/contact/quote" },
    draftCapable: true,
  },
  "license-management": {
    slug: "license-management",
    kicker: "Giải pháp",
    title: "Quản lý bản quyền",
    subtitle:
      "Theo dõi license đã mua, thời hạn sử dụng, gia hạn và thông tin sản phẩm ngay trong tài khoản KEYON.",
    bullets: [
      "License đã mua nằm trong Tài khoản sau khi bàn giao",
      "Nhắc trước khi đến hạn",
      "Gia hạn hoặc điều chỉnh qua mua thêm hoặc báo giá",
    ],
    primaryCta: { label: "Vào Tài khoản", href: "/account" },
    secondaryCta: { label: "Gửi yêu cầu tư vấn", href: "/contact/quote" },
    related: [
      { label: "Subscription & Gia hạn", href: "/business/subscriptions" },
      { label: "Volume licensing", href: "/business/volume-licensing" },
      { label: "Tất cả giải pháp", href: "/solutions" },
    ],
  },
};

export const BUSINESS_HUB = {
  title: "Dành cho doanh nghiệp",
  subtitle:
    "Mua theo quy mô, gia hạn, bàn giao triển khai và theo dõi đơn DN với KEYON. Cá nhân mua lẻ trên Sản phẩm. Nhu cầu theo việc cần làm nằm ở Giải pháp.",
};

export const BUSINESS_PAGES: Record<string, IaPage> = {
  "volume-licensing": {
    slug: "volume-licensing",
    kicker: "Doanh nghiệp",
    title: "Mua bản quyền số lượng lớn",
    subtitle:
      "Từ nhóm nhỏ đến doanh nghiệp 100+ người dùng — KEYON tư vấn sản phẩm, hình thức cấp phép, báo giá và bàn giao theo nhu cầu thực tế.",
    bullets: [
      "Tư vấn sản phẩm và hình thức cấp phép",
      "Báo giá theo sản phẩm, số lượng và thời hạn",
      "Bàn giao và hỗ trợ kích hoạt",
    ],
    primaryCta: { label: "Nhận báo giá doanh nghiệp", href: "/contact/quote?intent=volume-quote" },
    secondaryCta: { label: "Tư vấn giải pháp", href: "/business/licensing-consulting" },
  },
  subscriptions: {
    slug: "subscriptions",
    kicker: "Doanh nghiệp",
    title: "Subscription & Gia hạn",
    subtitle:
      "Theo dõi subscription, thời hạn và chu kỳ gia hạn tập trung — chủ động trước mỗi kỳ renew.",
    bullets: [
      "Theo dõi trạng thái và chu kỳ sử dụng",
      "Nhận thông tin trước kỳ gia hạn",
      "Tư vấn tiếp tục, điều chỉnh hoặc báo giá",
    ],
    primaryCta: {
      label: "Tư vấn subscription",
      href: "/contact/quote?intent=subscription-consult&requestType=SUBSCRIPTION",
    },
    secondaryCta: { label: "Tìm hiểu cách hoạt động", href: "/business/subscriptions#lifecycle" },
  },
  "licensing-consulting": {
    slug: "licensing-consulting",
    kicker: "Doanh nghiệp",
    title: "Tư vấn bản quyền",
    subtitle:
      "Chưa chắc nên chọn Office nào, Microsoft 365 nào, Windows hay Security? KEYON hỗ trợ tư vấn trước khi mua.",
    bullets: [
      "Hiểu rõ nhu cầu trước khi chọn sản phẩm",
      "So sánh các phương án cấp phép",
      "Hỗ trợ trước khi mua — Mua ngay khi đã chọn",
    ],
    primaryCta: {
      label: "Nhận tư vấn",
      href: "/business/licensing-consulting#consultation-form",
    },
    secondaryCta: {
      label: "Xem lĩnh vực tư vấn",
      href: "/business/licensing-consulting#consulting-areas",
    },
  },
  implementation: {
    slug: "implementation",
    kicker: "Doanh nghiệp",
    title: "Dịch vụ triển khai",
    subtitle:
      "Bàn giao và kích hoạt bản quyền theo quy mô — checklist cho đội IT sau khi mua.",
    bullets: [
      "Onboarding sau mua: key, tài khoản, checklist cho IT",
      "Khác tư vấn bản quyền — triển khai sau khi đã (sắp) có license",
      "Gửi yêu cầu qua form báo giá loại triển khai",
    ],
    primaryCta: {
      label: "Gửi yêu cầu triển khai",
      href: "/contact/quote?intent=implementation",
    },
    secondaryCta: { label: "Tư vấn chọn gói", href: "/business/licensing-consulting" },
  },
  contracts: {
    slug: "contracts",
    kicker: "Doanh nghiệp",
    title: "Hợp đồng & đơn hàng",
    subtitle:
      "Theo dõi đơn và license tổ chức sau đăng nhập. Chưa phải cổng hợp đồng pháp lý.",
    bullets: [
      "Đơn hàng: Tài khoản → Đơn hàng (Order hiện có)",
      "PO / gia hạn tập trung: liên hệ kinh doanh",
      "Bảng hợp đồng pháp lý trên web chưa mở — pha sau khi có nghiệp vụ",
    ],
    primaryCta: { label: "Xem đơn hàng", href: "/account/orders" },
    secondaryCta: { label: "Liên hệ kinh doanh", href: "/contact/quote?intent=business" },
  },
};

export const RESOURCE_HUB = {
  title: "Kiến thức",
  subtitle:
    "Hướng dẫn kích hoạt, phân tích bản quyền và tin cập nhật sản phẩm — nội dung thực tế để mua và dùng phần mềm đúng cách.",
};

export const RESOURCE_SECTIONS: Record<
  string,
  { title: string; subtitle: string; href: string; aliasNote?: string }
> = {
  insights: {
    title: "Chuyên sâu",
    subtitle:
      "Phân tích bản quyền, Microsoft 365, bảo mật và vận hành phần mềm cho doanh nghiệp.",
    href: "/kien-thuc/chuyen-sau",
  },
  guides: {
    title: "Hướng dẫn",
    subtitle:
      "How-to: kích hoạt, nhận license, kiểm tra bản quyền và dùng Tài khoản KEYON.",
    href: "/kien-thuc/huong-dan",
  },
  news: {
    title: "Tin tức",
    subtitle: "Cập nhật sản phẩm, vendor và KEYON.",
    href: "/kien-thuc/tin-tuc",
  },
};
