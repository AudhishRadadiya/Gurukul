import {
  DatePicker,
  FormGridLayout,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const FinancialYearMasterFormSchema = z.object({
  end_date: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  financial_year: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  is_active: z.boolean(),
  start_date: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type FinancialYearMasterFormFieldValues = z.infer<
  typeof FinancialYearMasterFormSchema
>;

type FinancialYearMasterFormProps = {
  defaultValues?: FinancialYearMasterFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<FinancialYearMasterFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<FinancialYearMasterFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: FinancialYearMasterFormFieldValues = {
  end_date: null,
  financial_year: null,
  is_active: true,
  start_date: null,
};

export const FinancialYearMasterForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: FinancialYearMasterFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      formState: { errors },
      handleSubmit,
      setError,
      setValue,
      watch,
    } = useForm({
      mode: "all",
      resolver: zodResolver(FinancialYearMasterFormSchema),
      values: defaultValues,
    });

    const startDate = watch("start_date") ?? "";

    const endDate = watch("end_date") ?? "";

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      setError,
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(formValues, {
            end_date: true,
            financial_year: true,
            is_active: true,
            start_date: true,
          });

          onSubmit(filterFormValues);
        })();
      },
    }));

    useMemo(() => {
      const getStartDateYear = DateTime.fromISO(startDate).year.toString();

      const getEndDateYear = DateTime.fromISO(endDate).year.toString();

      const financialYearValue =
        getStartDateYear &&
        getEndDateYear &&
        `${getStartDateYear}-${getEndDateYear}`;

      setValue("financial_year", financialYearValue);
    }, [startDate, endDate]);

    const minEndDate = DateTime.fromISO(startDate).plus({ year: 1 });

    const maxStartDate = DateTime.fromISO(endDate).minus({ year: 1 });

    const { end_date, financial_year, start_date } = errors;

    return (
      <Stack gap="15px">
        <FormGridLayout columns={2}>
          <DatePicker
            control={control}
            label="Start Date"
            name="start_date"
            loading={loading}
            clearable={false}
            maxDate={maxStartDate}
            required
            error={!!start_date}
            helperText={errorMessages(start_date?.message)}
          />

          <DatePicker
            name="end_date"
            label="End Date"
            control={control}
            loading={loading}
            minDate={minEndDate}
            clearable={false}
            disabled={!startDate}
            required
            error={!!end_date}
            helperText={errorMessages(end_date?.message)}
          />

          <TextField
            loading={loading}
            control={control}
            name="financial_year"
            required
            disabled
            label="Financial Year"
            error={!!financial_year}
            helperText={errorMessages(financial_year?.message)}
          />

          <RadioGroupField
            name="is_active"
            control={control}
            loading={loading}
            label="Current Active Year"
            options={[
              {
                disabled: false,
                label: "Yes",
                values: true,
              },
              {
                disabled: false,
                label: "No",
                values: false,
              },
            ]}
          />
        </FormGridLayout>
      </Stack>
    );
  }
);

FinancialYearMasterForm.displayName = "FinancialYearMasterForm";
