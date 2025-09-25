import { FilterListV2, type FilterListType } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { FieldValues } from "react-hook-form";

import { useGetDonationModeOptions } from "@web/components/common/Autocomplete/hooks/useGetDonationModeOptions";
import { useGetTrustOptions } from "@web/components/common/Autocomplete/hooks/useGetTrustOptions";
import {
  fromFilterDate,
  toFilterDate,
} from "@web/components/Donation/donationEntry/donationEntryList/DonationEntryList";

type DonationEntryFilterProps = {
  filterListData: FieldValues;
  setFilterListData: (data: FieldValues) => void;
};

export const DonationEntryFilter = ({
  filterListData,
  setFilterListData,
}: DonationEntryFilterProps) => {
  const searchParams = useSearchParams();

  const params = Object.fromEntries(searchParams.entries());

  const [currentFilter, setCurrentFilter] = useState<FieldValues>({});

  const { data: trustOptions } = useGetTrustOptions();

  const { data: donationModeOptions } = useGetDonationModeOptions();

  const fromDate = currentFilter.from_date;

  useMemo(() => {
    const { from_date, to_date } = params;

    setCurrentFilter({
      from_date: from_date ? from_date.toString() : fromFilterDate,
      to_date: to_date ? to_date.toString() : toFilterDate,
    });
  }, []);

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
        key: "donation_mode_id",
        label: t("donationMode.label"),
        options: donationModeOptions,
        type: "autoComplete",
        value: currentFilter.donation_mode_id,
      },
      {
        key: "from_date",
        label: t("fromDate.label"),
        required: true,
        type: "date",
        value: fromDate,
      },
      {
        isDefaultCurrentDate: true,
        isDisabled: !fromDate,
        key: "to_date",
        label: t("toDate.label"),
        required: !!fromDate,
        type: "date",
        value: currentFilter.to_date,
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
