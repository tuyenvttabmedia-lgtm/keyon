import type { MailSettingsPublic } from "@/server/mail/config";
import type { PaymentSettingsPublic } from "@/server/payment/config";
import type { StorageSettingsPublic } from "@/server/storage/config";
import type { SupplierApiSettingsPublic } from "@/server/supplier/config";
import type { TelegramSettingsPublic } from "@/server/telegram/config";

export type SettingsTab =
  | "chung"
  | "seo"
  | "email"
  | "telegram"
  | "storage"
  | "sepay"
  | "ncc";

export const SETTINGS_TABS: { id: SettingsTab; label: string }[] = [
  { id: "chung", label: "Chung" },
  { id: "seo", label: "SEO" },
  { id: "email", label: "Email / SMTP" },
  { id: "telegram", label: "Telegram" },
  { id: "sepay", label: "SePay" },
  { id: "ncc", label: "NCC / Pax8" },
  { id: "storage", label: "Storage / Wasabi" },
];

export function parseSettingsTab(raw: string | undefined): SettingsTab {
  if (
    raw === "ncc" ||
    raw === "seo" ||
    raw === "email" ||
    raw === "telegram" ||
    raw === "storage" ||
    raw === "sepay" ||
    raw === "chung"
  ) {
    return raw;
  }
  return "chung";
}

export function mailStatusLabel(mail: MailSettingsPublic): string {
  if (mail.resolved.status === "ok") return "OK";
  if (mail.resolved.status === "degraded") return "Lỗi gần đây";
  return "Chưa cấu hình";
}

export function mailStatusTone(
  mail: MailSettingsPublic,
): "ok" | "warn" | "bad" {
  if (mail.resolved.status === "ok") return "ok";
  if (mail.resolved.status === "degraded") return "bad";
  return "warn";
}

export function telegramStatusLabel(tg: TelegramSettingsPublic): string {
  if (tg.resolved.status === "ok") return "OK";
  if (tg.resolved.status === "degraded") return "Lỗi gần đây";
  if (tg.resolved.status === "disabled") return "Đã tắt";
  return "Chưa cấu hình";
}

export function telegramStatusTone(
  tg: TelegramSettingsPublic,
): "ok" | "warn" | "bad" | "neutral" {
  if (tg.resolved.status === "ok") return "ok";
  if (tg.resolved.status === "degraded") return "bad";
  if (tg.resolved.status === "disabled") return "neutral";
  return "warn";
}

export function paymentProviderLabel(provider: string): string {
  switch (provider) {
    case "stub":
      return "Stub (dev)";
    case "sepay":
      return "SePay";
    case "payos":
      return "PayOS";
    case "megapay":
      return "MegaPay";
    default:
      return provider;
  }
}

export function storageDriverLabel(driver: string): string {
  return driver === "wasabi" ? "Wasabi" : "Local";
}

export function pax8DriverLabel(driver: string): string {
  switch (driver) {
    case "stub":
      return "Stub";
    case "sandbox":
      return "Sandbox";
    case "http":
      return "HTTP";
    default:
      return driver;
  }
}

export type SettingsStatusCard = {
  label: string;
  value: string;
  hint: string;
  tone: "ok" | "warn" | "bad" | "neutral";
  tab: SettingsTab;
};

export function buildSettingsStatus(input: {
  siteName: string;
  mail: MailSettingsPublic;
  payment: PaymentSettingsPublic;
  storage: StorageSettingsPublic;
  supplierApi: SupplierApiSettingsPublic;
  telegram: TelegramSettingsPublic;
}): SettingsStatusCard[] {
  const mailTone = mailStatusTone(input.mail);
  const tgTone = telegramStatusTone(input.telegram);
  return [
    {
      label: "Website",
      value: input.siteName || "—",
      hint: "Tên hiển thị",
      tone: "neutral",
      tab: "chung",
    },
    {
      label: "Email / SMTP",
      value: mailStatusLabel(input.mail),
      hint: `${input.mail.resolved.provider} · ${input.mail.resolved.source}`,
      tone: mailTone,
      tab: "email",
    },
    {
      label: "Telegram",
      value: telegramStatusLabel(input.telegram),
      hint: `Nguồn: ${input.telegram.resolved.source}`,
      tone: tgTone,
      tab: "telegram",
    },
    {
      label: "Thanh toán",
      value: paymentProviderLabel(input.payment.resolvedProvider),
      hint: `Nguồn: ${input.payment.resolvedProviderSource}`,
      tone:
        input.payment.resolvedProvider === "stub" ? "warn" : "ok",
      tab: "sepay",
    },
    {
      label: "NCC API",
      value: pax8DriverLabel(input.supplierApi.resolved.pax8Driver),
      hint: `Driver: ${input.supplierApi.resolved.pax8DriverSource}`,
      tone:
        input.supplierApi.resolved.pax8Driver === "http" ? "ok" : "warn",
      tab: "ncc",
    },
    {
      label: "Storage",
      value: storageDriverLabel(input.storage.resolvedDriver),
      hint:
        input.storage.resolvedSource !== "local"
          ? `Nguồn: ${input.storage.resolvedSource}`
          : "Dev local",
      tone: input.storage.resolvedDriver === "wasabi" ? "ok" : "neutral",
      tab: "storage",
    },
  ];
}
