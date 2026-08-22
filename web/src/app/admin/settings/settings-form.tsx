"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { SiteSettings } from "@/server/cms/types";
import type { StorageSettingsPublic } from "@/server/storage/config";
import type { PaymentSettingsPublic } from "@/server/payment/config";
import type { SupplierApiSettingsPublic } from "@/server/supplier/config";
import type { MailSettingsPublic } from "@/server/mail/config";
import type { TelegramSettingsPublic } from "@/server/telegram/config";
import {
  SETTINGS_TABS,
  type SettingsTab,
} from "@/lib/admin-settings";
import { SeoSettingsPanel } from "./seo-settings-panel";

function formatHealthTime(iso: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("vi-VN");
  } catch {
    return iso;
  }
}

const TAB_HELP: Record<SettingsTab, { title: string; lead: string }> = {
  chung: {
    title: "Chung",
    lead: "Tên website và email hỗ trợ khách thấy trên storefront.",
  },
  seo: {
    title: "SEO",
    lead: "Cấu hình thông tin hiển thị trên công cụ tìm kiếm và khi chia sẻ website.",
  },
  email: {
    title: "Email / SMTP",
    lead: "Hybrid Admin + ENV. Dev dùng Mailpit; production Brevo / SMTP riêng.",
  },
  telegram: {
    title: "Telegram",
    lead: "Nhận thông báo lead (liên hệ / báo giá) và monitoring. Bot token mã hóa AES; Chat ID lưu plain. Field trống → fallback ENV.",
  },
  sepay: {
    title: "Thanh toán · SePay",
    lead: "Credential mã hóa AES. Field trống → fallback ENV.",
  },
  ncc: {
    title: "NCC / Pax8",
    lead: "Cấu hình API toàn hệ thống — không theo từng nhà cung cấp.",
  },
  storage: {
    title: "Storage / Wasabi",
    lead: "Driver Media upload. Secret mã hóa AES khi lưu.",
  },
};

