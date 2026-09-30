import type {
  ShopCategoryId,
  ShopLicenseType,
  ShopPlatform,
  ShopProduct,
  ShopSort,
} from "./types";

export const SHOP_PAGE_SIZE = 24;

export const CATEGORY_LABELS: Record<ShopCategoryId, string> = {
  windows: "Windows & OS",
  office: "Microsoft 365 & Office",
  adobe: "Adobe",
  cloud: "Cloud & Hạ tầng",
  security: "Bảo mật",
  backup: "Backup & Storage",
  autodesk: "Autodesk",
  other: "Khác",
};

export const LICENSE_LABELS: Record<ShopLicenseType, string> = {
  retail: "Retail",
  oem: "OEM",
  volume: "Volume",
  subscription: "Subscription",
};

export const PLATFORM_LABELS: Record<ShopPlatform, string> = {
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
  android: "Android",
};

export function inferCategory(brand: string, name: string): ShopCategoryId {
  const hay = `${brand} ${name}`.toLowerCase();
  if (/autodesk|autocad|revit|3ds\s?max|maya|inventor|civil\s?3d/.test(hay))
    return "autodesk";
  if (/adobe|creative|photoshop|illustrator|premiere|acrobat|lightroom|after\s?effects/.test(hay))
    return "adobe";
  if (/kaspersky|eset|norton|mcafee|defender|security|antivirus|nod32|bitdefender|avast|avg/.test(hay))
    return "security";
  if (/acronis|backup|veeam|storage|s3|object\s?storage/.test(hay)) return "backup";
  if (/server|vmware|azure|aws|cloud|vps|hosting/.test(hay)) return "cloud";
  if (/office|365|word|excel|powerpoint|outlook|teams/.test(hay)) return "office";
  if (/windows|win\s?1[01]/.test(hay)) return "windows";
  return "other";
}

/** Map home CMS iconKey → shop category query. */
export function shopCatFromCmsIcon(
  iconKey: string | undefined,
): ShopCategoryId | "all" | null {
  switch (iconKey) {
    case "windows":
      return "windows";
    case "office":
      return "office";
    case "adobe":
      return "adobe";
    case "cloud":
      return "cloud";
    case "backup":
      return "backup";
    case "security":
      return "security";
    case "autodesk":
      return "autodesk";
    case "other":
      return "other";
    default:
      return null;
  }
}

export function inferMark(
  category: ShopCategoryId,
  name: string,
): ShopProduct["mark"] {
  if (category === "adobe") return "adobe";
  if (category === "security") return "security";
  if (category === "cloud" && /server/i.test(name)) return "server";
  if (category === "backup") return "server";
  if (category === "office") return "office";
  if (category === "windows") return "windows";
  return "generic";
}

export function inferLicenseTypes(packageName: string, productName: string): ShopLicenseType[] {
  const hay = `${packageName} ${productName}`.toLowerCase();
  const out: ShopLicenseType[] = [];
  if (/subscription|365|cloud|month|năm|year|saas/.test(hay)) out.push("subscription");
  if (/oem/.test(hay)) out.push("oem");
  if (/volume|vl|mak|kms/.test(hay)) out.push("volume");
  if (/retail|fpp|esd|license retail/.test(hay) || out.length === 0) out.push("retail");
  return Array.from(new Set(out));
}

export function inferPlatforms(brand: string, name: string, packageName: string): ShopPlatform[] {
  const hay = `${brand} ${name} ${packageName}`.toLowerCase();
  const out: ShopPlatform[] = [];
  if (/macos|mac os|os x|iphone|ipad/.test(hay)) out.push("macos");
  if (/android/.test(hay)) out.push("android");
  if (/linux/.test(hay)) out.push("linux");
  if (/windows|win\s|pc\b/.test(hay) || out.length === 0) out.push("windows");
  return Array.from(new Set(out));
}

/** Demo compare-at when missing — deterministic from price. */
export function inferCompareAt(priceVnd: number, index: number): number | undefined {
  if (priceVnd <= 0) return undefined;
  const bumps = [0, 0.12, 0.15, 0.18, 0.1, 0];
  const bump = bumps[index % bumps.length]!;
  if (bump <= 0) return undefined;
  return Math.round(priceVnd * (1 + bump) / 1000) * 1000;
}

