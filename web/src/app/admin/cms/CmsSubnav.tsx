import Link from "next/link";

const CMS_NAV = [
  { href: "/admin/cms", label: "Trang chủ" },
  { href: "/admin/cms/partners", label: "Đối tác" },
  { href: "/admin/cms/categories", label: "Danh mục Home" },
  { href: "/admin/cms/blog-taxonomy", label: "Danh mục bài viết" },
  { href: "/admin/cms/banner", label: "Banner Why" },
  { href: "/admin/cms/faq", label: "FAQ" },
  { href: "/admin/blog", label: "Bài viết" },
  { href: "/admin/cms/footer", label: "Footer" },
  { href: "/admin/cms/nav", label: "Điều hướng" },
  { href: "/admin/cms/brand", label: "Favicon" },
  { href: "/admin/cms/policy", label: "Hub Chính sách" },
  { href: "/admin/cms/pages", label: "Trang tĩnh" },
  { href: "/admin/cms/ratings", label: "Ratings" },
  { href: "/admin/cms/productivity", label: "Microsoft 365 & Office" },
  { href: "/admin/cms/cloud", label: "Cloud & Hạ tầng" },
  { href: "/admin/cms/security", label: "Bảo mật" },
  { href: "/admin/cms/backup", label: "Sao lưu và khôi phục" },
  { href: "/admin/cms/backup-dr", label: "Backup & Disaster Recovery" },
  { href: "/admin/cms/security-deployment", label: "Triển khai bảo mật" },
  { href: "/admin/cms/m365-management", label: "Quản lý Microsoft 365" },
  { href: "/admin/cms/managed-it", label: "Managed IT / MSP" },
  { href: "/admin/cms/solutions", label: "Giải pháp" },
  { href: "/admin/cms/checkout", label: "Checkout" },
  { href: "/admin/cms/account", label: "Account" },
  { href: "/admin/cms/contact", label: "Liên hệ" },
];

export function CmsSubnav({ active }: { active: string }) {
  return (
    <nav className="mb-6 flex flex-wrap gap-2">
      {CMS_NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={
            active === item.href
              ? "rounded-full bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent"
              : "rounded-full border border-border px-3 py-1.5 text-sm text-muted hover:border-accent"
          }
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
