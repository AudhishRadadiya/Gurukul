import type { FilterListType } from "@codezee/sixtify-brahma";
import { FilterListV2 } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useMemo, useState } from "react";
import type { FieldValues } from "react-hook-form";

import {
  fromFilterDate,
  toFilterDate,
} from "@web/app/event/event-reminder/page";
import { useGetFilterEventOptions } from "@web/components/common/Autocomplete/hooks/useGetFilterEventOptions";

type EventReminderFilterProps = {
  filterListData: FieldValues;
  setFilterListData: (data: FieldValues) => void;
};

export const EventReminderFilter = ({
  filterListData,
  setFilterListData,
}: EventReminderFilterProps) => {
  const [currentFilter, setCurrentFilter] = useState<FieldValues>({});

  const { data: filterEventOptions } = useGetFilterEventOptions();

  const fromDate = currentFilter.from_date ?? fromFilterDate;

  const toDate = currentFilter.to_date ?? toFilterDate;

  const filterListItems: FilterListType[] = useMemo(
    () => [
      {
        key: "event_type",
        label: t("eventType.label"),
        options: filterEventOptions,
        type: "autoComplete",
        value: currentFilter.event_type,
      },
      {
        key: "from_date",
        label: t("fromDate.label"),
        required: true,
        type: "date",
        value: fromDate,
      },
      {
        isDisabled: !fromDate,
        key: "to_date",
        label: t("toDate.label"),
        required: !!fromDate,
        type: "date",
        value: toDate,
      },
    ],
    [filterEventOptions, currentFilter]
  );

  const onChange = (data: FieldValues, isPopup: boolean) => {
    if (!isPopup) {
      setCurrentFilter(data);
    }
  };

  const onClear = () => {
    const filterData = {
      from_date: fromFilterDate,
      to_date: toFilterDate,
    };

    setCurrentFilter(filterData);
    setFilterListData(filterData);
  };

  return (
    <FilterListV2
      filterListItems={filterListItems}
      filterListData={filterListData}
      onChange={onChange}
      onApply={setFilterListData}
      onClear={onClear}
    />
  );
};
