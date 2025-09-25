import { Autocomplete } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

import type { FinancialYearOption } from "@web/components/common/Autocomplete/hooks/useGetFinancialYearOptions";
import { useGetFinancialYearOptions } from "@web/components/common/Autocomplete/hooks/useGetFinancialYearOptions";
import type { DonationReportFormFieldValues } from "@web/components/report/donationReport/DonationReportFrom";

type FinancialYearSelectorProps = {
  loading?: boolean;
};

export const FinancialYearSelector = ({
  loading = false,
}: FinancialYearSelectorProps) => {
  const { control, setValue, watch } =
    useFormContext<DonationReportFormFieldValues>();

  const { data: financialYearOptions } =
    useGetFinancialYearOptions<FinancialYearOption>({
      segment: "for_report",
    });

  const tempYear = watch("temp_year");

  useMemo(() => {
    if (tempYear && financialYearOptions?.length) {
      const selectedYearOption = financialYearOptions.find(
        (option) => option.value == tempYear
      );

      if (selectedYearOption) {
        setValue("to_date", selectedYearOption.end_date);
        setValue("from_date", selectedYearOption.start_date);
      }
    }
  }, [tempYear]);

  return (
    <Autocomplete
      name="temp_year"
      loading={loading}
      control={control}
      label={t("apply.in.selected.year.label")}
      options={financialYearOptions}
    />
  );
};
