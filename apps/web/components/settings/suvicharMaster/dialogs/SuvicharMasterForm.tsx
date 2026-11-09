import { FormContainer, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { CheckboxWithLabel } from "@web/components/common/checkboxWithLabel/CheckboxWithLabel";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const SuvicharMasterFormSchema = z.object({
  is_sms: z.boolean(),
  is_whatsapp: z.boolean(),
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

export const formDefaultValues: SuvicharMasterFormFieldValues = {
  is_sms: false,
  is_whatsapp: false,
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
      <Stack gap={{ sm: "15px", xs: "10px" }}>
        <FormContainer>
          <TextField
            loading={loading}
            control={control}
            name="suvichar"
            characterType="any-character"
            label={t("suvichar.menu.label")}
            required
            error={!!suvichar}
            helperText={errorMessages(suvichar?.message)}
          />

          <Stack
            direction="row"
            gap={{ sm: 3, xs: 2 }}
            flexWrap="wrap"
            alignItems="center"
          >
            <CheckboxWithLabel
              control={control}
              name="is_sms"
              label={t("sms.label")}
            />

            <CheckboxWithLabel
              control={control}
              name="is_whatsapp"
              label={t("common.whatsApp.label")}
            />
          </Stack>
        </FormContainer>
      </Stack>
    );
  }
);

SuvicharMasterForm.displayName = "SuvicharMasterForm";
