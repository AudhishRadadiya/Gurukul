import {
  FormContainer,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const MasterTypeFromSchema = z.object({
  is_hastak: z.boolean(),
  master_type: z
    .string()
    .max(50, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type MasterTypeFormFieldValues = z.infer<typeof MasterTypeFromSchema>;

type MasterTypeFormProps = {
  defaultValues?: MasterTypeFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<MasterTypeFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<MasterTypeFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: MasterTypeFormFieldValues = {
  is_hastak: false,
  master_type: null,
};

export const MasterTypeFrom = forwardRef(
  (
    { defaultValues = formDefaultValues, loading = false }: MasterTypeFormProps,
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
      resolver: zodResolver(MasterTypeFromSchema),
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

    const { master_type } = errors;

    return (
      <FormContainer>
        <TextField
          control={control}
          loading={loading}
          name="master_type"
          label={t("master.type.menu.label")}
          required
          error={!!master_type}
          helperText={errorMessages(master_type?.message)}
        />

        <RadioGroupField
          name="is_hastak"
          control={control}
          label="Is Hastak"
          isHorizontal
          loading={loading}
          options={[
            { disabled: false, label: t("common.yes"), values: true },
            { disabled: false, label: t("common.no"), values: false },
          ]}
        />
      </FormContainer>
    );
  }
);

MasterTypeFrom.displayName = "MasterTypeFrom";
