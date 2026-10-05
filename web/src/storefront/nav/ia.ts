/**
 * KEYON IA v1 — Navigation / merchandising layer.
 * Frozen: NAV-01..05 — Brand ≠ Category ≠ Collection ≠ Solution ≠ Navigation.
 *
 * Sản phẩm  = what to buy (`/products`, brands, collections).
 * Giải pháp = what need to solve (`/solutions/*` + hub `/solutions`).
 * Doanh nghiệp = how to buy/renew/consult with KEYON (`/business/*`).
 * Dịch vụ = scoped deployment and managed IT (`/services/*`).
 * These megas must not list the same destinations.
 */

export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type MegaColumn = {
  title: string;
  links: NavLink[];
};

export type MegaPromo = {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
};

export type MegaNavItem = {
  id: string;
  label: string;
  href: string;
  kind: "mega";
  columns: MegaColumn[];
  promo?: MegaPromo;
  footerCta?: { label: string; href: string };
};

export type DropdownNavItem = {
  id: string;
  label: string;
  href: string;
  kind: "dropdown";
  links: NavLink[];
};

export type PrimaryNavItem = MegaNavItem | DropdownNavItem;

/** License shelves in the products menu. */
export const LICENSE_COLLECTIONS: NavLink[] = [
  {
    label: "Windows & OS",
    href: "/categories/windows",
    description: "Windows, Windows Server",
  },
  {
    label: "Microsoft 365 & Office",
    href: "/categories/office",
    description: "Word, Excel, PowerPoint, Teams, OneDrive",
  },
  {
    label: "Adobe Creative",
    href: "/categories/adobe",
    description: "Creative Cloud, Acrobat",
  },
  {
    label: "Autodesk",
    href: "/categories/autodesk",
    description: "AutoCAD, kỹ thuật",
  },
  {
    label: "Bảo mật",
    href: "/categories/security",
    description: "Antivirus & endpoint",
  },
  {
    label: "Backup & Storage",
    href: "/categories/backup",
    description: "Acronis và các gói backup trên catalog",
  },
];

/** Rented infrastructure shelves. Professional services stay off this menu until a service SKU exists. */
export const INFRA_COLLECTIONS: NavLink[] = [
  {
    label: "Cloud & Hạ tầng",
    href: "/categories/cloud",
    description: "VPS Linux, VPS Windows và Dedicated Server",
  },
];

/** Shop collections — category filters, not brand names (NAV-01). */
export const SHOP_COLLECTIONS: NavLink[] = [
  ...LICENSE_COLLECTIONS,
  ...INFRA_COLLECTIONS,
];

/** Featured brands — only brands with catalog coverage (Wave 5). */
export const FEATURED_BRANDS: NavLink[] = [
  {
    label: "Microsoft",
    href: "/brands/microsoft",
    description: "Windows, Office, Microsoft 365",
  },
  {
    label: "Adobe",
    href: "/brands/adobe",
    description: "Creative Cloud, Acrobat",
  },
  {
    label: "Autodesk",
    href: "/brands/autodesk",
    description: "AutoCAD, kỹ thuật",
  },
  {
    label: "Xem tất cả thương hiệu →",
    href: "/brands",
  },
];

export type SolutionTopicArt =
  | "bars"
  | "trend"
  | "shield"
  | "stack"
  | "cloud"
  | "backup";

