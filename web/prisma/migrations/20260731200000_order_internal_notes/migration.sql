-- Staff-only internal notes on orders (ops workspace)
CREATE TABLE IF NOT EXISTS "OrderNote" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "authorId" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderNote_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "OrderNote_orderId_createdAt_idx" ON "OrderNote"("orderId", "createdAt");

DO $$ BEGIN
  ALTER TABLE "OrderNote" ADD CONSTRAINT "OrderNote_orderId_fkey"
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "OrderNote" ADD CONSTRAINT "OrderNote_authorId_fkey"
    FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
