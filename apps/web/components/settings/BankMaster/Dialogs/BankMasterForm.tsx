import {
  FormContainer,
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

const BankMasterFormSchema = z.object({
  bank_name: z
    .string()
    .max(50, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  is_active: z.boolean(),
});

export type BankMasterFormFieldValues = z.infer<typeof BankMasterFormSchema>;

type BankMasterFormProps = {
  defaultValues?: BankMasterFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<BankMasterFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<BankMasterFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: BankMasterFormFieldValues = {
  bank_name: null,
  is_active: true,
};

export const BankMasterForm = forwardRef(
  (
    { defaultValues = formDefaultValues, loading = false }: BankMasterFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
    } = useForm({
      mode: "all",
      resolver: zodResolver(BankMasterFormSchema),
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

    const { bank_name } = errors;

    return (
      <Stack gap="15px">
        <FormContainer>
          <TextField
            name="bank_name"
            control={control}
            loading={loading}
            label={t("common.name.label", {
              label: t("bank.menu.label"),
            })}
            characterType="string"
            required
            error={!!bank_name}
            helperText={errorMessages(bank_name?.message)}
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
        </FormContainer>
      </Stack>
    );
  }
);

BankMasterForm.displayName = "BankMasterForm";
