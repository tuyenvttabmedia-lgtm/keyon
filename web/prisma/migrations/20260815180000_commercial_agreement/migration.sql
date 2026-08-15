-- CreateEnum
CREATE TYPE "CommercialAgreementStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED');

-- CreateTable
CREATE TABLE "CommercialAgreement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "reference" TEXT,
    "organizationId" TEXT,
    "status" "CommercialAgreementStatus" NOT NULL DEFAULT 'DRAFT',
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommercialAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommercialAgreementOrder" (
    "id" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommercialAgreementOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommercialAgreement_organizationId_idx" ON "CommercialAgreement"("organizationId");

-- CreateIndex
CREATE INDEX "CommercialAgreement_status_createdAt_idx" ON "CommercialAgreement"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CommercialAgreementOrder_agreementId_orderId_key" ON "CommercialAgreementOrder"("agreementId", "orderId");

-- CreateIndex
CREATE INDEX "CommercialAgreementOrder_orderId_idx" ON "CommercialAgreementOrder"("orderId");

-- AddForeignKey
ALTER TABLE "CommercialAgreement" ADD CONSTRAINT "CommercialAgreement_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommercialAgreementOrder" ADD CONSTRAINT "CommercialAgreementOrder_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "CommercialAgreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommercialAgreementOrder" ADD CONSTRAINT "CommercialAgreementOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
