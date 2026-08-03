import { decryptPayload, encryptPayload } from "@/lib/crypto";
import {
  defaultPaymentSettings,
  readJsonFile,
  writeJsonFile,
  type PaymentSettings,
} from "@/server/cms/store";
import type { SepayPgPaymentMethod } from "./providers/sepay-pg";

export type SepayEnvironment = "sandbox" | "production";
/** Derived from environment — one active method at a time. */
export type SepayMode = "payment_gateway" | "bank_webhook";

export type ResolvedSepayConfig = {
  environment: SepayEnvironment;
  mode: SepayMode;
  /** Bank / VietQR (production) */
  accountNumber: string;
  bankBin: string;
  bankName: string;
  bankDisplayName: string;
  accountName: string;
  qrTemplate: string;
  apiKey: string;
  webhookSecret: string;
  /** PG sandbox */
  merchantId: string;
  merchantSecretKey: string;
  ipnSecretKey: string;
  paymentMethod: SepayPgPaymentMethod;
  source: "admin" | "env" | "mixed";
};

export type ResolvedPayment = {
  provider: "stub" | "sepay" | "payos" | "megapay";
  providerSource: "admin" | "env";
  sepay: ResolvedSepayConfig;
};

function decryptSecret(enc: string): string {
  if (!enc) return "";
  try {
    return decryptPayload(enc);
  } catch {
    return "";
  }
}

function pick(admin: string, env: string | undefined): string {
  const a = admin.trim();
  if (a) return a;
  return (env ?? "").trim();
}

function resolveEnvironment(
  adminEnv: string | undefined,
): SepayEnvironment {
  const fromAdmin = (adminEnv ?? "").trim().toLowerCase();
  if (fromAdmin === "sandbox" || fromAdmin === "production") {
    return fromAdmin;
  }
  const fromEnv = (process.env.SEPAY_ENVIRONMENT ?? "").trim().toLowerCase();
  if (fromEnv === "sandbox" || fromEnv === "production") {
    return fromEnv;
  }
  // Default sandbox while testing PG; production must set explicitly.
  return "sandbox";
}

function modeForEnvironment(environment: SepayEnvironment): SepayMode {
  // KEYON: sandbox = PG IPN; production = bank HMAC webhook.
  return environment === "sandbox" ? "payment_gateway" : "bank_webhook";
}

