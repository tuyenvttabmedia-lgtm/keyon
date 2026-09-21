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
  "productivity",
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
      "Kết hợp năng suất, hạ tầng, bảo mật và sao lưu đúng quy mô — không mua rời từng SKU rồi mới ghép.",
    bullets: [
      "Chọn hướng theo việc cần làm, rồi chốt gói trên Sản phẩm",
      "Đội nhóm và tổ chức: tư vấn mix theo số người dùng",
      "Khác quản lý bản quyền — đây là bước chọn mix, không phải theo dõi license đã có",
    ],
    primaryCta: { label: "Nhận tư vấn mix", href: "/business/licensing-consulting" },
    secondaryCta: { label: "Tất cả giải pháp", href: "/solutions" },
    related: [
      { label: "Năng suất & Cộng tác", href: "/solutions/productivity" },
      { label: "Cloud & Hạ tầng", href: "/solutions/cloud" },
      { label: "Bảo mật", href: "/solutions/security" },
    ],
  },
  productivity: {
    slug: "productivity",
    kicker: "Giải pháp",
    title: "Năng suất & Cộng tác",
    subtitle:
      "Microsoft 365, Office, Teams và công cụ cộng tác chính hãng — kích hoạt nhanh, hỗ trợ tiếng Việt.",
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
    title: "Cloud & Hạ tầng",
    subtitle:
      "Gói cloud / hạ tầng đang bán trên KEYON — tư vấn chọn SKU. Không vận hành Azure/AWS thuê ngoài.",
    bullets: [
      "Gói cloud / storage / backup trên catalog (nếu có)",
      "Tư vấn chọn gói theo số người dùng / ngân sách",
      "Bàn giao license — không thay MSP vận hành tenant",
    ],
    primaryCta: { label: "Xem sản phẩm cloud", href: "/categories/cloud" },
    secondaryCta: { label: "Gửi yêu cầu tư vấn", href: "/contact/quote" },
  },
  security: {
    slug: "security",
    kicker: "Giải pháp",
    title: "Bảo mật & Bảo vệ dữ liệu",
    subtitle: "Gói bảo mật endpoint / internet security chính hãng trên KEYON.",
    bullets: ["Endpoint / Antivirus / Internet Security", "Xem rõ loại nhận trước khi mua"],
    primaryCta: { label: "Xem sản phẩm bảo mật", href: "/categories/security" },
    secondaryCta: { label: "Gửi yêu cầu tư vấn", href: "/contact/quote" },
  },
  backup: {
    slug: "backup",
    kicker: "Giải pháp",
    title: "Sao lưu & Khôi phục",
    subtitle:
      "License / gói backup trên catalog — kích hoạt phần mềm trên hạ tầng của bạn (KEYON không lưu bản sao dữ liệu).",
    bullets: ["Tìm gói backup trên cửa hàng", "Tư vấn chọn gói khi cần"],
    primaryCta: { label: "Tìm sản phẩm backup", href: "/categories/backup" },
    secondaryCta: { label: "Gửi yêu cầu tư vấn", href: "/contact/quote" },
    draftCapable: true,
  },
  "license-management": {
    slug: "license-management",
    kicker: "Giải pháp",
    title: "Quản lý phần mềm & bản quyền",
    subtitle:
      "Theo dõi license đã mua trên Tài khoản — hạn dùng, nhắc trước renew và hỗ trợ gia hạn.",
    bullets: [
      "License mua trên KEYON vào Tài khoản sau bàn giao",
      "Nhắc trước khi đến hạn (theo dữ liệu Tài khoản)",
      "Renew / điều chỉnh qua Mua ngay hoặc báo giá",
      "Hỗ trợ tiếng Việt",
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
      "Phù hợp 5 / 10 / 50 / 100+ người dùng — nhận tư vấn và báo giá theo nhu cầu.",
    bullets: [
      "Tư vấn hình thức cấp phép phù hợp",
      "Báo giá theo sản phẩm và số lượng",
      "Bàn giao và theo dõi trên Tài khoản KEYON",
    ],
    primaryCta: { label: "Nhận báo giá", href: "/contact/quote?intent=volume-quote" },
    secondaryCta: { label: "Tư vấn bản quyền", href: "/business/licensing-consulting" },
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
