import { z } from "zod";

import { isValidMobileNumber } from "@web/utils/mobileNumberValidate";
import { otpRegex, passwordRegex } from "@web/utils/regex";

export const LoginFormValuesSchema = z.object({
  login_name: z
    .string()
    .trim()
    .min(1, { message: "common.required" })
    .refine((value) => !!value, {
      message: "common.required",
    }),
  password: z
    .string()
    .trim()
    .min(1, { message: "common.required" })
    .max(128, { message: "common.max" })
    .regex(passwordRegex, "common.password.regex")
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export const OTPSchema = z.object({
  code: z
    .string()
    .trim()
    .min(4, { message: "common.otp.min" })
    .max(6, { message: "common.otp.max" })
    .regex(otpRegex, { message: "common.otp.regex" }),
});

export const MobileNumberSchema = z.object({
  mobile_number: z
    .string()
    .refine(isValidMobileNumber, {
      message: "common.mobileNumber.invalid",
    })
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export const GoogleAuthSchema = z.object({
  code: z
    .string()
    .trim()
    .min(6, { message: "common.auth.code" })
    .max(6, { message: "common.auth.code" })
    .regex(otpRegex, { message: "common.auth.code.regex" }),
});

export type LoginFormFieldValues = z.infer<typeof LoginFormValuesSchema>;

export type MobileNumberFormFieldValues = z.infer<typeof MobileNumberSchema>;

export type OTPFormFieldValues = z.infer<typeof OTPSchema>;

export type GoogleAuthFormFieldValues = z.infer<typeof GoogleAuthSchema>;
