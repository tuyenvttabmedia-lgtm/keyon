-- Replace step-list JSON with rich HTML (parity with Product.description)
ALTER TABLE "Product" ADD COLUMN "usageGuideHtml" TEXT;

-- Best-effort: convert any existing string[] steps into an ordered list
UPDATE "Product"
SET "usageGuideHtml" = (
  SELECT '<ol>' || string_agg(
    '<li>' ||
      replace(replace(replace(elem, '&', '&amp;'), '<', '&lt;'), '>', '&gt;') ||
    '</li>',
    ''
  ) || '</ol>'
  FROM jsonb_array_elements_text("usageGuides") AS t(elem)
)
WHERE jsonb_typeof("usageGuides") = 'array'
  AND jsonb_array_length("usageGuides") > 0;

ALTER TABLE "Product" DROP COLUMN "usageGuides";
