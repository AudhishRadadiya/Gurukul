import { DateTime } from "luxon";
import { z } from "zod";

import type { DonationEntryFormFieldValues } from "@web/components/Donation/donationEntry/addDonationEntry/DonationEntryForm";
import {
  emailRegex,
  mobileNumberRegex,
  panCardRegex,
  pinCodeRegex,
} from "@web/utils/regex";

export const EventDonationSchema = z.object({
  amount: z.number().nullable(),
  event_donation_id: z.string().nullable(),
});

export const SelectedPreviousDonationSchema = z.object({
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  email_id: z.string().nullable().optional(),
  pan_no: z.string().nullable().optional(),
  pincode: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
});

export const DonationEntryFormSchema = z
  .object({
    // aadhar_no: z
    //   .string()
    //   .trim()
    //   .min(12, { message: "common.aadhar_no.invalid" })
    //   .nullable()
    //   .optional(),
    address: z.string().nullable().optional(),
    amount: z
      .number()
      .max(99999999, { message: "common.number.maxLength" })
      .nullable(),
    atg: z.boolean().nullable(),
    bank_id: z.string().nullable().optional(),
    branch_id: z.string().nullable(),
    business_name: z.string().nullable().optional(),
    cheque_no: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    contact_no: z
      .string()
      .regex(mobileNumberRegex, "common.mobileNumber.invalid")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    date: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    direct_print: z.boolean().nullable(),
    donation_mode_id: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    donation_type_id: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    // driving_licence_no: z.string().nullable().optional(),
    // electors_number: z.string().nullable().optional(),
    email_id: z
      .string()
      .trim()
      .regex(emailRegex, "common.email.invalid")
      .optional()
      .nullable(),

    event_donation: z.array(EventDonationSchema).nullable().optional(),
    event_reminder_date: z.string().nullable().optional(),
    event_reminder_note: z.string().nullable().optional(),
    event_type_id: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    first_name: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    focus_on_trust: z.boolean().nullable(),
    is_bank_mode: z.boolean().nullable(),
    is_cancel: z.boolean().nullable().optional(),
    is_reminder: z.boolean().nullable(),
    last_five_entry: z.boolean().default(true),
    last_name: z.string().nullable().optional(),
    middle_name: z.string().nullable().optional(),
    name_of_receipt: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    organize_remark: z.string().nullable().optional(),
    pan_no: z
      .string()
      .regex(panCardRegex, "common.pan_card_no.invalid")
      .optional()
      .nullable(),
    // passport_no: z.string().nullable().optional(),
    pincode: z
      .string()
      .regex(pinCodeRegex, "common.pin_code.invalid")
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    prasad: z.boolean().nullable(),
    print_receipt: z.boolean().nullable(),
    proof_validate: z.string().optional(),
    receipt_no: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    receipt_sequence: z.number().nullable().optional(),
    ref_receipt_no: z.string().nullable().optional(),
    remarks: z.string().nullable().optional(),
    selected_previousDonation: SelectedPreviousDonationSchema,
    send_email: z.boolean().nullable(),
    send_sms: z.boolean().nullable(),
    send_whatsapp: z.boolean().nullable(),
    show_business_name: z.boolean().nullable().optional(),
    // show_id_fields: z.boolean(),
    state: z.string().nullable().optional(),
    trust_data: z
      .object({
        address_limit: z.number().nullable().optional(),
        cash_limit: z.number().nullable().optional(),
        cheque_limit: z.number().nullable().optional(),
        label: z.string(),
        short_name: z.string().nullable().optional(),
        value: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
    trust_id: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
  })
  // eslint-disable-next-line sonarjs/cognitive-complexity
  .superRefine((data, ctx) => {
    const hasATG = !!data.atg;

    const hasTrustId = !!data.trust_id;

    const hasChequeLimit = !!data.trust_data?.cheque_limit;

    const hasAmountExceedingLimit =
      !!data.amount && data.amount > (data.trust_data?.cheque_limit ?? 0);

    // const hasAnyDocument =
    //   !!data.aadhar_no ||
    //   !!data.driving_licence_no ||
    //   !!data.electors_number ||
    //   !!data.pan_no ||
    //   !!data.passport_no;

    const hasAnyDocument = !!data.pan_no;

    if (data.is_bank_mode) {
      if (!data.cheque_no) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["cheque_no"],
        });
      }

      if (!data.bank_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["bank_id"],
        });
      }
    }

    if (data.is_reminder) {
      if (!data.event_reminder_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["event_reminder_date"],
        });
      }
    }

    if (
      hasTrustId &&
      data.trust_data?.address_limit != null &&
      data.amount &&
      data.amount > data.trust_data.address_limit
    ) {
      if (!data.address) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.required",
          path: ["address"],
        });
      }
    }

    if (
      data.is_bank_mode &&
      hasATG &&
      hasTrustId &&
      hasChequeLimit &&
      hasAmountExceedingLimit &&
      !hasAnyDocument
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "proof.validation",
        path: ["proof_validate"],
      });
    }

    // if (
    //   data.driving_licence_no &&
    //   !licenseNumberRegex.test(data.driving_licence_no)
    // ) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "common.license_no.invalid",
    //     path: ["driving_licence_no"],
    //   });
    // }

    // if (data.electors_number && !voterIdRegex.test(data.electors_number)) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "common.elector_no.invalid",
    //     path: ["electors_number"],
    //   });
    // }

    if (data.pan_no && !panCardRegex.test(data.pan_no)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.pan_card_no.invalid",
        path: ["pan_no"],
      });
    }

    // if (data.passport_no && !passportNumberRegex.test(data.passport_no)) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     message: "common.passport_no.invalid",
    //     path: ["passport_no"],
    //   });
    // }

    if (data.is_cancel) {
      if (data.amount === null || data.amount < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "common.min_amount.greater_than.zero",
          path: ["amount"],
        });
      }
    }

    if (!data.is_cancel && data.amount !== null && data.amount < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.min_amount.greater_than.one",
        path: ["amount"],
      });
    }

    if (!data.is_cancel && data.amount === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "common.required",
        path: ["amount"],
      });
    }
  });

export const donationEntryFormDefaultValues: DonationEntryFormFieldValues = {
  // aadhar_no: null,
  address: null,
  amount: 0,
  atg: true,
  bank_id: null,
  branch_id: null,
  business_name: null,
  cheque_no: null,
  city: null,
  contact_no: null,
  date: DateTime.now().toISODate(),
  direct_print: false,
  donation_mode_id: null,
  donation_type_id: null,
  // driving_licence_no: null,
  // electors_number: null,
  email_id: null,
  event_donation: [],
  event_reminder_date: null,
  event_reminder_note: null,
  event_type_id: null,
  first_name: null,
  focus_on_trust: false,
  is_bank_mode: false,
  is_reminder: false,
  last_five_entry: true,
  last_name: null,
  middle_name: null,
  name_of_receipt: null,
  organize_remark: null,
  pan_no: null,
  // passport_no: null,
  pincode: null,
  prasad: false,
  print_receipt: true,
  receipt_no: null,
  receipt_sequence: 0,
  ref_receipt_no: null,
  remarks: null,
  selected_previousDonation: {
    address: null,
    city: null,
    email_id: null,
    pan_no: null,
    pincode: null,
    state: null,
  },
  send_email: false,
  send_sms: false,
  send_whatsapp: false,
  show_business_name: false,
  // show_id_fields: false,
  state: null,
  trust_data: {
    label: "",
    value: null,
  },
  trust_id: null,
};
