import type { PaymentProvider, CreatePaymentInput, CreatePaymentResult } from "../types";
import { AppError } from "@/lib/errors";

export const payosPaymentProvider: PaymentProvider = {
  name: "payos",
  async createPayment(_input: CreatePaymentInput): Promise<CreatePaymentResult> {
    throw new AppError("PayOS chưa cấu hình (Sprint sau)", 501, "PAYMENT_NOT_CONFIGURED");
  },
};
