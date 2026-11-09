import type { FilterListType } from "@codezee/sixtify-brahma";
import { FilterListV2 } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import { useMemo, useState } from "react";
import type { FieldValues } from "react-hook-form";

import { useGetTrustOptions } from "@web/components/common/Autocomplete/hooks/useGetTrustOptions";

type DonationSummaryFilterProps = {
  filterListData: FieldValues;
  handleApplyFilter: (data: FieldValues) => void;
};

export const DonationSummaryFilter = ({
  filterListData,
  handleApplyFilter,
}: DonationSummaryFilterProps) => {
  const [currentFilter, setCurrentFilter] = useState<FieldValues>();

  const { data: trustOptions } = useGetTrustOptions({ useShortName: true });

  useMemo(() => {
    if (!_isEmpty(filterListData)) {
      setCurrentFilter(filterListData);
    }
  }, [filterListData]);

  const filterListItems: FilterListType[] = useMemo(
    () => [
      {
        key: "trust_id",
        label: t("trust.label"),
        options: trustOptions,
        type: "autoComplete",
        value: currentFilter?.trust_id,
      },
    ],
    [trustOptions, currentFilter]
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
