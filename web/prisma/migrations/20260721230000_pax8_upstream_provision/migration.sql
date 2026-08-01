-- Pax8 / Semi-Automated: idempotent upstream provision refs on FulfillmentJob
ALTER TABLE "FulfillmentJob" ADD COLUMN IF NOT EXISTS "upstreamRequestId" TEXT;
ALTER TABLE "FulfillmentJob" ADD COLUMN IF NOT EXISTS "upstreamProvisionId" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "FulfillmentJob_upstreamRequestId_key" ON "FulfillmentJob"("upstreamRequestId");
