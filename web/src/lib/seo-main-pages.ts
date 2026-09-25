/** Client-safe main-page SEO paths (must match real storefront routes). */

export const SEO_TITLE_MAX = 60;
export const SEO_DESC_MAX = 160;

export type MainSeoPageKey =
  | "/"
  | "/products"
  | "/contact"
  | "/contact/quote"
  | "/about"
  | "/faq"
  | "/support"
  | "/how-it-works"
  | "/business"
  | "/solutions"
  | "/kien-thuc"
  | "/kien-thuc/chuyen-sau"
  | "/kien-thuc/huong-dan"
  | "/kien-thuc/tin-tuc"
  | "/policy"
  | "/brands"
  | "/categories";

export const MAIN_SEO_PAGES: {
  path: MainSeoPageKey;
  label: string;
}[] = [
  { path: "/", label: "Trang chủ" },
  { path: "/products", label: "Trang sản phẩm" },
  { path: "/categories", label: "Danh mục sản phẩm" },
  { path: "/business", label: "Doanh nghiệp" },
  { path: "/solutions", label: "Giải pháp" },
  { path: "/kien-thuc", label: "Kiến thức" },
  { path: "/kien-thuc/chuyen-sau", label: "Chuyên sâu" },
  { path: "/kien-thuc/huong-dan", label: "Hướng dẫn" },
  { path: "/kien-thuc/tin-tuc", label: "Tin tức" },
  { path: "/faq", label: "FAQ" },
  { path: "/support", label: "Trung tâm hỗ trợ" },
  { path: "/how-it-works", label: "Cách KEYON hoạt động" },
  { path: "/policy", label: "Trang chính sách" },
  { path: "/contact", label: "Trang liên hệ" },
  { path: "/contact/quote", label: "Yêu cầu báo giá" },
  { path: "/about", label: "Về KEYON" },
  { path: "/brands", label: "Thương hiệu" },
];

export const MAIN_SEO_PATHS = MAIN_SEO_PAGES.map((p) => p.path) as MainSeoPageKey[];

export function isMainSeoPath(path: string): path is MainSeoPageKey {
  return (MAIN_SEO_PATHS as string[]).includes(path);
}
