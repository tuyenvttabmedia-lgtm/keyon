import {
  defaultCmsAccount,
  type CmsAccount,
} from "@/server/cms/types";
import { ACCOUNT_UI } from "@/storefront/lib/account-ui";

export const ACCOUNT_OPS_KEYS = Object.keys(defaultCmsAccount) as (keyof CmsAccount)[];

/** Full copy for storefront views = UI chrome + ops CMS. */
export type AccountCopy = CmsAccount & typeof ACCOUNT_UI;

const LEGACY_ACCOUNT: Partial<Record<keyof CmsAccount, string>> = {
  licenseSecurityNote:
    "KEYON cam kết bảo mật tuyệt đối thông tin license của bạn.",
  licensesBannerBody:
    "100% license chính hãng · Kích hoạt nhanh chóng · Hỗ trợ tận tâm",
  licensesTrust1Title: "100% Chính hãng",
  licensesTrust1Body: "License chính hãng từ nhà cung cấp uy tín",
  licensesTrust2Title: "Kích hoạt nhanh",
  licensesTrust2Body: "Quy trình rõ ràng, kích hoạt chỉ trong vài phút",
  licensesTrust3Title: "Hỗ trợ tận tâm",
  licensesTrust3Body: "Đội ngũ kỹ thuật sẵn sàng hỗ trợ trong giờ làm việc",
  licensesTrust4Title: "Quản lý dễ dàng",
  licensesTrust4Body: "Theo dõi và quản lý tất cả license trên một nền tảng",
  promoBody:
    "Phần mềm bản quyền chính hãng — giao nhanh, lưu trong License của tôi.",
};

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
  for (const [key, legacy] of Object.entries(LEGACY_ACCOUNT) as [
    keyof CmsAccount,
    string,
  ][]) {
    if (merged[key] === legacy) {
      (merged as CmsAccount)[key] = defaultCmsAccount[key];
    }
  }
  return merged;
}
