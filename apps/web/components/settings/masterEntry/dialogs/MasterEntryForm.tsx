import { FormContainer, PhoneInputField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { MasterTypeOptionType } from "@web/components/common/Autocomplete/hooks/useGetMasterTypeOptions";
import { MasterEntryAutocomplete } from "@web/components/common/Autocomplete/MasterEntryAutocomplete";
import { MasterTypeAutocomplete } from "@web/components/common/Autocomplete/MasterTypeAutocomplete";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { masterTypeKeys } from "@web/queryKeysFactories/masterType";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";
import { isValidMobileNumber } from "@web/utils/mobileNumberValidate";

const MasterEntryFromSchema = z.object({
  contact_number: z
    .string()
    .refine(isValidMobileNumber, {
      message: "common.mobileNumber.invalid",
    })
    .nullable(),
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
  contact_number: null,
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
      watch,
    } = useForm({
      mode: "all",
      resolver: zodResolver(MasterEntryFromSchema),
      values: defaultValues,
    });

    const masterTypeId = watch("master_type_id");

    const { data: MasterTypeOptions = [] } = useQuery<MasterTypeOptionType[]>({
      enabled: false,
      queryFn: () => {
        return [];
      },
      queryKey: masterTypeKeys.options(),
    });

    const isHastakMasterType = useMemo(() => {
      if (masterTypeId) {
        const selectedMasterType = MasterTypeOptions.find(
          (option) => option.value === masterTypeId
        );

        return selectedMasterType?.is_hastak;
      }

      return false;
    }, [masterTypeId]);

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

    const { contact_number, master_type_id, name } = errors;

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

        {isHastakMasterType && (
          <PhoneInputField
            name="contact_number"
            control={control}
            label={t("contactNumber.label")}
            loading={loading}
            error={!!contact_number}
            helperText={errorMessages(contact_number?.message)}
          />
        )}
      </FormContainer>
    );
  }
);

MasterEntryForm.displayName = "MasterEntryForm";
