import {
  DatePicker,
  FormContainer,
  FormGridLayout,
  PadBox,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DonationModeAutocomplete } from "@web/components/common/Autocomplete/DonationModeAutocomplete";
import { TrustAutocomplete } from "@web/components/common/Autocomplete/TrustAutocomplete";
import { UserAutocomplete } from "@web/components/common/Autocomplete/UserAutocomplete";
import { CheckboxRow } from "@web/components/common/CheckboxRow/CheckboxRow";
import { useEnableDisableButton } from "@web/hooks/useEnableDisableButton";
import { errorMessages, filterChangedFormFields } from "@web/utils/helper";

const DailyCollectionReportFromSchema = z.object({
  donation_mode: z
    .array(z.string())
    .min(1, { message: "common.required" })
    .default([]),
  from_date: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  show_all: z.boolean().optional(),
  to_date: z.string().nullable().optional(),
  trust: z.array(z.string()).min(1, { message: "common.required" }).default([]),
  user: z.array(z.string()).min(1, { message: "common.required" }).default([]),
});

export type DailyCollectionReportFromFieldValues = z.infer<
  typeof DailyCollectionReportFromSchema
>;

type DailyCollectionReportFromProps = {
  defaultValues?: DailyCollectionReportFromFieldValues;
  loading?: boolean;
};

export type FormRef = {
  setError: UseFormSetError<DailyCollectionReportFromFieldValues>;
  submitForm: (
    onSubmit: (
      formValues: Partial<DailyCollectionReportFromFieldValues>
    ) => void
  ) => void;
};

const formDefaultValues: DailyCollectionReportFromFieldValues = {
  donation_mode: [],
  from_date: null,
  show_all: false,
  to_date: null,
  trust: [],
  user: [],
};

export const DailyCollectionReportFrom = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
    }: DailyCollectionReportFromProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const methods = useForm<DailyCollectionReportFromFieldValues>({
      mode: "all",
      resolver: zodResolver(DailyCollectionReportFromSchema),
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
          const filterFormValues = filterChangedFormFields(formValues, {
            ...dirtyFields,
            show_all: true,
          });

          onSubmit(filterFormValues);
        })();
      },
    }));

    const getError = (name: keyof DailyCollectionReportFromFieldValues) => ({
      error: !!errors[name],
      helperText: errorMessages(errors[name]?.message),
    });

    return (
      <FormContainer>
        <FormGridLayout columns={3}>
          <TrustAutocomplete
            label={t("trust.label")}
            multiple
            required
            loading={loading}
            name="trust"
            control={control}
            {...getError("trust")}
          />

          <UserAutocomplete
            multiple
            loading={loading}
            name="user"
            required
            control={control}
            {...getError("user")}
          />

          <DonationModeAutocomplete
            loading={loading}
            multiple
            required
            name="donation_mode"
            control={control}
            {...getError("donation_mode")}
          />
        </FormGridLayout>

        <FormGridLayout columns={3}>
          <DatePicker
            required
            control={control}
            label={t("fromDate.label")}
            name="from_date"
            loading={loading}
            clearable={false}
            {...getError("from_date")}
          />

          <DatePicker
            control={control}
            label={t("toDate.label")}
            name="to_date"
            loading={loading}
            clearable={false}
            {...getError("to_date")}
          />

          <PadBox padding={{ paddingLeft: "10px", paddingTop: "40px" }}>
            <CheckboxRow
              size="small"
              name="show_all"
              label={t("common.show.all.data")}
              control={control}
            />
          </PadBox>
        </FormGridLayout>
      </FormContainer>
    );
  }
);

DailyCollectionReportFrom.displayName = "DailyCollectionReportFrom";
