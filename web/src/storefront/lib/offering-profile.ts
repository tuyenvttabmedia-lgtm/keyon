/**
 * Catalog offering profile — controls the admin wizard and PDP labels.
 * Does not change Order, Payment, or License Pool.
 * Null / unknown stored values are treated as SOFTWARE so existing products stay license products.
 */

export const OFFERING_PROFILES = [
  "SOFTWARE",
  "INFRASTRUCTURE",
  "SERVICE",
  "OTHER",
] as const;

export type OfferingProfile = (typeof OFFERING_PROFILES)[number];

export const OFFERING_PROFILE_LABELS: Record<OfferingProfile, string> = {
  SOFTWARE: "Bản quyền phần mềm",
  INFRASTRUCTURE: "Hạ tầng thuê",
  SERVICE: "Dịch vụ chuyên nghiệp",
  OTHER: "Khác",
};

export const OFFERING_PROFILE_HINTS: Record<OfferingProfile, string> = {
  SOFTWARE: "Key, tài khoản, số ghế và cách kích hoạt. Có thể giao ngay từ kho.",
  INFRASTRUCTURE:
    "Cloud server, hosting, dung lượng backup. Cấu hình gói, không nhập kho key.",
  SERVICE: "Triển khai, bàn giao, tư vấn có giá. Giao thủ công bằng hồ sơ bàn giao.",
  OTHER: "Tự chọn cách giao và thứ khách nhận.",
};

export type LicenseModelCode = "PERPETUAL" | "SUBSCRIPTION" | "MAINTENANCE";
export type FulfillmentCode =
  | "MANUAL"
  | "INSTANT"
  | "SEMI_AUTOMATED"
  | "MANAGED_SUBSCRIPTION";
export type DeliverableCode =
  | "KEY"
  | "ACCOUNT"
  | "SUBSCRIPTION"
  | "DIGITAL_FILE"
  | "EXTERNAL_PORTAL";
export type SalesMotionCode = "SELF_SERVE" | "QUOTE_REQUIRED";

const ALL_FULFILLMENT: FulfillmentCode[] = [
  "MANUAL",
  "INSTANT",
  "SEMI_AUTOMATED",
  "MANAGED_SUBSCRIPTION",
];

const ALL_DELIVERABLE: DeliverableCode[] = [
  "KEY",
  "ACCOUNT",
  "SUBSCRIPTION",
  "DIGITAL_FILE",
  "EXTERNAL_PORTAL",
];

export function parseOfferingProfile(
  value: string | null | undefined,
): OfferingProfile {
  if (value && (OFFERING_PROFILES as readonly string[]).includes(value)) {
    return value as OfferingProfile;
  }
  return "SOFTWARE";
}

export function showsLicenseMerchandising(profile: OfferingProfile): boolean {
  return profile === "SOFTWARE";
}

export function fulfillmentOptionsFor(
  profile: OfferingProfile,
): FulfillmentCode[] {
  if (profile === "SERVICE") return ["MANUAL"];
  if (profile === "INFRASTRUCTURE") return ["MANUAL", "MANAGED_SUBSCRIPTION"];
  return ALL_FULFILLMENT;
}

export function deliverableOptionsFor(
  profile: OfferingProfile,
): DeliverableCode[] {
  if (profile === "SERVICE") return ["DIGITAL_FILE"];
  if (profile === "INFRASTRUCTURE") {
    return ["ACCOUNT", "SUBSCRIPTION", "EXTERNAL_PORTAL"];
  }
  return ALL_DELIVERABLE;
}

export function commerceDefaults(profile: OfferingProfile): {
  licenseModel: LicenseModelCode;
  fulfillmentStrategy: FulfillmentCode;
  deliverableType: DeliverableCode;
  salesMotion: SalesMotionCode;
} {
  if (profile === "INFRASTRUCTURE") {
    return {
      licenseModel: "SUBSCRIPTION",
      fulfillmentStrategy: "MANUAL",
      deliverableType: "ACCOUNT",
      salesMotion: "SELF_SERVE",
    };
  }
  if (profile === "SERVICE") {
    return {
      licenseModel: "PERPETUAL",
      fulfillmentStrategy: "MANUAL",
      deliverableType: "DIGITAL_FILE",
      salesMotion: "SELF_SERVE",
    };
  }
  if (profile === "OTHER") {
    return {
      licenseModel: "PERPETUAL",
      fulfillmentStrategy: "MANUAL",
      deliverableType: "ACCOUNT",
      salesMotion: "SELF_SERVE",
    };
  }
  return {
    licenseModel: "PERPETUAL",
    fulfillmentStrategy: "MANUAL",
    deliverableType: "KEY",
    salesMotion: "SELF_SERVE",
  };
}

