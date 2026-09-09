import { decryptPayload, encryptPayload } from "@/lib/crypto";
import {
  defaultTurnstileSettings,
  readJsonFile,
  writeJsonFile,
  type TurnstileSettings,
} from "@/server/cms/store";

export type ResolvedTurnstile = {
  enabled: boolean;
  siteKey: string;
  secretKey: string;
  source: "admin" | "env" | "mixed" | "none";
  ready: boolean;
};

function decryptSecret(enc: string): string {
  if (!enc) return "";
  try {
    return decryptPayload(enc);
  } catch {
    return "";
  }
}

export async function getTurnstileSettings(): Promise<TurnstileSettings> {
  return readJsonFile("turnstile.json", defaultTurnstileSettings);
}

export async function resolveTurnstile(): Promise<ResolvedTurnstile> {
  const settings = await getTurnstileSettings();
  const adminSecret = decryptSecret(settings.secretKeyEnc);
  const adminSite = settings.siteKey.trim();
  const envSecret = (process.env.TURNSTILE_SECRET_KEY ?? "").trim();
  const envSite = (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "").trim();

  const secretKey = adminSecret || envSecret;
  const siteKey = adminSite || envSite;

  const fromAdmin = Boolean(adminSecret || adminSite);
  const fromEnv = Boolean(envSecret || envSite);

  let source: ResolvedTurnstile["source"] = "none";
  if (fromAdmin && fromEnv) source = "mixed";
  else if (fromAdmin) source = "admin";
  else if (fromEnv) source = "env";

  const ready = Boolean(settings.enabled && siteKey && secretKey);

  return {
    enabled: settings.enabled,
    siteKey,
    secretKey,
    source,
    ready,
  };
}

export type TurnstileSettingsPublic = {
  enabled: boolean;
  siteKey: string;
  secretConfigured: boolean;
  health: TurnstileSettings["health"];
  resolved: {
    ready: boolean;
    source: ResolvedTurnstile["source"];
    status: "ok" | "unconfigured" | "degraded" | "disabled";
  };
};

function statusOf(
  resolved: ResolvedTurnstile,
  health: TurnstileSettings["health"],
  enabled: boolean,
): TurnstileSettingsPublic["resolved"]["status"] {
  if (!enabled) return "disabled";
  if (!resolved.ready) return "unconfigured";
  if (
    health.lastFailedAt &&
    (!health.lastSuccessAt || health.lastFailedAt > health.lastSuccessAt)
  ) {
    return "degraded";
  }
  return "ok";
}

export async function getTurnstileSettingsPublic(): Promise<TurnstileSettingsPublic> {
  const settings = await getTurnstileSettings();
  const resolved = await resolveTurnstile();
  return {
    enabled: settings.enabled,
    siteKey: settings.siteKey,
    secretConfigured: Boolean(settings.secretKeyEnc),
    health: settings.health,
    resolved: {
      ready: resolved.ready,
      source: resolved.source,
      status: statusOf(resolved, settings.health, settings.enabled),
    },
  };
}

/** Public storefront — only site key when ready (never secret). */
export async function getTurnstilePublicClient(): Promise<{
  enabled: boolean;
  siteKey: string | null;
}> {
  const resolved = await resolveTurnstile();
  if (!resolved.ready) return { enabled: false, siteKey: null };
  return { enabled: true, siteKey: resolved.siteKey };
}

export async function saveTurnstileSettings(input: {
  enabled?: boolean;
  siteKey?: string;
  secretKey?: string;
  clearSecret?: boolean;
}): Promise<TurnstileSettings> {
  const current = await getTurnstileSettings();
  let secretKeyEnc = current.secretKeyEnc;
  if (input.clearSecret) secretKeyEnc = "";
  const plain = input.secretKey?.trim();
  if (plain) secretKeyEnc = encryptPayload(plain);

  const next: TurnstileSettings = {
    enabled: input.enabled ?? current.enabled,
    siteKey: (input.siteKey ?? current.siteKey).trim(),
    secretKeyEnc,
    health: current.health,
  };
  await writeJsonFile("turnstile.json", next);
  return next;
}

export async function recordTurnstileHealth(
  ok: boolean,
  error?: string,
): Promise<void> {
  const current = await getTurnstileSettings();
  const now = new Date().toISOString();
  const health: TurnstileSettings["health"] = { ...current.health };
  if (ok) {
    health.lastSuccessAt = now;
    health.lastError = null;
  } else {
    health.lastFailedAt = now;
    health.lastError = (error ?? "Unknown error").slice(0, 500);
  }
  await writeJsonFile("turnstile.json", { ...current, health });
}
