-- SePay / Payment Domain reconcile + L1 webhook + events
ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'CANCELLED';

ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL DEFAULT 'VND';
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "providerReference" TEXT;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "providerTransactionId" TEXT;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "providerEventId" TEXT;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "providerPaidAt" TIMESTAMP(3);
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3);

CREATE UNIQUE INDEX IF NOT EXISTS "Payment_providerEventId_key" ON "Payment"("providerEventId");
CREATE INDEX IF NOT EXISTS "Payment_status_idx" ON "Payment"("status");

CREATE TABLE IF NOT EXISTS "PaymentWebhookReceipt" (
    "id" TEXT NOT NULL,
    "providerEventId" TEXT NOT NULL,
    "paymentReference" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'sepay',
    "rawPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PaymentWebhookReceipt_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PaymentWebhookReceipt_providerEventId_key" ON "PaymentWebhookReceipt"("providerEventId");
CREATE INDEX IF NOT EXISTS "PaymentWebhookReceipt_paymentReference_idx" ON "PaymentWebhookReceipt"("paymentReference");

CREATE TYPE "PaymentDomainEventType" AS ENUM ('CREATED', 'SUCCEEDED', 'FAILED', 'EXPIRED', 'CANCELLED');

CREATE TABLE IF NOT EXISTS "PaymentDomainEvent" (
    "id" TEXT NOT NULL,
    "type" "PaymentDomainEventType" NOT NULL,
    "paymentId" TEXT NOT NULL,
    "reason" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PaymentDomainEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "PaymentDomainEvent_type_createdAt_idx" ON "PaymentDomainEvent"("type", "createdAt");
CREATE INDEX IF NOT EXISTS "PaymentDomainEvent_paymentId_idx" ON "PaymentDomainEvent"("paymentId");

ALTER TABLE "PaymentDomainEvent" DROP CONSTRAINT IF EXISTS "PaymentDomainEvent_paymentId_fkey";
ALTER TABLE "PaymentDomainEvent" ADD CONSTRAINT "PaymentDomainEvent_paymentId_fkey"
  FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