export function variantNameForProfile(
  current: string,
  profile: OfferingProfile,
): string {
  const trimmed = current.trim();
  if (
    !trimmed ||
    trimmed === "License Retail" ||
    trimmed === "Gói chuẩn"
  ) {
    return profile === "SOFTWARE" ? "License Retail" : "Gói chuẩn";
  }
  return current;
}

export const INFRA_SPEC_TEMPLATES = {
  cloud: [
    "vCPU|2",
    "RAM|4 GB",
    "SSD|80 GB",
    "Băng thông|Không giới hạn",
    "Khu vực|Việt Nam",
  ].join("\n"),
  hosting: [
    "Dung lượng|10 GB",
    "Băng thông|Không giới hạn",
    "Tên miền|1 tên miền",
    "Bảng điều khiển|Theo gói",
  ].join("\n"),
  backup: ["Dung lượng|1 TB", "Retention|30 ngày", "Workload|Máy chủ"].join(
    "\n",
  ),
} as const;

export function guideAdminTitle(profile: OfferingProfile): string {
  if (profile === "SOFTWARE") return "Hướng dẫn kích hoạt (tab PDP)";
  if (profile === "SERVICE") return "Phạm vi bàn giao (tab PDP)";
  if (profile === "INFRASTRUCTURE") return "Quy trình triển khai";
  return "Hướng dẫn sử dụng (tab PDP)";
}

export function guideAdminHint(profile: OfferingProfile): string {
  if (profile === "SOFTWARE") {
    return "Hiển thị ở tab «Hướng dẫn kích hoạt» trên trang sản phẩm.";
  }
  if (profile === "SERVICE") {
    return "Hiển thị ở tab «Phạm vi bàn giao» trên trang sản phẩm.";
  }
  if (profile === "INFRASTRUCTURE") {
    return "Các tiêu đề cấp 2 hoặc 3 thành các bước trong mục Quy trình triển khai trên trang sản phẩm.";
  }
  return "Hiển thị ở tab «Hướng dẫn sử dụng» trên trang sản phẩm.";
}

export function guidePdpLabel(profile: OfferingProfile): string {
  if (profile === "SOFTWARE") return "Hướng dẫn kích hoạt";
  if (profile === "SERVICE") return "Phạm vi bàn giao";
  return "Hướng dẫn sử dụng";
}

export function guidePdpHeading(profile: OfferingProfile): string {
  if (profile === "SOFTWARE") return "Hướng dẫn sử dụng và kích hoạt";
  if (profile === "SERVICE") return "Phạm vi bàn giao";
  return "Hướng dẫn sử dụng";
}

export function guideEmptyCopy(profile: OfferingProfile): string {
  if (profile === "SOFTWARE") {
    return "Chưa có hướng dẫn kích hoạt cho sản phẩm này. Liên hệ KEYON để được hỗ trợ theo gói đã mua.";
  }
  if (profile === "SERVICE") {
    return "Chưa có mô tả phạm vi bàn giao. Liên hệ KEYON để xác nhận hạng mục theo gói đã mua.";
  }
  if (profile === "INFRASTRUCTURE") {
    return "Chưa có hướng dẫn sử dụng cho gói này. Liên hệ KEYON khi cần cấp phát hoặc đổi cấu hình.";
  }
  return "Chưa có hướng dẫn cho sản phẩm này. Liên hệ KEYON để được hỗ trợ theo gói đã mua.";
}

export function systemSpecsTitle(profile: OfferingProfile): string {
  if (profile === "INFRASTRUCTURE") return "Cấu hình gói";
  if (profile === "SOFTWARE") return "Yêu cầu hệ thống";
  return "Thông số bổ sung";
}

export function licenseFactsTitle(profile: OfferingProfile): string {
  if (profile === "SOFTWARE") return "Thông tin bản quyền";
  return "Thông tin gói";
}

