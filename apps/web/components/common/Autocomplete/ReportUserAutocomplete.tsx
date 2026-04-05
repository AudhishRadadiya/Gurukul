import { Autocomplete, type AutocompleteProps } from "@codezee/sixtify-brahma";
import type { FieldValues } from "react-hook-form";

import { useGetReportUserOptions } from "@web/components/common/Autocomplete/hooks/useGetReportUserOptions";

type ReportUserAutocompleteProps<P extends FieldValues> = Omit<
  AutocompleteProps<P>,
  "options" & {
    loading?: boolean;
  }
>;

export const ReportUserAutocomplete = <P extends FieldValues>({
  loading,
  ...props
}: ReportUserAutocompleteProps<P>) => {
  const { data: reportUserOption } = useGetReportUserOptions();

  return (
    <Autocomplete
      label="User"
      options={reportUserOption}
      placeholder="Select User"
      loading={loading}
      {...props}
    />
  );
};
