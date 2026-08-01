import type { PaymentProvider, CreatePaymentInput, CreatePaymentResult } from "./types";
import { stubPaymentProvider } from "./providers/stub";
import { sepayPaymentProvider } from "./providers/sepay";
import { payosPaymentProvider } from "./providers/payos";
import { megapayPaymentProvider } from "./providers/megapay";
import { childLogger } from "@/lib/logger";
import { resolvePayment } from "./config";

const log = childLogger("payment");

const providers: Record<string, PaymentProvider> = {
  stub: stubPaymentProvider,
  sepay: sepayPaymentProvider,
  payos: payosPaymentProvider,
  megapay: megapayPaymentProvider,
};

let cachedName: string | null = null;
let cachedFp: string | null = null;

export function resetPaymentCache(): void {
  cachedName = null;
  cachedFp = null;
}

export async function getPaymentProvider(): Promise<PaymentProvider> {
  const resolved = await resolvePayment();
  const fp = `${resolved.provider}:${resolved.providerSource}`;
  if (cachedName && cachedFp === fp) {
    return providers[cachedName] ?? stubPaymentProvider;
  }
  const provider = providers[resolved.provider];
  if (!provider) {
    log.warn({ name: resolved.provider }, "unknown payment provider — fallback stub");
    cachedName = "stub";
    cachedFp = fp;
    return stubPaymentProvider;
  }
  cachedName = provider.name;
  cachedFp = fp;
  return provider;
}

/** Facade — Checkout chỉ gọi PaymentService.* */
export const PaymentService = {
  async providerName(): Promise<string> {
    return (await getPaymentProvider()).name;
  },
  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const provider = await getPaymentProvider();
    try {
      log.info(
        { provider: provider.name, orderId: input.orderId, ref: input.paymentReference },
        "createPayment",
      );
    } catch {
      /* never block payment on logger / pretty-worker failures */
    }
    return provider.createPayment(input);
  },
  async confirmDev(paymentReference: string) {
    const provider = await getPaymentProvider();
    if (!provider.confirmDev) {
      throw new Error(`Provider ${provider.name} does not support confirmDev`);
    }
    return provider.confirmDev(paymentReference);
  },
  async verifyWebhook(
    input: import("./types").VerifyWebhookInput,
  ): Promise<import("./types").VerifyWebhookResult> {
    const provider = await getPaymentProvider();
    if (!provider.verifyWebhook) {
      throw new Error(`Provider ${provider.name} does not support verifyWebhook`);
    }
    return provider.verifyWebhook(input);
  },
};
