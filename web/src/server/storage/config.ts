import { decryptPayload, encryptPayload } from "@/lib/crypto";
import { defaultStorageSettings, readJsonFile, writeJsonFile } from "@/server/cms/store";
import type { StorageSettings } from "@/server/cms/store";

export type ResolvedWasabiConfig = {
  endpoint: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicBaseUrl: string;
  pathPrefix: string;
  source: "admin" | "env";
};

export type ResolvedStorage =
  | { driver: "local"; localRoot: string }
  | { driver: "wasabi"; wasabi: ResolvedWasabiConfig };

function envWasabi(): ResolvedWasabiConfig | null {
  const endpoint = process.env.WASABI_ENDPOINT?.trim() ?? "";
  const region = process.env.WASABI_REGION?.trim() ?? "";
  const bucket = process.env.WASABI_BUCKET?.trim() ?? "";
  const accessKeyId = process.env.WASABI_ACCESS_KEY?.trim() ?? "";
  const secretAccessKey = process.env.WASABI_SECRET_KEY?.trim() ?? "";
  if (!endpoint || !region || !bucket || !accessKeyId || !secretAccessKey) {
    return null;
  }
  return {
    endpoint: endpoint.replace(/\/$/, ""),
    region,
    bucket,
    accessKeyId,
    secretAccessKey,
    publicBaseUrl: (process.env.WASABI_PUBLIC_BASE_URL ?? "").replace(/\/$/, ""),
    pathPrefix: (process.env.WASABI_PATH_PREFIX ?? "media").replace(/^\/|\/$/g, ""),
    source: "env",
  };
}

function decryptSecret(enc: string): string | null {
  if (!enc) return null;
  try {
    return decryptPayload(enc);
  } catch {
    return null;
  }
}

/** Admin config wins when complete; else ENV; else local. */
export async function resolveStorage(): Promise<ResolvedStorage> {
  const settings = await readJsonFile("storage.json", defaultStorageSettings);
  const localRoot = process.env.STORAGE_LOCAL_ROOT ?? "./storage/uploads";

  if (settings.driver === "wasabi") {
    const w = settings.wasabi;
    const secret =
      decryptSecret(w.secretAccessKeyEnc) ??
      process.env.WASABI_SECRET_KEY?.trim() ??
      "";
    if (w.endpoint && w.region && w.bucket && w.accessKeyId && secret) {
      return {
        driver: "wasabi",
        wasabi: {
          endpoint: w.endpoint.replace(/\/$/, ""),
          region: w.region,
          bucket: w.bucket,
          accessKeyId: w.accessKeyId,
          secretAccessKey: secret,
          publicBaseUrl: (w.publicBaseUrl ?? "").replace(/\/$/, ""),
          pathPrefix: (w.pathPrefix || "media").replace(/^\/|\/$/g, ""),
          source: "admin",
        },
      };
    }
  }

  if ((process.env.STORAGE_DRIVER ?? "local") === "wasabi") {
    const fromEnv = envWasabi();
    if (fromEnv) return { driver: "wasabi", wasabi: fromEnv };
  }

  return { driver: "local", localRoot };
}

export async function getStorageSettings(): Promise<StorageSettings> {
  return readJsonFile("storage.json", defaultStorageSettings);
}

export type StorageSettingsPublic = {
  driver: "local" | "wasabi";
  wasabi: {
    endpoint: string;
    region: string;
    bucket: string;
    accessKeyId: string;
    publicBaseUrl: string;
    pathPrefix: string;
    secretConfigured: boolean;
  };
  resolvedDriver: "local" | "wasabi";
  resolvedSource: "admin" | "env" | "local";
};

export async function getStorageSettingsPublic(): Promise<StorageSettingsPublic> {
  const settings = await getStorageSettings();
  const resolved = await resolveStorage();
  return {
    driver: settings.driver,
    wasabi: {
      endpoint: settings.wasabi.endpoint,
      region: settings.wasabi.region,
      bucket: settings.wasabi.bucket,
      accessKeyId: settings.wasabi.accessKeyId,
      publicBaseUrl: settings.wasabi.publicBaseUrl,
      pathPrefix: settings.wasabi.pathPrefix,
      secretConfigured: Boolean(settings.wasabi.secretAccessKeyEnc),
    },
    resolvedDriver: resolved.driver,
    resolvedSource:
      resolved.driver === "local"
        ? "local"
        : resolved.wasabi.source,
  };
}

export async function saveStorageSettings(input: {
  driver: "local" | "wasabi";
  wasabi: {
    endpoint: string;
    region: string;
    bucket: string;
    accessKeyId: string;
    publicBaseUrl?: string;
    pathPrefix?: string;
    /** Plain secret; omit/empty keeps existing */
    secretAccessKey?: string;
  };
}): Promise<StorageSettings> {
  const current = await getStorageSettings();
  let secretAccessKeyEnc = current.wasabi.secretAccessKeyEnc;
  const plain = input.wasabi.secretAccessKey?.trim();
  if (plain) {
    secretAccessKeyEnc = encryptPayload(plain);
  }

  const next: StorageSettings = {
    driver: input.driver,
    wasabi: {
      endpoint: input.wasabi.endpoint.trim(),
      region: input.wasabi.region.trim(),
      bucket: input.wasabi.bucket.trim(),
      accessKeyId: input.wasabi.accessKeyId.trim(),
      secretAccessKeyEnc,
      publicBaseUrl: (input.wasabi.publicBaseUrl ?? "").trim().replace(/\/$/, ""),
      pathPrefix: (input.wasabi.pathPrefix || "media").replace(/^\/|\/$/g, ""),
    },
  };
  await writeJsonFile("storage.json", next);
  return next;
}
