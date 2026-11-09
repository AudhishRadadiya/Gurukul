import {
  FormGridLayout,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const SmsSettingsFormSchema = z.object({
  is_active: z.boolean(),
  left_sms_url: z.string().max(255, "common.maxLength").nullable(),
  sms_auth_key: z.string().max(255, "common.maxLength").nullable(),
  sms_password: z.string().max(255, "common.maxLength").nullable(),
  sms_provider_name: z.string().nullable(),
  sms_sender_id: z
    .string()
    .max(255, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  sms_url: z.string().max(255, "common.maxLength").nullable(),
  sms_username: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type SmsSettingsFormFieldValues = z.infer<typeof SmsSettingsFormSchema>;

type SmsSettingsFormProps = {
  defaultValues?: SmsSettingsFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<SmsSettingsFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<SmsSettingsFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: SmsSettingsFormFieldValues = {
  is_active: true,
  left_sms_url: null,
  sms_auth_key: null,
  sms_password: null,
  sms_provider_name: null,
  sms_sender_id: null,
  sms_url: null,
  sms_username: null,
};

export const SmsSettingsForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: SmsSettingsFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
    } = useForm({
      mode: "all",
      resolver: zodResolver(SmsSettingsFormSchema),
      values: defaultValues,
    });

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      setError,
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(formValues, {
            ...dirtyFields,
            is_active: true,
          });

          onSubmit(filterFormValues);
        })();
      },
    }));

    const {
      left_sms_url,
      sms_auth_key,
      sms_password,
      sms_provider_name,
      sms_sender_id,
      sms_url,
      sms_username,
    } = errors;

    return (
      <Stack gap="15px">
        <FormGridLayout columns={3}>
          <TextField
            name="sms_username"
            control={control}
            loading={loading}
            letterCase="mixed"
            label={t("common.sms.label", {
              label: t("common.username"),
            })}
            required
            setError={setError}
            error={!!sms_username}
            helperText={errorMessages(sms_username?.message)}
          />

          <TextField
            name="sms_sender_id"
            letterCase="mixed"
            control={control}
            loading={loading}
            label={t("common.sms.label", {
              label: t("common.sender"),
            })}
            required
            setError={setError}
            error={!!sms_sender_id}
            helperText={errorMessages(sms_sender_id?.message)}
          />

          <TextField
            name="sms_provider_name"
            control={control}
            letterCase="mixed"
            loading={loading}
            label={t("common.sms.label", {
              label: t("common.provider"),
            })}
            required
            error={!!sms_provider_name}
            helperText={errorMessages(sms_provider_name?.message)}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <TextField
            name="sms_auth_key"
            control={control}
            letterCase="mixed"
            loading={loading}
            label={t("common.sms.label", {
              label: t("common.auth"),
            })}
            required
            setError={setError}
            error={!!sms_auth_key}
            helperText={errorMessages(sms_auth_key?.message)}
          />

          <TextField
            name="sms_password"
            control={control}
            loading={loading}
            letterCase="mixed"
            label={t("common.sms.label", {
              label: t("common.password"),
            })}
            required
            setError={setError}
            error={!!sms_password}
            helperText={errorMessages(sms_password?.message)}
          />

          <TextField
            name="sms_url"
            control={control}
            letterCase="mixed"
            loading={loading}
            label={t("common.sms.label", {
              label: t("common.url"),
            })}
            required
            setError={setError}
            error={!!sms_url}
            helperText={errorMessages(sms_url?.message)}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <TextField
            name="left_sms_url"
            control={control}
            letterCase="mixed"
            loading={loading}
            label={t("left.msg.url.label")}
            required
            setError={setError}
            error={!!left_sms_url}
            helperText={errorMessages(left_sms_url?.message)}
          />

          <RadioGroupField
            name="is_active"
            control={control}
            isHorizontal
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
        </FormGridLayout>
      </Stack>
    );
  }
);

SmsSettingsForm.displayName = "SmsSettingsForm";
