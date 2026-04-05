import {
  FormGridLayout,
  PasswordField,
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
import z from "zod";

import { BranchAutocomplete } from "@web/components/common/Autocomplete/BranchAutocomplete";
import { PaymentGatewayOptionsAutocomplete } from "@web/components/common/Autocomplete/PaymentGatewayOptionsAutocomplete";
import { TrustAutocompleteFromMultipleBranch } from "@web/components/common/Autocomplete/TrustAutocompleteFromMultipleBranch";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const PaymentGatewayFormSchema = z.object({
  api_key: z
    .string()
    .trim()
    .min(1, { message: "common.required" })
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  branch_id: z
    .array(z.string())
    .min(1, { message: "common.required" })
    .default([]),
  is_default: z.boolean().default(false).optional(),
  is_test_mode: z.boolean().default(false).optional(),
  notes: z
    .string()
    .trim()
    .max(1000, { message: "common.maxLength" })
    .nullable()
    .optional(),
  payment_gateway_name: z
    .string()
    .trim()
    .min(1, { message: "common.required" })
    .max(255, { message: "common.maxLength" })
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  secret_key: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  trust_id: z.string().optional().nullable(),
});

export type PaymentGatewayFormFieldValues = z.infer<
  typeof PaymentGatewayFormSchema
>;

type PaymentGatewayFormProps = Partial<{
  defaultValues: PaymentGatewayFormFieldValues;
  loading: boolean;
}>;

export type FormRef = {
  setError: UseFormSetError<PaymentGatewayFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<PaymentGatewayFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: PaymentGatewayFormFieldValues = {
  api_key: null,
  branch_id: [],
  is_default: false,
  is_test_mode: false,
  notes: null,
  payment_gateway_name: null,
  secret_key: null,
  trust_id: null,
};

export const PaymentGatewayForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: PaymentGatewayFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
      watch,
    } = useForm({
      mode: "all",
      resolver: zodResolver(PaymentGatewayFormSchema),
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

    const { api_key, branch_id, payment_gateway_name, secret_key } = errors;

    const branchIds = watch("branch_id") || [];

    return (
      <Stack gap="15px">
        <FormGridLayout columns={2}>
          <TextField
            name="api_key"
            loading={loading}
            control={control}
            letterCase="mixed"
            label={t("api.key.label")}
            required
            error={!!api_key}
            helperText={errorMessages(api_key?.message)}
          />

          <PasswordField
            control={control}
            label={t("secret.key.label")}
            name="secret_key"
            letterCase="mixed"
            placeholder={t("secret.key.placeholder")}
            required
            error={!!secret_key}
            helperText={errorMessages(secret_key?.message)}
          />

          <PaymentGatewayOptionsAutocomplete
            control={control}
            loading={loading}
            name="payment_gateway_name"
            label={t("payment.gateway.name.label")}
            required
            error={!!payment_gateway_name}
            helperText={errorMessages(payment_gateway_name?.message)}
          />

          <BranchAutocomplete
            isUserWise
            name="branch_id"
            required
            loading={loading}
            control={control}
            error={!!branch_id}
            helperText={errorMessages(branch_id?.message)}
            multiple
          />

          <TrustAutocompleteFromMultipleBranch
            branchIds={branchIds}
            name="trust_id"
            loading={loading}
            control={control}
          />

          <TextField
            name="notes"
            loading={loading}
            control={control}
            letterCase="mixed"
            label={t("common.note")}
            multiline
            rows={4}
          />

          <RadioGroupField
            name="is_test_mode"
            loading={loading}
            control={control}
            label={t("is.test.mode.label")}
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
            name="is_default"
            loading={loading}
            control={control}
            label={t("common.is.default.label")}
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

PaymentGatewayForm.displayName = "PaymentGatewayForm";
