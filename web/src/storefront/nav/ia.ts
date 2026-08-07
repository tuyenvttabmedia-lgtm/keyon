/**
 * KEYON IA v1 — Navigation / merchandising layer.
 * Frozen: NAV-01..05 — Brand ≠ Category ≠ Collection ≠ Solution ≠ Navigation.
 * Phase 2: Collections remain merchandising config (not Prisma Category).
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
};

export type DropdownNavItem = {
  id: string;
  label: string;
  href: string;
  kind: "dropdown";
  links: NavLink[];
};

export type PrimaryNavItem = MegaNavItem | DropdownNavItem;

/** Shop Collections — only collections with sellable catalog coverage (Wave 5). */
export const SHOP_COLLECTIONS: NavLink[] = [
  { label: "Windows", href: "/products?cat=windows", description: "Hệ điều hành" },
  { label: "Microsoft Office", href: "/products?cat=office", description: "Office & năng suất" },
  { label: "Adobe", href: "/products?cat=adobe", description: "PDF & sáng tạo" },
  { label: "Cloud & Server", href: "/products?cat=cloud", description: "Server / hạ tầng" },
  { label: "Tất cả sản phẩm", href: "/products" },
];

/** Featured brands — only brands with ≥1 active product (Wave 5). */
export const FEATURED_BRANDS: NavLink[] = [
  { label: "Microsoft", href: "/products?q=microsoft", description: "Windows, Office, Microsoft 365" },
  { label: "Adobe", href: "/products?q=adobe", description: "Sáng tạo, thiết kế và tài liệu" },
  { label: "Autodesk", href: "/products?q=autodesk", description: "Thiết kế, kỹ thuật và xây dựng" },
  { label: "Tất cả thương hiệu", href: "/brands" },
];

/** Top-level header navigation (desktop mega / dropdown). */
export const IA_PRIMARY_NAV: PrimaryNavItem[] = [
  {
    id: "products",
    label: "Sản phẩm",
    href: "/products",
    kind: "mega",
    columns: [
      { title: "Thương hiệu", links: FEATURED_BRANDS },
      { title: "Khám phá", links: SHOP_COLLECTIONS },
    ],
  },
  {
    id: "solutions",
    label: "Giải pháp",
    href: "/solutions",
    kind: "mega",
    columns: [
      {
        title: "Theo nhu cầu",
        links: [
          {
            label: "Bản quyền phần mềm",
            href: "/solutions/software-licensing",
            description: "Cá nhân, đội nhóm và doanh nghiệp",
          },
          {
            label: "Năng suất & Cộng tác",
            href: "/solutions/productivity",
            description: "Office, Microsoft 365, làm việc nhóm",
          },
          {
            label: "Cloud",
            href: "/solutions/cloud",
            description: "Hạ tầng và dịch vụ cloud",
          },
          {
            label: "Bảo mật",
            href: "/solutions/security",
            description: "Endpoint, antivirus, bảo vệ dữ liệu",
          },
          {
            label: "Backup & Khôi phục",
            href: "/solutions/backup",
            description: "Sao lưu endpoint, cloud và máy chủ",
          },
          {
            label: "Quản lý bản quyền",
            href: "/solutions/license-management",
            description: "Theo dõi license, gia hạn, tài khoản KEYON",
          },
        ],
      },
    ],
  },
  {
    id: "business",
    label: "Doanh nghiệp",
    href: "/business",
    kind: "mega",
    columns: [
      {
        title: "Dành cho tổ chức",
        links: [
          {
            label: "Giải pháp cho doanh nghiệp",
            href: "/business",
            description: "Landing B2B tổng quan",
          },
          {
            label: "Mua bản quyền số lượng lớn",
            href: "/business/volume-licensing",
            description: "5 / 10 / 50 / 100+ users · báo giá",
          },
          {
            label: "Subscription & Gia hạn",
            href: "/business/subscriptions",
            description: "Quản lý subscription và renewal",
          },
          {
            label: "Tư vấn bản quyền",
            href: "/business/licensing-consulting",
            description: "Chọn đúng gói Office / Windows / Security",
          },
          {
            label: "Liên hệ kinh doanh",
            href: "/contact/quote",
            description: "CTA tư vấn B2B",
          },
        ],
      },
    ],
    promo: {
      title: "Quản lý bản quyền tập trung",
      description: "Theo dõi license của doanh nghiệp tại một nơi trên KEYON.",
      href: "/solutions/license-management",
      ctaLabel: "Tìm hiểu →",
    },
  },
  {
    id: "resources",
    label: "Tài nguyên",
    href: "/resources",
    kind: "dropdown",
    links: [
      { label: "Kiến thức", href: "/resources/insights" },
      { label: "Hướng dẫn", href: "/resources/guides" },
      { label: "Tin tức", href: "/resources/news" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    id: "support",
    label: "Hỗ trợ",
    href: "/support",
    kind: "dropdown",
    links: [
      { label: "Trung tâm hỗ trợ", href: "/support" },
      { label: "Gửi yêu cầu hỗ trợ", href: "/account/tickets" },
      { label: "Liên hệ", href: "/contact" },
    ],
  },
];

/** Flat top links for mobile accordion roots / footer helpers */
export function iaTopLinks(): NavLink[] {
  return IA_PRIMARY_NAV.map((n) => ({ label: n.label, href: n.href }));
}
