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
  | "/policy"
  | "/brands";

export const MAIN_SEO_PAGES: {
  path: MainSeoPageKey;
  label: string;
}[] = [
  { path: "/", label: "Trang chủ" },
  { path: "/products", label: "Trang sản phẩm" },
  { path: "/blog", label: "Trang blog / bài viết" },
  { path: "/faq", label: "Trang hỗ trợ / FAQ" },
  { path: "/policy", label: "Trang chính sách" },
  { path: "/contact", label: "Trang liên hệ" },
  { path: "/about", label: "Về KEYON" },
  { path: "/brands", label: "Thương hiệu" },
];

export const MAIN_SEO_PATHS = MAIN_SEO_PAGES.map((p) => p.path) as MainSeoPageKey[];

export function isMainSeoPath(path: string): path is MainSeoPageKey {
  return (MAIN_SEO_PATHS as string[]).includes(path);
}
