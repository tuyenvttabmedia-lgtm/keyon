import type { PaymentProvider, CreatePaymentInput, CreatePaymentResult } from "../types";
import { markPaymentSucceededByRef } from "../money";
import { enqueuePaymentSucceeded } from "@/server/queue";
import { resolvePayment } from "../config";

export const stubPaymentProvider: PaymentProvider = {
  name: "stub",
  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const { sepay } = await resolvePayment();
    const account = sepay.accountNumber;
    const bankBin = sepay.bankBin;
    const template = sepay.qrTemplate || "compact2";
    const qrImageUrl =
      account && bankBin
        ? `https://img.vietqr.io/image/${bankBin}-${account}-${template}.png?amount=${input.amountVnd}&addInfo=${encodeURIComponent(input.paymentReference)}`
        : undefined;
    return {
      provider: "stub",
      qrImageUrl,
      instructions: `STUB: giả lập ${input.amountVnd.toLocaleString("vi-VN")}đ — ref ${input.paymentReference}. Bấm «Tôi đã chuyển khoản» để giả lập webhook (dev).`,
      raw: { accountNumber: account, bankBin, content: input.paymentReference },
    };
  },
  async confirmDev(paymentReference: string) {
    await enqueuePaymentSucceeded(paymentReference, { source: "stub-confirm" });
    return markPaymentSucceededByRef(paymentReference, { source: "stub-confirm" });
  },
};
