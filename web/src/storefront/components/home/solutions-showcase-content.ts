import type { SolutionItem } from "@/storefront/content/types";

/** Home Solutions showcase — 5 tabs matching mockup (by-need lives on /solutions hub). */
export const HOME_SOLUTION_TAB_IDS = [
  "productivity",
  "cloud",
  "security",
  "backup",
  "license-management",
] as const;

export type HomeSolutionTabId = (typeof HOME_SOLUTION_TAB_IDS)[number];

export type SolutionChip = {
  id: string;
  label: string;
  /** Placement token for desktop float layout */
  slot: "tl" | "tr" | "ml" | "bl" | "br";
};

export type SolutionShowcasePanel = {
  /** Short tab label (mockup density) */
  tabLabel: string;
  /** Panel kicker after index, e.g. NĂNG SUẤT & CỘNG TÁC */
  panelKicker: string;
  /** Right-column headline */
  headline: string;
  /** Right-column lead — go-live prod voice */
  lead: string;
  /** Check list (max 4) */
  checks: string[];
  /** Floating chips around visual */
  chips: SolutionChip[];
};

export const HOME_SOLUTION_SHOWCASE: Record<
  HomeSolutionTabId,
  SolutionShowcasePanel
> = {
  productivity: {
    tabLabel: "Năng suất & Cộng tác",
    panelKicker: "Năng suất & Cộng tác",
    headline: "Làm việc hiệu quả hơn, ở mọi nơi",
    lead: "Microsoft 365, Office, Teams và công cụ cộng tác chính hãng — kích hoạt nhanh, hỗ trợ tiếng Việt.",
    checks: [
      "Microsoft 365 / Office chính hãng",
      "Email và lịch làm việc trên Microsoft 365",
      "Teams và cộng tác trực tuyến",
      "OneDrive / lưu trữ theo gói đã mua",
    ],
    chips: [
      { id: "mail", label: "Email doanh nghiệp", slot: "tl" },
      { id: "cloud", label: "Lưu trữ trên cloud", slot: "tr" },
      { id: "m365", label: "Bộ ứng dụng Microsoft 365", slot: "br" },
      { id: "cal", label: "Lịch làm việc", slot: "bl" },
      { id: "team", label: "Cộng tác nhóm", slot: "ml" },
    ],
  },
  cloud: {
    tabLabel: "Cloud & Hạ tầng",
    panelKicker: "Cloud & Hạ tầng",
    headline: "Chọn đúng gói cloud trên catalog",
    lead: "Gói cloud / hạ tầng đang bán trên KEYON — tư vấn chọn SKU theo nhu cầu. Không vận hành Azure/AWS thuê ngoài.",
    checks: [
      "Gói cloud / storage / backup trên catalog",
      "Tư vấn theo số người dùng và ngân sách",
      "Bàn giao license rõ ràng sau thanh toán",
      "Không thay MSP vận hành tenant",
    ],
    chips: [
      { id: "cloud", label: "Cloud trên catalog", slot: "tl" },
      { id: "scale", label: "Theo quy mô tổ chức", slot: "tr" },
      { id: "sku", label: "Tư vấn chọn SKU", slot: "br" },
      { id: "handoff", label: "Bàn giao license", slot: "bl" },
      { id: "quote", label: "Báo giá khi cần", slot: "ml" },
    ],
  },
  security: {
    tabLabel: "Bảo mật & An toàn",
    panelKicker: "Bảo mật & An toàn",
    headline: "Bảo vệ endpoint bằng gói chính hãng",
    lead: "Antivirus / internet security trên KEYON — xem rõ loại nhận trước khi mua, hỗ trợ kích hoạt tiếng Việt.",
    checks: [
      "Endpoint / Antivirus / Internet Security",
      "Loại nhận (key / tài khoản) ghi rõ trên SKU",
      "Kích hoạt theo hướng dẫn sau bàn giao",
      "Tư vấn chọn gói khi cần",
    ],
    chips: [
      { id: "shield", label: "Bảo vệ endpoint", slot: "tl" },
      { id: "web", label: "Internet security", slot: "tr" },
      { id: "key", label: "Key / tài khoản rõ ràng", slot: "br" },
      { id: "guide", label: "Hướng dẫn kích hoạt", slot: "bl" },
      { id: "support", label: "Hỗ trợ tiếng Việt", slot: "ml" },
    ],
  },
  backup: {
    tabLabel: "Backup & Khôi phục",
    panelKicker: "Backup & Khôi phục",
    headline: "License backup trên hạ tầng của bạn",
    lead: "Gói / license backup trên catalog — kích hoạt phần mềm trên hạ tầng khách hàng. KEYON không lưu bản sao dữ liệu.",
    checks: [
      "Tìm gói backup trên cửa hàng",
      "Kích hoạt trên hạ tầng của bạn",
      "Tư vấn chọn gói khi cần",
      "Không dịch vụ DR thuê ngoài",
    ],
    chips: [
      { id: "backup", label: "Gói backup catalog", slot: "tl" },
      { id: "restore", label: "Khôi phục tại chỗ", slot: "tr" },
      { id: "infra", label: "Trên hạ tầng của bạn", slot: "br" },
      { id: "guide", label: "Hướng dẫn kích hoạt", slot: "bl" },
      { id: "quote", label: "Tư vấn chọn gói", slot: "ml" },
    ],
  },
  "license-management": {
    tabLabel: "Quản lý bản quyền",
    panelKicker: "Quản lý bản quyền",
    headline: "Theo dõi license đã mua trên Tài khoản",
    lead: "License mua trên KEYON vào Tài khoản sau bàn giao — hạn dùng, nhắc trước renew và hỗ trợ gia hạn.",
    checks: [
      "License vào Tài khoản sau bàn giao",
      "Nhắc trước khi đến hạn",
      "Renew qua Mua ngay hoặc báo giá",
      "Hỗ trợ tiếng Việt",
    ],
    chips: [
      { id: "account", label: "Trong Tài khoản", slot: "tl" },
      { id: "renew", label: "Nhắc gia hạn", slot: "tr" },
      { id: "track", label: "Theo dõi hạn dùng", slot: "br" },
      { id: "order", label: "Đơn & giao nhận", slot: "bl" },
      { id: "support", label: "Hỗ trợ gia hạn", slot: "ml" },
    ],
  },
};

export const HOME_SOLUTIONS_SECTION_COPY = {
  overline: "Giải pháp",
  title: "Giải pháp số cho mọi nhu cầu vận hành",
  subtitle:
    "Từ năng suất, cloud, bảo mật đến backup và quản lý bản quyền — KEYON giúp chọn gói chính hãng, bàn giao rõ ràng và theo dõi trên Tài khoản.",
  viewAllLabel: "Xem tất cả giải pháp",
  viewAllHref: "/solutions",
  primaryCta: "Tìm hiểu giải pháp",
} as const;

export function pickSolutionTabs(items: SolutionItem[]): SolutionItem[] {
  const byId = new Map(items.map((i) => [i.id, i]));
  return HOME_SOLUTION_TAB_IDS.map((id) => byId.get(id)).filter(
    (i): i is SolutionItem => Boolean(i),
  );
}
