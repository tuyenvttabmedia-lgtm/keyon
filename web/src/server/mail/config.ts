import { decryptPayload, encryptPayload } from "@/lib/crypto";
import {
  defaultMailSettings,
  readJsonFile,
  writeJsonFile,
  type MailSettings,
} from "@/server/cms/store";

export type ResolvedMail = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  replyTo: string;
  provider: MailSettings["provider"];
  source: "admin" | "env" | "mixed";
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

const BREVO_HOST = "smtp-relay.brevo.com";

/** Hybrid resolve: admin mail.json when provider ≠ env, else ENV (Mailpit/ops). */
export async function resolveMail(): Promise<ResolvedMail> {
  const settings = await readJsonFile("mail.json", defaultMailSettings);
  const provider = settings.provider;

  if (provider === "env") {
    return {
      host: process.env.SMTP_HOST ?? "localhost",
      port: Number(process.env.SMTP_PORT ?? 1025),
      secure: process.env.SMTP_SECURE === "true",
      user: (process.env.SMTP_USER ?? "").trim(),
      pass: (process.env.SMTP_PASS ?? "").trim(),
      from: process.env.MAIL_FROM ?? "KEYON <noreply@keyon.local>",
      replyTo: (process.env.MAIL_REPLY_TO ?? "").trim(),
      provider: "env",
      source: "env",
    };
  }

  const defaultHost = provider === "brevo" ? BREVO_HOST : "";
  const host = pick(settings.host || defaultHost, process.env.SMTP_HOST);
  const portRaw = settings.port > 0 ? String(settings.port) : "";
  const port = Number(
    pick(portRaw, process.env.SMTP_PORT) || (provider === "brevo" ? "587" : "1025"),
  );
  const secure =
    settings.host || settings.user || settings.passEnc
      ? settings.secure
      : process.env.SMTP_SECURE === "true";
  const user = pick(settings.user, process.env.SMTP_USER);
  const pass =
    decryptSecret(settings.passEnc) || (process.env.SMTP_PASS ?? "").trim();
  const from = pick(settings.from, process.env.MAIL_FROM) ||
    "KEYON <noreply@keyon.local>";
  const replyTo = pick(settings.replyTo, process.env.MAIL_REPLY_TO);

  const fromAdmin =
    Boolean(settings.host.trim()) ||
    Boolean(settings.user.trim()) ||
    Boolean(settings.passEnc) ||
    Boolean(settings.from.trim());
  const fromEnv =
    Boolean(process.env.SMTP_HOST) ||
    Boolean(process.env.SMTP_USER) ||
    Boolean(process.env.MAIL_FROM);

  let source: ResolvedMail["source"] = "admin";
  if (fromAdmin && fromEnv) source = "mixed";
  else if (!fromAdmin && fromEnv) source = "env";

  return {
    host: host || (provider === "brevo" ? BREVO_HOST : "localhost"),
    port,
    secure,
    user,
    pass,
    from,
    replyTo,
    provider,
    source,
  };
}

export async function getMailSettings(): Promise<MailSettings> {
  return readJsonFile("mail.json", defaultMailSettings);
}

export type MailSettingsPublic = {
  provider: MailSettings["provider"];
  host: string;
  port: number;
  secure: boolean;
  user: string;
  passConfigured: boolean;
  from: string;
  replyTo: string;
  health: MailSettings["health"];
  resolved: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    from: string;
    replyTo: string;
    provider: MailSettings["provider"];
    source: ResolvedMail["source"];
    status: "ok" | "unconfigured" | "degraded";
  };
};

function statusOf(resolved: ResolvedMail, health: MailSettings["health"]): MailSettingsPublic["resolved"]["status"] {
  if (!resolved.host) return "unconfigured";
  if (health.lastFailedAt && (!health.lastSuccessAt || health.lastFailedAt > health.lastSuccessAt)) {
    return "degraded";
  }
  if (health.lastSuccessAt) return "ok";
  // Dev Mailpit without auth is fine
  if (resolved.host === "localhost" || resolved.host === "127.0.0.1") return "ok";
  if (resolved.user && !resolved.pass) return "unconfigured";
  return resolved.user || resolved.host ? "ok" : "unconfigured";
}

export async function getMailSettingsPublic(): Promise<MailSettingsPublic> {
  const settings = await getMailSettings();
  const resolved = await resolveMail();
  return {
    provider: settings.provider,
    host: settings.host,
    port: settings.port,
    secure: settings.secure,
    user: settings.user,
    passConfigured: Boolean(settings.passEnc),
    from: settings.from,
    replyTo: settings.replyTo,
    health: settings.health,
    resolved: {
      host: resolved.host,
      port: resolved.port,
      secure: resolved.secure,
      user: resolved.user,
      from: resolved.from,
      replyTo: resolved.replyTo,
      provider: resolved.provider,
      source: resolved.source,
      status: statusOf(resolved, settings.health),
    },
  };
}

export async function saveMailSettings(input: {
  provider: MailSettings["provider"];
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  pass?: string;
  from?: string;
  replyTo?: string;
}): Promise<MailSettings> {
  const current = await getMailSettings();
  let passEnc = current.passEnc;
  const plain = input.pass?.trim();
  if (plain) passEnc = encryptPayload(plain);

  const next: MailSettings = {
    provider: input.provider,
    host: (input.host ?? current.host).trim(),
    port: input.port ?? current.port,
    secure: input.secure ?? current.secure,
    user: (input.user ?? current.user).trim(),
    passEnc,
    from: (input.from ?? current.from).trim(),
    replyTo: (input.replyTo ?? current.replyTo).trim(),
    health: current.health,
  };

  if (input.provider === "brevo" && !next.host) {
    next.host = BREVO_HOST;
  }
  if (input.provider === "brevo" && (!next.port || next.port === 1025)) {
    next.port = 587;
  }

  await writeJsonFile("mail.json", next);
  return next;
}

export async function recordMailHealth(
  kind: "connection" | "send",
  ok: boolean,
  error?: string,
): Promise<MailSettings> {
  const current = await getMailSettings();
  const now = new Date().toISOString();
  const health: MailSettings["health"] = {
    ...current.health,
    lastTestKind: kind,
  };
  if (ok) {
    health.lastSuccessAt = now;
    health.lastError = null;
  } else {
    health.lastFailedAt = now;
    health.lastError = (error ?? "Unknown error").slice(0, 500);
  }
  const next = { ...current, health };
  await writeJsonFile("mail.json", next);
  return next;
}
