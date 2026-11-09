import type { FilterListType } from "@codezee/sixtify-brahma";
import { FilterListV2 } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import { useMemo, useState } from "react";
import type { FieldValues } from "react-hook-form";

import { useGetBankOptions } from "@web/components/common/Autocomplete/hooks/useGetBankOptions";
import { useGetChequeStatusOptions } from "@web/components/common/Autocomplete/hooks/useGetChequeStatusOptions";
import { useGetTrustOptions } from "@web/components/common/Autocomplete/hooks/useGetTrustOptions";

type ChequeReconciliationFilterProps = {
  filterListData: FieldValues;
  handleApplyFilter: (data: FieldValues) => void;
};

export const ChequeReconciliationFilter = ({
  filterListData,
  handleApplyFilter,
}: ChequeReconciliationFilterProps) => {
  const [currentFilter, setCurrentFilter] = useState<FieldValues>({});

  const { data: trustOptions } = useGetTrustOptions({ useShortName: true });

  const { data: bankOptions } = useGetBankOptions();

  const { chequeStatusOptions } = useGetChequeStatusOptions();

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
        value: currentFilter.trust_id,
      },
      {
        key: "status",
        label: t("status.label"),
        options: chequeStatusOptions,
        type: "autoComplete",
        value: currentFilter.status,
      },
      {
        key: "bank_id",
        label: t("bank.name.label"),
        options: bankOptions,
        type: "autoComplete",
        value: currentFilter.bank_id,
      },
    ],
    [trustOptions, bankOptions, chequeStatusOptions, currentFilter]
  );

  const onChange = (data: FieldValues, isPopup: boolean) => {
    if (!isPopup) {
      setCurrentFilter(data);
    }
  };

  const onApply = (data: FieldValues) => {
    handleApplyFilter(data);
    setCurrentFilter(data);
  };

  const onClear = () => {
    handleApplyFilter({});
    setCurrentFilter({});
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
