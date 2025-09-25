import { FormGridLayout, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { errorMessages } from "@web/utils/helper";
import { emailRegex, panCardRegex } from "@web/utils/regex";

export const BusinessDetailFormSchema = z.object({
  address: z.string().nullable(),
  business_name: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  email: z
    .string()
    .regex(emailRegex, "common.email.invalid")
    .optional()
    .nullable(),
  id: z.string().nullable().optional(),
  pan: z
    .string()
    .regex(panCardRegex, "common.pan_card_no.invalid")
    .optional()
    .nullable(),
});

export type BusinessDetailFormFieldValues = z.infer<
  typeof BusinessDetailFormSchema
>;

type BusinessDetailFormProps = {
  defaultValues?: BusinessDetailFormFieldValues;
};

export type FormRef = {
  setError: UseFormSetError<BusinessDetailFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: BusinessDetailFormFieldValues) => void
  ) => void;
};

const formDefaultValues: BusinessDetailFormFieldValues = {
  address: null,
  business_name: null,
  email: null,
  pan: null,
};

export const BusinessDetailForm = forwardRef(
  (
    { defaultValues = formDefaultValues }: BusinessDetailFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const formMethods = useForm({
      mode: "all",
      resolver: zodResolver(BusinessDetailFormSchema),
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

    const { business_name, email, pan } = errors;

    return (
      <FormProvider {...formMethods}>
        <Stack gap="16px">
          <FormGridLayout columns={2}>
            <TextField
              name="business_name"
              control={control}
              required
              label={t("common.business.name")}
              error={!!business_name}
              helperText={errorMessages(business_name?.message)}
            />

            <TextField
              name="pan"
              control={control}
              label={t("panNumber.label")}
              error={!!pan}
              helperText={errorMessages(pan?.message)}
            />
          </FormGridLayout>

          <FormGridLayout columns={2}>
            <TextField
              name="email"
              control={control}
              label={t("email.label")}
              error={!!email}
              helperText={errorMessages(email?.message)}
            />

            <TextField
              name="address"
              control={control}
              multiline
              label={t("address.label")}
            />
          </FormGridLayout>
        </Stack>
      </FormProvider>
    );
  }
);

BusinessDetailForm.displayName = "BusinessDetailForm";
