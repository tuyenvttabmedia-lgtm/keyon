-- AlterTable
ALTER TABLE "Brand" ADD COLUMN "logoUrl" TEXT;
ALTER TABLE "Brand" ADD COLUMN "bannerDesktopUrl" TEXT;
ALTER TABLE "Brand" ADD COLUMN "bannerMobileUrl" TEXT;
ALTER TABLE "Brand" ADD COLUMN "shortDescription" TEXT;
ALTER TABLE "Brand" ADD COLUMN "description" TEXT;
ALTER TABLE "Brand" ADD COLUMN "seoTitle" TEXT;
ALTER TABLE "Brand" ADD COLUMN "seoDescription" TEXT;
ALTER TABLE "Brand" ADD COLUMN "ogImageUrl" TEXT;
ALTER TABLE "Brand" ADD COLUMN "canonicalUrl" TEXT;
ALTER TABLE "Brand" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Brand" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Brand" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Brand_active_sortOrder_idx" ON "Brand"("active", "sortOrder");

-- CreateIndex
CREATE INDEX "Brand_featured_active_idx" ON "Brand"("featured", "active");
