import type { PaymentProvider, CreatePaymentInput, CreatePaymentResult } from "../types";
import { AppError } from "@/lib/errors";

export const megapayPaymentProvider: PaymentProvider = {
  name: "megapay",
  async createPayment(_input: CreatePaymentInput): Promise<CreatePaymentResult> {
    throw new AppError("MegaPay chưa cấu hình (Sprint sau)", 501, "PAYMENT_NOT_CONFIGURED");
  },
};
