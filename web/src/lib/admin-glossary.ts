import type { FulfillmentJobStatus } from "@prisma/client";

/** Vietnamese ops labels — avoid raw enum jargon in Admin UI. */
export const JOB_STATUS_VI: Record<FulfillmentJobStatus, string> = {
  QUEUED: "Trong hàng đợi",
  RESERVED: "Đã giữ kho",
  PROCESSING: "Đang xử lý",
  WAITING_HUMAN: "Chờ nhân viên",
  WAITING_STOCK: "Chờ nhập kho",
  SUCCEEDED: "Thành công",
  FAILED: "Thất bại",
  RELEASED: "Đã nhả giữ",
};

export function jobStatusVi(status: string): string {
  return JOB_STATUS_VI[status as FulfillmentJobStatus] ?? status;
}

/** Short glossary for dashboard / stock copy. */
export const ADMIN_TERMS_VI = {
  worker: "Tiến trình giao hàng (Worker)",
  readModel: "Tồn kho License (bản tổng hợp)",
  inbox: "Hàng chờ giao thủ công",
} as const;
