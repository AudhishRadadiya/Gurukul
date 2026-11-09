import { FilterListV2, type FilterListType } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { FieldValues } from "react-hook-form";

import { amountFilterOperatorOptions } from "@web/components/common/Autocomplete/hooks/useGetAmountFilterOperatorOptions";
import { useGetBranchOptions } from "@web/components/common/Autocomplete/hooks/useGetBranchOptions";
import { useGetDonationModeOptions } from "@web/components/common/Autocomplete/hooks/useGetDonationModeOptions";
import { useGetEventDropdownOptions } from "@web/components/common/Autocomplete/hooks/useGetEventDropdownOptions";
import { useGetFilterEventOptions } from "@web/components/common/Autocomplete/hooks/useGetFilterEventOptions";
import { useGetTrustOptionsFromMultipleBranch } from "@web/components/common/Autocomplete/hooks/useGetTrustOptionsFromMultipleBranch";
import { BETWEEN } from "@web/components/common/hooks/constant";
import {
  fromFilterDate,
  toFilterDate,
} from "@web/components/Donation/donationEntry/donationEntryList/DonationEntryList";
import { useBranch } from "@web/context/BranchContext";

const donationEntryAmountFilterKeys = {
  betweenOperatorValue: BETWEEN,
  fromAmountKey: "from_amount",
  operatorKey: "operator",
  toAmountKey: "to_amount",
} as const;

type DonationEntryFilterProps = {
  filterListData: FieldValues;
  handleApplyFilter: (data: FieldValues) => void;
  isHideRenderChips?: boolean;
  showEventDropdownFilter?: boolean;
};

export const DonationEntryFilter = ({
  filterListData,
  handleApplyFilter,
  isHideRenderChips = false,
  showEventDropdownFilter = true,
}: DonationEntryFilterProps) => {
  const searchParams = useSearchParams();

  const [currentFilter, setCurrentFilter] =
    useState<FieldValues>(filterListData);

  const { data: trustOptions } = useGetTrustOptionsFromMultipleBranch({
    branchIds: currentFilter.branch_id,
    useShortName: true,
  });

  const { data: donationModeOptions } = useGetDonationModeOptions();

  const { data: branchOptions } = useGetBranchOptions({
    isUserWise: true,
  });

  const { data: filterEventOptions } = useGetFilterEventOptions();

  const { data: eventDropdownOptions } = useGetEventDropdownOptions({
    eventId: currentFilter.event_type_id,
  });

  const { branchIds } = useBranch();

  useMemo(() => {
    if (!_isEmpty(filterListData)) {
      setCurrentFilter(filterListData);
    }
  }, [filterListData]);

  useEffect(() => {
    const event_type_id = searchParams.get("event_type_id");

    const from_date = searchParams.get("from_date");

    const to_date = searchParams.get("to_date");

    const trust_id = searchParams.get("trust_id");

    setCurrentFilter((prev) => {
      const newFilter = {
        branch_id: filterListData.branch_id || prev.branch_id,
        from_date: from_date ? from_date.toString() : fromFilterDate,
        to_date: to_date ? to_date.toString() : toFilterDate,
        ...(trust_id && { trust_id }),
        ...((event_type_id ?? filterListData.event_type_id)
          ? { event_type_id: event_type_id ?? filterListData.event_type_id }
          : {}),
        ...(filterListData.donation_mode_id && {
          donation_mode_id: filterListData.donation_mode_id,
        }),
        ...(filterListData.event_dropdown_filter && {
          event_dropdown_filter: filterListData.event_dropdown_filter,
        }),
        ...(filterListData.amount && { amount: filterListData.amount }),
      };

      const hasChanged = JSON.stringify(newFilter) !== JSON.stringify(prev);

      return hasChanged ? newFilter : prev;
    });
  }, [
    filterListData.branch_id,
    filterListData.donation_mode_id,
    filterListData.event_dropdown_filter,
    filterListData.event_type_id,
    filterListData.trust_id,
    filterListData.amount,
    searchParams,
  ]);

  const filterListItems: FilterListType[] = useMemo(() => {
    const items: FilterListType[] = [
      {
        key: "branch_id",
        label: t("branch.label"),
        multiSelect: true,
        options: branchOptions,
        required: true,
        type: "autoComplete",
        value: currentFilter.branch_id,
      },
      {
        isDisabled: !currentFilter.branch_id,
        key: "trust_id",
        label: t("trust.label"),
        multiSelect: true,
        options: trustOptions,
        type: "autoComplete",
        value: currentFilter.trust_id,
      },
      {
        key: "donation_mode_id",
        label: t("donationMode.label"),
        multiSelect: true,
        options: donationModeOptions,
        type: "autoComplete",
        value: currentFilter.donation_mode_id,
      },
      {
        key: "event_type_id",
        label: t("common.event.label"),
        multiSelect: true,
        options: filterEventOptions,
        type: "autoComplete",
        value: currentFilter.event_type_id,
      },
    ];

    if (showEventDropdownFilter) {
      items.push({
        isDisabled: !currentFilter.event_type_id,
        key: "event_dropdown_filter",
        label: t("common.form.options.label"),
        multiSelect: true,
        options: eventDropdownOptions,
        type: "autoComplete",
        value: currentFilter.event_dropdown_filter,
      });
    }

    items.push({
      amountFilterKeys: donationEntryAmountFilterKeys,
      amountFilterValues: {
        fromAmount: currentFilter.amount?.from_amount ?? null,
        operator: currentFilter.amount?.operator ?? null,
        toAmount: currentFilter.amount?.to_amount ?? null,
      },
      key: "amount",
      label: t("amount.label"),
      options: amountFilterOperatorOptions,
      type: "amountFilter",
      value: currentFilter.amount,
    });

    return items;
  }, [
    trustOptions,
    donationModeOptions,
    branchOptions,
    filterEventOptions,
    eventDropdownOptions,
    currentFilter,
    showEventDropdownFilter,
  ]);

  const onChange = (data: FieldValues, isPopup: boolean) => {
    if (!isPopup) {
      setCurrentFilter(data);
    }
  };

  const onApply = (data: FieldValues) => {
    setCurrentFilter(data);

    handleApplyFilter(data);
  };

  const onClear = () => {
    const filterData = {
      branch_id: [branchIds],
    };

    setCurrentFilter(filterData);

    handleApplyFilter(filterData);
  };

  return (
    <FilterListV2
      isHideRenderChips={isHideRenderChips}
      filterListItems={filterListItems}
      filterListData={filterListData}
      onChange={onChange}
      onApply={onApply}
      onClear={onClear}
    />
  );
};