/** Field-level hybrid like CardOn: admin value if set, else ENV. */
export async function resolvePayment(): Promise<ResolvedPayment> {
  const settings = await readJsonFile("payment.json", defaultPaymentSettings);
  const envProvider = (process.env.PAYMENT_PROVIDER ?? "stub").toLowerCase();
  const valid = ["stub", "sepay", "payos", "megapay"] as const;
  const adminProvider = settings.provider;
  const useAdminProvider = valid.includes(adminProvider);

  let provider: ResolvedPayment["provider"] = "stub";
  let providerSource: "admin" | "env" = "env";

  if (useAdminProvider && adminProvider !== "stub") {
    provider = adminProvider;
    providerSource = "admin";
  } else if (valid.includes(envProvider as (typeof valid)[number])) {
    provider = envProvider as ResolvedPayment["provider"];
    providerSource = "env";
  } else if (useAdminProvider) {
    provider = adminProvider;
    providerSource = "admin";
  }

  const s = settings.sepay;
  const environment = resolveEnvironment(s.environment);
  const mode = modeForEnvironment(environment);

  const accountNumber = pick(s.accountNumber, process.env.SEPAY_ACCOUNT_NUMBER);
  const bankBin = pick(
    s.bankBin,
    process.env.SEPAY_BANK_BIN ?? process.env.SEPAY_BANK_NAME,
  );
  const bankName = pick(s.bankName, process.env.SEPAY_BANK_NAME);
  const bankDisplayName = pick(
    s.bankDisplayName,
    process.env.SEPAY_BANK_DISPLAY_NAME,
  );
  const accountName = pick(s.accountName, process.env.SEPAY_ACCOUNT_NAME);
  const qrTemplate = pick(s.qrTemplate, process.env.SEPAY_QR_TEMPLATE) || "compact2";
  const apiKey =
    decryptSecret(s.apiKeyEnc) || (process.env.SEPAY_API_KEY ?? "").trim();
  const webhookSecret =
    decryptSecret(s.webhookSecretEnc) ||
    (process.env.SEPAY_WEBHOOK_SECRET ?? process.env.SEPAY_HMAC_SECRET ?? "").trim();

  const merchantId = pick(
    s.merchantId ?? "",
    process.env.SEPAY_PG_MERCHANT_ID ??
      process.env.SEPAY_MERCHANT_ID ??
      process.env.SEPAY_MERCHANT_CODE,
  );
  const merchantSecretKey =
    decryptSecret(s.merchantSecretEnc ?? "") ||
    (process.env.SEPAY_PG_SECRET_KEY ?? process.env.SEPAY_MERCHANT_SECRET_KEY ?? "").trim();
  const ipnSecretKey =
    decryptSecret(s.ipnSecretEnc ?? "") ||
    (process.env.SEPAY_PG_IPN_SECRET ?? process.env.SEPAY_IPN_SECRET_KEY ?? "").trim() ||
    merchantSecretKey;

  const paymentMethodRaw = (
    s.paymentMethod ||
    process.env.SEPAY_PG_PAYMENT_METHOD ||
    "BANK_TRANSFER"
  ).trim();
  const paymentMethod: SepayPgPaymentMethod =
    paymentMethodRaw === "NAPAS_BANK_TRANSFER"
      ? "NAPAS_BANK_TRANSFER"
      : "BANK_TRANSFER";

  const fromAdmin =
    Boolean(s.accountNumber.trim()) ||
    Boolean(s.bankBin.trim()) ||
    Boolean(s.apiKeyEnc) ||
    Boolean(s.webhookSecretEnc) ||
    Boolean(s.merchantId?.trim()) ||
    Boolean(s.merchantSecretEnc) ||
    Boolean(s.ipnSecretEnc);
  const fromEnv =
    Boolean(process.env.SEPAY_ACCOUNT_NUMBER) ||
    Boolean(process.env.SEPAY_API_KEY) ||
    Boolean(process.env.SEPAY_WEBHOOK_SECRET) ||
    Boolean(process.env.SEPAY_PG_MERCHANT_ID) ||
    Boolean(process.env.SEPAY_PG_SECRET_KEY) ||
    Boolean(process.env.SEPAY_MERCHANT_CODE);

  let source: ResolvedSepayConfig["source"] = "env";
  if (fromAdmin && fromEnv) source = "mixed";
  else if (fromAdmin) source = "admin";

  return {
    provider,
    providerSource,
    sepay: {
      environment,
      mode,
      accountNumber,
      bankBin,
      bankName,
      bankDisplayName: bankDisplayName || "Ngân hàng",
      accountName: accountName || "KEYON",
      qrTemplate,
      apiKey,
      webhookSecret,
      merchantId,
      merchantSecretKey,
      ipnSecretKey,
      paymentMethod,
      source,
    },
  };
}

export async function getPaymentSettings(): Promise<PaymentSettings> {
  return readJsonFile("payment.json", defaultPaymentSettings);
}

export type PaymentSettingsPublic = {
  provider: PaymentSettings["provider"];
  sepay: {
    environment: SepayEnvironment;
    mode: SepayMode;
    accountNumber: string;
    bankBin: string;
    bankName: string;
    bankDisplayName: string;
    accountName: string;
    qrTemplate: string;
    merchantId: string;
    paymentMethod: string;
    apiKeyConfigured: boolean;
    webhookSecretConfigured: boolean;
    merchantSecretConfigured: boolean;
    ipnSecretConfigured: boolean;
  };
  resolvedProvider: ResolvedPayment["provider"];
  resolvedProviderSource: "admin" | "env";
  webhookUrl: string;
};