/** Outcome-oriented topics — Home, `/solutions` hub, Giải pháp mega. */
export const SOLUTION_TOPICS: {
  id: string;
  label: string;
  href: string;
  description: string;
  art: SolutionTopicArt;
}[] = [
  {
    id: "microsoft-365-office",
    label: "Microsoft & Productivity",
    href: "/solutions/microsoft-365-office",
    description:
      "Microsoft 365, Windows và Office — license và subscription cho cá nhân, đội nhóm và doanh nghiệp.",
    art: "trend",
  },
  {
    id: "cloud",
    label: "Cloud & Hạ tầng",
    href: "/solutions/cloud",
    description:
      "License Cloud, máy chủ và lưu trữ — chọn gói hạ tầng phù hợp với quy mô sử dụng trên KEYON.",
    art: "cloud",
  },
  {
    id: "security",
    label: "Bảo mật",
    href: "/solutions/security",
    description:
      "Khám phá các sản phẩm và license bảo mật cho thiết bị, email, dữ liệu, danh tính và mạng trên KEYON.",
    art: "shield",
  },
  {
    id: "backup",
    label: "Backup & Khôi phục",
    href: "/solutions/backup",
    description:
      "Phần mềm và license backup cho PC, máy chủ, Microsoft 365 và dữ liệu Cloud trên KEYON.",
    art: "backup",
  },
  {
    id: "license-management",
    label: "License Management",
    href: "/solutions/license-management",
    description:
      "Theo dõi license, thời hạn, subscription và trạng thái kích hoạt trên tài khoản KEYON.",
    art: "stack",
  },
  {
    id: "by-need",
    label: "Giải pháp theo nhu cầu",
    href: "/solutions/by-need",
    description:
      "Kết hợp nhiều sản phẩm theo nhu cầu thực tế của cá nhân, đội nhóm hoặc doanh nghiệp.",
    art: "bars",
  },
];

const SOLUTION_NEED_IDS = [
  "microsoft-365-office",
  "cloud",
  "security",
  "backup",
] as const;

export const SOLUTION_NEED_LINKS: NavLink[] = SOLUTION_TOPICS.filter((t) =>
  (SOLUTION_NEED_IDS as readonly string[]).includes(t.id),
).map(({ label, href, description }) => ({ label, href, description }));

export const SOLUTION_ORG_LINKS: NavLink[] = SOLUTION_TOPICS.filter(
  (t) => t.id === "license-management" || t.id === "by-need",
).map(({ label, href, description }) => ({ label, href, description }));

/** @deprecated Use SOLUTION_NEED_LINKS — kept for older imports. */
export const BUSINESS_TOPIC_LINKS: NavLink[] = SOLUTION_NEED_LINKS;

export function solutionTopicCards() {
  return SOLUTION_TOPICS.map((t) => ({
    id: t.id,
    title: t.label,
    description: t.description,
    href: t.href,
    art: t.art,
  }));
}

export const BUSINESS_BUY_LINKS: NavLink[] = [
  {
    label: "Mua bản quyền số lượng lớn",
    href: "/business/volume-licensing",
    description: "Tư vấn license, báo giá và bàn giao theo quy mô doanh nghiệp",
  },
  {
    label: "Subscription & Gia hạn",
    href: "/business/subscriptions",
    description: "Mua theo thời hạn, theo dõi thời gian sử dụng và hỗ trợ gia hạn",
  },
  {
    label: "Hợp đồng & đơn hàng",
    href: "/business/contracts",
    description: "Theo dõi đơn hàng và license trong Tài khoản. PO và hợp đồng qua đội kinh doanh",
  },
];

export const BUSINESS_ADVISORY_LINKS: NavLink[] = [
  {
    label: "Tư vấn bản quyền",
    href: "/business/licensing-consulting",
    description: "Tư vấn chọn bản quyền phần mềm trước khi mua",
  },
  {
    label: "Dịch vụ triển khai",
    href: "/business/implementation",
    description: "Bàn giao, kích hoạt và hướng dẫn sử dụng bản quyền sau khi mua",
  },
  {
    label: "Liên hệ kinh doanh",
    href: "/contact/quote",
    description: "Nhận báo giá bản quyền theo nhu cầu doanh nghiệp",
  },
];

/** @deprecated Prefer BUSINESS_BUY_LINKS + BUSINESS_ADVISORY_LINKS */
export const BUSINESS_SERVICE_LINKS: NavLink[] = [
  ...BUSINESS_BUY_LINKS,
  ...BUSINESS_ADVISORY_LINKS,
];

export type ServiceColumnId = "deploy" | "manage";

export type ServiceTopic = {
  slug: string;
  column: ServiceColumnId;
  label: string;
  description: string;
  bullets: string[];
};

export const SERVICE_COLUMNS: { id: ServiceColumnId; title: string }[] = [
  { id: "deploy", title: "Triển khai & chuyển đổi" },
  { id: "manage", title: "Quản lý & bảo mật" },
];

