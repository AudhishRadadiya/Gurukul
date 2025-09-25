import {
  FormContainer,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const SMSMasterFormSchema = z.object({
  is_active: z.boolean(),
  sms_name: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type SMSMasterFormFieldValues = z.infer<typeof SMSMasterFormSchema>;

type SMSMasterFormProps = {
  defaultValues?: SMSMasterFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<SMSMasterFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<SMSMasterFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: SMSMasterFormFieldValues = {
  is_active: true,
  sms_name: "",
};

export const SMSMasterForm = forwardRef(
  (
    { defaultValues = formDefaultValues, loading = false }: SMSMasterFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
    } = useForm({
      mode: "all",
      resolver: zodResolver(SMSMasterFormSchema),
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

    const { sms_name } = errors;

    return (
      <FormContainer>
        <TextField
          control={control}
          loading={loading}
          name="sms_name"
          label={t("common.name.label", {
            label: t("sms.label"),
          })}
          required
          error={!!sms_name}
          helperText={errorMessages(sms_name?.message)}
        />

        <RadioGroupField
          name="is_active"
          control={control}
          loading={loading}
          label="Current Active Year"
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
      </FormContainer>
    );
  }
);

SMSMasterForm.displayName = "SMSMasterForm";
