import {
  FormContainer,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { BranchAutocomplete } from "@web/components/common/Autocomplete/BranchAutocomplete";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const DonationMasterFormSchema = z.object({
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
  donation_master_name: z
    .string()
    .max(50, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  is_active: z.boolean(),
  remark: z.string().max(255, "common.maxLength").nullable(),
});

export type DonationMasterFormFieldValues = z.infer<
  typeof DonationMasterFormSchema
>;

type DonationMasterFormProps = {
  defaultValues?: DonationMasterFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<DonationMasterFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<DonationMasterFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: DonationMasterFormFieldValues = {
  branch_id: [],
  donation_master_name: null,
  is_active: true,
  remark: null,
};

export const DonationMasterForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: DonationMasterFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
    } = useForm({
      mode: "all",
      resolver: zodResolver(DonationMasterFormSchema),
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

    const { branch_id, donation_master_name } = errors;

    return (
      <Stack gap="15px">
        <FormContainer>
          <TextField
            loading={loading}
            control={control}
            name="donation_master_name"
            label={t("common.name.label", {
              label: t("donation.menu.label"),
            })}
            letterCase="uppercase"
            required
            error={!!donation_master_name}
            helperText={errorMessages(donation_master_name?.message)}
          />

          <BranchAutocomplete
            loading={loading}
            name="branch_id"
            control={control}
            isUserWise
            required
            multiple
            error={!!branch_id}
            helperText={errorMessages(branch_id?.message)}
          />

          <TextField
            name="remark"
            loading={loading}
            control={control}
            label={t("remark.label")}
            multiline
            letterCase="mixed"
            rows={4}
          />

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
        </FormContainer>
      </Stack>
    );
  }
);

DonationMasterForm.displayName = "DonationMasterForm";
