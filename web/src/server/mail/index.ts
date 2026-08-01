import nodemailer from "nodemailer";
import { childLogger } from "@/lib/logger";
import { recordMailHealth, resolveMail } from "@/server/mail/config";

const log = childLogger("mail");

export type SendMailInput = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
};

async function transporter() {
  const cfg = await resolveMail();
  return {
    cfg,
    transport: nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: cfg.user
        ? {
            user: cfg.user,
            pass: cfg.pass,
          }
        : undefined,
    }),
  };
}

export async function sendMail(input: SendMailInput) {
  const { cfg, transport } = await transporter();
  try {
    const info = await transport.sendMail({
      from: cfg.from,
      replyTo: input.replyTo || cfg.replyTo || undefined,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
    log.info(
      { to: input.to, messageId: info.messageId, subject: input.subject },
      "mail sent",
    );
    await recordMailHealth("send", true).catch(() => undefined);
    return info;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "send failed";
    await recordMailHealth("send", false, msg).catch(() => undefined);
    throw e;
  }
}

/** Verify SMTP handshake without sending a message. */
export async function verifyMailConnection() {
  const { cfg, transport } = await transporter();
  try {
    await transport.verify();
    await recordMailHealth("connection", true);
    return { ok: true as const, cfg };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "connection failed";
    await recordMailHealth("connection", false, msg);
    return { ok: false as const, error: msg, cfg };
  }
}
