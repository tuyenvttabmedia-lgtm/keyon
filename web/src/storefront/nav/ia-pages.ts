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

export const SOLUTIONS_HUB = {
  title: "Giải pháp KEYON",
  subtitle:
    "Không chỉ mua key — chọn đúng hướng giải quyết: bản quyền, năng suất, cloud, bảo mật, backup và quản lý license.",
};

export const SOLUTION_PAGES: Record<string, IaPage> = {
  "software-licensing": {
    slug: "software-licensing",
    kicker: "Giải pháp",
    title: "Bản quyền phần mềm",
    subtitle:
      "Mua và quản lý bản quyền cho cá nhân, đội nhóm hoặc doanh nghiệp — perpetual, subscription và volume (theo điều kiện từng gói).",
    bullets: [
      "Bản quyền cá nhân và đội nhóm",
      "Perpetual / Subscription (theo sản phẩm)",
      "Volume licensing — báo giá doanh nghiệp",
      "Gia hạn và theo dõi trong Tài khoản KEYON",
    ],
    primaryCta: { label: "Xem sản phẩm", href: "/products" },
    secondaryCta: { label: "Liên hệ tư vấn", href: "/contact/sales" },
    related: [
      { label: "Quản lý bản quyền", href: "/solutions/license-management" },
      { label: "Volume licensing", href: "/business/volume-licensing" },
    ],
  },
  productivity: {
    slug: "productivity",
    kicker: "Giải pháp",
    title: "Năng suất & Cộng tác",
    subtitle:
      "Office, Microsoft 365 và công cụ làm việc nhóm — chọn gói phù hợp trước khi mua.",
    bullets: [
      "Microsoft Office / Microsoft 365",
      "Làm việc nhóm và tài liệu",
      "Gói cá nhân và doanh nghiệp",
    ],
    primaryCta: { label: "Xem Office & năng suất", href: "/products?cat=office" },
    secondaryCta: { label: "Tư vấn chọn gói", href: "/business/licensing-consulting" },
    related: [
      { label: "Microsoft", href: "/brands/microsoft" },
      { label: "Giải pháp doanh nghiệp", href: "/business" },
    ],
  },
  cloud: {
    slug: "cloud",
    kicker: "Giải pháp",
    title: "Cloud",
    subtitle:
      "Cloud linh hoạt cho doanh nghiệp hiện đại — hạ tầng, storage, backup và tư vấn triển khai trên KEYON.",
    bullets: [
      "Cloud Infrastructure / Storage / Backup",
      "Định hướng nền tảng đối tác (Azure, AWS, …)",
      "Tư vấn theo quy mô SME → Enterprise",
    ],
    primaryCta: { label: "Khám phá dịch vụ cloud", href: "/products?cat=cloud" },
    secondaryCta: { label: "Liên hệ tư vấn", href: "/contact/sales" },
  },
  security: {
    slug: "security",
    kicker: "Giải pháp",
    title: "Bảo mật",
    subtitle: "Bảo vệ endpoint, dữ liệu và thiết bị với các gói bảo mật trên KEYON.",
    bullets: ["Endpoint / Antivirus / Internet Security", "Xem rõ loại nhận trước khi mua"],
    primaryCta: { label: "Xem sản phẩm bảo mật", href: "/products?cat=security" },
    secondaryCta: { label: "Liên hệ tư vấn", href: "/contact/sales" },
  },
  backup: {
    slug: "backup",
    kicker: "Giải pháp",
    title: "Backup & Khôi phục",
    subtitle: "Sao lưu và khôi phục dữ liệu — endpoint, cloud và máy chủ (theo catalog hiện có).",
    bullets: ["Tìm gói backup trên cửa hàng", "Tư vấn khi cần triển khai tổ chức"],
    primaryCta: { label: "Tìm sản phẩm backup", href: "/products?q=backup" },
    secondaryCta: { label: "Liên hệ tư vấn", href: "/contact/sales" },
    draftCapable: true,
  },
  "license-management": {
    slug: "license-management",
    kicker: "Giải pháp · Canonical",
    title: "Quản lý bản quyền",
    subtitle:
      "Theo dõi license, đơn hàng, gia hạn và deliverable trong Tài khoản KEYON — một nơi cho cá nhân và doanh nghiệp.",
    bullets: [
      "Quản lý tập trung trong Tài khoản",
      "Theo dõi trạng thái đơn và license",
      "Mở lại deliverable khi cần",
      "Hỗ trợ ticket tiếng Việt",
    ],
    primaryCta: { label: "Vào Tài khoản", href: "/account" },
    secondaryCta: { label: "Giải pháp doanh nghiệp", href: "/business" },
    related: [
      { label: "Subscription & Gia hạn", href: "/business/subscriptions" },
      { label: "Volume licensing", href: "/business/volume-licensing" },
    ],
  },
};

