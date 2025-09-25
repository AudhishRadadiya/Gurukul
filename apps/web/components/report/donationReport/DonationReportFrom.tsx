import {
  DatePicker,
  FormContainer,
  FormGridLayout,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { DonationAutocomplete } from "@web/components/common/Autocomplete/DonationAutocomplete";
import { DonationModeAutocomplete } from "@web/components/common/Autocomplete/DonationModeAutocomplete";
import { DonationReportTypeAutocomplete } from "@web/components/common/Autocomplete/DonationReportTypeAutocomplete";
import { TrustAutocomplete } from "@web/components/common/Autocomplete/TrustAutocomplete";
import { UserAutocomplete } from "@web/components/common/Autocomplete/UserAutocomplete";
import { CheckboxRow } from "@web/components/common/CheckboxRow/CheckboxRow";
import { FinancialYearSelector } from "@web/components/report/donationReport/FinancialYearSelector";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const DonationReportFromSchema = z
  .object({
    donation_mode: z.array(z.string()).default([]),
    donation_type: z.array(z.string()).default([]),
    from_date: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    from_receipt_no: z.number().nullable(),
    report_type: z
      .number()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    show_all: z.boolean().optional(),
    temp_year: z.string().nullable(),
    to_date: z
      .string()
      .nullable()
      .refine((value) => !!value, {
        message: "common.required",
      }),
    to_receipt_no: z.number().nullable(),
    trust_ids: z
      .array(z.string())
      .min(1, { message: "common.required" })
      .default([]),
    user_ids: z.array(z.string()).default([]),
    year: z.boolean().optional(),
    year_month_wise: z.boolean().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.report_type === 6) {
      if (val.donation_type.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("common.required"),
          path: ["donation_type"],
        });
      }

      if (val.donation_mode.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("common.required"),
          path: ["donation_mode"],
        });
      }

      if (val.user_ids.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("common.required"),
          path: ["user_ids"],
        });
      }
    }

    if (val.report_type === 7) {
      if (!val.from_receipt_no) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("common.required"),
          path: ["from_receipt_no"],
        });
      }

      if (!val.to_receipt_no) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("common.required"),
          path: ["to_receipt_no"],
        });
      }
    }
  });

export type DonationReportFormFieldValues = z.infer<
  typeof DonationReportFromSchema
>;

type DonationReportFormProps = {
  defaultValues?: DonationReportFormFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<DonationReportFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<DonationReportFormFieldValues>) => void
  ) => void;
};

const formDefaultValues: DonationReportFormFieldValues = {
  donation_mode: [],
  donation_type: [],
  from_date: DateTime.now().startOf("year").toISODate(),
  from_receipt_no: null,
  report_type: 0,
  show_all: false,
  temp_year: null,
  to_date: DateTime.now().toISODate(),
  to_receipt_no: null,
  trust_ids: [],
  user_ids: [],
  year: false,
  year_month_wise: false,
};

export const DonationReportFrom = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: DonationReportFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const methods = useForm<DonationReportFormFieldValues>({
      mode: "all",
      resolver: zodResolver(DonationReportFromSchema),
      values: defaultValues,
    });

    const {
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      setError,
      watch,
    } = methods;

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      setError,
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(formValues, {
            ...dirtyFields,
            from_date: true,
            temp_year: false,
            to_date: true,
          });

          onSubmit(filterFormValues);
        })();
      },
    }));

    const year = watch("year");

    const reportType = watch("report_type");

    const getError = (name: keyof DonationReportFormFieldValues) => ({
      error: !!errors[name],
      helperText: errorMessages(errors[name]?.message),
    });

    return (
      <FormContainer>
        <FormGridLayout columns={3}>
          <CheckboxRow
            size="small"
            name="year_month_wise"
            label={t("common.year.month.wise")}
            control={control}
          />

          <CheckboxRow
            size="small"
            name="year"
            label={t("common.year.wise")}
            control={control}
          />

          <CheckboxRow
            size="small"
            name="show_all"
            label={t("common.show.all.data")}
            control={control}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <TrustAutocomplete
            label={t("trust.label")}
            multiple
            required
            loading={loading}
            name="trust_ids"
            control={control}
            {...getError("trust_ids")}
          />

          <DonationAutocomplete
            multiple
            loading={loading}
            required={reportType == 6}
            label={t("donation.type.label")}
            name="donation_type"
            control={control}
            {...getError("donation_type")}
          />

          <DonationReportTypeAutocomplete
            loading={loading}
            required
            name="report_type"
            control={control}
            {...getError("report_type")}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <UserAutocomplete
            multiple
            loading={loading}
            name="user_ids"
            control={control}
            required={reportType == 6}
            {...getError("user_ids")}
          />

          <DonationModeAutocomplete
            loading={loading}
            multiple
            name="donation_mode"
            control={control}
            required={reportType == 6}
            {...getError("donation_mode")}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          {year && (
            <FormProvider {...methods}>
              <FinancialYearSelector loading={loading} />
            </FormProvider>
          )}

          <DatePicker
            control={control}
            label={t("fromDate.label")}
            name="from_date"
            required
            loading={loading}
            clearable={false}
            {...getError("from_date")}
          />

          <DatePicker
            control={control}
            label={t("toDate.label")}
            name="to_date"
            required
            loading={loading}
            clearable={false}
            {...getError("to_date")}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <TextField
            type="number"
            name="to_receipt_no"
            control={control}
            label={t("to.receipt.no.label")}
            required={reportType == 7}
            {...getError("from_receipt_no")}
          />

          <TextField
            type="number"
            name="from_receipt_no"
            control={control}
            label={t("from.receipt.no.label")}
            required={reportType == 7}
            {...getError("from_receipt_no")}
          />
        </FormGridLayout>
      </FormContainer>
    );
  }
);

DonationReportFrom.displayName = "DonationReportFrom";
