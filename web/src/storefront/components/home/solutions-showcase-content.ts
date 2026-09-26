import type { SolutionItem } from "@/storefront/content/types";

/** Home Solutions — 5 tabs aligned to mockup (by-need stays on /solutions hub). */
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
  /** Icon well tint — matches mockup colored chips */
  tone?: "sky" | "violet" | "cyan" | "amber" | "emerald" | "teal";
};

export type SolutionShowcasePanel = {
  tabLabel: string;
  panelKicker: string;
  headline: string;
  lead: string;
  checks: string[];
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
    lead: "Bộ giải pháp Microsoft 365, email doanh nghiệp, cộng tác và lưu trữ giúp đội ngũ làm việc liền mạch, an toàn và hiệu quả.",
    checks: [
      "Microsoft 365 / Office chính hãng",
      "Email doanh nghiệp bảo mật cao",
      "Teams và cộng tác trực tuyến",
      "OneDrive và lưu trữ thông minh",
    ],
    chips: [
      {
        id: "mail",
        label: "Email doanh nghiệp",
        slot: "tl",
        tone: "sky",
      },
      {
        id: "cloud",
        label: "Lưu trữ cloud",
        slot: "tr",
        tone: "violet",
      },
      {
        id: "m365",
        label: "Microsoft 365",
        slot: "br",
        tone: "teal",
      },
      {
        id: "cal",
        label: "Lịch làm việc",
        slot: "bl",
        tone: "amber",
      },
    ],
  },
  cloud: {
    tabLabel: "Cloud & Hạ tầng",
    panelKicker: "Cloud & Hạ tầng",
    headline: "Chọn đúng gói cloud trên catalog",
    lead: "Gói cloud / hạ tầng đang bán trên KEYON — tư vấn chọn SKU theo nhu cầu. Không vận hành Azure/AWS thuê ngoài.",
    checks: [
      "Gói cloud / storage trên catalog",
      "Tư vấn theo quy mô & ngân sách",
      "Bàn giao license rõ ràng",
      "Không thay MSP vận hành tenant",
    ],
    chips: [
      { id: "cloud", label: "Cloud catalog", slot: "tl", tone: "sky" },
      { id: "scale", label: "Theo quy mô", slot: "tr", tone: "violet" },
      { id: "sku", label: "Tư vấn SKU", slot: "br", tone: "teal" },
      { id: "handoff", label: "Bàn giao license", slot: "bl", tone: "amber" },
    ],
  },
  security: {
    tabLabel: "Bảo mật & An toàn",
    panelKicker: "Bảo mật & An toàn",
    headline: "Bảo vệ endpoint bằng gói chính hãng",
    lead: "Antivirus / internet security trên KEYON — xem rõ loại nhận trước khi mua, hỗ trợ kích hoạt tiếng Việt.",
    checks: [
      "Endpoint / Antivirus chính hãng",
      "Loại nhận ghi rõ trên SKU",
      "Kích hoạt theo hướng dẫn",
      "Tư vấn chọn gói khi cần",
    ],
    chips: [
      { id: "shield", label: "Endpoint", slot: "tl", tone: "sky" },
      { id: "web", label: "Internet security", slot: "tr", tone: "violet" },
      { id: "key", label: "Key / tài khoản rõ", slot: "br", tone: "teal" },
      { id: "guide", label: "Hướng dẫn kích hoạt", slot: "bl", tone: "amber" },
    ],
  },
  backup: {
    tabLabel: "Backup & Khôi phục",
    panelKicker: "Backup & Khôi phục",
    headline: "License backup trên hạ tầng của bạn",
    lead: "Gói / license backup trên catalog — kích hoạt phần mềm trên hạ tầng khách hàng. KEYON không lưu bản sao dữ liệu.",
    checks: [
      "Gói backup trên cửa hàng",
      "Kích hoạt trên hạ tầng của bạn",
      "Tư vấn chọn gói khi cần",
      "Không dịch vụ DR thuê ngoài",
    ],
    chips: [
      { id: "backup", label: "Gói backup", slot: "tl", tone: "sky" },
      { id: "restore", label: "Khôi phục tại chỗ", slot: "tr", tone: "violet" },
      { id: "infra", label: "Hạ tầng của bạn", slot: "br", tone: "teal" },
      { id: "guide", label: "Hướng dẫn kích hoạt", slot: "bl", tone: "amber" },
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
      { id: "account", label: "Trong Tài khoản", slot: "tl", tone: "sky" },
      { id: "renew", label: "Nhắc gia hạn", slot: "tr", tone: "violet" },
      { id: "track", label: "Theo dõi hạn dùng", slot: "br", tone: "teal" },
      { id: "order", label: "Đơn & giao nhận", slot: "bl", tone: "amber" },
    ],
  },
};

export const HOME_SOLUTIONS_SECTION_COPY = {
  overline: "Giải pháp",
  title: "Giải pháp số cho mọi nhu cầu vận hành",
  subtitle:
    "Từ năng suất, cloud, bảo mật đến backup và quản lý bản quyền — KEYON giúp doanh nghiệp lựa chọn, triển khai và quản lý các giải pháp số phù hợp.",
  viewAllLabel: "Xem tất cả giải pháp",
  viewAllHref: "/solutions",
  primaryCta: "Tìm hiểu giải pháp",
  secondaryCta: "Xem tài liệu chi tiết",
  secondaryCtaHref: "/how-it-works",
} as const;

export function pickSolutionTabs(items: SolutionItem[]): SolutionItem[] {
  const byId = new Map(items.map((i) => [i.id, i]));
  return HOME_SOLUTION_TAB_IDS.map((id) => byId.get(id)).filter(
    (i): i is SolutionItem => Boolean(i),
  );
}
