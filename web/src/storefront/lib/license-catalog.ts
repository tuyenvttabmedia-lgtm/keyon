/**
 * Catalog license merchandising (Retail/OEM/…) — distinct from Prisma LicenseModel
 * (PERPETUAL/SUBSCRIPTION/MAINTENANCE) used by fulfillment/ops.
 */

export const LICENSE_CHANNELS = [
  "RETAIL",
  "OEM",
  "VOLUME",
  "SUBSCRIPTION",
  "PER_USER",
  "PER_DEVICE",
  "ENTERPRISE",
  "EDUCATION",
  "OTHER",
] as const;
export type LicenseChannel = (typeof LICENSE_CHANNELS)[number];

export const LICENSE_CHANNEL_LABELS: Record<LicenseChannel, string> = {
  RETAIL: "Retail",
  OEM: "OEM",
  VOLUME: "Volume",
  SUBSCRIPTION: "Subscription",
  PER_USER: "Per User",
  PER_DEVICE: "Per Device",
  ENTERPRISE: "Enterprise",
  EDUCATION: "Education",
  OTHER: "Khác",
};

export const LICENSE_TERMS = [
  "PERPETUAL",
  "1_MONTH",
  "3_MONTHS",
  "6_MONTHS",
  "1_YEAR",
  "2_YEARS",
  "3_YEARS",
  "CUSTOM",
] as const;
export type LicenseTermCode = (typeof LICENSE_TERMS)[number];

export const LICENSE_TERM_LABELS: Record<LicenseTermCode, string> = {
  PERPETUAL: "Vĩnh viễn (Perpetual)",
  "1_MONTH": "1 tháng",
  "3_MONTHS": "3 tháng",
  "6_MONTHS": "6 tháng",
  "1_YEAR": "1 năm",
  "2_YEARS": "2 năm",
  "3_YEARS": "3 năm",
  CUSTOM: "Tuỳ chỉnh",
};

export const PRODUCT_PLATFORMS = [
  "windows",
  "macos",
  "linux",
  "android",
  "ios",
  "web",
  "cross_platform",
  "other",
] as const;
export type ProductPlatform = (typeof PRODUCT_PLATFORMS)[number];

export const PRODUCT_PLATFORM_LABELS: Record<ProductPlatform, string> = {
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
  android: "Android",
  ios: "iOS",
  web: "Web",
  cross_platform: "Cross-platform",
  other: "Khác",
};

export const ACTIVATION_METHODS = [
  "PRODUCT_KEY",
  "DIGITAL_LICENSE",
  "ACCOUNT",
  "LICENSE_FILE",
  "SUBSCRIPTION",
  "MANUAL",
  "API",
  "OTHER",
] as const;
export type ActivationMethod = (typeof ACTIVATION_METHODS)[number];

export const ACTIVATION_METHOD_LABELS: Record<ActivationMethod, string> = {
  PRODUCT_KEY: "Product Key",
  DIGITAL_LICENSE: "Digital License",
  ACCOUNT: "Kích hoạt tài khoản",
  LICENSE_FILE: "License file",
  SUBSCRIPTION: "Subscription",
  MANUAL: "Kích hoạt thủ công",
  API: "API Activation",
  OTHER: "Khác",
};

export const LICENSE_REGIONS = [
  "GLOBAL",
  "VN",
  "APAC",
  "EU",
  "US",
  "OTHER",
] as const;
export type LicenseRegion = (typeof LICENSE_REGIONS)[number];

export const LICENSE_REGION_LABELS: Record<LicenseRegion, string> = {
  GLOBAL: "Toàn cầu (Global)",
  VN: "Việt Nam",
  APAC: "Asia Pacific",
  EU: "EU",
  US: "US",
  OTHER: "Khác",
};

export const PRODUCT_LANGUAGES = [
  "vi",
  "en",
  "multilingual",
  "other",
] as const;
export type ProductLanguage = (typeof PRODUCT_LANGUAGES)[number];

export const PRODUCT_LANGUAGE_LABELS: Record<ProductLanguage, string> = {
  vi: "Tiếng Việt",
  en: "English",
  multilingual: "Đa ngôn ngữ",
  other: "Khác",
};

export type SpecGroup = "general" | "system";

export type ProductSpecRowV2 = {
  label: string;
  value: string;
  group?: SpecGroup;
};

export function parsePlatforms(raw: unknown): ProductPlatform[] {
  if (!Array.isArray(raw)) return [];
  const allowed = new Set<string>(PRODUCT_PLATFORMS);
  return raw
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is ProductPlatform => allowed.has(s));
}

export function parseSeoKeywords(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw
      .filter((x): x is string => typeof x === "string")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function optionalEnum<T extends string>(
  value: string | null | undefined,
  allowed: readonly T[],
): T | null {
  const v = (value ?? "").trim();
  if (!v) return null;
  return (allowed as readonly string[]).includes(v) ? (v as T) : null;
}

/** Resolve PDP license panel: variant wins over product defaults. */
export function resolveLicensePresentation(input: {
  product: {
    licenseChannelDefault?: string | null;
    licenseTermDefault?: string | null;
    seatsDefault?: string | null;
    activationMethodDefault?: string | null;
    platforms?: unknown;
    language?: string | null;
    transferPolicy?: string | null;
    upgradePolicy?: string | null;
    accountRequired?: string | null;
  };
  variant: {
    licenseChannel?: string | null;
    licenseTerm?: string | null;
    seatsLabel?: string | null;
    regionCode?: string | null;
    activationMethod?: string | null;
  };
}) {
  const channel =
    optionalEnum(input.variant.licenseChannel, LICENSE_CHANNELS) ??
    optionalEnum(input.product.licenseChannelDefault, LICENSE_CHANNELS);
  const term =
    optionalEnum(input.variant.licenseTerm, LICENSE_TERMS) ??
    optionalEnum(input.product.licenseTermDefault, LICENSE_TERMS);
  const activation =
    optionalEnum(input.variant.activationMethod, ACTIVATION_METHODS) ??
    optionalEnum(input.product.activationMethodDefault, ACTIVATION_METHODS);
  const region = optionalEnum(input.variant.regionCode, LICENSE_REGIONS);
  const seats =
    (input.variant.seatsLabel ?? "").trim() ||
    (input.product.seatsDefault ?? "").trim() ||
    null;
  const language = optionalEnum(input.product.language, PRODUCT_LANGUAGES);
  const platforms = parsePlatforms(input.product.platforms);

  return {
    channel,
    channelLabel: channel ? LICENSE_CHANNEL_LABELS[channel] : null,
    term,
    termLabel: term ? LICENSE_TERM_LABELS[term] : null,
    seats,
    region,
    regionLabel: region ? LICENSE_REGION_LABELS[region] : null,
    activation,
    activationLabel: activation ? ACTIVATION_METHOD_LABELS[activation] : null,
    platforms,
    platformLabels: platforms.map((p) => PRODUCT_PLATFORM_LABELS[p]),
    language,
    languageLabel: language ? PRODUCT_LANGUAGE_LABELS[language] : null,
    transferPolicy: (input.product.transferPolicy ?? "").trim() || null,
    upgradePolicy: (input.product.upgradePolicy ?? "").trim() || null,
    accountRequired: (input.product.accountRequired ?? "").trim() || null,
  };
}
