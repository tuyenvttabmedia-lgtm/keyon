-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Supplier" ADD COLUMN "contactName" TEXT;
ALTER TABLE "Supplier" ADD COLUMN "contactEmail" TEXT;
ALTER TABLE "Supplier" ADD COLUMN "website" TEXT;