export async function getPaymentSettingsPublic(): Promise<PaymentSettingsPublic> {
  const settings = await getPaymentSettings();
  const resolved = await resolvePayment();
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
  const environment = resolveEnvironment(settings.sepay.environment);
  return {
    provider: settings.provider,
    sepay: {
      environment,
      mode: modeForEnvironment(environment),
      accountNumber: settings.sepay.accountNumber,
      bankBin: settings.sepay.bankBin,
      bankName: settings.sepay.bankName,
      bankDisplayName: settings.sepay.bankDisplayName,
      accountName: settings.sepay.accountName,
      qrTemplate: settings.sepay.qrTemplate || "compact2",
      merchantId: settings.sepay.merchantId || resolved.sepay.merchantId,
      paymentMethod: settings.sepay.paymentMethod || "BANK_TRANSFER",
      apiKeyConfigured:
        Boolean(settings.sepay.apiKeyEnc) || Boolean(resolved.sepay.apiKey),
      webhookSecretConfigured:
        Boolean(settings.sepay.webhookSecretEnc) ||
        Boolean(resolved.sepay.webhookSecret),
      merchantSecretConfigured:
        Boolean(settings.sepay.merchantSecretEnc) ||
        Boolean(resolved.sepay.merchantSecretKey),
      ipnSecretConfigured:
        Boolean(settings.sepay.ipnSecretEnc) ||
        Boolean(
          process.env.SEPAY_PG_IPN_SECRET || process.env.SEPAY_IPN_SECRET_KEY,
        ) ||
        Boolean(resolved.sepay.ipnSecretKey),
    },
    resolvedProvider: resolved.provider,
    resolvedProviderSource: resolved.providerSource,
    webhookUrl: appUrl ? `${appUrl}/api/webhooks/sepay` : "/api/webhooks/sepay",
  };
}

export async function savePaymentSettings(input: {
  provider: PaymentSettings["provider"];
  sepay: {
    environment?: SepayEnvironment;
    accountNumber: string;
    bankBin: string;
    bankName?: string;
    bankDisplayName?: string;
    accountName?: string;
    qrTemplate?: string;
    merchantId?: string;
    paymentMethod?: string;
    apiKey?: string;
    webhookSecret?: string;
    merchantSecret?: string;
    ipnSecret?: string;
  };
}): Promise<PaymentSettings> {
  const current = await getPaymentSettings();
  let apiKeyEnc = current.sepay.apiKeyEnc;
  let webhookSecretEnc = current.sepay.webhookSecretEnc;
  let merchantSecretEnc = current.sepay.merchantSecretEnc ?? "";
  let ipnSecretEnc = current.sepay.ipnSecretEnc ?? "";

  const apiPlain = input.sepay.apiKey?.trim();
  if (apiPlain) apiKeyEnc = encryptPayload(apiPlain);
  const whPlain = input.sepay.webhookSecret?.trim();
  if (whPlain) webhookSecretEnc = encryptPayload(whPlain);
  const msPlain = input.sepay.merchantSecret?.trim();
  if (msPlain) merchantSecretEnc = encryptPayload(msPlain);
  const ipnPlain = input.sepay.ipnSecret?.trim();
  if (ipnPlain) ipnSecretEnc = encryptPayload(ipnPlain);

  const environment =
    input.sepay.environment === "production" ? "production" : "sandbox";

  const next: PaymentSettings = {
    provider: input.provider,
    sepay: {
      environment,
      accountNumber: input.sepay.accountNumber.trim(),
      bankBin: input.sepay.bankBin.trim(),
      bankName: (input.sepay.bankName ?? "").trim(),
      bankDisplayName: (input.sepay.bankDisplayName ?? "").trim(),
      accountName: (input.sepay.accountName ?? "").trim(),
      qrTemplate: (input.sepay.qrTemplate ?? "compact2").trim() || "compact2",
      merchantId: (input.sepay.merchantId ?? "").trim(),
      paymentMethod:
        input.sepay.paymentMethod === "NAPAS_BANK_TRANSFER"
          ? "NAPAS_BANK_TRANSFER"
          : "BANK_TRANSFER",
      apiKeyEnc,
      webhookSecretEnc,
      merchantSecretEnc,
      ipnSecretEnc,
    },
  };
  await writeJsonFile("payment.json", next);
  return next;
}
