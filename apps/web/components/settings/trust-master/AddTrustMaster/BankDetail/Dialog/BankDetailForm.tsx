import {
  FormGridLayout,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { z } from "zod";

import { BankNameAutocomplete } from "@web/components/common/Autocomplete/BankNameAutocomplete";
import { BankDetailFormSchema } from "@web/components/settings/trust-master/AddTrustMaster/TrustMasterForm";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";

export type BankDetailFormFieldValues = z.infer<typeof BankDetailFormSchema>;

type BankDetailFormProps = {
  defaultValues?: BankDetailFormFieldValues;
};

export type FormRef = {
  setError: UseFormSetError<BankDetailFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: BankDetailFormFieldValues) => void
  ) => void;
};

const formDefaultValues: BankDetailFormFieldValues = {
  acc_no: null,
  bank_branch: null,
  bank_name: null,
  ifsc_code: null,
  is_active: true,
};

export const BankDetailForm = forwardRef(
  (
    { defaultValues = formDefaultValues }: BankDetailFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const { t } = useTranslation();

    const formMethods = useForm({
      mode: "all",
      resolver: zodResolver(BankDetailFormSchema),
      values: defaultValues,
    });

    const {
      control,
      formState: { errors },
      handleSubmit,
      setError,
    } = formMethods;

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      setError,

      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          onSubmit({ ...formValues });
        })();
      },
    }));

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const { acc_no, bank_branch, bank_name, ifsc_code } = errors;

    return (
      <FormProvider {...formMethods}>
        <Stack gap="16px">
          <FormGridLayout columns={2}>
            <BankNameAutocomplete
              name="bank_name"
              required
              label={t("bank.name.label")}
              control={control}
              error={!!bank_name}
              helperText={errorMessages(bank_name?.message)}
            />

            <TextField
              control={control}
              name="bank_branch"
              required
              label="Bank Branch"
              error={!!bank_branch}
              helperText={errorMessages(bank_branch?.message)}
            />

            <TextField
              control={control}
              name="acc_no"
              required
              label="Account No"
              error={!!acc_no}
              helperText={errorMessages(acc_no?.message)}
            />

            <TextField
              control={control}
              name="ifsc_code"
              required
              label="IFSC Code"
              error={!!ifsc_code}
              helperText={errorMessages(ifsc_code?.message)}
            />

            <RadioGroupField
              name="is_active"
              control={control}
              label="Is Active"
              options={[
                {
                  disabled: false,
                  label: "Yes",
                  values: true,
                },
                {
                  disabled: false,
                  label: "No",
                  values: false,
                },
              ]}
            />
          </FormGridLayout>
        </Stack>
      </FormProvider>
    );
  }
);

BankDetailForm.displayName = "BankDetailForm";
