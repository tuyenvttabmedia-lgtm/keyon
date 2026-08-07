import { z } from "zod";

export const ESTIMATED_USERS = ["5", "10", "50", "100+", "OTHER"] as const;
export const LICENSE_TYPES = [
  "UNDECIDED",
  "PERPETUAL",
  "SUBSCRIPTION",
  "VOLUME",
] as const;
export const TERMS = [
  "UNDECIDED",
  "MONTHLY",
  "YEARLY",
  "PERPETUAL",
  "OTHER",
] as const;

export const ESTIMATED_USERS_LABEL: Record<(typeof ESTIMATED_USERS)[number], string> = {
  "5": "5 người dùng",
  "10": "10 người dùng",
  "50": "50 người dùng",
  "100+": "100+ người dùng",
  OTHER: "Khác",
};

export const LICENSE_TYPE_LABEL: Record<(typeof LICENSE_TYPES)[number], string> = {
  UNDECIDED: "Chưa xác định",
  PERPETUAL: "Perpetual",
  SUBSCRIPTION: "Subscription",
  VOLUME: "Volume",
};

export const TERM_LABEL: Record<(typeof TERMS)[number], string> = {
  UNDECIDED: "Chưa xác định",
  MONTHLY: "Theo tháng",
  YEARLY: "Theo năm",
  PERPETUAL: "Vĩnh viễn",
  OTHER: "Khác",
};

export function normalizePhone(raw: string): string {
  let s = raw.trim().replace(/[\s.\-()]/g, "");
  if (s.startsWith("+84")) s = `0${s.slice(3)}`;
  else if (/^84\d{8,}$/.test(s)) s = `0${s.slice(2)}`;
  return s;
}

function phoneOk(raw: string): boolean {
  const s = normalizePhone(raw);
  const digits = s.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

const productItem = z.object({
  slug: z.string().trim().max(120).optional(),
  name: z.string().trim().min(1).max(200),
});

export const quoteRequestBodySchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Vui lòng nhập họ và tên.")
      .max(100, "Họ và tên tối đa 100 ký tự."),
    email: z.string().trim().email("Email chưa đúng định dạng.").max(200),
    phone: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập số điện thoại.")
      .max(40)
      .refine(phoneOk, "Số điện thoại chưa hợp lệ."),
    companyName: z
      .string()
      .trim()
      .min(2, "Vui lòng nhập tên công ty.")
      .max(200, "Tên công ty tối đa 200 ký tự."),
    jobTitle: z.string().trim().max(120).optional().or(z.literal("")),
    interestedProducts: z.array(productItem).max(20).default([]),
    estimatedUsers: z.enum(ESTIMATED_USERS),
    estimatedUsersOther: z.number().int().min(1).max(100_000).optional().nullable(),
    licenseType: z.enum(LICENSE_TYPES).default("UNDECIDED"),
    term: z.enum(TERMS).default("UNDECIDED"),
    message: z.string().trim().max(2000).optional().or(z.literal("")),
    privacyAccepted: z
      .boolean()
      .refine((v) => v === true, {
        message: "Vui lòng đồng ý với Chính sách bảo mật.",
      }),
    requestType: z.string().trim().max(60).optional().default("GENERAL"),
    sourcePath: z.string().trim().max(300).optional().or(z.literal("")),
    /** Honeypot — must stay empty */
    companyUrl: z.string().max(0).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.estimatedUsers === "OTHER") {
      if (data.estimatedUsersOther == null || data.estimatedUsersOther < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["estimatedUsersOther"],
          message: "Vui lòng nhập số lượng người dùng.",
        });
      }
    }
  });

export type QuoteRequestBody = z.infer<typeof quoteRequestBodySchema>;
