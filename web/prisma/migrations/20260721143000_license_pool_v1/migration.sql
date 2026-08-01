-- License Pool v1.0: StockUnit → LicenseItem + events + 4 statuses

-- New enums
CREATE TYPE "LicenseItemStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'CONSUMED', 'DISABLED');
CREATE TYPE "LicenseEventType" AS ENUM ('RESERVED', 'CONSUMED', 'RELEASED', 'DISABLED');

-- Rename table
ALTER TABLE "StockUnit" RENAME TO "LicenseItem";

-- Map old statuses → new enum via text column dance
ALTER TABLE "LicenseItem" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "LicenseItem" ALTER COLUMN "status" TYPE TEXT USING (
  CASE "status"::text
    WHEN 'DELIVERED' THEN 'CONSUMED'
    WHEN 'REVOKED' THEN 'DISABLED'
    ELSE "status"::text
  END
);
ALTER TABLE "LicenseItem" ALTER COLUMN "status" TYPE "LicenseItemStatus" USING ("status"::"LicenseItemStatus");
ALTER TABLE "LicenseItem" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE'::"LicenseItemStatus";

DROP TYPE "StockUnitStatus";

-- Rename FK / indexes that Prisma expects
ALTER INDEX IF EXISTS "StockUnit_pkey" RENAME TO "LicenseItem_pkey";
ALTER INDEX IF EXISTS "StockUnit_orderItemId_key" RENAME TO "LicenseItem_orderItemId_key";
ALTER INDEX IF EXISTS "StockUnit_variantId_status_idx" RENAME TO "LicenseItem_variantId_status_idx";

ALTER TABLE "LicenseItem" RENAME CONSTRAINT "StockUnit_variantId_fkey" TO "LicenseItem_variantId_fkey";
ALTER TABLE "LicenseItem" RENAME CONSTRAINT "StockUnit_orderItemId_fkey" TO "LicenseItem_orderItemId_fkey";

-- Drop unique on orderItemId (batch qty>1)
ALTER TABLE "LicenseItem" DROP CONSTRAINT IF EXISTS "LicenseItem_orderItemId_key";
DROP INDEX IF EXISTS "LicenseItem_orderItemId_key";

-- Pool fields
ALTER TABLE "LicenseItem" ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "LicenseItem" ADD COLUMN IF NOT EXISTS "reservedOrderId" TEXT;
ALTER TABLE "LicenseItem" ADD COLUMN IF NOT EXISTS "reservedOrderItemId" TEXT;
ALTER TABLE "LicenseItem" ADD COLUMN IF NOT EXISTS "reservationToken" TEXT;
ALTER TABLE "LicenseItem" ADD COLUMN IF NOT EXISTS "expiresAt" TIMESTAMP(3);
ALTER TABLE "LicenseItem" ADD COLUMN IF NOT EXISTS "consumedAt" TIMESTAMP(3);
ALTER TABLE "LicenseItem" ADD COLUMN IF NOT EXISTS "disabledAt" TIMESTAMP(3);
ALTER TABLE "LicenseItem" ADD COLUMN IF NOT EXISTS "disabledReason" TEXT;

-- Backfill consumedAt for already consumed
UPDATE "LicenseItem" SET "consumedAt" = "updatedAt" WHERE "status" = 'CONSUMED' AND "consumedAt" IS NULL;

CREATE UNIQUE INDEX "LicenseItem_reservationToken_key" ON "LicenseItem"("reservationToken");
CREATE INDEX "LicenseItem_status_expiresAt_idx" ON "LicenseItem"("status", "expiresAt");
CREATE INDEX "LicenseItem_reservedOrderItemId_idx" ON "LicenseItem"("reservedOrderItemId");
CREATE INDEX "LicenseItem_orderItemId_idx" ON "LicenseItem"("orderItemId");

ALTER TABLE "LicenseItem" ADD CONSTRAINT "LicenseItem_reservedOrderId_fkey"
  FOREIGN KEY ("reservedOrderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "LicenseItem" ADD CONSTRAINT "LicenseItem_reservedOrderItemId_fkey"
  FOREIGN KEY ("reservedOrderItemId") REFERENCES "OrderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "reservationToken" TEXT;

CREATE TABLE "LicenseEvent" (
    "id" TEXT NOT NULL,
    "type" "LicenseEventType" NOT NULL,
    "licenseItemId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "orderId" TEXT,
    "orderItemId" TEXT,
    "reservationToken" TEXT,
    "reason" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LicenseEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LicenseEvent_type_createdAt_idx" ON "LicenseEvent"("type", "createdAt");
CREATE INDEX "LicenseEvent_licenseItemId_createdAt_idx" ON "LicenseEvent"("licenseItemId", "createdAt");
CREATE INDEX "LicenseEvent_variantId_type_idx" ON "LicenseEvent"("variantId", "type");
CREATE INDEX "LicenseEvent_reason_createdAt_idx" ON "LicenseEvent"("reason", "createdAt");

ALTER TABLE "LicenseEvent" ADD CONSTRAINT "LicenseEvent_licenseItemId_fkey"
  FOREIGN KEY ("licenseItemId") REFERENCES "LicenseItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
