import {
  FormContainer,
  GridProvider,
  PhoneInputField,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { MailSettingAutocomplete } from "@web/components/common/Autocomplete/MailSettingAutocomplete";
import { SmsSettingAutocomplete } from "@web/components/common/Autocomplete/SmsSettingAutocomplete";
import { WhatsappSettingAutocomplete } from "@web/components/common/Autocomplete/WhatsappSettingAutocomplete";
import { ImageUploadField } from "@web/components/common/ImageUploadField";
import { SlugTextField } from "@web/components/common/PanCardTextField/SlugTextField";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";
import { isValidMobileNumber } from "@web/utils/mobileNumberValidate";
import { gstNoRegex } from "@web/utils/regex";

const BranchMasterFormSchema = z.object({
  address: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  branch_code: z
    .string()
    .max(20, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  branch_name: z
    .string()
    .max(50, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  branch_slug: z.string().nullable(),
  city: z
    .string()
    .max(50, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  contact_no: z
    .string()
    .refine(isValidMobileNumber, {
      message: "common.mobileNumber.invalid",
    })
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  contact_person_name: z
    .string()
    .max(20, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  email_setting_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  gst_no: z
    .string()
    .trim()
    .nullable()
    .optional()
    .refine(
      (value) => {
        if (!value || value === "") {
          return true;
        }

        return gstNoRegex.test(value);
      },
      {
        message: "common.gst_no.invalid",
      }
    ),
  is_active: z.boolean().default(true),
  is_online: z.boolean().default(true),
  logo: z.string().nullable(),
  sms_setting_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  whatsapp_setting_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type BranchMasterFormFieldValues = z.infer<
  typeof BranchMasterFormSchema
>;

type BranchMasterFormProps = {
  defaultValues?: BranchMasterFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<BranchMasterFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<BranchMasterFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: BranchMasterFormFieldValues = {
  address: null,
  branch_code: null,
  branch_name: null,
  branch_slug: null,
  city: null,
  contact_no: null,
  contact_person_name: null,
  email_setting_id: null,
  gst_no: null,
  is_active: true,
  is_online: true,
  logo: null,
  sms_setting_id: null,
  whatsapp_setting_id: null,
};

export const BranchMasterForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: BranchMasterFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
    } = useForm({
      mode: "all",
      resolver: zodResolver(BranchMasterFormSchema),
      values: defaultValues,
    });

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      setError,
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(
            formValues,
            dirtyFields
          );

          onSubmit(filterFormValues);
        })();
      },
    }));

    const {
      branch_code,
      branch_name,
      branch_slug,
      city,
      contact_no,
      contact_person_name,
      email_setting_id,
      gst_no,
      sms_setting_id,
      whatsapp_setting_id,
    } = errors;

    return (
      <FormContainer>
        <GridProvider gap="15px" columns={3}>
          <ImageUploadField
            control={control}
            name="logo"
            loading={loading}
            label=""
          />

          <TextField
            control={control}
            label="Branch Name"
            name="branch_name"
            loading={loading}
            required
            error={!!branch_name}
            helperText={errorMessages(branch_name?.message)}
          />

          <TextField
            name="branch_code"
            control={control}
            loading={loading}
            label="Branch Code"
            required
            error={!!branch_code}
            helperText={errorMessages(branch_code?.message)}
          />

          <SlugTextField
            control={control}
            label="Branch Slug"
            name="branch_slug"
            loading={loading}
            error={!!branch_slug}
            helperText={errorMessages(branch_slug?.message)}
          />

          <TextField
            name="gst_no"
            loading={loading}
            control={control}
            isCapitalize
            label="GST No"
            error={!!gst_no}
            helperText={errorMessages(gst_no?.message)}
            maxLength={15}
          />

          <PhoneInputField
            control={control}
            label="Contact No"
            name="contact_no"
            loading={loading}
            required
            error={!!contact_no}
            helperText={errorMessages(contact_no?.message)}
          />

          <TextField
            control={control}
            label="Contact Person Name"
            name="contact_person_name"
            loading={loading}
            required
            error={!!contact_person_name}
            helperText={errorMessages(contact_person_name?.message)}
          />

          <TextField
            control={control}
            label="City"
            name="city"
            loading={loading}
            required
            error={!!city}
            helperText={errorMessages(city?.message)}
          />

          <MailSettingAutocomplete
            loading={loading}
            name="email_setting_id"
            control={control}
            required
            error={!!email_setting_id}
            helperText={errorMessages(email_setting_id?.message)}
          />

          <SmsSettingAutocomplete
            loading={loading}
            name="sms_setting_id"
            control={control}
            required
            error={!!sms_setting_id}
            helperText={errorMessages(sms_setting_id?.message)}
          />

          <WhatsappSettingAutocomplete
            loading={loading}
            name="whatsapp_setting_id"
            control={control}
            required
            error={!!whatsapp_setting_id}
            helperText={errorMessages(whatsapp_setting_id?.message)}
          />

          <TextField
            name="address"
            control={control}
            loading={loading}
            label="Address"
            required
            multiline
            letterCase="mixed"
            rows={4}
            error={!!errors.address}
            helperText={errorMessages(errors.address?.message)}
            placeholder="Enter Address"
          />

          <RadioGroupField
            name="is_active"
            control={control}
            label={t("isActive.label")}
            options={[
              {
                disabled: false,
                label: t("common.yes"),
                values: true,
              },
              {
                disabled: false,
                label: t("common.no"),
                values: false,
              },
            ]}
            loading={loading}
          />

          <RadioGroupField
            name="is_online"
            control={control}
            label={t("isOnline.label")}
            options={[
              {
                disabled: false,
                label: t("common.yes"),
                values: true,
              },
              {
                disabled: false,
                label: t("common.no"),
                values: false,
              },
            ]}
            loading={loading}
          />
        </GridProvider>
      </FormContainer>
    );
  }
);

BranchMasterForm.displayName = "BranchMasterForm";
