import { decryptPayload, encryptPayload } from "@/lib/crypto";
import {
  defaultSupplierApiSettings,
  readJsonFile,
  writeJsonFile,
  type SupplierApiSettings,
} from "@/server/cms/store";

export type ResolvedPax8Config = {
  driver: "stub" | "sandbox" | "http";
  driverSource: "admin" | "env";
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  companyId: string;
  credentialsSource: "admin" | "env" | "mixed" | "none";
};

export type ResolvedPacisoftConfig = {
  enabled: boolean;
  baseUrl: string;
  apiKey: string;
  notes: string;
  source: "admin" | "env" | "none";
};

export type ResolvedSupplierApi = {
  pax8: ResolvedPax8Config;
  pacisoft: ResolvedPacisoftConfig;
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

/** Field-level hybrid: Admin value if set, else ENV (CardOn / SePay style). */
export async function resolveSupplierApi(): Promise<ResolvedSupplierApi> {
  const settings = await readJsonFile(
    "suppliers-api.json",
    defaultSupplierApiSettings,
  );

  const envDriver = (process.env.PAX8_DRIVER ?? "stub").toLowerCase();
  const adminDriver = settings.pax8.driver;
  let driver: ResolvedPax8Config["driver"] = "stub";
  let driverSource: "admin" | "env" = "env";

  if (adminDriver === "http" || adminDriver === "sandbox") {
    driver = adminDriver;
    driverSource = "admin";
  } else if (envDriver === "http" || envDriver === "sandbox") {
    driver = envDriver;
    driverSource = "env";
  } else if (envDriver === "stub") {
    driver = "stub";
    driverSource = "env";
  } else {
    driver = adminDriver;
    driverSource = "admin";
  }

  const baseUrl = pick(settings.pax8.baseUrl, process.env.PAX8_BASE_URL);
  const clientId = pick(settings.pax8.clientId, process.env.PAX8_CLIENT_ID);
  const clientSecret =
    decryptSecret(settings.pax8.clientSecretEnc) ||
    (process.env.PAX8_CLIENT_SECRET ?? "").trim();
  const companyId = pick(settings.pax8.companyId, process.env.PAX8_COMPANY_ID);

  const fromAdmin =
    Boolean(settings.pax8.baseUrl.trim()) ||
    Boolean(settings.pax8.clientId.trim()) ||
    Boolean(settings.pax8.clientSecretEnc) ||
    Boolean(settings.pax8.companyId.trim());
  const fromEnv =
    Boolean(process.env.PAX8_BASE_URL) ||
    Boolean(process.env.PAX8_CLIENT_ID) ||
    Boolean(process.env.PAX8_CLIENT_SECRET) ||
    Boolean(process.env.PAX8_COMPANY_ID);

  let credentialsSource: ResolvedPax8Config["credentialsSource"] = "none";
  if (fromAdmin && fromEnv) credentialsSource = "mixed";
  else if (fromAdmin) credentialsSource = "admin";
  else if (fromEnv) credentialsSource = "env";

  const pacisoftKey =
    decryptSecret(settings.pacisoft.apiKeyEnc) ||
    (process.env.PACISOFT_API_KEY ?? "").trim();
  const pacisoftUrl = pick(
    settings.pacisoft.baseUrl,
    process.env.PACISOFT_BASE_URL,
  );
  const pacisoftEnabled =
    settings.pacisoft.enabled ||
    process.env.PACISOFT_ENABLED === "1" ||
    process.env.PACISOFT_ENABLED === "true";

  let pacisoftSource: ResolvedPacisoftConfig["source"] = "none";
  if (settings.pacisoft.enabled || settings.pacisoft.baseUrl.trim() || settings.pacisoft.apiKeyEnc) {
    pacisoftSource = "admin";
  } else if (process.env.PACISOFT_API_KEY || process.env.PACISOFT_BASE_URL) {
    pacisoftSource = "env";
  }

  return {
    pax8: {
      driver,
      driverSource,
      baseUrl,
      clientId,
      clientSecret,
      companyId,
      credentialsSource,
    },
    pacisoft: {
      enabled: pacisoftEnabled,
      baseUrl: pacisoftUrl,
      apiKey: pacisoftKey,
      notes: settings.pacisoft.notes,
      source: pacisoftSource,
    },
  };
}

export async function getSupplierApiSettings(): Promise<SupplierApiSettings> {
  return readJsonFile("suppliers-api.json", defaultSupplierApiSettings);
}

export type SupplierApiSettingsPublic = {
  pax8: {
    driver: Pax8ApiSettingsPublicDriver;
    baseUrl: string;
    clientId: string;
    companyId: string;
    clientSecretConfigured: boolean;
  };
  pacisoft: {
    enabled: boolean;
    baseUrl: string;
    notes: string;
    apiKeyConfigured: boolean;
  };
  resolved: {
    pax8Driver: ResolvedPax8Config["driver"];
    pax8DriverSource: "admin" | "env";
    pax8CredentialsSource: ResolvedPax8Config["credentialsSource"];
    pacisoftEnabled: boolean;
  };
};

type Pax8ApiSettingsPublicDriver = "stub" | "sandbox" | "http";

export async function getSupplierApiSettingsPublic(): Promise<SupplierApiSettingsPublic> {
  const settings = await getSupplierApiSettings();
  const resolved = await resolveSupplierApi();
  return {
    pax8: {
      driver: settings.pax8.driver,
      baseUrl: settings.pax8.baseUrl,
      clientId: settings.pax8.clientId,
      companyId: settings.pax8.companyId,
      clientSecretConfigured: Boolean(settings.pax8.clientSecretEnc),
    },
    pacisoft: {
      enabled: settings.pacisoft.enabled,
      baseUrl: settings.pacisoft.baseUrl,
      notes: settings.pacisoft.notes,
      apiKeyConfigured: Boolean(settings.pacisoft.apiKeyEnc),
    },
    resolved: {
      pax8Driver: resolved.pax8.driver,
      pax8DriverSource: resolved.pax8.driverSource,
      pax8CredentialsSource: resolved.pax8.credentialsSource,
      pacisoftEnabled: resolved.pacisoft.enabled,
    },
  };
}

export async function saveSupplierApiSettings(input: {
  pax8: {
    driver: "stub" | "sandbox" | "http";
    baseUrl: string;
    clientId: string;
    companyId: string;
    clientSecret?: string;
  };
  pacisoft: {
    enabled: boolean;
    baseUrl: string;
    notes?: string;
    apiKey?: string;
  };
}): Promise<SupplierApiSettings> {
  const current = await getSupplierApiSettings();
  let clientSecretEnc = current.pax8.clientSecretEnc;
  let pacisoftApiKeyEnc = current.pacisoft.apiKeyEnc;

  const secretPlain = input.pax8.clientSecret?.trim();
  if (secretPlain) clientSecretEnc = encryptPayload(secretPlain);
  const keyPlain = input.pacisoft.apiKey?.trim();
  if (keyPlain) pacisoftApiKeyEnc = encryptPayload(keyPlain);

  const next: SupplierApiSettings = {
    pax8: {
      driver: input.pax8.driver,
      baseUrl: input.pax8.baseUrl.trim(),
      clientId: input.pax8.clientId.trim(),
      clientSecretEnc,
      companyId: input.pax8.companyId.trim(),
    },
    pacisoft: {
      enabled: input.pacisoft.enabled,
      baseUrl: input.pacisoft.baseUrl.trim(),
      apiKeyEnc: pacisoftApiKeyEnc,
      notes: (input.pacisoft.notes ?? "").trim(),
    },
  };
  await writeJsonFile("suppliers-api.json", next);
  return next;
}
