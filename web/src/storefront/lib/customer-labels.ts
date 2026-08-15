import type { DeliverableType, FulfillmentStrategy } from "@prisma/client";
import type { ReceiveKind } from "@/storefront/content/types";

/** Customer UI — never expose INSTANT/MANUAL enums */
export function receiveFromDeliverable(type: DeliverableType): {
  kind: ReceiveKind;
  label: string;
} {
  switch (type) {
    case "KEY":
      return { kind: "key", label: "Key" };
    case "ACCOUNT":
      return { kind: "account", label: "Tài khoản" };
    case "EXTERNAL_PORTAL":
    case "SUBSCRIPTION":
      return { kind: "activation", label: "Kích hoạt" };
    case "DIGITAL_FILE":
      return { kind: "activation", label: "Hồ sơ bàn giao" };
    default:
      return { kind: "key", label: "Key" };
  }
}

export function deliveryPromiseLabel(strategy: FulfillmentStrategy): string {
  switch (strategy) {
    case "INSTANT":
      return "Giao ngay";
    case "SEMI_AUTOMATED":
    case "MANUAL":
      return "KEYON xử lý";
    case "MANAGED_SUBSCRIPTION":
      return "KEYON xử lý";
    default:
      return "KEYON xử lý";
  }
}
