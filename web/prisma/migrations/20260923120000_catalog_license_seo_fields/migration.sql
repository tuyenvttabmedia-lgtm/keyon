-- Catalog license merchandising + SEO enrichment (additive only)
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "focusKeyword" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "seoKeywords" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "canonicalUrl" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "ogTitle" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "ogDescription" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "platforms" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "language" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "licenseChannelDefault" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "licenseTermDefault" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "seatsDefault" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "activationMethodDefault" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "transferPolicy" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "upgradePolicy" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "accountRequired" TEXT;

ALTER TABLE "ProductVariant" ADD COLUMN IF NOT EXISTS "licenseChannel" TEXT;
ALTER TABLE "ProductVariant" ADD COLUMN IF NOT EXISTS "licenseTerm" TEXT;
ALTER TABLE "ProductVariant" ADD COLUMN IF NOT EXISTS "seatsLabel" TEXT;
ALTER TABLE "ProductVariant" ADD COLUMN IF NOT EXISTS "regionCode" TEXT;
ALTER TABLE "ProductVariant" ADD COLUMN IF NOT EXISTS "activationMethod" TEXT;