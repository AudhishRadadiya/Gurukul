import { FormContainer, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import z from "zod";

import { filterChangedFormFields } from "@web/utils/helper";

const DonationReceiptEntryFormSchema = z.object({
  amount: z.number().nullable().optional(),
});

export type DonationReceiptEntryFormFieldValues = z.infer<
  typeof DonationReceiptEntryFormSchema
>;

export type FormRef = {
  setError: UseFormSetError<DonationReceiptEntryFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<DonationReceiptEntryFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: DonationReceiptEntryFormFieldValues = {
  amount: null,
};

export const DonationReceiptEntryForm = forwardRef(
  (_, ref: ForwardedRef<FormRef>) => {
    const {
      control,
      formState: { dirtyFields },
      handleSubmit,
      setError,
    } = useForm({
      mode: "all",
      resolver: zodResolver(DonationReceiptEntryFormSchema),
      values: formDefaultValues,
    });

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

    return (
      <Stack gap="15px">
        <FormContainer>
          <TextField
            type="number"
            control={control}
            name="amount"
            label={t("amount.label")}
          />
        </FormContainer>
      </Stack>
    );
  }
);

DonationReceiptEntryForm.displayName = "DonationReceiptEntryForm";
