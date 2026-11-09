import {
  GridProvider,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
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
import { eventUrlRegex } from "@web/utils/regex";

const MetaWhatsappSettingFormSchema = z.object({
  api_key: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  is_active: z.boolean(),
  is_deleted: z.boolean(),
  phone_number_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  title: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  url: z
    .string()
    .regex(eventUrlRegex, "common.url.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  waba_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type MetaWhatsappSettingFormFieldValues = z.infer<
  typeof MetaWhatsappSettingFormSchema
>;

const formDefaultValues: MetaWhatsappSettingFormFieldValues = {
  api_key: null,
  is_active: true,
  is_deleted: false,
  phone_number_id: null,
  title: null,
  url: null,
  waba_id: null,
};

type MetaWhatsappSettingFormArgs = {
  defaultValues?: MetaWhatsappSettingFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<MetaWhatsappSettingFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<MetaWhatsappSettingFormFieldValues>) => void
  ) => void;
};

export const MetaWhatsappSettingForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: MetaWhatsappSettingFormArgs,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
    } = useForm({
      mode: "all",
      resolver: zodResolver(MetaWhatsappSettingFormSchema),
      values: defaultValues,
    });

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      setError,

      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filteredFormValues = filterNestedChangedFormFields(formValues, {
            ...dirtyFields,
            is_active: true,
            is_deleted: true,
          });

          onSubmit(filteredFormValues);
        })();
      },
    }));

    const { api_key, phone_number_id, title, url, waba_id } = errors;

    return (
      <Stack gap="15px">
        <GridProvider gap="15px" columns={2}>
          <TextField
            name="title"
            control={control}
            loading={loading}
            letterCase="mixed"
            label={t("title.label")}
            required
            error={!!title}
            helperText={errorMessages(title?.message)}
          />

          <TextField
            name="phone_number_id"
            control={control}
            loading={loading}
            letterCase="mixed"
            label={t("metaWhatsappSetting.phoneNumberId.label")}
            required
            error={!!phone_number_id}
            helperText={errorMessages(phone_number_id?.message)}
          />

          <TextField
            name="waba_id"
            control={control}
            loading={loading}
            letterCase="mixed"
            label={t("metaWhatsappSetting.wabaId.label")}
            required
            error={!!waba_id}
            helperText={errorMessages(waba_id?.message)}
          />

          <TextField
            name="api_key"
            control={control}
            loading={loading}
            letterCase="mixed"
            label={t("metaWhatsappSetting.apiKey.label")}
            required
            error={!!api_key}
            helperText={errorMessages(api_key?.message)}
          />
        </GridProvider>

        <GridProvider gap="15px" columns={1}>
          <TextField
            name="url"
            control={control}
            loading={loading}
            letterCase="mixed"
            label={t("common.url")}
            required
            error={!!url}
            helperText={errorMessages(url?.message)}
          />
        </GridProvider>

        <GridProvider gap="15px" columns={2}>
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

          <RadioGroupField
            name="is_deleted"
            control={control}
            loading={loading}
            label={t("isDeleted.label")}
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
      </Stack>
    );
  }
);

MetaWhatsappSettingForm.displayName = "MetaWhatsappSettingForm";
