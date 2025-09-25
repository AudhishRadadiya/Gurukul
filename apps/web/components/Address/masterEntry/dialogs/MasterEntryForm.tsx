import { FormContainer } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { MasterEntryAutocomplete } from "@web/components/common/Autocomplete/MasterEntryAutocomplete";
import { MasterTypeAutocomplete } from "@web/components/common/Autocomplete/MasterTypeAutocomplete";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const MasterEntryFromSchema = z.object({
  master_type_id: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  name: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type MasterEntryFormFieldValues = z.infer<typeof MasterEntryFromSchema>;

type MasterEntryFormProps = {
  defaultValues?: MasterEntryFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<MasterEntryFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<MasterEntryFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: MasterEntryFormFieldValues = {
  master_type_id: null,
  name: null,
};

export const MasterEntryForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: MasterEntryFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
      setValue,
    } = useForm({
      mode: "all",
      resolver: zodResolver(MasterEntryFromSchema),
      values: defaultValues,
    });

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      setError,
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(formValues, {
            ...dirtyFields,
            name: true,
          });

          onSubmit(filterFormValues);
        })();
      },
    }));

    const { master_type_id, name } = errors;

    return (
      <FormContainer>
        <MasterTypeAutocomplete
          loading={loading}
          name="master_type_id"
          required
          control={control}
          error={!!master_type_id}
          helperText={errorMessages(master_type_id?.message)}
        />

        <MasterEntryAutocomplete
          loading={loading}
          name="name"
          label={t("common.name")}
          required
          freeSolo
          setValue={setValue}
          control={control}
          error={!!name}
          helperText={errorMessages(name?.message)}
        />
      </FormContainer>
    );
  }
);

MasterEntryForm.displayName = "MasterEntryForm";
