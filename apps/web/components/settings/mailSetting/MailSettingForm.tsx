import {
  FormGridLayout,
  FormSection,
  PasswordField,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import { useForm, type UseFormSetError } from "react-hook-form";
import { z } from "zod";

import { TextEditor } from "@web/components/common/TextEditor/TextEditor";
import {
  errorMessages,
  filterNestedChangedFormFields,
} from "@web/utils/helper";
import { passwordRegex } from "@web/utils/regex";

const MailSettingFormSchema = z.object({
  content: z.string().nullable().optional(),
  password: z
    .string()
    .trim()
    .min(1)
    .max(128)
    .regex(passwordRegex, {
      message: "common.password.required",
    })
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  port_no: z
    .number()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  sender_email: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  smtp_enable: z.boolean(),
  smtp_server: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type MailSettingFormFieldValues = z.infer<typeof MailSettingFormSchema>;

const formDefaultValues: MailSettingFormFieldValues = {
  content: null,
  password: null,
  port_no: null,
  sender_email: null,
  smtp_enable: false,
  smtp_server: null,
};

type MailSettingFormArgs = {
  defaultValues?: MailSettingFormFieldValues;
  loading: boolean;
};

export type FormRef = {
  setError: UseFormSetError<MailSettingFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<MailSettingFormFieldValues>) => void
  ) => void;
};

export const MailSettingForm = forwardRef(
  (
    { defaultValues = formDefaultValues, loading = false }: MailSettingFormArgs,
    ref: ForwardedRef<FormRef>
  ) => {
    const methods = useForm({
      mode: "all",
      resolver: zodResolver(MailSettingFormSchema),
      values: defaultValues,
    });

    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
    } = methods;

    useImperativeHandle(ref, () => ({
      setError,

      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterNestedChangedFormFields(
            formValues,
            dirtyFields
          );

          onSubmit(filterFormValues);
        })();
      },
    }));

    const { password, port_no, sender_email, smtp_server } = errors;

    return (
      <FormSection title={t("mailSetting.label")}>
        <FormGridLayout columns={3}>
          <TextField
            name="sender_email"
            control={control}
            loading={loading}
            label={t("senderEmail.label")}
            required
            setError={setError}
            error={!!sender_email}
            helperText={errorMessages(sender_email?.message)}
          />

          <PasswordField
            name="password"
            loading={loading}
            label={t("password.label")}
            control={control}
            error={!!password}
            helperText={errorMessages(password?.message)}
            required
          />

          <TextField
            name="smtp_server"
            control={control}
            loading={loading}
            label={t("smtpServer.label")}
            required
            setError={setError}
            error={!!smtp_server}
            helperText={errorMessages(smtp_server?.message)}
          />
        </FormGridLayout>

        <FormGridLayout columns={2}>
          <TextField
            name="port_no"
            type="number"
            control={control}
            loading={loading}
            label={t("portNumber.label")}
            required
            setError={setError}
            error={!!port_no}
            helperText={errorMessages(port_no?.message)}
          />

          <RadioGroupField
            name="smtp_enable"
            control={control}
            loading={loading}
            label={t("smtpEnable.label")}
            options={[
              {
                disabled: false,
                label: t("common.yes"),
                values: true,
              },
              {
                disabled: false,
                label: t("common.no"),
                values: false,
              },
            ]}
          />
        </FormGridLayout>

        <TextEditor
          name="content"
          control={control}
          loading={loading}
          label={t("content.label")}
        />
      </FormSection>
    );
  }
);

MailSettingForm.displayName = "MailSettingForm";
