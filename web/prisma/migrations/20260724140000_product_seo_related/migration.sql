-- Catalog SEO + curated related products
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "seoTitle" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "seoDescription" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "relatedProductIds" JSONB NOT NULL DEFAULT '[]';
