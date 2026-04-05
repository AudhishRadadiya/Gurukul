import type { FilterListType } from "@codezee/sixtify-brahma";
import { FilterListV2 } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useMemo, useState } from "react";
import type { FieldValues } from "react-hook-form";

import { useGetTrustOptions } from "@web/components/common/Autocomplete/hooks/useGetTrustOptions";

type DonationSummaryFilterProps = {
  filterListData: FieldValues;
  setFilterListData: (data: FieldValues) => void;
};

export const DonationSummaryFilter = ({
  filterListData,
  setFilterListData,
}: DonationSummaryFilterProps) => {
  const [currentFilter, setCurrentFilter] = useState<FieldValues>();

  const { data: trustOptions } = useGetTrustOptions({ useShortName: true });

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

  const onClear = () => {
    setCurrentFilter({});
    setFilterListData({});
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
