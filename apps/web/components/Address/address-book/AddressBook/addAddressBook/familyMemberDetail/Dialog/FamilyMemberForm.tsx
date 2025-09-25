import { DatePicker, FormGridLayout, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { RelationAutocomplete } from "@web/components/common/Autocomplete/RelationAutocomplete";
import { errorMessages } from "@web/utils/helper";

export const FamilyMemberFormSchema = z.object({
  birthdate: z.string().nullable(),
  id: z.string().nullable().optional(),
  name: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  relation: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  remark: z.string().nullable(),
});

export type FamilyMemberFormFieldValues = z.infer<
  typeof FamilyMemberFormSchema
>;

type FamilyMemberFormProps = {
  defaultValues?: FamilyMemberFormFieldValues;
};

export type FormRef = {
  setError: UseFormSetError<FamilyMemberFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: FamilyMemberFormFieldValues) => void
  ) => void;
};

const formDefaultValues: FamilyMemberFormFieldValues = {
  birthdate: null,
  name: null,
  relation: null,
  remark: null,
};

export const FamilyMemberForm = forwardRef(
  (
    { defaultValues = formDefaultValues }: FamilyMemberFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const formMethods = useForm({
      mode: "all",
      resolver: zodResolver(FamilyMemberFormSchema),
      values: defaultValues,
    });

    const {
      control,
      formState: { errors },
      handleSubmit,
      setError,
    } = formMethods;

    useImperativeHandle(ref, () => ({
      setError,
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          onSubmit({ id: uuidv4(), ...formValues });
        })();
      },
    }));

    const { name, relation } = errors;

    return (
      <FormProvider {...formMethods}>
        <Stack gap="16px">
          <FormGridLayout columns={2}>
            <TextField
              name="name"
              control={control}
              required
              label={t("common.name")}
              error={!!name}
              helperText={errorMessages(name?.message)}
            />

            <RelationAutocomplete
              name="relation"
              required
              control={control}
              label={t("common.relation")}
              error={!!relation}
              helperText={errorMessages(relation?.message)}
            />
          </FormGridLayout>

          <FormGridLayout columns={2}>
            <DatePicker
              control={control}
              label={t("common.birth.date")}
              name="birthdate"
            />

            <TextField
              name="remark"
              control={control}
              label={t("common.remark")}
            />
          </FormGridLayout>
        </Stack>
      </FormProvider>
    );
  }
);

FamilyMemberForm.displayName = "FamilyMemberForm";
