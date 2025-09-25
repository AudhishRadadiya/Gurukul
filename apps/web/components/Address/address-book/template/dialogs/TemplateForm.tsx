import { TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { type ForwardedRef, forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useEnableDisableButtonToggle } from "@web/hooks/useEnableDisableButtonToggle";
import { filterChangedFormFields } from "@web/utils/helper";

export const TemplateFormSchema = z.object({
  template_name: z
    .string()
    .max(20, { message: "common.template.name.max.characters" })
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type TemplateFormFieldValues = z.infer<typeof TemplateFormSchema>;

type TemplateFormProps = {
  defaultValues?: TemplateFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<TemplateFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<TemplateFormFieldValues>) => void
  ) => void;
};

export const formDefaultValues: TemplateFormFieldValues = {
  template_name: null,
};

export const TemplateForm = forwardRef(
  (
    { defaultValues = formDefaultValues, loading = false }: TemplateFormProps,
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
      resolver: zodResolver(TemplateFormSchema),
      values: defaultValues,
    });

    useEnableDisableButtonToggle({
      errors,
      isFormChanged: !!Object.keys(dirtyFields).length,
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

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const { template_name } = errors || {};

    return (
      <Box>
        <TextField
          control={control}
          label={t("template.name.label")}
          name="template_name"
          required
          loading={loading}
          error={!!template_name}
          helperText={errorMessages(template_name?.message)}
        />
      </Box>
    );
  }
);

TemplateForm.displayName = "TemplateForm";
