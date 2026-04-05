import {
  AddIconAction,
  FormRow,
  PadBox,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack } from "@mui/material";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  BILL_ENTRY,
  COUNTER_BASE,
  DONATION,
  GUEST_BOOKING,
  LOGIN_OTP,
  MAIL,
  OTHER,
  PAYMENT,
} from "@web/components/common/Autocomplete/hooks/useGetTemplateParametersOptions";
import { TemplateParametersAutocomplete } from "@web/components/common/Autocomplete/TemplateParametersAutocomplete";
import { CheckboxWithLabel } from "@web/components/common/checkboxWithLabel/CheckboxWithLabel";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import {
  errorMessages,
  filterChangedFormFields,
  resetDependentFields,
} from "@web/utils/helper";

const SmsTemplateFormSchema = z.object({
  is_active: z.boolean(),
  is_sms: z.boolean(),
  is_whatsapp: z.boolean(),
  temp_template_parameter: z.string().nullable(),
  template_name: z
    .string()
    .max(50, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  template_parameter_text: z
    .string()
    .max(250, "common.maxLength")
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  template_type: z.union([
    z.literal(COUNTER_BASE),
    z.literal(DONATION),
    z.literal(BILL_ENTRY),
    z.literal(MAIL),
    z.literal(PAYMENT),
    z.literal(GUEST_BOOKING),
    z.literal(OTHER),
    z.literal(LOGIN_OTP),
  ]),
});

export type SmsTemplateFormFieldValues = z.infer<typeof SmsTemplateFormSchema>;

type SmsTemplateFormProps = {
  defaultValues?: SmsTemplateFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<SmsTemplateFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<SmsTemplateFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: SmsTemplateFormFieldValues = {
  is_active: true,
  is_sms: false,
  is_whatsapp: false,
  temp_template_parameter: null,
  template_name: null,
  template_parameter_text: null,
  template_type: COUNTER_BASE,
};

export const SmsTemplateForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: SmsTemplateFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      clearErrors,
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
      setValue,
      watch,
    } = useForm({
      mode: "all",
      resolver: zodResolver(SmsTemplateFormSchema),
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
            temp_template_parameter: false,
            template_type: true,
          });

          onSubmit(filterFormValues);
        })();
      },
    }));

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const templateType = watch("template_type");

    const tempTemplateParameter = watch("temp_template_parameter");

    const { temp_template_parameter, template_name, template_parameter_text } =
      errors;

    const handleInsertParam = () => {
      const insertValue = tempTemplateParameter ?? "";

      const textarea = textareaRef.current;

      if (!insertValue || !textarea) {
        return;
      }

      const { selectionEnd, selectionStart, value: currentValue } = textarea;

      const newValue =
        currentValue.slice(0, selectionStart) +
        insertValue +
        currentValue.slice(selectionEnd);

      if (newValue === currentValue) {
        return;
      }

      setValue("template_parameter_text", newValue, { shouldDirty: true });

      // for focus in textarea
      requestAnimationFrame(() => {
        const cursorPosition = selectionStart + insertValue.length;

        textarea.focus();
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      });
    };

    const dependentFieldsMap: Partial<
      Record<
        keyof SmsTemplateFormFieldValues,
        (keyof SmsTemplateFormFieldValues)[]
      >
    > = {
      temp_template_parameter: ["template_parameter_text"],
      template_type: ["temp_template_parameter", "template_parameter_text"],
    };

    useMemo(() => {
      resetDependentFields({
        clearErrors,
        dependentFieldsMap,
        dirtyFields,
        fieldName: "template_type",
        fieldValue: templateType,
        setValue,
      });
    }, [templateType]);

    useMemo(() => {
      resetDependentFields({
        clearErrors,
        dependentFieldsMap,
        dirtyFields,
        fieldName: "temp_template_parameter",
        fieldValue: tempTemplateParameter,
        setValue,
      });
    }, [tempTemplateParameter]);

    return (
      <Stack gap="30px">
        <Stack gap="10px">
          <FormRow maxColumn={2}>
            <TextField
              loading={loading}
              control={control}
              name="template_name"
              label={t("common.template.name")}
              required
              error={!!template_name}
              helperText={errorMessages(template_name?.message)}
            />

            <RadioGroupField
              name="template_type"
              direction="row"
              type="number"
              control={control}
              containerProps={{
                sx: {
                  flexWrap: "wrap",
                },
              }}
              loading={loading}
              label={t("common.template.type")}
              options={[
                {
                  disabled: false,
                  label: t("counter.base.label"),
                  values: COUNTER_BASE,
                },
                {
                  disabled: false,
                  label: t("donation.menu.label"),
                  values: DONATION,
                },
                {
                  disabled: false,
                  label: t("bill.entry.amount.label"),
                  values: BILL_ENTRY,
                },
                {
                  disabled: false,
                  label: t("mail.label"),
                  values: MAIL,
                },
                {
                  disabled: false,
                  label: t("payment.label"),
                  values: PAYMENT,
                },
                {
                  disabled: false,
                  label: t("guest.booking.label"),
                  values: GUEST_BOOKING,
                },
                {
                  disabled: false,
                  label: t("other.label"),
                  values: OTHER,
                },
                {
                  disabled: false,
                  label: t("loginOtp.label"),
                  values: LOGIN_OTP,
                },
              ]}
            />

            <Stack direction="row" gap="10px" alignItems="center">
              <Box flex="0 0 90%">
                <TemplateParametersAutocomplete
                  templateType={templateType}
                  label={t("common.template.parameters")}
                  name="temp_template_parameter"
                  loading={loading}
                  control={control}
                  error={!!temp_template_parameter}
                  helperText={errorMessages(temp_template_parameter?.message)}
                />
              </Box>

              <Box flex="0 0 10%">
                <AddIconAction onClick={handleInsertParam} />
              </Box>
            </Stack>

            <TextField
              loading={loading}
              control={control}
              name="template_parameter_text"
              label={t("common.template.parameters")}
              required
              multiline
              letterCase="mixed"
              characterType="any-character"
              error={!!template_parameter_text}
              inputRef={(el) => {
                textareaRef.current = el;
              }}
              helperText={errorMessages(template_parameter_text?.message)}
            />

            <Stack direction="row" gap="80px" alignItems="center">
              <RadioGroupField
                name="is_active"
                control={control}
                loading={loading}
                label={t("isActive.label")}
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

              <PadBox
                padding={{
                  paddingTop: "25px",
                }}
              >
                <CheckboxWithLabel
                  control={control}
                  name="is_whatsapp"
                  label={t("common.whatsApp.label")}
                />
              </PadBox>

              <PadBox
                padding={{
                  paddingTop: "25px",
                }}
              >
                <CheckboxWithLabel
                  control={control}
                  name="is_sms"
                  label={t("sms.label")}
                />
              </PadBox>
            </Stack>
          </FormRow>
        </Stack>
      </Stack>
    );
  }
);

SmsTemplateForm.displayName = "SmsTemplateForm";
