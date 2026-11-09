import { FormSection, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { ContactDetailFields } from "@web/components/Event/eventContactGroup/EventContactDetailFields/ContactDetailFields";
import { contactDetailItemDefaultValues } from "@web/components/Event/eventContactGroup/EventContactDetailFields/hooks/constant";
import { ContactDetailItemFormSchema } from "@web/components/Event/eventContactGroup/EventContactDetailFields/hooks/useContactDetailImport";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const EventContactGroupFormSchema = z.object({
  contact_detail: z
    .array(ContactDetailItemFormSchema)
    .min(1, { message: "common.required" }),
  excel_file: z.any().nullable().optional(),
  group_name: z.string().trim().min(1, { message: "common.required" }),
});

export type EventContactGroupFormFieldValues = z.infer<
  typeof EventContactGroupFormSchema
>;

type ContactGroupFieldsType = {
  mobile_no: string;
};

export type EventContactGroupApiPayload = {
  contact_detail: ContactGroupFieldsType[];
  group_name: string;
};

type EventContactGroupFormProps = {
  defaultValues?: EventContactGroupFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<EventContactGroupFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<EventContactGroupApiPayload>) => void
  ) => void;
};

const formDefaultValues: EventContactGroupFormFieldValues = {
  contact_detail: [contactDetailItemDefaultValues],
  excel_file: null,
  group_name: "",
};

export const EventContactGroupForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: EventContactGroupFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const methods = useForm({
      mode: "all",
      resolver: zodResolver(EventContactGroupFormSchema),
      values: defaultValues,
    });

    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
    } = methods;

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      setError,
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const { contact_detail, ...rest } = formValues;

          const apiPayload = {
            ...rest,
            // eslint-disable-next-line sonarjs/no-nested-functions
            contact_detail: contact_detail.map(({ mobile_no }) => ({
              mobile_no: mobile_no ?? "",
            })),
          };

          const filterFormValues = filterChangedFormFields(apiPayload, {
            ...dirtyFields,
            contact_detail: true,
          });

          onSubmit(filterFormValues);
        })();
      },
    }));

    const { group_name } = errors;

    return (
      <FormProvider {...methods}>
        <Stack gap="20px">
          <TextField
            control={control}
            name="group_name"
            required
            characterType="any-character"
            letterCase="mixed"
            label="Group Name"
            loading={loading}
            error={!!group_name}
            helperText={errorMessages(group_name?.message)}
          />

          <FormSection title={t("contact.details.label")}>
            <ContactDetailFields control={control} loading={loading} />
          </FormSection>
        </Stack>
      </FormProvider>
    );
  }
);

EventContactGroupForm.displayName = "EventContactGroupForm";
