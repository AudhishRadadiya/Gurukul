import { z } from "zod";

import { mobileNoRegex } from "@web/utils/regex";

export const ContactDetailItemFormSchema = z.object({
  mobile_no: z
    .string()
    .regex(mobileNoRegex, "common.mobileNumber.invalid")
    .nullable()
    .refine((value) => !!value?.trim(), {
      message: "common.required",
    }),
  selected: z.boolean(),
});

export type ContactDetailItemFormValues = z.infer<
  typeof ContactDetailItemFormSchema
>;

export type ContactDetailExcelImportRow = Record<string, string | number>;
