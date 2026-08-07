import { decryptPayload, encryptPayload } from "@/lib/crypto";
import {
  defaultTelegramSettings,
  readJsonFile,
  writeJsonFile,
  type TelegramSettings,
} from "@/server/cms/store";

export type ResolvedTelegram = {
  enabled: boolean;
  botToken: string;
  chatId: string;
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

function maskChatId(id: string): string {
  const s = id.trim();
  if (!s) return "—";
  if (s.length <= 4) return "••••";
  return `${s.slice(0, 2)}…${s.slice(-3)}`;
}

export async function getTelegramSettings(): Promise<TelegramSettings> {
  return readJsonFile("telegram.json", defaultTelegramSettings);
}

export async function resolveTelegram(): Promise<ResolvedTelegram> {
  const settings = await getTelegramSettings();
  const adminToken = decryptSecret(settings.botTokenEnc);
  const envToken = (process.env.TELEGRAM_BOT_TOKEN ?? "").trim();
  const adminChat = settings.chatId.trim();
  const envChat = (process.env.TELEGRAM_CHAT_ID ?? "").trim();

  const botToken = adminToken || envToken;
  const chatId = adminChat || envChat;

  const fromAdmin = Boolean(adminToken || adminChat);
  const fromEnv = Boolean(envToken || envChat);

  let source: ResolvedTelegram["source"] = "none";
  if (fromAdmin && fromEnv) source = "mixed";
  else if (fromAdmin) source = "admin";
  else if (fromEnv) source = "env";

  const ready = Boolean(settings.enabled && botToken && chatId);

  return {
    enabled: settings.enabled,
    botToken,
    chatId,
    source,
    ready,
  };
}

export type TelegramSettingsPublic = {
  enabled: boolean;
  chatId: string;
  botTokenConfigured: boolean;
  health: TelegramSettings["health"];
  resolved: {
    ready: boolean;
    source: ResolvedTelegram["source"];
    chatIdMasked: string;
    status: "ok" | "unconfigured" | "degraded" | "disabled";
  };
};

function statusOf(
  resolved: ResolvedTelegram,
  health: TelegramSettings["health"],
  enabled: boolean,
): TelegramSettingsPublic["resolved"]["status"] {
  if (!enabled) return "disabled";
  if (!resolved.ready) return "unconfigured";
  if (
    health.lastFailedAt &&
    (!health.lastSuccessAt || health.lastFailedAt > health.lastSuccessAt)
  ) {
    return "degraded";
  }
  if (health.lastSuccessAt) return "ok";
  return "ok";
}

export async function getTelegramSettingsPublic(): Promise<TelegramSettingsPublic> {
  const settings = await getTelegramSettings();
  const resolved = await resolveTelegram();
  return {
    enabled: settings.enabled,
    chatId: settings.chatId,
    botTokenConfigured: Boolean(settings.botTokenEnc),
    health: settings.health,
    resolved: {
      ready: resolved.ready,
      source: resolved.source,
      chatIdMasked: maskChatId(resolved.chatId),
      status: statusOf(resolved, settings.health, settings.enabled),
    },
  };
}

export async function saveTelegramSettings(input: {
  enabled?: boolean;
  chatId?: string;
  botToken?: string;
  clearBotToken?: boolean;
}): Promise<TelegramSettings> {
  const current = await getTelegramSettings();
  let botTokenEnc = current.botTokenEnc;
  if (input.clearBotToken) botTokenEnc = "";
  const plain = input.botToken?.trim();
  if (plain) botTokenEnc = encryptPayload(plain);

  const next: TelegramSettings = {
    enabled: input.enabled ?? current.enabled,
    botTokenEnc,
    chatId: (input.chatId ?? current.chatId).trim(),
    health: current.health,
  };
  await writeJsonFile("telegram.json", next);
  return next;
}

export async function recordTelegramHealth(
  ok: boolean,
  error?: string,
): Promise<TelegramSettings> {
  const current = await getTelegramSettings();
  const now = new Date().toISOString();
  const health: TelegramSettings["health"] = { ...current.health };
  if (ok) {
    health.lastSuccessAt = now;
    health.lastError = null;
  } else {
    health.lastFailedAt = now;
    health.lastError = (error ?? "Unknown error").slice(0, 500);
  }
  const next = { ...current, health };
  await writeJsonFile("telegram.json", next);
  return next;
}