/** Canonical slug for the Microsoft 365 email implementation service. */
export const M365_EMAIL_SERVICE_SLUG = "microsoft-365-email-deployment" as const;

/** Canonical slug for mailbox and data migration. */
export const EMAIL_MIGRATION_SERVICE_SLUG = "email-data-migration" as const;

/** Deployment and managed-IT offerings. Distinct from Giải pháp and Doanh nghiệp. */
export const SERVICE_TOPICS: ServiceTopic[] = [
  {
    slug: M365_EMAIL_SERVICE_SLUG,
    column: "deploy",
    label: "Triển khai Microsoft 365 & Email",
    description:
      "Thiết lập Microsoft 365, email, domain, DNS và tài khoản người dùng.",
    bullets: [
      "Thiết lập Microsoft 365, hộp thư và tài khoản người dùng",
      "Gắn domain và bản ghi DNS cho email doanh nghiệp",
      "Bàn giao theo phạm vi đã thống nhất",
    ],
  },
  {
    slug: EMAIL_MIGRATION_SERVICE_SLUG,
    column: "deploy",
    label: "Di chuyển Email & Dữ liệu",
    description: "Migration email, dữ liệu và người dùng sang nền tảng mới.",
    bullets: [
      "Chuyển email, dữ liệu và người dùng sang nền tảng mới",
      "Lên kế hoạch cắt chuyển để hạn chế gián đoạn",
      "Kiểm tra sau khi chuyển xong",
    ],
  },
  {
    slug: "cloud-server",
    column: "deploy",
    label: "Cloud & Server Deployment",
    description:
      "Triển khai VPS, Cloud Server, storage và môi trường máy chủ.",
    bullets: [
      "Triển khai VPS, Cloud Server và storage",
      "Dựng môi trường máy chủ theo cấu hình đã chốt",
      "Bàn giao quyền truy cập cho người phụ trách",
    ],
  },
  {
    slug: "backup-disaster-recovery",
    column: "deploy",
    label: "Backup & Disaster Recovery",
    description: "Thiết lập backup và phương án khôi phục dữ liệu.",
    bullets: [
      "Thiết lập backup cho dữ liệu cần giữ",
      "Xây phương án khôi phục khi sự cố",
      "Kiểm tra quy trình phục hồi theo phạm vi dịch vụ",
    ],
  },
  {
    slug: "security-deployment",
    column: "manage",
    label: "Triển khai bảo mật",
    description:
      "Cài đặt và cấu hình giải pháp bảo mật cho thiết bị và doanh nghiệp.",
    bullets: [
      "Cài đặt giải pháp bảo mật cho thiết bị và doanh nghiệp",
      "Cấu hình theo phạm vi đã thống nhất",
      "Hướng dẫn vận hành sau khi triển khai",
    ],
  },
  {
    slug: "microsoft-365-management",
    column: "manage",
    label: "Quản lý Microsoft 365",
    description:
      "Quản trị người dùng, license, tenant và cấu hình Microsoft 365.",
    bullets: [
      "Quản trị người dùng, license và tenant",
      "Điều chỉnh cấu hình Microsoft 365 theo nhu cầu",
      "Hỗ trợ vận hành trong thời hạn dịch vụ",
    ],
  },
  {
    slug: "managed-it",
    column: "manage",
    label: "Managed IT / MSP",
    description: "Giám sát, hỗ trợ và quản lý hệ thống CNTT theo nhu cầu.",
    bullets: [
      "Giám sát và hỗ trợ hệ thống CNTT",
      "Quản lý theo phạm vi đã thỏa thuận",
      "Tiếp nhận yêu cầu qua kênh hỗ trợ KEYON",
    ],
  },
];

function serviceNavLinks(column: ServiceColumnId): NavLink[] {
  return SERVICE_TOPICS.filter((topic) => topic.column === column).map((topic) => ({
    label: topic.label,
    href: `/services/${topic.slug}`,
    description: topic.description,
  }));
}

export const SERVICE_DEPLOY_LINKS: NavLink[] = serviceNavLinks("deploy");
export const SERVICE_MANAGE_LINKS: NavLink[] = serviceNavLinks("manage");

