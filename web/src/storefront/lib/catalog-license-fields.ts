import {
  ACTIVATION_METHODS,
  LICENSE_CHANNELS,
  LICENSE_REGIONS,
  LICENSE_TERMS,
  PRODUCT_LANGUAGES,
  PRODUCT_PLATFORMS,
  parsePlatforms,
  parseSeoKeywords,
  optionalEnum,
} from "@/storefront/lib/license-catalog";
import { z } from "zod";

const emptyToNull = (v: unknown) => {
  if (v === undefined) return undefined;
  if (v === null) return null;
  if (typeof v === "string" && !v.trim()) return null;
  return v;
};

function optionalEnumSchema<T extends string>(allowed: readonly T[]) {
  return z.preprocess(
    emptyToNull,
    z
      .string()
      .nullable()
      .optional()
      .refine(
        (v) => v == null || (allowed as readonly string[]).includes(v),
        { message: "Giá trị không hợp lệ" },
      ),
  );
}

export const productSpecSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  group: z.enum(["general", "system"]).optional(),
});

/** Shared Product catalog fields (create + patch). */
export const productCatalogFieldsSchema = z.object({
  focusKeyword: z.preprocess(emptyToNull, z.string().nullable().optional()),
  seoKeywords: z.array(z.string()).optional(),
  canonicalUrl: z.preprocess(emptyToNull, z.string().nullable().optional()),
  ogTitle: z.preprocess(emptyToNull, z.string().nullable().optional()),
  ogDescription: z.preprocess(emptyToNull, z.string().nullable().optional()),
  platforms: z.array(z.string()).optional(),
  language: optionalEnumSchema(PRODUCT_LANGUAGES),
  licenseChannelDefault: optionalEnumSchema(LICENSE_CHANNELS),
  licenseTermDefault: optionalEnumSchema(LICENSE_TERMS),
  seatsDefault: z.preprocess(emptyToNull, z.string().nullable().optional()),
  activationMethodDefault: optionalEnumSchema(ACTIVATION_METHODS),
  transferPolicy: z.preprocess(emptyToNull, z.string().nullable().optional()),
  upgradePolicy: z.preprocess(emptyToNull, z.string().nullable().optional()),
  accountRequired: z.preprocess(emptyToNull, z.string().nullable().optional()),
});

/** Shared Variant license merchandising fields. */
export const variantLicenseFieldsSchema = z.object({
  licenseChannel: optionalEnumSchema(LICENSE_CHANNELS),
  licenseTerm: optionalEnumSchema(LICENSE_TERMS),
  seatsLabel: z.preprocess(emptyToNull, z.string().nullable().optional()),
  regionCode: optionalEnumSchema(LICENSE_REGIONS),
  activationMethod: optionalEnumSchema(ACTIVATION_METHODS),
});

export function normalizeProductCatalogWrite(
  body: z.infer<typeof productCatalogFieldsSchema>,
) {
  return {
    ...(body.focusKeyword !== undefined
      ? { focusKeyword: body.focusKeyword }
      : {}),
    ...(body.seoKeywords !== undefined
      ? { seoKeywords: parseSeoKeywords(body.seoKeywords) }
      : {}),
    ...(body.canonicalUrl !== undefined
      ? { canonicalUrl: body.canonicalUrl }
      : {}),
    ...(body.ogTitle !== undefined ? { ogTitle: body.ogTitle } : {}),
    ...(body.ogDescription !== undefined
      ? { ogDescription: body.ogDescription }
      : {}),
    ...(body.platforms !== undefined
      ? { platforms: parsePlatforms(body.platforms) }
      : {}),
    ...(body.language !== undefined
      ? {
          language:
            optionalEnum(body.language, PRODUCT_LANGUAGES) ?? body.language,
        }
      : {}),
    ...(body.licenseChannelDefault !== undefined
      ? {
          licenseChannelDefault:
            optionalEnum(body.licenseChannelDefault, LICENSE_CHANNELS) ??
            body.licenseChannelDefault,
        }
      : {}),
    ...(body.licenseTermDefault !== undefined
      ? {
          licenseTermDefault:
            optionalEnum(body.licenseTermDefault, LICENSE_TERMS) ??
            body.licenseTermDefault,
        }
      : {}),
    ...(body.seatsDefault !== undefined
      ? { seatsDefault: body.seatsDefault }
      : {}),
    ...(body.activationMethodDefault !== undefined
      ? {
          activationMethodDefault:
            optionalEnum(body.activationMethodDefault, ACTIVATION_METHODS) ??
            body.activationMethodDefault,
        }
      : {}),
    ...(body.transferPolicy !== undefined
      ? { transferPolicy: body.transferPolicy }
      : {}),
    ...(body.upgradePolicy !== undefined
      ? { upgradePolicy: body.upgradePolicy }
      : {}),
    ...(body.accountRequired !== undefined
      ? { accountRequired: body.accountRequired }
      : {}),
  };
}

export function normalizeVariantLicenseWrite(
  body: z.infer<typeof variantLicenseFieldsSchema>,
) {
  return {
    ...(body.licenseChannel !== undefined
      ? {
          licenseChannel:
            optionalEnum(body.licenseChannel, LICENSE_CHANNELS) ??
            body.licenseChannel,
        }
      : {}),
    ...(body.licenseTerm !== undefined
      ? {
          licenseTerm:
            optionalEnum(body.licenseTerm, LICENSE_TERMS) ?? body.licenseTerm,
        }
      : {}),
    ...(body.seatsLabel !== undefined ? { seatsLabel: body.seatsLabel } : {}),
    ...(body.regionCode !== undefined
      ? {
          regionCode:
            optionalEnum(body.regionCode, LICENSE_REGIONS) ?? body.regionCode,
        }
      : {}),
    ...(body.activationMethod !== undefined
      ? {
          activationMethod:
            optionalEnum(body.activationMethod, ACTIVATION_METHODS) ??
            body.activationMethod,
        }
      : {}),
  };
}

export {
  LICENSE_CHANNELS,
  LICENSE_TERMS,
  LICENSE_REGIONS,
  ACTIVATION_METHODS,
  PRODUCT_PLATFORMS,
  PRODUCT_LANGUAGES,
};
