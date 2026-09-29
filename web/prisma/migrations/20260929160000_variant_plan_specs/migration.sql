-- Per-package display rows for the infrastructure plan board.
ALTER TABLE "ProductVariant" ADD COLUMN "planSpecs" JSONB NOT NULL DEFAULT '[]';