export function serviceTopicBySlug(slug: string): ServiceTopic | undefined {
  return SERVICE_TOPICS.find((topic) => topic.slug === slug);
}

export const RESOURCE_LINKS: NavLink[] = [
  {
    label: "Hướng dẫn",
    href: "/kien-thuc/huong-dan",
    description: "Cài đặt, kích hoạt, sử dụng",
  },
  {
    label: "Chuyên sâu",
    href: "/kien-thuc/chuyen-sau",
    description: "Bản quyền, Microsoft 365, bảo mật",
  },
  {
    label: "Tin tức",
    href: "/kien-thuc/tin-tuc",
    description: "Cập nhật sản phẩm, vendor và KEYON",
  },
  {
    label: "FAQ",
    href: "/faq",
    description: "Câu hỏi thường gặp",
  },
];

export const SUPPORT_LINKS: NavLink[] = [
  {
    label: "Trung tâm hỗ trợ",
    href: "/support",
    description: "Tìm câu trả lời nhanh",
  },
  {
    label: "Cách KEYON hoạt động",
    href: "/how-it-works",
    description: "Chọn sản phẩm → thanh toán hoặc báo giá → nhận bàn giao → quản lý trong Tài khoản",
  },
  {
    label: "Tra cứu đơn hàng",
    href: "/account/orders",
    description: "Cần đăng nhập — tìm theo mã đơn trong Tài khoản",
  },
  {
    label: "Gửi yêu cầu hỗ trợ",
    href: "/account/tickets",
    description: "Tạo ticket và theo dõi xử lý",
  },
  {
    label: "Liên hệ",
    href: "/contact",
    description: "Email và các kênh hỗ trợ",
  },
];

export const IA_PRIMARY_NAV: PrimaryNavItem[] = [
  {
    id: "products",
    label: "Sản phẩm",
    href: "/products",
    kind: "mega",
    columns: [
      { title: "Bản quyền", links: LICENSE_COLLECTIONS },
      { title: "Hạ tầng thuê", links: INFRA_COLLECTIONS },
      { title: "Thương hiệu nổi bật", links: FEATURED_BRANDS },
    ],
    footerCta: { label: "Xem tất cả sản phẩm →", href: "/products" },
  },
  {
    id: "solutions",
    label: "Giải pháp",
    href: "/solutions",
    kind: "mega",
    columns: [
      { title: "Giải pháp theo nhu cầu", links: SOLUTION_NEED_LINKS },
      { title: "Dành cho tổ chức", links: SOLUTION_ORG_LINKS },
    ],
    footerCta: { label: "Khám phá tất cả giải pháp →", href: "/solutions" },
  },
  {
    id: "business",
    label: "Doanh nghiệp",
    href: "/business",
    kind: "mega",
    columns: [
      { title: "Mua & quản lý", links: BUSINESS_BUY_LINKS },
      { title: "Tư vấn", links: BUSINESS_ADVISORY_LINKS },
    ],
    footerCta: {
      label: "Khám phá dịch vụ doanh nghiệp →",
      href: "/business",
    },
  },
  {
    id: "services",
    label: "Dịch vụ",
    href: "/services",
    kind: "mega",
    columns: [
      { title: "Triển khai & chuyển đổi", links: SERVICE_DEPLOY_LINKS },
      { title: "Quản lý & bảo mật", links: SERVICE_MANAGE_LINKS },
    ],
    footerCta: { label: "Xem tất cả dịch vụ →", href: "/services" },
  },
  {
    id: "knowledge",
    label: "Kiến thức",
    href: "/kien-thuc",
    kind: "mega",
    columns: [{ title: "Chuyên mục", links: RESOURCE_LINKS }],
    footerCta: { label: "Xem tất cả kiến thức →", href: "/kien-thuc" },
  },
  {
    id: "support",
    label: "Hỗ trợ",
    href: "/support",
    kind: "mega",
    columns: [{ title: "Hỗ trợ", links: SUPPORT_LINKS }],
    footerCta: { label: "Trung tâm hỗ trợ →", href: "/support" },
  },
];

export function iaTopLinks(): NavLink[] {
  return IA_PRIMARY_NAV.map((n) => ({ label: n.label, href: n.href }));
}
