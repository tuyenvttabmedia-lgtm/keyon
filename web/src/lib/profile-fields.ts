import { z } from "zod";

/** Shared customer profile fields (register + account profile). */

export const profileNameSchema = z
  .string()
  .trim()
  .min(1, "Vui lòng nhập họ tên")
  .max(120);

export const profilePhoneSchema = z
  .string()
  .trim()
  .min(8, "Số điện thoại không hợp lệ")
  .max(30)
  .regex(/^[0-9+\s().-]+$/, "Số điện thoại không hợp lệ");

export const profilePhoneOptionalSchema = z
  .string()
  .trim()
  .max(30)
  .optional()
  .transform((v) => (v == null || v === "" ? null : v))
  .refine(
    (v) => v == null || (/^[0-9+\s().-]+$/.test(v) && v.length >= 8),
    "Số điện thoại không hợp lệ",
  );

export const profileAddressOptionalSchema = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((v) => (v == null || v === "" ? null : v));

export const profileDateOfBirthOptionalSchema = z
  .string()
  .optional()
  .nullable()
  .transform((v, ctx) => {
    if (v == null || v === "") return null;
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ngày sinh không hợp lệ",
      });
      return z.NEVER;
    }
    const min = new Date("1900-01-01");
    const max = new Date();
    if (d < min || d > max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ngày sinh không hợp lệ",
      });
      return z.NEVER;
    }
    return d;
  });

/** PATCH /api/account/profile — all optional (partial update). */
export const profileUpdateSchema = z.object({
  name: profileNameSchema.optional(),
  phone: profilePhoneOptionalSchema,
  address: profileAddressOptionalSchema,
  dateOfBirth: profileDateOfBirthOptionalSchema,
});

/** POST /api/auth/register — core identity + profile fields. */
export const registerProfileSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
  name: profileNameSchema,
  phone: profilePhoneSchema,
  address: profileAddressOptionalSchema,
  dateOfBirth: profileDateOfBirthOptionalSchema,
});