export function discountPercent(price: number, compareAt?: number): number | undefined {
  if (!compareAt || compareAt <= price) return undefined;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

/** Catalog money: 1.999.000 ₫ — grouping does not depend on server locale. */
export function formatVnd(n: number): string {
  const sign = n < 0 ? "-" : "";
  const digits = Math.abs(Math.round(n)).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}${grouped} ₫`;
}

const CARD_CHANNEL: Record<string, string> = {
  RETAIL: "Retail",
  OEM: "OEM",
  VOLUME: "Volume",
  PER_USER: "Personal",
  PER_DEVICE: "Per Device",
  EDUCATION: "Education",
  ENTERPRISE: "Enterprise",
};

const CARD_TERM: Record<string, string> = {
  "1_MONTH": "1 tháng",
  "3_MONTHS": "3 tháng",
  "6_MONTHS": "6 tháng",
  "1_YEAR": "1 năm",
  "2_YEARS": "2 năm",
  "3_YEARS": "3 năm",
};

function sameText(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function isDurationToken(value: string) {
  return /^\d+\s*(year|years|năm|month|months|tháng)$/i.test(value.trim());
}

function looksLikeSeats(value: string) {
  return /^\d+\s*(pc|device|devices|user|users|thiết bị|người)/i.test(value.trim());
}

/** One short license line for a catalog card. Never the full variant title. */
export function shopPackageLabel(input: {
  productName: string;
  variantName: string;
  licenseChannel?: string | null;
  licenseTerm?: string | null;
  seatsLabel?: string | null;
}): string {
  const productName = input.productName.trim();
  let name = input.variantName.replace(/\s*·\s*.+$/u, "").trim();
  name = name.replace(
    /^(?:vps linux|vps windows|dedicated server|cloud server)\s+/i,
    "",
  );
  const pieces = name
    .split(/\s+[–—]\s+|\s+-\s+/u)
    .map((part) => part.trim())
    .filter(Boolean);
  const body = (pieces.length > 1 ? pieces : [name]).filter((part) => {
    if (!part) return false;
    if (productName && sameText(part, productName)) return false;
    if (isDurationToken(part)) return false;
    return true;
  });
  const seats = input.seatsLabel?.trim() ?? "";
  let plan =
    body.find((part) => !looksLikeSeats(part) && !sameText(part, seats)) ??
    "";
  if (plan.length > 22) plan = "";
  if (!plan) {
    const channel = input.licenseChannel
      ? CARD_CHANNEL[input.licenseChannel] ?? ""
      : "";
    plan = channel;
  }
  const term = input.licenseTerm ? CARD_TERM[input.licenseTerm] ?? "" : "";
  const parts = [plan, seats, term].filter((part, index, all) => {
    if (!part) return false;
    return all.findIndex((item) => item && sameText(item, part)) === index;
  });
  const line = parts.join(" · ");
  return line || plan || "Theo gói";
}

export function sortProducts(items: ShopProduct[], sort: ShopSort): ShopProduct[] {
  const next = [...items];
  switch (sort) {
    case "price_asc":
      return next.sort((a, b) => a.priceVnd - b.priceVnd);
    case "price_desc":
      return next.sort((a, b) => b.priceVnd - a.priceVnd);
    case "name":
      return next.sort((a, b) => a.productName.localeCompare(b.productName, "vi"));
    case "newest":
    default:
      return next.sort((a, b) => (b.sortIndex ?? 0) - (a.sortIndex ?? 0));
  }
}

export function filterProducts(
  items: ShopProduct[],
  opts: {
    category?: ShopCategoryId | "all";
    licenses: ShopLicenseType[];
    platforms: ShopPlatform[];
    priceMin: number;
    priceMax: number;
    query?: string;
  },
): ShopProduct[] {
  const q = opts.query?.trim().toLowerCase();
  return items.filter((p) => {
    if (opts.category && opts.category !== "all" && p.categoryId !== opts.category) return false;
    if (opts.licenses.length && !opts.licenses.some((l) => p.licenseTypes.includes(l))) return false;
    if (opts.platforms.length && !opts.platforms.some((x) => p.platforms.includes(x))) return false;
    if (p.priceVnd < opts.priceMin || p.priceVnd > opts.priceMax) return false;
    if (q) {
      const hay = `${p.productName} ${p.brandName} ${p.packageName}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function countByCategory(items: ShopProduct[]): Record<ShopCategoryId, number> {
  const counts: Record<ShopCategoryId, number> = {
    windows: 0,
    office: 0,
    adobe: 0,
    cloud: 0,
    security: 0,
    backup: 0,
    autodesk: 0,
    other: 0,
  };
  for (const p of items) counts[p.categoryId] += 1;
  return counts;
}
