/** Canonical B2B consult / quote CTA — prefer this over /contact/quote (redirect alias). */
export const QUOTE_HREF = "/contact/quote" as const;
export const QUOTE_LABEL = "Liên hệ tư vấn" as const;

/** Implementation services intake — Outer Layer quote, not a Core Order type. */
export const IMPLEMENTATION_QUOTE_HREF =
  "/contact/quote?intent=implementation" as const;
