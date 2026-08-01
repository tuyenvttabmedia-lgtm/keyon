-- Inventory Read Model: threshold trên Variant (không tạo bảng stock)
ALTER TABLE "ProductVariant" ADD COLUMN IF NOT EXISTS "lowStockThreshold" INTEGER NOT NULL DEFAULT 10;
