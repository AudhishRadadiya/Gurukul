import { DatePicker, FormGridLayout } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { BankAutocompleteFromTrust } from "@web/components/common/Autocomplete/BankAutocompleteFromTrust";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const ChequeReconciliationFormSchema = z.object({
  pass_bank: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  pass_date: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type ChequeReconciliationFormFieldValues = z.infer<
  typeof ChequeReconciliationFormSchema
>;

type ChequeReconciliationFormProps = {
  defaultValues?: ChequeReconciliationFormFieldValues & {
    trust_id?: string;
  };
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<ChequeReconciliationFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<ChequeReconciliationFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: ChequeReconciliationFormFieldValues = {
  pass_bank: null,
  pass_date: null,
};

export const ChequeReconciliationForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: ChequeReconciliationFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
    } = useForm({
      mode: "all",
      resolver: zodResolver(ChequeReconciliationFormSchema),
      values: defaultValues,
    });

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      setError,
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(formValues, {
            ...dirtyFields,
          });

          onSubmit(filterFormValues);
        })();
      },
    }));

    const { pass_bank, pass_date } = errors;

    return (
      <Stack gap="15px">
        <FormGridLayout columns={2}>
          <BankAutocompleteFromTrust
            loading={loading}
            name="pass_bank"
            required
            control={control}
            trustId={defaultValues.trust_id}
            error={!!pass_bank}
            helperText={errorMessages(pass_bank?.message)}
          />

          <DatePicker
            name="pass_date"
            label="Pass Date"
            control={control}
            loading={loading}
            clearable={false}
            required
            error={!!pass_date}
            helperText={errorMessages(pass_date?.message)}
          />
        </FormGridLayout>
      </Stack>
    );
  }
);

ChequeReconciliationForm.displayName = "ChequeReconciliationForm";
