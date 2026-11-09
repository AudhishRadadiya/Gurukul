import type { FilterListType } from "@codezee/sixtify-brahma";
import { FilterListV2 } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import { useMemo, useState } from "react";
import type { FieldValues } from "react-hook-form";

import { useGetFilterEventOptions } from "@web/components/common/Autocomplete/hooks/useGetFilterEventOptions";

type EventReminderFilterProps = {
  filterListData: FieldValues;
  handleApplyFilter: (data: FieldValues) => void;
};

export const EventReminderFilter = ({
  filterListData,
  handleApplyFilter,
}: EventReminderFilterProps) => {
  const [currentFilter, setCurrentFilter] = useState<FieldValues>({});

  const { data: filterEventOptions } = useGetFilterEventOptions();

  useMemo(() => {
    if (!_isEmpty(filterListData)) {
      setCurrentFilter(filterListData);
    }
  }, [filterListData]);

  const filterListItems: FilterListType[] = useMemo(
    () => [
      {
        key: "event_id",
        label: t("eventType.label"),
        options: filterEventOptions,
        type: "autoComplete",
        value: currentFilter.event_id,
      },
    ],
    [filterEventOptions, currentFilter]
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
