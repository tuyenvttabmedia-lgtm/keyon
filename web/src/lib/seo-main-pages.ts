/** Client-safe main-page SEO paths (must match real storefront routes). */

export const SEO_TITLE_MAX = 60;
export const SEO_DESC_MAX = 160;

export type MainSeoPageKey =
  | "/"
  | "/products"
  | "/blog"
  | "/contact"
  | "/about"
  | "/faq"
  | "/support"
  | "/business"
  | "/solutions"
  | "/resources"
  | "/resources/insights"
  | "/resources/guides"
  | "/resources/news"
  | "/policy"
  | "/brands";

export const MAIN_SEO_PAGES: {
  path: MainSeoPageKey;
  label: string;
}[] = [
  { path: "/", label: "Trang chủ" },
  { path: "/products", label: "Trang sản phẩm" },
  { path: "/business", label: "Doanh nghiệp" },
  { path: "/solutions", label: "Giải pháp" },
  { path: "/resources", label: "Tài nguyên" },
  { path: "/resources/insights", label: "Kiến thức" },
  { path: "/resources/guides", label: "Hướng dẫn" },
  { path: "/resources/news", label: "Tin tức" },
  { path: "/faq", label: "FAQ" },
  { path: "/support", label: "Trung tâm hỗ trợ" },
  { path: "/policy", label: "Trang chính sách" },
  { path: "/contact", label: "Trang liên hệ" },
  { path: "/about", label: "Về KEYON" },
  { path: "/brands", label: "Thương hiệu" },
];

export const MAIN_SEO_PATHS = MAIN_SEO_PAGES.map((p) => p.path) as MainSeoPageKey[];

export function isMainSeoPath(path: string): path is MainSeoPageKey {
  return (MAIN_SEO_PATHS as string[]).includes(path);
}