export function catalogFeatureFallback(
  profile: OfferingProfile,
  name: string,
): string {
  if (profile === "INFRASTRUCTURE") {
    return `${name} — gói thuê trên KEYON. Thanh toán rõ, nhận trong Tài sản sau khi KEYON cấp phát.`;
  }
  if (profile === "SERVICE") {
    return `${name} — dịch vụ bàn giao trên KEYON. Thanh toán rõ, nhận hồ sơ trong Tài sản.`;
  }
  if (profile === "OTHER") {
    return `${name} — mua trên KEYON. Thanh toán rõ, nhận trong Tài sản.`;
  }
  return `${name} — bản quyền số chính hãng, giao qua Tài khoản KEYON sau thanh toán.`;
}

export function catalogDescriptionFallback(
  profile: OfferingProfile,
  name: string,
): string {
  if (profile === "SERVICE") {
    return `${name} — dịch vụ bàn giao trên KEYON. Thanh toán rõ, nhận hồ sơ trong Tài sản.`;
  }
  if (profile === "INFRASTRUCTURE") {
    return `${name} — gói thuê trên KEYON. Thanh toán rõ, nhận trong Tài sản.`;
  }
  if (profile === "OTHER") {
    return `${name} — mua trên KEYON. Thanh toán rõ, nhận trong Tài sản.`;
  }
  return `${name} — bản quyền số chính hãng. Thanh toán rõ, nhận trong Tài khoản KEYON.`;
}

export function packageStepHint(profile: OfferingProfile): string {
  if (profile === "INFRASTRUCTURE") {
    return "Mỗi cấu hình và mỗi chu kỳ thanh toán là một biến thể. Cùng CPU, RAM và ổ thì trang gom một thẻ gói và một hàng chu kỳ. Giá của chu kỳ dài là tổng tiền khách trả, không phải giá theo tháng.";
  }
  if (profile === "SERVICE") {
    return "Mỗi gói là một phạm vi bàn giao. Thêm gói khác trên trang sửa.";
  }
  if (profile === "OTHER") {
    return "Sau khi tạo có thể thêm gói trên trang sửa.";
  }
  return "Sau khi tạo có thể thêm Home / Pro / OEM trên trang sửa.";
}

export const INFRA_PLAN_FIT_HINT =
  "Hiện trên thẻ gói, sau «Phù hợp với». Cũng dùng trong đoạn tóm tắt ở mục Mô tả sản phẩm. Để trống thì trang suy theo tên gói.";

export const INFRA_PLAN_SUMMARY_HINT =
  "Hiện dưới tên gói ở cột mua. Mỗi chu kỳ của cùng một cấu hình nên dùng cùng một đoạn.";

export const INFRA_PLAN_SPECS_HINT =
  "Mỗi dòng Nhãn|Giá trị. vCPU, RAM, dung lượng lưu trữ và băng thông thành bốn thẻ. Không ghi NVMe nếu nhà cung cấp chưa xác nhận; có thể ghi SSD / NVMe. Các dòng còn lại vào bảng Thông tin dịch vụ. Các chu kỳ của cùng một cấu hình phải giống nhau ở các dòng này.";

export const INFRA_PRICE_HINT =
  "Tổng tiền khách trả cho đúng chu kỳ của gói này. Gói 6 tháng, 12 tháng, 2 năm hoặc 3 năm nhập tổng cả chu kỳ, không nhập giá theo tháng.";

export const INFRA_TERM_HINT =
  "Mỗi chu kỳ là một biến thể riêng: cùng cấu hình, khác tổng tiền. Trang gom các biến thể đó thành một thẻ gói và một hàng chọn chu kỳ.";

export const INFRA_SLA_HINT =
  "Hiện ở dòng Hỗ trợ trong Thông tin dịch vụ khi cấu hình gói chưa có dòng Hỗ trợ.";

export const INFRA_REGION_HINT =
  "Chỉ dùng khi cấu hình gói chưa có dòng Khu vực. Nếu đã có dòng Khu vực|… thì trang hiển thị dòng đó.";

export const INFRA_FEATURES_HINT =
  "Mỗi dòng Tiêu đề|Mô tả. Hiện thành các thẻ «Bạn nhận được gì». Cùng một bộ cho mọi gói. Để trống thì không hiện mục này.";

export const INFRA_GALLERY_HINT =
  "Hiện ở mục Hình ảnh trên trang chi tiết. Ảnh đầu là ảnh chính; thêm ảnh thì có hàng thumbnail. Có thể bỏ trống khi xuất bản.";