export const BUSINESS_HUB = {
  title: "Giải pháp cho doanh nghiệp",
  subtitle:
    "Bản quyền phần mềm và cloud cho tổ chức — mua, triển khai và quản lý trên một nền tảng. Cá nhân vẫn mua lẻ bình thường trên Sản phẩm.",
};

export const BUSINESS_PAGES: Record<string, IaPage> = {
  "volume-licensing": {
    slug: "volume-licensing",
    kicker: "Doanh nghiệp",
    title: "Mua bản quyền số lượng lớn",
    subtitle: "Phù hợp 5 / 10 / 50 / 100+ người dùng — nhận tư vấn và báo giá theo nhu cầu.",
    bullets: ["Volume / multi-seat theo điều kiện gói", "Báo giá và hỗ trợ triển khai", "Gắn với quản lý license trên KEYON"],
    primaryCta: { label: "Yêu cầu báo giá", href: "/contact/sales" },
    secondaryCta: { label: "Quản lý bản quyền", href: "/solutions/license-management" },
  },
  subscriptions: {
    slug: "subscriptions",
    kicker: "Doanh nghiệp",
    title: "Subscription & Gia hạn",
    subtitle: "Theo dõi subscription, renewal và chu kỳ sử dụng — nền tảng cho vận hành B2B / Pax8 về sau.",
    bullets: ["Gia hạn theo gói subscription", "Theo dõi trong Tài khoản", "Tư vấn khi đến kỳ renew"],
    primaryCta: { label: "Liên hệ kinh doanh", href: "/contact/sales" },
    secondaryCta: { label: "Quản lý bản quyền", href: "/solutions/license-management" },
    draftCapable: true,
  },
  "licensing-consulting": {
    slug: "licensing-consulting",
    kicker: "Doanh nghiệp",
    title: "Tư vấn bản quyền",
    subtitle: "Chưa chắc nên chọn Office nào, Microsoft 365 nào, Windows hay Security? KEYON hỗ trợ tư vấn trước khi mua.",
    bullets: ["Tư vấn chọn gói", "Phân biệt perpetual / subscription", "Phù hợp cá nhân, team và doanh nghiệp"],
    primaryCta: { label: "Liên hệ tư vấn", href: "/contact/sales" },
    secondaryCta: { label: "Xem giải pháp", href: "/solutions" },
  },
};

export const RESOURCE_HUB = {
  title: "Tài nguyên",
  subtitle: "Kiến thức, hướng dẫn và tin tức — knowledge hub của KEYON (một Article engine phía sau).",
};

export const RESOURCE_SECTIONS: Record<
  string,
  { title: string; subtitle: string; href: string; aliasNote?: string }
> = {
  insights: {
    title: "Kiến thức",
    subtitle: "Bài chuyên sâu / SEO: bản quyền, Microsoft, cloud, security, doanh nghiệp.",
    href: "/resources/insights",
  },
  guides: {
    title: "Hướng dẫn",
    subtitle: "How-to thực hành: kích hoạt, nhập key, kiểm tra license, dùng Tài khoản KEYON.",
    href: "/resources/guides",
  },
  news: {
    title: "Tin tức",
    subtitle: "Cập nhật vendor và KEYON. Canonical Article engine — /blog 301 → đây.",
    href: "/resources/news",
  },
};