export function SettingsForm({
  initial,
  initialStorage,
  initialPayment,
  initialSupplierApi,
  initialMail,
  initialTelegram,
  initialTab = "chung",
  siteOrigin,
  siteHostname,
  indexingAllowed,
}: {
  initial: SiteSettings;
  initialStorage: StorageSettingsPublic;
  initialPayment: PaymentSettingsPublic;
  initialSupplierApi: SupplierApiSettingsPublic;
  initialMail: MailSettingsPublic;
  initialTelegram: TelegramSettingsPublic;
  initialTab?: SettingsTab;
  siteOrigin: string;
  siteHostname: string;
  indexingAllowed: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<SettingsTab>(initialTab);
  const [form, setForm] = useState(initial);
  const [savedForm, setSavedForm] = useState(initial);
  const [storage, setStorage] = useState(initialStorage);
  const [payment, setPayment] = useState(initialPayment);
  const [supplierApi, setSupplierApi] = useState(initialSupplierApi);
  const [mail, setMail] = useState(initialMail);
  const [telegram, setTelegram] = useState(initialTelegram);
  const [mailPass, setMailPass] = useState("");
  const [mailTestTo, setMailTestTo] = useState("");
  const [telegramBotToken, setTelegramBotToken] = useState("");
  const [wasabiSecret, setWasabiSecret] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [merchantSecret, setMerchantSecret] = useState("");
  const [ipnSecret, setIpnSecret] = useState("");
  const [pax8Secret, setPax8Secret] = useState("");
  const [pacisoftKey, setPacisoftKey] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(initial);
    setSavedForm(initial);
  }, [initial]);
  useEffect(() => setStorage(initialStorage), [initialStorage]);
  useEffect(() => setPayment(initialPayment), [initialPayment]);
  useEffect(() => setSupplierApi(initialSupplierApi), [initialSupplierApi]);
  useEffect(() => setMail(initialMail), [initialMail]);
  useEffect(() => setTelegram(initialTelegram), [initialTelegram]);
  useEffect(() => setTab(initialTab), [initialTab]);

  const siteDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(savedForm),
    [form, savedForm],
  );

  useEffect(() => {
    if (!siteDirty || (tab !== "chung" && tab !== "seo")) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [siteDirty, tab]);

  function selectTab(id: SettingsTab) {
    setTab(id);
    setMsg(null);
    router.replace(`/admin/settings?tab=${id}`, { scroll: false });
  }

  async function saveSite() {
    setLoading(true);
    setMsg(null);
    try {
      const payload = {
        ...form,
        ogImageUrl: form.ogImageUrl?.trim() || undefined,
        pageSeo: form.pageSeo,
      };
      const res = await fetch("/api/admin/cms/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      const next = (data.data as SiteSettings) ?? form;
      setForm(next);
      setSavedForm(next);
      setMsg(
        tab === "seo" ? "Đã lưu cấu hình SEO." : "Đã lưu",
      );
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function saveMail() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/mail", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: mail.provider,
          host: mail.host,
          port: mail.port,
          secure: mail.secure,
          user: mail.user,
          from: mail.from,
          replyTo: mail.replyTo,
          ...(mailPass.trim() ? { pass: mailPass.trim() } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setMail(data.data);
      setMailPass("");
      setMsg("Đã lưu cấu hình Email / SMTP");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function saveTelegram() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/telegram", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: telegram.enabled,
          chatId: telegram.chatId,
          ...(telegramBotToken.trim()
            ? { botToken: telegramBotToken.trim() }
            : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setTelegram(data.data);
      setTelegramBotToken("");
      setMsg("Đã lưu cấu hình Telegram");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function clearTelegramToken() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/telegram", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: telegram.enabled,
          chatId: telegram.chatId,
          clearBotToken: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setTelegram(data.data);
      setTelegramBotToken("");
      setMsg("Đã xóa Bot token đã lưu (fallback ENV nếu có)");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function saveStorage() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/storage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driver: storage.driver,
          wasabi: {
            endpoint: storage.wasabi.endpoint,
            region: storage.wasabi.region,
            bucket: storage.wasabi.bucket,
            accessKeyId: storage.wasabi.accessKeyId,
            publicBaseUrl: storage.wasabi.publicBaseUrl,
            pathPrefix: storage.wasabi.pathPrefix,
            ...(wasabiSecret.trim() ? { secretAccessKey: wasabiSecret.trim() } : {}),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setStorage(data.data);
      setWasabiSecret("");
      setMsg("Đã lưu cấu hình storage");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function savePayment() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/payment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: payment.provider,
          sepay: {
            environment: payment.sepay.environment,
            accountNumber: payment.sepay.accountNumber,
            bankBin: payment.sepay.bankBin,
            bankName: payment.sepay.bankName,
            bankDisplayName: payment.sepay.bankDisplayName,
            accountName: payment.sepay.accountName,
            qrTemplate: payment.sepay.qrTemplate,
            merchantId: payment.sepay.merchantId,
            paymentMethod: payment.sepay.paymentMethod,
            ...(apiKey.trim() ? { apiKey: apiKey.trim() } : {}),
            ...(webhookSecret.trim() ? { webhookSecret: webhookSecret.trim() } : {}),
            ...(merchantSecret.trim() ? { merchantSecret: merchantSecret.trim() } : {}),
            ...(ipnSecret.trim() ? { ipnSecret: ipnSecret.trim() } : {}),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setPayment(data.data);
      setApiKey("");
      setWebhookSecret("");
      setMerchantSecret("");
      setIpnSecret("");
      setMsg("Đã lưu cấu hình SePay");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function saveSupplierApi() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/suppliers-api", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pax8: {
            driver: supplierApi.pax8.driver,
            baseUrl: supplierApi.pax8.baseUrl,
            clientId: supplierApi.pax8.clientId,
            companyId: supplierApi.pax8.companyId,
            ...(pax8Secret.trim() ? { clientSecret: pax8Secret.trim() } : {}),
          },
          pacisoft: {
            enabled: supplierApi.pacisoft.enabled,
            baseUrl: supplierApi.pacisoft.baseUrl,
            notes: supplierApi.pacisoft.notes,
            ...(pacisoftKey.trim() ? { apiKey: pacisoftKey.trim() } : {}),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lỗi");
      setSupplierApi(data.data);
      setPax8Secret("");
      setPacisoftKey("");
      setMsg("Đã lưu cấu hình NCC API");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function testStorage() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/storage/test", { method: "POST" });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        throw new Error(data.error ?? "Test thất bại");
      }
      setMsg(data.message ?? "OK");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function testPayment() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/payment/test", { method: "POST" });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        throw new Error(data.error ?? "Test thất bại");
      }
      setMsg(data.message ?? "OK");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function testSupplierApi() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/suppliers-api/test", { method: "POST" });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        throw new Error(data.error ?? "Test thất bại");
      }
      setMsg(data.message ?? "OK");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function testMailConnection() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/mail/test", { method: "POST" });
      const data = await res.json();
      if (data.data) setMail(data.data);
      if (!res.ok || data.ok === false) {
        throw new Error(data.error ?? "Test thất bại");
      }
      setMsg(data.message ?? "OK");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function testMailSend() {
    const to = mailTestTo.trim();
    if (!to) {
      setMsg("Nhập email nhận thử trước khi gửi");
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/mail/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to }),
      });
      const data = await res.json();
      if (data.data) setMail(data.data);
      if (!res.ok || data.ok === false) {
        throw new Error(data.error ?? "Gửi thất bại");
      }
      setMsg(data.message ?? "OK");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function testTelegram() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/telegram/test", { method: "POST" });
      const data = await res.json();
      if (data.data) setTelegram(data.data);
      if (!res.ok || data.ok === false) {
        throw new Error(data.error ?? "Test thất bại");
      }
      setMsg(data.message ?? "OK");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  function save() {
    if (tab === "email") return saveMail();
    if (tab === "telegram") return saveTelegram();
    if (tab === "storage") return saveStorage();
    if (tab === "sepay") return savePayment();
    if (tab === "ncc") return saveSupplierApi();
    return saveSite();
  }

  const smtpStatusLabel =
    mail.resolved.status === "ok"
      ? "OK"
      : mail.resolved.status === "degraded"
        ? "Lỗi gần đây"
        : "Chưa cấu hình";
  const smtpStatusClass =
    mail.resolved.status === "ok"
      ? "bg-emerald-50 text-emerald-700"
      : mail.resolved.status === "degraded"
        ? "bg-rose-50 text-rose-700"
        : "bg-amber-50 text-amber-800";

  const help = TAB_HELP[tab];

  return (
    <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
      <nav className="space-y-1">
        {SETTINGS_TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => selectTab(id)}
            className={
              tab === id
                ? "w-full rounded-lg bg-accent-soft px-3 py-2 text-left text-sm font-medium text-accent"
                : "w-full rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-navy-soft"
            }
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="rounded-2xl border border-border bg-card p-6">
        {tab !== "seo" ? (
          <div className="mb-5 border-b border-border pb-4">
            <h2 className="text-base font-semibold text-navy">{help.title}</h2>
            <p className="mt-1 text-sm text-muted">{help.lead}</p>
          </div>
        ) : null}

        {tab === "chung" ? (
          <div className="space-y-4">
            <label className="block text-sm">
              <span className="font-medium text-navy">Tên website</span>
              <input
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-navy">Email hỗ trợ</span>
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
              />
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-[#f8fafc] px-4 py-3 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={Boolean(form.quotePublicTrackingEnabled)}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quotePublicTrackingEnabled: e.target.checked,
                  })
                }
              />
              <span>
                <span className="font-medium text-navy">
                  Tra cứu báo giá công khai (QT- + OTP email)
                </span>
                <span className="mt-1 block text-muted">
                  Bật khi volume lớn — khách tra trạng thái tại{" "}
                  <code className="text-xs">/contact/quote/status</code> bằng mã
                  QT- và mã OTP gửi qua email. Tắt mặc định.
                </span>
              </span>
            </label>
            <p className="rounded-lg border border-dashed border-border bg-[#f8fafc] px-3 py-2 text-xs text-muted">
              Logo thương hiệu quản lý tại{" "}
              <Link href="/admin/media" className="text-accent hover:underline">
                Media
              </Link>{" "}
              / CMS — không có field logo riêng trên settings.json.
            </p>
          </div>
        ) : null}

        {tab === "seo" ? (
          <SeoSettingsPanel
            form={form}
            setForm={setForm}
            siteHostname={siteHostname}
            siteOrigin={siteOrigin}
            indexingAllowed={indexingAllowed}
          />
        ) : null}

        {tab === "email" ? (
          <div className="space-y-5">
            <div className="rounded-xl border border-border bg-[#f8fafc] p-4">
              <p className="text-sm font-semibold text-navy">Trạng thái SMTP</p>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2">
                  <dt className="text-muted">Status</dt>
                  <dd>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${smtpStatusClass}`}>
                      {smtpStatusLabel}
                    </span>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2">
                  <dt className="text-muted">Provider</dt>
                  <dd className="font-medium text-navy capitalize">
                    {mail.resolved.provider} · {mail.resolved.source}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2">
                  <dt className="text-muted">Host / Port</dt>
                  <dd className="font-medium text-navy">
                    {mail.resolved.host}:{mail.resolved.port}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2">
                  <dt className="text-muted">TLS</dt>
                  <dd className="font-medium text-navy">
                    {mail.resolved.secure ? "SMTPS (secure)" : "STARTTLS / plain"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2 sm:col-span-2">
                  <dt className="text-muted">Thành công gần nhất</dt>
                  <dd className="font-medium text-navy">
                    {formatHealthTime(mail.health.lastSuccessAt)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2 sm:col-span-2">
                  <dt className="text-muted">Lỗi gần nhất</dt>
                  <dd className="text-right font-medium text-navy">
                    {formatHealthTime(mail.health.lastFailedAt)}
                    {mail.health.lastError ? (
                      <span className="mt-0.5 block text-xs font-normal text-rose-600">
                        {mail.health.lastError}
                      </span>
                    ) : null}
                  </dd>
                </div>
              </dl>
            </div>

            <label className="block text-sm">
              <span className="font-medium text-navy">Provider</span>
              <select
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                value={mail.provider}
                onChange={(e) => {
                  const provider = e.target.value as MailSettingsPublic["provider"];
                  setMail({
                    ...mail,
                    provider,
                    ...(provider === "brevo"
                      ? {
                          host: mail.host || "smtp-relay.brevo.com",
                          port: mail.port === 1025 ? 587 : mail.port,
                          secure: false,
                        }
                      : {}),
                  });
                }}
              >
                <option value="env">ENV only (Mailpit / ops)</option>
                <option value="brevo">Brevo SMTP</option>
                <option value="custom">Custom SMTP</option>
              </select>
              <span className="mt-1 block text-xs text-muted">
                Hybrid: field Admin nếu có, không thì fallback ENV. Worker cũng dùng cấu hình này.
              </span>
            </label>

            {mail.provider !== "env" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm sm:col-span-2">
                  <span className="font-medium text-navy">SMTP Host</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    placeholder={
                      mail.provider === "brevo"
                        ? "smtp-relay.brevo.com"
                        : "smtp.example.com"
                    }
                    value={mail.host}
                    onChange={(e) => setMail({ ...mail, host: e.target.value })}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-navy">Port</span>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    value={mail.port}
                    onChange={(e) =>
                      setMail({ ...mail, port: Number(e.target.value) || 587 })
                    }
                  />
                </label>
                <label className="flex items-center gap-2 pt-6 text-sm">
                  <input
                    type="checkbox"
                    checked={mail.secure}
                    onChange={(e) =>
                      setMail({ ...mail, secure: e.target.checked })
                    }
                  />
                  <span className="font-medium text-navy">
                    Secure (SMTPS / port 465)
                  </span>
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-navy">User</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    value={mail.user}
                    onChange={(e) => setMail({ ...mail, user: e.target.value })}
                    autoComplete="off"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-navy">
                    Password / SMTP key
                    {mail.passConfigured ? " (đã lưu)" : ""}
                  </span>
                  <input
                    type="password"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    placeholder={
                      mail.passConfigured ? "•••••••• (để trống nếu giữ)" : ""
                    }
                    value={mailPass}
                    onChange={(e) => setMailPass(e.target.value)}
                    autoComplete="new-password"
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="font-medium text-navy">From</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    placeholder='KEYON <noreply@yourdomain.com>'
                    value={mail.from}
                    onChange={(e) => setMail({ ...mail, from: e.target.value })}
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="font-medium text-navy">Reply-To (optional)</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    value={mail.replyTo}
                    onChange={(e) =>
                      setMail({ ...mail, replyTo: e.target.value })
                    }
                  />
                </label>
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-border bg-white px-3 py-3 text-sm text-muted">
                Đang dùng ENV:{" "}
                <code className="text-navy">
                  {mail.resolved.host}:{mail.resolved.port}
                </code>
                {" · "}
                from <code className="text-navy">{mail.resolved.from}</code>
              </p>
            )}
          </div>
        ) : null}

        {tab === "telegram" ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  telegram.resolved.status === "ok"
                    ? "bg-emerald-50 text-emerald-700"
                    : telegram.resolved.status === "degraded"
                      ? "bg-rose-50 text-rose-700"
                      : telegram.resolved.status === "disabled"
                        ? "bg-slate-100 text-slate-600"
                        : "bg-amber-50 text-amber-800"
                }`}
              >
                {telegram.resolved.status === "ok"
                  ? "Sẵn sàng"
                  : telegram.resolved.status === "degraded"
                    ? "Lỗi gần đây"
                    : telegram.resolved.status === "disabled"
                      ? "Đã tắt"
                      : "Chưa cấu hình"}
              </span>
              <span className="text-muted">
                Nguồn:{" "}
                <span className="font-medium text-navy">{telegram.resolved.source}</span>
                {" · "}
                Chat:{" "}
                <span className="font-medium text-navy">
                  {telegram.resolved.chatIdMasked}
                </span>
              </span>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                checked={telegram.enabled}
                onChange={(e) =>
                  setTelegram({ ...telegram, enabled: e.target.checked })
                }
              />
              <span className="font-medium text-navy">
                Bật thông báo Telegram (lead + monitoring)
              </span>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                <span className="font-medium text-navy">
                  Bot token
                  {telegram.botTokenConfigured ? " (đã lưu)" : ""}
                </span>
                <input
                  type="password"
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                  placeholder={
                    telegram.botTokenConfigured
                      ? "•••••••• (để trống nếu giữ)"
                      : "123456:ABC…"
                  }
                  value={telegramBotToken}
                  onChange={(e) => setTelegramBotToken(e.target.value)}
                  autoComplete="new-password"
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="font-medium text-navy">Chat ID</span>
                <input
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                  placeholder="VD: 123456789 hoặc -100…"
                  value={telegram.chatId}
                  onChange={(e) =>
                    setTelegram({ ...telegram, chatId: e.target.value })
                  }
                  autoComplete="off"
                />
              </label>
            </div>

            <p className="text-xs text-muted">
              Tạo bot qua{" "}
              <a
                href="https://t.me/BotFather"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-accent hover:underline"
              >
                @BotFather
              </a>
              , chat với bot, lấy <code className="text-navy">chat_id</code> từ{" "}
              <code className="text-navy">getUpdates</code>. Field trống → dùng{" "}
              <code className="text-navy">TELEGRAM_BOT_TOKEN</code> /{" "}
              <code className="text-navy">TELEGRAM_CHAT_ID</code> trong ENV.
            </p>

            <div className="rounded-lg border border-border bg-[#F7FAFC] px-3 py-3 text-xs text-muted">
              <p>
                Test gần nhất:{" "}
                <span className="text-navy">
                  {formatHealthTime(telegram.health.lastSuccessAt)}
                </span>
                {telegram.health.lastError ? (
                  <>
                    {" · "}
                    Lỗi:{" "}
                    <span className="text-rose-700">{telegram.health.lastError}</span>
                  </>
                ) : null}
              </p>
            </div>
          </div>
        ) : null}

        {tab === "sepay" ? (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              Provider:{" "}
              <span className="font-medium text-navy">{payment.resolvedProvider}</span> (
              {payment.resolvedProviderSource}) · Mode:{" "}
              <span className="font-medium text-navy">
                {payment.sepay.mode === "payment_gateway"
                  ? "Cổng thanh toán PG (sandbox)"
                  : "Bank webhook HMAC (production)"}
              </span>
            </p>

            <label className="block text-sm">
              <span className="font-medium text-navy">Payment provider</span>
              <select
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                value={payment.provider}
                onChange={(e) =>
                  setPayment({
                    ...payment,
                    provider: e.target.value as PaymentSettingsPublic["provider"],
                  })
                }
              >
                <option value="stub">Stub (dev)</option>
                <option value="sepay">SePay</option>
                <option value="payos" disabled>
                  PayOS (chưa hỗ trợ)
                </option>
                <option value="megapay" disabled>
                  MegaPay (chưa hỗ trợ)
                </option>
              </select>
            </label>

            <label className="block text-sm">
              <span className="font-medium text-navy">Môi trường SePay</span>
              <select
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                value={payment.sepay.environment}
                onChange={(e) =>
                  setPayment({
                    ...payment,
                    sepay: {
                      ...payment.sepay,
                      environment: e.target.value as "sandbox" | "production",
                      mode:
                        e.target.value === "sandbox"
                          ? "payment_gateway"
                          : "bank_webhook",
                    },
                  })
                }
              >
                <option value="sandbox">Sandbox — Cổng thanh toán PG + IPN X-Secret-Key</option>
                <option value="production">
                  Production — VietQR + Webhook bank HMAC-SHA256
                </option>
              </select>
              <span className="mt-1 block text-xs text-muted">
                KEYON chỉ dùng một phương thức theo môi trường (giống CardOn tách mode).
              </span>
            </label>

            {payment.sepay.environment === "sandbox" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm sm:col-span-2">
                  <span className="font-medium text-navy">Merchant ID (mã đơn vị)</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 font-mono text-sm"
                    placeholder="SP-TEST-…"
                    value={payment.sepay.merchantId}
                    onChange={(e) =>
                      setPayment({
                        ...payment,
                        sepay: { ...payment.sepay, merchantId: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-navy">Merchant Secret Key</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    placeholder={
                      payment.sepay.merchantSecretConfigured
                        ? "Đã lưu — nhập để thay"
                        : "spsk_test_…"
                    }
                    value={merchantSecret}
                    onChange={(e) => setMerchantSecret(e.target.value)}
                  />
                  <span className="mt-1 block text-xs text-muted">
                    Ký form checkout PG (HMAC-SHA256 base64).
                  </span>
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-navy">IPN Secret (X-Secret-Key)</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    placeholder={
                      payment.sepay.ipnSecretConfigured
                        ? "Đã lưu — nhập để thay"
                        : "Tách với merchant secret nếu SePay cấp riêng"
                    }
                    value={ipnSecret}
                    onChange={(e) => setIpnSecret(e.target.value)}
                  />
                  <span className="mt-1 block text-xs text-muted">
                    Trống → dùng Merchant Secret. Header IPN:{" "}
                    <code className="text-[11px]">X-Secret-Key</code>
                  </span>
                </label>
                <div className="sm:col-span-2 space-y-2 rounded-xl border border-accent/30 bg-accent-soft/40 p-4 text-sm">
                  <p className="font-semibold text-navy">IPN Cổng thanh toán (sandbox)</p>
                  <p className="text-xs text-muted">
                    Cấu hình Callback/IPN trên SePay PG. Endpoint KEYON:
                  </p>
                  <p className="break-all rounded-md border border-border bg-white px-2 py-1.5 font-mono text-xs text-navy">
                    {payment.webhookUrl}
                  </p>
                  <ul className="list-inside list-disc text-xs text-navy">
                    <li>Checkout: pay-sandbox.sepay.vn</li>
                    <li>Auth IPN: header X-Secret-Key</li>
                    <li>Không dùng Webhook bank HMAC ở mode này</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium text-navy">Số tài khoản</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    value={payment.sepay.accountNumber}
                    onChange={(e) =>
                      setPayment({
                        ...payment,
                        sepay: { ...payment.sepay, accountNumber: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-navy">Bank BIN</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    placeholder="970436"
                    value={payment.sepay.bankBin}
                    onChange={(e) =>
                      setPayment({
                        ...payment,
                        sepay: { ...payment.sepay, bankBin: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-navy">Tên ngân hàng (hiển thị)</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    value={payment.sepay.bankDisplayName}
                    onChange={(e) =>
                      setPayment({
                        ...payment,
                        sepay: { ...payment.sepay, bankDisplayName: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-navy">Tên chủ TK</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    value={payment.sepay.accountName}
                    onChange={(e) =>
                      setPayment({
                        ...payment,
                        sepay: { ...payment.sepay, accountName: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-navy">HMAC webhook secret (whsec_…)</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    placeholder={
                      payment.sepay.webhookSecretConfigured
                        ? "Đã lưu — nhập để thay"
                        : "whsec_…"
                    }
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-navy">API key (fallback)</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    placeholder={
                      payment.sepay.apiKeyConfigured ? "Đã lưu — nhập để thay" : "Tuỳ chọn"
                    }
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                </label>
                <div className="sm:col-span-2 space-y-2 rounded-xl border border-accent/30 bg-accent-soft/40 p-4 text-sm">
                  <p className="font-semibold text-navy">Webhook bank (production)</p>
                  <p className="break-all rounded-md border border-border bg-white px-2 py-1.5 font-mono text-xs text-navy">
                    {payment.webhookUrl}
                  </p>
                  <ul className="list-inside list-disc text-xs text-navy">
                    <li>SePay → Webhooks → Bảo mật: HMAC-SHA256</li>
                    <li>Loại sự kiện: Tiền vào</li>
                    <li>Secret whsec_… khớp field HMAC bên trên</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {tab === "ncc" ? (
          <div className="space-y-6">
            <p className="text-sm text-muted">
              Pax8 driver đang resolve:{" "}
              <span className="font-medium text-navy">{supplierApi.resolved.pax8Driver}</span>{" "}
              (driver: {supplierApi.resolved.pax8DriverSource}, credentials:{" "}
              {supplierApi.resolved.pax8CredentialsSource}). Secret mã hóa AES. Field trống →
              ENV. Hồ sơ nhà cung cấp xem tại{" "}
              <Link href="/admin/suppliers" className="text-accent hover:underline">
                Nhà cung cấp
              </Link>
              .
            </p>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-navy">Pax8 (API provisioner)</h3>
              <label className="block text-sm">
                <span className="font-medium text-navy">Driver</span>
                <select
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                  value={supplierApi.pax8.driver}
                  onChange={(e) =>
                    setSupplierApi({
                      ...supplierApi,
                      pax8: {
                        ...supplierApi.pax8,
                        driver: e.target.value as "stub" | "sandbox" | "http",
                      },
                    })
                  }
                >
                  <option value="stub">Stub (dev / exit test)</option>
                  <option value="sandbox">Sandbox (stub behavior)</option>
                  <option value="http">HTTP (credentials only — live chưa bật)</option>
                </select>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm sm:col-span-2">
                  <span className="font-medium text-navy">Base URL</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    placeholder="https://api.pax8.com"
                    value={supplierApi.pax8.baseUrl}
                    onChange={(e) =>
                      setSupplierApi({
                        ...supplierApi,
                        pax8: { ...supplierApi.pax8, baseUrl: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-navy">Client ID</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    value={supplierApi.pax8.clientId}
                    onChange={(e) =>
                      setSupplierApi({
                        ...supplierApi,
                        pax8: { ...supplierApi.pax8, clientId: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-navy">Company ID</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    value={supplierApi.pax8.companyId}
                    onChange={(e) =>
                      setSupplierApi({
                        ...supplierApi,
                        pax8: { ...supplierApi.pax8, companyId: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="font-medium text-navy">Client secret</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    placeholder={
                      supplierApi.pax8.clientSecretConfigured
                        ? "Đã lưu — nhập để thay"
                        : "Nhập secret"
                    }
                    value={pax8Secret}
                    onChange={(e) => setPax8Secret(e.target.value)}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4 border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-navy">PACISOFT (dự phòng API)</h3>
              <p className="text-xs text-muted">
                Hiện seed là MANUAL_OPS — lưu credential sẵn khi bật API sau này.
              </p>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={supplierApi.pacisoft.enabled}
                  onChange={(e) =>
                    setSupplierApi({
                      ...supplierApi,
                      pacisoft: {
                        ...supplierApi.pacisoft,
                        enabled: e.target.checked,
                      },
                    })
                  }
                />
                <span className="font-medium text-navy">Đánh dấu đã cấu hình API</span>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm sm:col-span-2">
                  <span className="font-medium text-navy">Base URL</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    value={supplierApi.pacisoft.baseUrl}
                    onChange={(e) =>
                      setSupplierApi({
                        ...supplierApi,
                        pacisoft: {
                          ...supplierApi.pacisoft,
                          baseUrl: e.target.value,
                        },
                      })
                    }
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="font-medium text-navy">API key</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    placeholder={
                      supplierApi.pacisoft.apiKeyConfigured
                        ? "Đã lưu — nhập để thay"
                        : "Tuỳ chọn"
                    }
                    value={pacisoftKey}
                    onChange={(e) => setPacisoftKey(e.target.value)}
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="font-medium text-navy">Ghi chú</span>
                  <textarea
                    rows={2}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    value={supplierApi.pacisoft.notes}
                    onChange={(e) =>
                      setSupplierApi({
                        ...supplierApi,
                        pacisoft: {
                          ...supplierApi.pacisoft,
                          notes: e.target.value,
                        },
                      })
                    }
                  />
                </label>
              </div>
            </div>
          </div>
        ) : null}

        {tab === "storage" ? (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              Media upload dùng driver đang resolve:{" "}
              <span className="font-medium text-navy">{storage.resolvedDriver}</span>
              {storage.resolvedSource !== "local" ? (
                <> (nguồn: {storage.resolvedSource})</>
              ) : null}
              . Secret được mã hóa AES khi lưu.
            </p>

            <label className="block text-sm">
              <span className="font-medium text-navy">Driver</span>
              <select
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                value={storage.driver}
                onChange={(e) =>
                  setStorage({
                    ...storage,
                    driver: e.target.value as "local" | "wasabi",
                  })
                }
              >
                <option value="local">Local (dev)</option>
                <option value="wasabi">Wasabi (S3-compatible)</option>
              </select>
            </label>

            {storage.driver === "wasabi" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm sm:col-span-2">
                  <span className="font-medium text-navy">Endpoint</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    placeholder="https://s3.ap-southeast-1.wasabisys.com"
                    value={storage.wasabi.endpoint}
                    onChange={(e) =>
                      setStorage({
                        ...storage,
                        wasabi: { ...storage.wasabi, endpoint: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-navy">Region</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    placeholder="ap-southeast-1"
                    value={storage.wasabi.region}
                    onChange={(e) =>
                      setStorage({
                        ...storage,
                        wasabi: { ...storage.wasabi, region: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-navy">Bucket</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    value={storage.wasabi.bucket}
                    onChange={(e) =>
                      setStorage({
                        ...storage,
                        wasabi: { ...storage.wasabi, bucket: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-navy">Access key</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    value={storage.wasabi.accessKeyId}
                    onChange={(e) =>
                      setStorage({
                        ...storage,
                        wasabi: { ...storage.wasabi, accessKeyId: e.target.value },
                      })
                    }
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-navy">Secret key</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    placeholder={
                      storage.wasabi.secretConfigured
                        ? "Đã lưu — nhập để thay"
                        : "Nhập secret"
                    }
                    value={wasabiSecret}
                    onChange={(e) => setWasabiSecret(e.target.value)}
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="font-medium text-navy">Public base URL (CDN)</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    placeholder="https://media.tabfarm.vn"
                    value={storage.wasabi.publicBaseUrl}
                    onChange={(e) =>
                      setStorage({
                        ...storage,
                        wasabi: { ...storage.wasabi, publicBaseUrl: e.target.value },
                      })
                    }
                  />
                  <span className="mt-1 block text-xs text-muted">
                    URL công khai gắn vào mỗi ảnh khi upload. Hiện Wasabi public OK — dùng{" "}
                    <code className="text-[11px]">
                      https://s3.ap-southeast-1.wasabisys.com/media.keyon.vn
                    </code>
                    . Khi Cloudflare CDN (vd. https://media.tabfarm.vn) trả 200, đổi sang domain
                    CDN.
                  </span>
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-navy">Path prefix</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                    value={storage.wasabi.pathPrefix}
                    onChange={(e) =>
                      setStorage({
                        ...storage,
                        wasabi: { ...storage.wasabi, pathPrefix: e.target.value },
                      })
                    }
                  />
                </label>
              </div>
            ) : (
              <p className="rounded-lg border border-border bg-[#f8fafc] p-3 text-sm text-muted">
                Local lưu file trên server. Phù hợp môi trường dev.
              </p>
            )}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={
              loading ||
              ((tab === "chung" || tab === "seo") && !siteDirty)
            }
            onClick={save}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Đang lưu…" : "Lưu thay đổi"}
          </button>
          {tab === "email" ? (
            <>
              <button
                type="button"
                disabled={loading}
                onClick={testMailConnection}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-navy hover:bg-navy-soft disabled:opacity-50"
              >
                Kiểm tra kết nối
              </button>
              <label className="flex min-w-[220px] flex-1 items-center gap-2 text-sm sm:max-w-sm">
                <span className="sr-only">Email nhận thử</span>
                <input
                  type="email"
                  className="w-full rounded-lg border border-border px-3 py-2"
                  placeholder="Email nhận thử (vd. ban@gmail.com)"
                  value={mailTestTo}
                  onChange={(e) => setMailTestTo(e.target.value)}
                  autoComplete="email"
                />
              </label>
              <button
                type="button"
                disabled={loading}
                onClick={testMailSend}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-navy hover:bg-navy-soft disabled:opacity-50"
              >
                Gửi email thử
              </button>
            </>
          ) : null}
          {tab === "telegram" ? (
            <>
              <button
                type="button"
                disabled={loading}
                onClick={testTelegram}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-navy hover:bg-navy-soft disabled:opacity-50"
              >
                Gửi tin nhắn thử
              </button>
              {telegram.botTokenConfigured ? (
                <button
                  type="button"
                  disabled={loading}
                  onClick={clearTelegramToken}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-navy hover:bg-navy-soft disabled:opacity-50"
                >
                  Xóa token đã lưu
                </button>
              ) : null}
            </>
          ) : null}
          {tab === "storage" ? (
            <button
              type="button"
              disabled={loading}
              onClick={testStorage}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-navy hover:bg-navy-soft disabled:opacity-50"
            >
              Test kết nối
            </button>
          ) : null}
          {tab === "sepay" ? (
            <button
              type="button"
              disabled={loading}
              onClick={testPayment}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-navy hover:bg-navy-soft disabled:opacity-50"
            >
              Test cấu hình
            </button>
          ) : null}
          {tab === "ncc" ? (
            <button
              type="button"
              disabled={loading}
              onClick={testSupplierApi}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-navy hover:bg-navy-soft disabled:opacity-50"
            >
              Test cấu hình
            </button>
          ) : null}
          {msg && <span className="text-sm text-muted">{msg}</span>}
        </div>
      </div>
    </div>
  );
}
