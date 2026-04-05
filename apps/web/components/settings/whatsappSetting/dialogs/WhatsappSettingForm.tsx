import {
  GridProvider,
  PhoneInputField,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import { useForm, type UseFormSetError } from "react-hook-form";
import { z } from "zod";

import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import {
  errorMessages,
  filterNestedChangedFormFields,
} from "@web/utils/helper";
import { isValidMobileNumber } from "@web/utils/mobileNumberValidate";
import { eventUrlRegex } from "@web/utils/regex";

const WhatsappSettingFormSchema = z.object({
  for_message_url: z
    .string()
    .trim()
    .regex(eventUrlRegex, "common.url.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  for_schedule_url: z
    .string()
    .trim()
    .regex(eventUrlRegex, "common.url.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  is_active: z.boolean(),
  whatsapp_api_client: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  whatsapp_api_key: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  whatsapp_number: z
    .string()
    .refine(isValidMobileNumber, {
      message: "common.mobileNumber.invalid",
    })
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  whatsapp_secret: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type WhatsappSettingFormFieldValues = z.infer<
  typeof WhatsappSettingFormSchema
>;

const formDefaultValues: WhatsappSettingFormFieldValues = {
  for_message_url: null,
  for_schedule_url: null,
  is_active: true,
  whatsapp_api_client: null,
  whatsapp_api_key: null,
  whatsapp_number: null,
  whatsapp_secret: null,
};

type WhatsappSettingFormArgs = {
  defaultValues?: WhatsappSettingFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<WhatsappSettingFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<WhatsappSettingFormFieldValues>) => void
  ) => void;
};

export const WhatsappSettingForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: WhatsappSettingFormArgs,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
    } = useForm({
      mode: "all",
      resolver: zodResolver(WhatsappSettingFormSchema),
      values: defaultValues,
    });

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      setError,

      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterNestedChangedFormFields(formValues, {
            ...dirtyFields,
            is_active: true,
          });

          onSubmit(filterFormValues);
        })();
      },
    }));

    const {
      for_message_url,
      for_schedule_url,
      whatsapp_api_client,
      whatsapp_api_key,
      whatsapp_number,
      whatsapp_secret,
    } = errors;

    return (
      <GridProvider gap="15px" columns={2}>
        <TextField
          name="whatsapp_secret"
          control={control}
          loading={loading}
          letterCase="mixed"
          label={t("common.whatsApp", {
            label: t("common.client.label"),
          })}
          required
          error={!!whatsapp_secret}
          helperText={errorMessages(whatsapp_secret?.message)}
        />

        <PhoneInputField
          control={control}
          loading={loading}
          required
          label={t("common.whatsApp", {
            label: t("common.number.label"),
          })}
          name="whatsapp_number"
          error={!!whatsapp_number}
          helperText={errorMessages(whatsapp_number?.message)}
        />

        <TextField
          name="whatsapp_api_key"
          control={control}
          loading={loading}
          letterCase="mixed"
          label={t("common.whatsApp", {
            label: t("api.key.label"),
          })}
          required
          error={!!whatsapp_api_key}
          helperText={errorMessages(whatsapp_api_key?.message)}
        />

        <TextField
          name="whatsapp_api_client"
          control={control}
          letterCase="mixed"
          loading={loading}
          label={t("common.whatsApp", {
            label: t("common.api.client.label"),
          })}
          required
          error={!!whatsapp_api_client}
          helperText={errorMessages(whatsapp_api_client?.message)}
        />

        <TextField
          name="for_message_url"
          control={control}
          loading={loading}
          label={t("common.message.url.label")}
          letterCase="mixed"
          required
          error={!!for_message_url}
          helperText={errorMessages(for_message_url?.message)}
        />

        <TextField
          name="for_schedule_url"
          control={control}
          loading={loading}
          letterCase="mixed"
          required
          label={t("common.schedule.url.label")}
          error={!!for_schedule_url}
          helperText={errorMessages(for_schedule_url?.message)}
        />

        <RadioGroupField
          name="is_active"
          control={control}
          loading={loading}
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
        />
      </GridProvider>
    );
  }
);

WhatsappSettingForm.displayName = "WhatsappSettingForm";
