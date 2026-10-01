import type { SolutionItem } from "@/storefront/content/types";

/** Home Solutions — 5 tabs aligned to mockup (by-need stays on /solutions hub). */
export const HOME_SOLUTION_TAB_IDS = [
  "microsoft-365-office",
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
  "microsoft-365-office": {
    tabLabel: "Microsoft & Productivity",
    panelKicker: "Microsoft & Productivity",
    headline: "Microsoft 365, Windows và Office trên một nền tảng",
    lead: "KEYON phân phối Microsoft 365, Windows và Office — license và subscription cho cá nhân, đội nhóm và doanh nghiệp.",
    checks: [
      "Microsoft 365 và Office",
      "Windows",
      "Subscription và license theo gói",
      "Gia hạn và hỗ trợ tiếng Việt",
    ],
    chips: [
      {
        id: "m365",
        label: "Microsoft 365",
        slot: "tl",
        tone: "sky",
      },
      {
        id: "windows",
        label: "Windows",
        slot: "tr",
        tone: "violet",
      },
      {
        id: "office",
        label: "Office",
        slot: "br",
        tone: "teal",
      },
      {
        id: "teams",
        label: "Teams",
        slot: "bl",
        tone: "amber",
      },
    ],
  },
  cloud: {
    tabLabel: "Cloud & Hạ tầng",
    panelKicker: "Cloud & Hạ tầng",
    headline: "VPS Linux, VPS Windows và Dedicated Server",
    lead: "Ba dòng hạ tầng đang có trên catalog KEYON. Khách tự quản trị hệ điều hành và ứng dụng.",
    checks: [
      "VPS Linux và VPS Windows",
      "Dedicated Server",
      "Cấu hình và thời hạn trên catalog",
      "Provisioning sau khi đơn được xác nhận",
    ],
    chips: [
      { id: "vps-linux", label: "VPS Linux", slot: "tl", tone: "sky" },
      { id: "vps-win", label: "VPS Windows", slot: "tr", tone: "violet" },
      { id: "dedicated", label: "Dedicated Server", slot: "br", tone: "teal" },
      { id: "term", label: "Theo thời hạn", slot: "bl", tone: "amber" },
    ],
  },
  security: {
    tabLabel: "Security",
    panelKicker: "Security",
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
    headline: "Acronis và các gói backup trên catalog",
    lead: "Backup & Storage trên KEYON, gồm Acronis Cyber Protect Cloud. Kích hoạt trên hạ tầng của bạn — KEYON không lưu bản sao dữ liệu.",
    checks: [
      "Acronis Cyber Protect Cloud",
      "Kích hoạt trên hạ tầng của bạn",
      "Tư vấn chọn gói khi cần",
      "Không dịch vụ DR thuê ngoài",
    ],
    chips: [
      { id: "acronis", label: "Acronis", slot: "tl", tone: "sky" },
      { id: "backup", label: "Backup", slot: "tr", tone: "violet" },
      { id: "restore", label: "Khôi phục", slot: "br", tone: "teal" },
      { id: "infra", label: "Hạ tầng của bạn", slot: "bl", tone: "amber" },
    ],
  },
  "license-management": {
    tabLabel: "Quản lý license",
    panelKicker: "Quản lý license",
    headline: "Theo dõi license đã mua trên Tài khoản",
    lead: "License đã mua nằm trong Tài khoản KEYON — thời hạn sử dụng, nhắc gia hạn và hỗ trợ tiếng Việt.",
    checks: [
      "License vào Tài khoản sau bàn giao",
      "Nhắc trước khi đến hạn",
      "Gia hạn qua mua thêm hoặc báo giá",
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
