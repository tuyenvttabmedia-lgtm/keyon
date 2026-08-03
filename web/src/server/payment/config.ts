import { decryptPayload, encryptPayload } from "@/lib/crypto";
import {
  defaultPaymentSettings,
  readJsonFile,
  writeJsonFile,
  type PaymentSettings,
} from "@/server/cms/store";

export type ResolvedSepayConfig = {
  accountNumber: string;
  bankBin: string;
  bankName: string;
  bankDisplayName: string;
  accountName: string;
  qrTemplate: string;
  apiKey: string;
  webhookSecret: string;
  /** SePay company / unit code (e.g. SP-TEST-…) — display / ops reference */
  merchantCode: string;
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

/** Field-level hybrid like CardOn: admin value if set, else ENV. */
export async function resolvePayment(): Promise<ResolvedPayment> {
  const settings = await readJsonFile("payment.json", defaultPaymentSettings);
  const envProvider = (process.env.PAYMENT_PROVIDER ?? "stub").toLowerCase();
  const valid = ["stub", "sepay", "payos", "megapay"] as const;
  const adminProvider = settings.provider;
  const useAdminProvider = valid.includes(adminProvider);
  // Admin file always has a provider (default stub). Prefer admin when
  // payment.json was intentionally saved with sepay/payos/megapay, OR when
  // ENV is also stub. If ENV forces sepay and admin still default stub with
  // empty bank fields — still allow ENV via: admin provider wins only if
  // admin.provider !== stub OR admin has sepay account filled.
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

  // If admin explicitly set stub (and saved), and ENV says sepay — ENV wins for ops override
  // unless admin has non-stub. Already handled above.
  // Extra: admin set stub intentionally while ENV=sepay → ENV wins (ops). Good.

  const s = settings.sepay;
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
    (process.env.SEPAY_WEBHOOK_SECRET ?? "").trim();
  const merchantCode = (process.env.SEPAY_MERCHANT_CODE ?? "").trim();

  const fromAdmin =
    Boolean(s.accountNumber.trim()) ||
    Boolean(s.bankBin.trim()) ||
    Boolean(s.apiKeyEnc) ||
    Boolean(s.webhookSecretEnc);
  const fromEnv =
    Boolean(process.env.SEPAY_ACCOUNT_NUMBER) ||
    Boolean(process.env.SEPAY_API_KEY) ||
    Boolean(process.env.SEPAY_WEBHOOK_SECRET);

  let source: ResolvedSepayConfig["source"] = "env";
  if (fromAdmin && fromEnv) source = "mixed";
  else if (fromAdmin) source = "admin";

  return {
    provider,
    providerSource,
    sepay: {
      accountNumber,
      bankBin,
      bankName,
      bankDisplayName: bankDisplayName || "Ngân hàng",
      accountName: accountName || "KEYON",
      qrTemplate,
      apiKey,
      webhookSecret,
      merchantCode,
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
    accountNumber: string;
    bankBin: string;
    bankName: string;
    bankDisplayName: string;
    accountName: string;
    qrTemplate: string;
    apiKeyConfigured: boolean;
    webhookSecretConfigured: boolean;
    merchantCode: string;
  };
  resolvedProvider: ResolvedPayment["provider"];
  resolvedProviderSource: "admin" | "env";
  webhookUrl: string;
};

export async function getPaymentSettingsPublic(): Promise<PaymentSettingsPublic> {
  const settings = await getPaymentSettings();
  const resolved = await resolvePayment();
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
  return {
    provider: settings.provider,
    sepay: {
      accountNumber: settings.sepay.accountNumber,
      bankBin: settings.sepay.bankBin,
      bankName: settings.sepay.bankName,
      bankDisplayName: settings.sepay.bankDisplayName,
      accountName: settings.sepay.accountName,
      qrTemplate: settings.sepay.qrTemplate || "compact2",
      apiKeyConfigured:
        Boolean(settings.sepay.apiKeyEnc) || Boolean(resolved.sepay.apiKey),
      webhookSecretConfigured:
        Boolean(settings.sepay.webhookSecretEnc) ||
        Boolean(resolved.sepay.webhookSecret),
      merchantCode: resolved.sepay.merchantCode,
    },
    resolvedProvider: resolved.provider,
    resolvedProviderSource: resolved.providerSource,
    webhookUrl: appUrl ? `${appUrl}/api/webhooks/sepay` : "/api/webhooks/sepay",
  };
}

export async function savePaymentSettings(input: {
  provider: PaymentSettings["provider"];
  sepay: {
    accountNumber: string;
    bankBin: string;
    bankName?: string;
    bankDisplayName?: string;
    accountName?: string;
    qrTemplate?: string;
    apiKey?: string;
    webhookSecret?: string;
  };
}): Promise<PaymentSettings> {
  const current = await getPaymentSettings();
  let apiKeyEnc = current.sepay.apiKeyEnc;
  let webhookSecretEnc = current.sepay.webhookSecretEnc;

  const apiPlain = input.sepay.apiKey?.trim();
  if (apiPlain) apiKeyEnc = encryptPayload(apiPlain);
  const whPlain = input.sepay.webhookSecret?.trim();
  if (whPlain) webhookSecretEnc = encryptPayload(whPlain);

  const next: PaymentSettings = {
    provider: input.provider,
    sepay: {
      accountNumber: input.sepay.accountNumber.trim(),
      bankBin: input.sepay.bankBin.trim(),
      bankName: (input.sepay.bankName ?? "").trim(),
      bankDisplayName: (input.sepay.bankDisplayName ?? "").trim(),
      accountName: (input.sepay.accountName ?? "").trim(),
      qrTemplate: (input.sepay.qrTemplate ?? "compact2").trim() || "compact2",
      apiKeyEnc,
      webhookSecretEnc,
    },
  };
  await writeJsonFile("payment.json", next);
  return next;
}
