-- CreateTable
CREATE TABLE "OrganizationOrder" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationOrder_organizationId_orderId_key" ON "OrganizationOrder"("organizationId", "orderId");

-- CreateIndex
CREATE INDEX "OrganizationOrder_orderId_idx" ON "OrganizationOrder"("orderId");

-- AddForeignKey
ALTER TABLE "OrganizationOrder" ADD CONSTRAINT "OrganizationOrder_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationOrder" ADD CONSTRAINT "OrganizationOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
