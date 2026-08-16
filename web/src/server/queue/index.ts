import { Queue, type ConnectionOptions } from "bullmq";
import IORedis from "ioredis";

let connection: IORedis | null = null;

export function getRedisConnection(): IORedis {
  if (!connection) {
    const url = process.env.REDIS_URL ?? "redis://localhost:6379";
    connection = new IORedis(url, { maxRetriesPerRequest: null });
  }
  return connection;
}

export function bullConnection(): ConnectionOptions {
  return getRedisConnection();
}

export const QUEUE_NAMES = {
  payment: "payment",
  fulfillment: "fulfillment",
  email: "email",
} as const;

export type PaymentJobData = {
  type: "mark_succeeded";
  paymentReference: string;
  amountVnd?: number | null;
  rawPayload?: Record<string, string | number | boolean | null>;
};

export type FulfillmentJobData = {
  type: "process_order" | "run_job";
  orderId?: string;
  jobId?: string;
};

export type EmailJobData = {
  type: "delivery_notice" | "generic";
  to: string;
  subject: string;
  text: string;
  html?: string;
};

function makeQueue<T>(name: string) {
  return new Queue<T>(name, { connection: bullConnection() });
}

let paymentQueue: Queue<PaymentJobData> | null = null;
let fulfillmentQueue: Queue<FulfillmentJobData> | null = null;
let emailQueue: Queue<EmailJobData> | null = null;

export function getPaymentQueue() {
  paymentQueue ??= makeQueue<PaymentJobData>(QUEUE_NAMES.payment);
  return paymentQueue;
}

export function getFulfillmentQueue() {
  fulfillmentQueue ??= makeQueue<FulfillmentJobData>(QUEUE_NAMES.fulfillment);
  return fulfillmentQueue;
}

export function getEmailQueue() {
  emailQueue ??= makeQueue<EmailJobData>(QUEUE_NAMES.email);
  return emailQueue;
}

export async function enqueuePaymentSucceeded(
  paymentReference: string,
  rawPayload?: PaymentJobData["rawPayload"],
  amountVnd?: number | null,
) {
  await getPaymentQueue().add(
    "mark_succeeded",
    { type: "mark_succeeded", paymentReference, rawPayload, amountVnd },
    {
      jobId: `pay_${paymentReference}`,
      removeOnComplete: 1000,
      removeOnFail: 5000,
      attempts: 5,
      backoff: { type: "exponential", delay: 2000 },
    },
  );
}

export async function enqueueFulfillmentOrder(orderId: string) {
  await getFulfillmentQueue().add(
    "process_order",
    { type: "process_order", orderId },
    {
      jobId: `fulfill_order_${orderId}`,
      removeOnComplete: 1000,
      removeOnFail: 5000,
      attempts: 5,
      backoff: { type: "exponential", delay: 2000 },
    },
  );
}

export async function enqueueEmail(data: EmailJobData) {
  await getEmailQueue().add("send", data, {
    removeOnComplete: 1000,
    removeOnFail: 5000,
    attempts: 3,
    backoff: { type: "exponential", delay: 1500 },
  });
}
