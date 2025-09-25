import type { FilterListType } from "@codezee/sixtify-brahma";
import { FilterListV2 } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useMemo, useState } from "react";
import type { FieldValues } from "react-hook-form";

type DonationCollectionReportFilterProps = {
  filterListData: FieldValues;
  setFilterListData: (data: FieldValues) => void;
};

export const DonationCollectionReportFilter = ({
  filterListData,
  setFilterListData,
}: DonationCollectionReportFilterProps) => {
  const [currentFilter, setCurrentFilter] = useState<FieldValues>({});

  const fromDate = currentFilter?.from_date;

  const filterListItems: FilterListType[] = useMemo(
    () => [
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
    [currentFilter]
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
