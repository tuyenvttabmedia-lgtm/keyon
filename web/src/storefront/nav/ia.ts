/**
 * KEYON IA v1 — Navigation / merchandising layer.
 * Frozen: NAV-01..05 — Brand ≠ Category ≠ Collection ≠ Solution ≠ Navigation.
 *
 * Sản phẩm  = what to buy (`/products`, brands, collections).
 * Giải pháp = what need to solve (`/solutions/*` + hub `/solutions`).
 * Doanh nghiệp = how to buy/renew/consult with KEYON (`/business/*`).
 * The three megas must not list the same destinations.
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

/** Shop collections — category / query filters, not brand names (NAV-01). */
export const SHOP_COLLECTIONS: NavLink[] = [
  {
    label: "Hệ điều hành",
    href: "/products?cat=windows",
    description: "Windows, Windows Server",
  },
  {
    label: "Office & Năng suất",
    href: "/products?cat=office",
    description: "Office, Microsoft 365",
  },
  {
    label: "Cloud & Hạ tầng",
    href: "/products?cat=cloud",
    description: "Server, cloud, Azure",
  },
  {
    label: "Bảo mật",
    href: "/products?cat=security",
    description: "Antivirus & endpoint",
  },
  {
    label: "Backup & Khôi phục",
    href: "/products?q=backup",
    description: "Bảo vệ và phục hồi dữ liệu",
  },
];

/** Featured brands — only brands with catalog coverage (Wave 5). */
export const FEATURED_BRANDS: NavLink[] = [
  {
    label: "Microsoft",
    href: "/products?q=microsoft",
    description: "Windows, Office, Microsoft 365",
  },
  {
    label: "Adobe",
    href: "/products?q=adobe",
    description: "Creative Cloud, Acrobat",
  },
  {
    label: "Autodesk",
    href: "/products?q=autodesk",
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
    id: "productivity",
    label: "Năng suất & Cộng tác",
    href: "/solutions/productivity",
    description: "Làm việc hiệu quả hơn với Microsoft 365, Office",
    art: "trend",
  },
  {
    id: "cloud",
    label: "Cloud & Hạ tầng",
    href: "/solutions/cloud",
    description: "Xây dựng và vận hành cloud, server và workload",
    art: "cloud",
  },
  {
    id: "security",
    label: "Bảo mật & Bảo vệ dữ liệu",
    href: "/solutions/security",
    description: "Bảo vệ endpoint, email và dữ liệu doanh nghiệp",
    art: "shield",
  },
  {
    id: "backup",
    label: "Sao lưu & Khôi phục",
    href: "/solutions/backup",
    description: "Backup, disaster recovery",
    art: "backup",
  },
  {
    id: "license-management",
    label: "Quản lý phần mềm & bản quyền",
    href: "/solutions/license-management",
    description: "Theo dõi tập trung license, gia hạn và tài sản số",
    art: "stack",
  },
  {
    id: "by-need",
    label: "Giải pháp theo nhu cầu",
    href: "/solutions/by-need",
    description: "Kết hợp sản phẩm phù hợp với quy mô sử dụng",
    art: "bars",
  },
];

const SOLUTION_NEED_IDS = [
  "productivity",
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
    description: "5 / 10 / 50 / 100+ license · báo giá cho tổ chức",
  },
  {
    label: "Subscription & Gia hạn",
    href: "/business/subscriptions",
    description: "Quản lý thuê bao, renewal và chu kỳ sử dụng",
  },
  {
    label: "Hợp đồng & đơn hàng",
    href: "/business/contracts",
    description: "Theo dõi giao dịch DN trên Tài khoản — chưa phải cổng HĐ pháp lý",
  },
];

export const BUSINESS_ADVISORY_LINKS: NavLink[] = [
  {
    label: "Tư vấn bản quyền",
    href: "/business/licensing-consulting",
    description: "Chọn đúng sản phẩm và mô hình cấp phép",
  },
  {
    label: "Dịch vụ triển khai",
    href: "/business/implementation",
    description: "Bàn giao và kích hoạt bản quyền theo quy mô",
  },
  {
    label: "Liên hệ kinh doanh",
    href: "/contact/quote",
    description: "Nhận tư vấn và báo giá",
  },
];

/** @deprecated Prefer BUSINESS_BUY_LINKS + BUSINESS_ADVISORY_LINKS */
export const BUSINESS_SERVICE_LINKS: NavLink[] = [
  ...BUSINESS_BUY_LINKS,
  ...BUSINESS_ADVISORY_LINKS,
];

export const RESOURCE_LINKS: NavLink[] = [
  {
    label: "Hướng dẫn phần mềm",
    href: "/resources/guides",
    description: "Cài đặt, kích hoạt, sử dụng",
  },
  {
    label: "Kiến thức bản quyền",
    href: "/resources/insights",
    description: "License, subscription, renewal",
  },
  {
    label: "Tin tức & Cập nhật",
    href: "/resources/news",
    description: "Sản phẩm, công nghệ, ưu đãi",
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
    label: "Hướng dẫn nhận hàng",
    href: "/how-it-works",
    description: "Key / tài khoản / kích hoạt",
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
      { title: "Theo danh mục", links: SHOP_COLLECTIONS },
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
    id: "resources",
    label: "Tài nguyên",
    href: "/resources",
    kind: "mega",
    columns: [{ title: "Kiến thức", links: RESOURCE_LINKS }],
    footerCta: { label: "Xem tất cả tài nguyên →", href: "/resources" },
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
