import { FormContainer, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const AddressTypeFromSchema = z.object({
  address_type: z
    .string()
    .max(50, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type AddressTypeFormFieldValues = z.infer<typeof AddressTypeFromSchema>;

type AddressTypeMasterFormProps = {
  defaultValues?: AddressTypeFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<AddressTypeFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<AddressTypeFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: AddressTypeFormFieldValues = {
  address_type: null,
};

export const AddressTypeFrom = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: AddressTypeMasterFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
    } = useForm({
      mode: "all",
      resolver: zodResolver(AddressTypeFromSchema),
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

    return (
      <FormContainer>
        <TextField
          control={control}
          label="Address Type"
          name="address_type"
          loading={loading}
          required
          error={!!errors.address_type}
          helperText={errorMessages(errors.address_type?.message)}
        />
      </FormContainer>
    );
  }
);

AddressTypeFrom.displayName = "AddressTypeFrom";
