import {
  DatePicker,
  FormContainer,
  FormGridLayout,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import _isArray from "lodash/isArray";
import { DateTime } from "luxon";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useMemo } from "react";
import type { UseFormSetError } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { BranchAutocomplete } from "@web/components/common/Autocomplete/BranchAutocomplete";
import { DonationAutocomplete } from "@web/components/common/Autocomplete/DonationAutocomplete";
import { DonationModeAutocomplete } from "@web/components/common/Autocomplete/DonationModeAutocomplete";
import { DonationReportTypeAutocomplete } from "@web/components/common/Autocomplete/DonationReportTypeAutocomplete";
import { ReportUserAutocomplete } from "@web/components/common/Autocomplete/ReportUserAutocomplete";
import { TrustAutocomplete } from "@web/components/common/Autocomplete/TrustAutocomplete";
import { CheckboxRow } from "@web/components/common/CheckboxRow/CheckboxRow";
import { FinancialYearSelector } from "@web/components/report/donationReport/FinancialYearSelector";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const DonationReportFromSchema = z
  .object({
    branch_ids: z
      .array(z.string())
      .min(1, { message: "common.required" })
      .default([]),
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
      .union([z.string(), z.array(z.string())])
      .refine((value) => !!value, {
        message: "common.required",
      }),
    user_ids: z.array(z.string()).default([]),
    year: z.boolean().optional(),
    year_month_wise: z.boolean().optional(),
  })
  // eslint-disable-next-line sonarjs/cognitive-complexity
  .superRefine((val, ctx) => {
    const isReportType7or8 = [7, 8].includes(val.report_type ?? 0);

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

    if (isReportType7or8) {
      if (!val.trust_ids || _isArray(val.trust_ids)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("common.required"),
          path: ["trust_ids"],
        });
      }
    }

    if (!isReportType7or8) {
      if (!_isArray(val.trust_ids) || !val.trust_ids.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("common.required"),
          path: ["trust_ids"],
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
  reset: (values: DonationReportFormFieldValues) => void;
  setError: UseFormSetError<DonationReportFormFieldValues>;
  submitForm: (
    onSubmit: (formValues: Partial<DonationReportFormFieldValues>) => void
  ) => void;
};

export const formDefaultValues: DonationReportFormFieldValues = {
  branch_ids: [],
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
      clearErrors,
      control,
      formState: { dirtyFields, errors },
      handleSubmit,
      reset,
      setError,
      setValue,
      watch,
    } = methods;

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      reset: (values) => {
        reset(values, { keepDirty: true });
      },
      setError,
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          let transformedTrustIds: string[] = [];

          if (_isArray(formValues.trust_ids)) {
            transformedTrustIds = formValues.trust_ids;
          } else if (formValues.trust_ids) {
            transformedTrustIds = [formValues.trust_ids];
          }

          const transformedFormValues = {
            ...formValues,
            trust_ids: transformedTrustIds,
          };

          const filterFormValues = filterChangedFormFields(
            transformedFormValues,
            {
              ...dirtyFields,
              from_date: true,
              temp_year: false,
              to_date: true,
            }
          );

          onSubmit(filterFormValues);
        })();
      },
    }));

    const year = watch("year");

    const reportType = watch("report_type");

    const branchIds = watch("branch_ids") ?? [];

    const trustIds = watch("trust_ids") ?? [];

    const getError = (name: keyof DonationReportFormFieldValues) => ({
      error: !!errors[name],
      helperText: errorMessages(errors[name]?.message),
    });

    useMemo(() => {
      if (![7, 8].includes(reportType ?? 0) && !Array.isArray(trustIds)) {
        setValue("trust_ids", [], { shouldDirty: true });
        clearErrors("trust_ids");
      }
    }, [reportType]);

    const isMultiSelectTrust = useMemo(() => {
      return ![7, 8].includes(reportType ?? 0);
    }, [reportType]);

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
          <BranchAutocomplete
            isUserWise
            multiple
            required
            loading={loading}
            name="branch_ids"
            control={control}
            {...getError("branch_ids")}
          />

          <TrustAutocomplete
            useUserWise
            label={t("trust.label")}
            multiple={isMultiSelectTrust}
            required
            loading={loading}
            disabled={!branchIds.length}
            name="trust_ids"
            control={control}
            {...getError("trust_ids")}
          />

          <DonationAutocomplete
            multiple
            loading={loading}
            label={t("donation.type.label")}
            name="donation_type"
            control={control}
            {...getError("donation_type")}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <DonationReportTypeAutocomplete
            loading={loading}
            required
            name="report_type"
            control={control}
            {...getError("report_type")}
          />
          <ReportUserAutocomplete
            multiple
            loading={loading}
            name="user_ids"
            control={control}
            {...getError("user_ids")}
          />

          <DonationModeAutocomplete
            loading={loading}
            multiple
            name="donation_mode"
            control={control}
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
            name="from_receipt_no"
            control={control}
            label={t("from.receipt.no.label")}
            required={reportType == 7}
            {...getError("from_receipt_no")}
          />

          <TextField
            type="number"
            name="to_receipt_no"
            control={control}
            label={t("to.receipt.no.label")}
            required={reportType == 7}
            {...getError("from_receipt_no")}
          />
        </FormGridLayout>
      </FormContainer>
    );
  }
);

DonationReportFrom.displayName = "DonationReportFrom";
