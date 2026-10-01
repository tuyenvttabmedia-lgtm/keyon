import type {
  FulfillmentJobStatus,
  FulfillmentStrategy,
  LicenseModel,
} from "@prisma/client";
import {
  guidePdpLabel,
  parseOfferingProfile,
  type OfferingProfile,
} from "@/storefront/lib/offering-profile";

/** Customer-facing delivery state. Maps existing fulfillment data; no new order states. */
export type SuccessPhase = "ready" | "processing" | "preparing" | "failed";

export function successPhase(input: {
  hasDelivery: boolean;
  strategy: FulfillmentStrategy | null;
  jobStatus: FulfillmentJobStatus | null;
}): SuccessPhase {
  if (input.hasDelivery) return "ready";
  if (input.jobStatus === "FAILED") return "failed";
  if (
    input.jobStatus === "WAITING_HUMAN" ||
    input.strategy === "MANUAL" ||
    input.strategy === "MANAGED_SUBSCRIPTION"
  ) {
    return "preparing";
  }
  return "processing";
}

export function successLead(code: string, phase: SuccessPhase, paid: boolean): string {
  const order = `Đơn hàng #${code}`;
  if (!paid) {
    return `${order} chưa ghi nhận thanh toán.`;
  }
  if (phase === "ready") {
    return `${order} đã được thanh toán. License của bạn đã sẵn sàng để sử dụng.`;
  }
  if (phase === "preparing") {
    return `${order} đã được ghi nhận. Đội ngũ KEYON đang chuẩn bị license theo thông tin đơn hàng.`;
  }
  if (phase === "failed") {
    return `${order} đã được thanh toán. Việc giao license chưa hoàn tất. KEYON sẽ cập nhật trên đơn hàng.`;
  }
  return `${order} đã được thanh toán. KEYON đang xử lý license và sẽ cập nhật ngay khi sẵn sàng.`;
}

export function successStatus(phase: SuccessPhase, paid: boolean): {
  badge: string;
  detail: string;
  tone: "ready" | "wait" | "hold" | "fail";
} {
  if (!paid) {
    return {
      badge: "Chưa thanh toán",
      detail: "Hoàn tất thanh toán để KEYON bắt đầu giao thông tin kích hoạt.",
      tone: "hold",
    };
  }
  if (phase === "ready") {
    return {
      badge: "License đã sẵn sàng",
      detail: "License đã được giao vào tài khoản.",
      tone: "ready",
    };
  }
  if (phase === "preparing") {
    return {
      badge: "Đang chuẩn bị license",
      detail: "KEYON đang chuẩn bị theo thông tin đơn hàng.",
      tone: "hold",
    };
  }
  if (phase === "failed") {
    return {
      badge: "Cần xử lý thêm",
      detail: "Theo dõi đơn hàng. KEYON sẽ cập nhật khi giao lại xong.",
      tone: "fail",
    };
  }
  return {
    badge: "Đang xử lý license",
    detail: "License sẽ xuất hiện trong Tài sản khi KEYON hoàn tất xử lý.",
    tone: "wait",
  };
}

export function licenseModelLabel(model: LicenseModel | null): string {
  if (model === "SUBSCRIPTION") return "Subscription";
  if (model === "MAINTENANCE") return "Bảo trì";
  if (model === "PERPETUAL") return "Vĩnh viễn";
  return "Theo gói";
}

export function quantityLabel(quantity: number, profile: OfferingProfile): string {
  if (profile === "SOFTWARE") return `${quantity} license`;
  return `${quantity} gói`;
}

function isCheckoutChecklist(steps: string[]): boolean {
  const blob = steps.join(" ").toLowerCase();
  return /thanh toán|chọn gói/.test(blob);
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/** Prefer the product's own guide (list items or headings) over a generic script. */
export function guideStepsFromHtml(html: string | null | undefined): string[] {
  if (!html?.trim()) return [];
  const items = [...html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((match) => stripTags(match[1] ?? ""))
    .filter((text) => text.length >= 8 && text.length <= 160);
  if (items.length >= 2) return items.slice(0, 4);
  const headings = [...html.matchAll(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/gi)]
    .map((match) => stripTags(match[1] ?? ""))
    .filter((text) => text.length >= 4 && text.length <= 90);
  if (headings.length >= 2) return headings.slice(0, 4);
  return [];
}

const WINDOWS_STEPS = [
  "Mở Cài đặt Windows.",
  "Chọn Hệ thống → Kích hoạt.",
  "Chọn Thay đổi khóa sản phẩm.",
  "Nhập mã kích hoạt và xác nhận.",
];

const M365_STEPS = [
  "Đăng nhập tài khoản Microsoft.",
  "Mở trang Microsoft 365.",
  "Nhập hoặc kích hoạt license.",
  "Kiểm tra subscription trong tài khoản.",
];

const ACRONIS_STEPS = [
  "Đăng nhập tài khoản Acronis.",
  "Mở Cyber Protect Cloud.",
  "Nhập thông tin subscription đã nhận.",
  "Kiểm tra trạng thái dịch vụ.",
];

const INFRA_STEPS = [
  "Chờ KEYON cấp phát dịch vụ.",
  "Nhận thông tin truy cập trong đơn hàng.",
  "Đăng nhập theo thông tin đã nhận.",
  "Kiểm tra dịch vụ đã chạy.",
];

const SERVICE_STEPS = [
  "KEYON đối chiếu phạm vi bàn giao trên đơn.",
  "Nhận hồ sơ trong đơn hàng hoặc email.",
  "Làm theo hạng mục đã thống nhất.",
  "Liên hệ KEYON nếu cần bổ sung.",
];

const GENERIC_STEPS = [
  "Mở hướng dẫn trên trang sản phẩm.",
  "Dùng thông tin kích hoạt trong đơn hàng.",
  "Làm theo các bước của nhà phát hành.",
  "Liên hệ KEYON nếu cần đối chiếu gói đã mua.",
];

export function activationGuide(input: {
  productName: string;
  brandName: string;
  variantName: string;
  categoryKey: string | null;
  offeringProfile: string | null;
  usageGuideHtml: string | null;
}): { title: string; steps: string[] } {
  const profile = parseOfferingProfile(input.offeringProfile);
  const fromProduct = guideStepsFromHtml(input.usageGuideHtml);
  const productSteps =
    fromProduct.length >= 2 && !isCheckoutChecklist(fromProduct) ? fromProduct : [];
  if (productSteps.length >= 2) {
    return { title: guidePdpLabel(profile), steps: productSteps };
  }

  const blob = `${input.brandName} ${input.productName} ${input.variantName} ${input.categoryKey ?? ""}`.toLowerCase();
  if (/acronis/.test(blob)) {
    return { title: "Hướng dẫn bắt đầu", steps: ACRONIS_STEPS };
  }
  if (/microsoft\s*365|office\s*365|\bm365\b|\boffice\b/.test(blob)) {
    return { title: "Hướng dẫn kích hoạt", steps: M365_STEPS };
  }
  if (/\bwindows\b/.test(blob) && !/server/.test(blob)) {
    return { title: "Hướng dẫn kích hoạt", steps: WINDOWS_STEPS };
  }
  if (
    profile === "INFRASTRUCTURE" ||
    /vps|dedicated|cloud server|máy chủ/.test(blob)
  ) {
    return { title: "Thông tin dịch vụ", steps: INFRA_STEPS };
  }
  if (profile === "SERVICE") {
    return { title: "Phạm vi bàn giao", steps: SERVICE_STEPS };
  }
  return { title: "Hướng dẫn sử dụng", steps: GENERIC_STEPS };
}
