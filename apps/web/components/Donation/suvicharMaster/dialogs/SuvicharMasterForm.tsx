import { FormContainer, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const SuvicharMasterFormSchema = z.object({
  suvichar: z
    .string()
    .max(50, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type SuvicharMasterFormFieldValues = z.infer<
  typeof SuvicharMasterFormSchema
>;

type SuvichaMasterFormProps = {
  defaultValues?: SuvicharMasterFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<SuvicharMasterFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<SuvicharMasterFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: SuvicharMasterFormFieldValues = {
  suvichar: null,
};

export const SuvicharMasterForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: SuvichaMasterFormProps,
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
      resolver: zodResolver(SuvicharMasterFormSchema),
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

    const { suvichar } = errors;

    return (
      <Stack gap="15px">
        <FormContainer>
          <TextField
            loading={loading}
            control={control}
            name="suvichar"
            label={t("suvichar.menu.label")}
            required
            error={!!suvichar}
            helperText={errorMessages(suvichar?.message)}
          />
        </FormContainer>
      </Stack>
    );
  }
);

SuvicharMasterForm.displayName = "SuvicharMasterForm";
