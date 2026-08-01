import { z } from "zod";

const emptyToNull = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((v) => {
    if (v == null) return null;
    const t = String(v).trim();
    return t.length ? t : null;
  });

const brandFields = {
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(80).optional(),
  supplierId: z.string().min(1).nullable().optional(),
  logoUrl: emptyToNull.optional(),
  bannerDesktopUrl: emptyToNull.optional(),
  bannerMobileUrl: emptyToNull.optional(),
  shortDescription: emptyToNull.optional(),
  description: emptyToNull.optional(),
  seoTitle: emptyToNull.optional(),
  seoDescription: emptyToNull.optional(),
  ogImageUrl: emptyToNull.optional(),
  canonicalUrl: emptyToNull.optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
};

export const brandCreateSchema = z.object(brandFields);

export const brandPatchSchema = z
  .object({
    ...brandFields,
    name: z.string().min(1).max(120).optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "Empty patch" });

export type BrandCreateBody = z.infer<typeof brandCreateSchema>;
export type BrandPatchBody = z.infer<typeof brandPatchSchema>;

export function slugifyBrand(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function pickBrandContent(
  body: BrandCreateBody | BrandPatchBody,
): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  const keys = [
    "logoUrl",
    "bannerDesktopUrl",
    "bannerMobileUrl",
    "shortDescription",
    "description",
    "seoTitle",
    "seoDescription",
    "ogImageUrl",
    "canonicalUrl",
    "featured",
    "sortOrder",
    "active",
    "supplierId",
  ] as const;
  for (const k of keys) {
    if (k in body && body[k] !== undefined) data[k] = body[k];
  }
  return data;
}
