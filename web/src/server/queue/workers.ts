import { Worker } from "bullmq";
import {
  QUEUE_NAMES,
  bullConnection,
  type PaymentJobData,
  type FulfillmentJobData,
  type EmailJobData,
} from "./index";
import { markPaymentSucceeded } from "@/server/payment/money";
import { processFulfillmentForOrder, runFulfillmentJob } from "@/server/fulfillment/engine";
import { sendMail } from "@/server/mail";
import { childLogger } from "@/lib/logger";

const log = childLogger("worker");

export function startWorkers() {
  const paymentWorker = new Worker<PaymentJobData>(
    QUEUE_NAMES.payment,
    async (job) => {
      if (job.data.type === "mark_succeeded") {
        await markPaymentSucceeded({
          paymentReference: job.data.paymentReference,
          rawPayload: job.data.rawPayload,
        });
      }
    },
    { connection: bullConnection() },
  );

  const fulfillmentWorker = new Worker<FulfillmentJobData>(
    QUEUE_NAMES.fulfillment,
    async (job) => {
      if (job.data.type === "process_order" && job.data.orderId) {
        await processFulfillmentForOrder(job.data.orderId);
      }
      if (job.data.type === "run_job" && job.data.jobId) {
        await runFulfillmentJob(job.data.jobId);
      }
    },
    { connection: bullConnection() },
  );

  const emailWorker = new Worker<EmailJobData>(
    QUEUE_NAMES.email,
    async (job) => {
      await sendMail({
        to: job.data.to,
        subject: job.data.subject,
        text: job.data.text,
        html: job.data.html,
      });
    },
    { connection: bullConnection() },
  );

  for (const w of [paymentWorker, fulfillmentWorker, emailWorker]) {
    w.on("completed", (job) => log.info({ queue: w.name, id: job.id }, "job completed"));
    w.on("failed", (job, err) =>
      log.error({ queue: w.name, id: job?.id, err }, "job failed"),
    );
  }

  log.info("BullMQ workers started (payment, fulfillment, email)");
  return { paymentWorker, fulfillmentWorker, emailWorker };
}
