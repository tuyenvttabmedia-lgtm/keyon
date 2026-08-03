import {
  defaultCmsAccount,
  type CmsAccount,
} from "@/server/cms/types";
import { ACCOUNT_UI } from "@/storefront/lib/account-ui";

export const ACCOUNT_OPS_KEYS = Object.keys(defaultCmsAccount) as (keyof CmsAccount)[];

/** Full copy for storefront views = UI chrome + ops CMS. */
export type AccountCopy = CmsAccount & typeof ACCOUNT_UI;

export function pickAccountOps(
  raw: Record<string, unknown> | null | undefined,
): Partial<CmsAccount> {
  if (!raw) return {};
  const out: Partial<CmsAccount> = {};
  for (const key of ACCOUNT_OPS_KEYS) {
    const v = raw[key];
    if (typeof v === "string") out[key] = v;
  }
  return out;
}

export function resolveAccountCopy(
  raw: Partial<CmsAccount> | Record<string, unknown> | null | undefined,
): AccountCopy {
  const ops = pickAccountOps(raw as Record<string, unknown>);
  const merged = {
    ...ACCOUNT_UI,
    ...defaultCmsAccount,
    ...ops,
  };
  // Legacy CMS may still store /support (no route) → FAQ help center
  if (merged.activationGuideHref === "/support") {
    merged.activationGuideHref = "/faq";
  }
  return merged;
}
