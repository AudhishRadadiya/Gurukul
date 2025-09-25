import { FormRow, RadioGroupField, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { BranchAutocomplete } from "@web/components/common/Autocomplete/BranchAutocomplete";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const DonationModeFormSchema = z.object({
  branch_id: z
    .array(
      z
        .string()
        .nullable()
        .refine((value) => !!value, {
          message: "common.required",
        })
    )
    .default([]),
  donation_mode_code: z
    .string()
    .max(50, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  donation_mode_name: z
    .string()
    .max(50, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  donation_mode_receipt: z
    .string()
    .max(50, "common.maxLength")
    .nullable()
    .optional(),
  is_active: z.boolean(),
  is_bank: z.boolean(),
});

export type DonationModeFormFieldValues = z.infer<
  typeof DonationModeFormSchema
>;

type DonationModeFormProps = {
  defaultValues?: DonationModeFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<DonationModeFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<DonationModeFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: DonationModeFormFieldValues = {
  branch_id: [],
  donation_mode_code: null,
  donation_mode_name: null,
  donation_mode_receipt: null,
  is_active: true,
  is_bank: true,
};

export const DonationModeForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: DonationModeFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
    } = useForm({
      mode: "all",
      resolver: zodResolver(DonationModeFormSchema),
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
            is_bank: true,
          });

          onSubmit(filterFormValues);
        })();
      },
    }));

    const {
      branch_id,
      donation_mode_code,
      donation_mode_name,
      donation_mode_receipt,
    } = errors;

    return (
      <Stack gap="15px">
        <FormRow maxColumn={2}>
          <TextField
            control={control}
            loading={loading}
            name="donation_mode_name"
            label={t("common.name.label", {
              label: t("common.mode.label", {
                label: t("donation.menu.label"),
              }),
            })}
            required
            error={!!donation_mode_name}
            helperText={errorMessages(donation_mode_name?.message)}
          />

          <TextField
            control={control}
            loading={loading}
            name="donation_mode_code"
            label={t("donationModeCode.label")}
            required
            error={!!donation_mode_code}
            helperText={errorMessages(donation_mode_code?.message)}
          />
        </FormRow>

        <FormRow maxColumn={2}>
          <BranchAutocomplete
            loading={loading}
            name="branch_id"
            control={control}
            required
            multiple
            error={!!branch_id}
            helperText={errorMessages(branch_id?.message)}
          />

          <TextField
            control={control}
            loading={loading}
            name="donation_mode_receipt"
            label={t("donationModeOfReceipt.label")}
            error={!!donation_mode_receipt}
            helperText={errorMessages(donation_mode_receipt?.message)}
          />
        </FormRow>

        <FormRow maxColumn={2}>
          <RadioGroupField
            name="is_active"
            loading={loading}
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
          />

          <RadioGroupField
            name="is_bank"
            loading={loading}
            control={control}
            label={t("isBank.label")}
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
        </FormRow>
      </Stack>
    );
  }
);

DonationModeForm.displayName = "DonationModeForm";
