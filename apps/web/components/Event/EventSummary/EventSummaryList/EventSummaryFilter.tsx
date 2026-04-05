import type { FilterListType } from "@codezee/sixtify-brahma";
import { FilterListV2 } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useMemo, useState } from "react";
import type { FieldValues } from "react-hook-form";

import { useGetFilterEventOptions } from "@web/components/common/Autocomplete/hooks/useGetFilterEventOptions";
import { useGetTrustOptions } from "@web/components/common/Autocomplete/hooks/useGetTrustOptions";

type EventSummaryFilterProps = {
  filterListData: FieldValues;
  handleApplyFilter: (data: FieldValues) => void;
};

export const EventSummaryFilter = ({
  filterListData,
  handleApplyFilter,
}: EventSummaryFilterProps) => {
  const [currentFilter, setCurrentFilter] = useState<FieldValues>();

  const { data: filterEventOptions } = useGetFilterEventOptions();

  const { data: trustOption } = useGetTrustOptions({ useShortName: true });

  const fromDate = currentFilter?.from_date;

  const filterListItems: FilterListType[] = useMemo(
    () => [
      {
        key: "trust_id",
        label: t("trust.label"),
        multiSelect: true,
        options: trustOption,
        type: "autoComplete",
        value: currentFilter?.trust_id,
      },
      {
        key: "event_type",
        label: t("eventType.label"),
        options: filterEventOptions,
        type: "autoComplete",
        value: currentFilter?.event_type,
      },
      {
        key: "from_date",
        label: t("fromDate.label"),
        type: "date",
        value: fromDate ?? "",
      },
      {
        isDisabled: !fromDate,
        key: "to_date",
        label: t("toDate.label"),
        required: !!fromDate,
        type: "date",
        value: currentFilter?.to_date ?? "",
      },
    ],
    [filterEventOptions, trustOption, currentFilter]
  );

  const onChange = (data: FieldValues, isPopup: boolean) => {
    if (!isPopup) {
      setCurrentFilter(data);
    }
  };

  const onApply = (data: FieldValues) => {
    handleApplyFilter(data);
  };

  const onClear = () => {
    setCurrentFilter({});
    handleApplyFilter({});
  };

  return (
    <FilterListV2
      filterListItems={filterListItems}
      filterListData={filterListData}
      onChange={onChange}
      onApply={onApply}
      onClear={onClear}
    />
  );
};
