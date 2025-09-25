import {
  FormContainer,
  FormGridLayout,
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

import { CheckboxWithLabel } from "@web/components/common/checkboxWithLabel/CheckboxWithLabel";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { filterChangedFormFields, errorMessages } from "@web/utils/helper";
import { emailRegex } from "@web/utils/regex";

const BulkMailFormSchema = z.object({
  send_letter: z.boolean().optional(),
  send_receipt: z.boolean().optional(),
  to_email: z
    .string()
    .regex(emailRegex, "common.email.invalid")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type BulkMailFormFieldValues = z.infer<typeof BulkMailFormSchema>;

export type FormRef = {
  setError: UseFormSetError<BulkMailFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<BulkMailFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: BulkMailFormFieldValues = {
  send_letter: false,
  send_receipt: false,
  to_email: null,
};

export const BulkMailForm = forwardRef((_, ref: ForwardedRef<FormRef>) => {
  const {
    control,
    formState: { dirtyFields, errors },
    handleSubmit,
    setError,
  } = useForm<BulkMailFormFieldValues>({
    mode: "all",
    resolver: zodResolver(BulkMailFormSchema),
    values: formDefaultValues,
  });

  useEnableDisableButton({ control, defaultValues: formDefaultValues, errors });

  useImperativeHandle(ref, () => ({
    setError,
    submitForm(onSubmit) {
      handleSubmit((formValues) => {
        const filterFormValues = filterChangedFormFields(formValues, {
          ...dirtyFields,
          send_letter: true,
          send_receipt: true,
        });

        onSubmit(filterFormValues);
      })();
    },
  }));

  return (
    <Stack gap="15px">
      <FormContainer>
        <TextField
          name="to_email"
          control={control}
          required
          label={t("common.email.send.to")}
          error={!!errors.to_email}
          helperText={errorMessages(errors.to_email?.message)}
        />

        <FormGridLayout columns={2}>
          <CheckboxWithLabel
            control={control}
            name="send_receipt"
            label={t("common.send.receipt")}
          />

          <CheckboxWithLabel
            control={control}
            name="send_letter"
            label={t("common.send.letter")}
          />
        </FormGridLayout>
      </FormContainer>
    </Stack>
  );
});

BulkMailForm.displayName = "BulkMailForm";
