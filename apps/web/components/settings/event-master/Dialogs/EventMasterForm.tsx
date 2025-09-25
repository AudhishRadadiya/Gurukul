import {
  CheckBox,
  DatePicker,
  DateTimePicker,
  FormContainer,
  FormGridLayout,
  PadBox,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Typography } from "@mui/material";
import { t } from "i18next";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { BranchAutocomplete } from "@web/components/common/Autocomplete/BranchAutocomplete";
import { TrustAutocompleteFromMultipleBranch } from "@web/components/common/Autocomplete/TrustAutocompleteFromMultipleBranch";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const EventMasterFormSchema = z
  .object({
    branch_id: z.array(z.string()).default([]),
    description: z.string().max(255, "common.maxLength").nullable().optional(),
    end_date: z.string().nullable(),
    event_master_name: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    is_active: z.boolean(),
    is_lifetime: z.boolean(),
    is_need_reminder: z.boolean(),
    is_online: z.boolean(),
    is_send_sms: z.boolean(),
    is_send_whatsapp: z.boolean(),
    location: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    start_date: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    trust_id: z.array(z.string()).default([]),
  })
  .superRefine((values, ctx) => {
    if (!values.is_lifetime && !values.end_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("common.required"),
        path: ["end_date"],
      });
    }
  });

export type EventMasterFormFieldValues = z.infer<typeof EventMasterFormSchema>;

type EventMasterFormProps = {
  defaultValues?: EventMasterFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<EventMasterFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<EventMasterFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: EventMasterFormFieldValues = {
  branch_id: [],
  description: null,
  end_date: null,
  event_master_name: null,
  is_active: true,
  is_lifetime: false,
  is_need_reminder: true,
  is_online: false,
  is_send_sms: true,
  is_send_whatsapp: true,
  location: null,
  start_date: null,
  trust_id: [],
};

export const EventMasterForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: EventMasterFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      resetField,
      setError,
      watch,
    } = useForm({
      mode: "all",
      resolver: zodResolver(EventMasterFormSchema),
      values: defaultValues,
    });

    const startDate = watch("start_date") ?? "";

    const branchIds = watch("branch_id");

    const isLifetime = watch("is_lifetime");

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      setError,

      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(formValues, {
            ...dirtyFields,
            is_online: true,
            is_send_whatsapp: true,
          });

          onSubmit(filterFormValues);
        })();
      },
    }));

    const { description, end_date, event_master_name, location, start_date } =
      errors;

    useMemo(() => {
      if (dirtyFields.is_lifetime) {
        resetField("end_date", {
          defaultValue: formDefaultValues.end_date,
        });
      }
    }, [isLifetime]);

    useMemo(() => {
      if (dirtyFields.branch_id) {
        resetField("trust_id", {
          defaultValue: formDefaultValues.trust_id,
        });
      }
    }, [branchIds]);

    return (
      <FormContainer>
        <FormGridLayout columns={2}>
          <TextField
            control={control}
            label={t("common.name.label", {
              label: t("common.master.label", {
                label: t("common.event.label"),
              }),
            })}
            name="event_master_name"
            loading={loading}
            required
            error={!!event_master_name}
            helperText={errorMessages(event_master_name?.message)}
          />

          <TextField
            name="location"
            control={control}
            loading={loading}
            label={t("location.label")}
            required
            error={!!location}
            helperText={errorMessages(location?.message)}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <DatePicker
            control={control}
            label={t("startDate.label")}
            name="start_date"
            loading={loading}
            required
            clearable={false}
            error={!!start_date}
            helperText={errorMessages(start_date?.message)}
          />

          <DateTimePicker
            name="end_date"
            label={t("endDate.label")}
            control={control}
            loading={loading}
            required={!isLifetime}
            minDate={startDate ? DateTime.fromISO(startDate) : DateTime.now()}
            clearable={false}
            disabled={!startDate}
            error={!!end_date}
            ampm={true}
            format="dd-MM-yyyy hh:mm a"
            closeOnSelect={false}
            helperText={errorMessages(end_date?.message)}
          />

          <PadBox padding={{ paddingTop: "40px" }}>
            <Box display="flex" gap="10px">
              <CheckBox control={control} name="is_lifetime" size="small" />
              <Typography>{t("common.is.lifetime")}</Typography>
            </Box>
          </PadBox>
        </FormGridLayout>

        <FormGridLayout columns={2}>
          <BranchAutocomplete
            loading={loading}
            name="branch_id"
            control={control}
            multiple
          />

          <TrustAutocompleteFromMultipleBranch
            branchIds={branchIds}
            loading={loading}
            name="trust_id"
            label={t("trust.label")}
            control={control}
            multiple
          />
        </FormGridLayout>

        <TextField
          name="description"
          label={t("description.label")}
          loading={loading}
          control={control}
          multiline
          error={!!description}
          helperText={errorMessages(description?.message)}
        />

        <FormGridLayout columns={3}>
          <RadioGroupField
            name="is_send_sms"
            control={control}
            loading={loading}
            label={t("isSendSMS.label")}
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

          <RadioGroupField
            name="is_send_whatsapp"
            control={control}
            loading={loading}
            label={t("common.isSendWhatsApp.label")}
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

          <RadioGroupField
            name="is_need_reminder"
            control={control}
            loading={loading}
            label={t("isNeedReminder.label")}
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

        <FormGridLayout columns={3}>
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

          <RadioGroupField
            name="is_online"
            control={control}
            loading={loading}
            label={t("isOnline.label")}
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
      </FormContainer>
    );
  }
);

EventMasterForm.displayName = "EventMasterForm";
