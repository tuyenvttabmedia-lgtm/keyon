/**
 * Outer ops helpers for DISTRIBUTOR + MANUAL_OPS (FPT / TechData).
 * Does not change Fulfillment / Pool / Order schema.
 */

export type PoMailDraftInput = {
  orderCode: string;
  productName: string;
  variantName: string;
  variantSku: string;
  quantity: number;
  deliverableType: string;
  supplierName: string | null;
  supplierEmail: string | null;
  customerEmail: string;
  poNumber?: string | null;
};

export function isManualOpsDistributor(input: {
  supplierType: string | null | undefined;
  integrationMode: string | null | undefined;
}): boolean {
  return (
    input.supplierType === "DISTRIBUTOR" &&
    input.integrationMode === "MANUAL_OPS"
  );
}

export function buildPoMailSubject(input: PoMailDraftInput): string {
  const po = input.poNumber?.trim();
  const prefix = po ? `[PO ${po}]` : "[KEYON PO]";
  return `${prefix} ${input.orderCode} · ${input.variantSku} × ${input.quantity}`;
}

export function buildPoMailBody(input: PoMailDraftInput): string {
  const lines = [
    `Kính gửi ${input.supplierName ?? "đối tác"},`,
    "",
    "KEYON gửi yêu cầu cung ứng (PO/email):",
    "",
    `- Mã đơn KEYON: ${input.orderCode}`,
    `- SKU: ${input.variantSku}`,
    `- Sản phẩm: ${input.productName} — ${input.variantName}`,
    `- Số lượng: ${input.quantity}`,
    `- Loại bàn giao: ${input.deliverableType}`,
    input.poNumber?.trim() ? `- Số PO KEYON: ${input.poNumber.trim()}` : null,
    `- Email khách (tham chiếu nội bộ): ${input.customerEmail}`,
    "",
    "Vui lòng phản hồi key / tài khoản / xác nhận kích hoạt theo quy trình đã thỏa thuận.",
    "",
    "Trân trọng,",
    "KEYON Ops",
  ];
  return lines.filter((l) => l !== null).join("\n");
}

/** mailto: for staff — opens local mail client. Empty to if no supplier email. */
export function buildPoMailtoHref(input: PoMailDraftInput): string {
  const to = (input.supplierEmail ?? "").trim();
  const subject = encodeURIComponent(buildPoMailSubject(input));
  const body = encodeURIComponent(buildPoMailBody(input));
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

export function distributorOpsHint(input: {
  strategy: string;
  status: string;
  supplierType: string | null;
  integrationMode: string | null;
}): string | null {
  if (!isManualOpsDistributor(input)) return null;
  if (input.strategy === "INSTANT" && input.status === "WAITING_STOCK") {
    return "Đệm kho Instant: gửi PO/email NCC → nhận key → Admin Stock Import → Retry Instant.";
  }
  if (input.strategy === "MANUAL") {
    return "Theo đơn Manual: gửi PO/email NCC → nhận deliverable → Complete trên Inbox. Ghi số PO bằng HĐ/PO nếu cần.";
  }
  return "NCC phân phối xử lý thủ công (PO/email) — không gọi API.";
}
