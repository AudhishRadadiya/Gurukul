import { FilterListV2, type FilterListType } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { FieldValues } from "react-hook-form";

import { useGetBranchOptions } from "@web/components/common/Autocomplete/hooks/useGetBranchOptions";
import { useGetDonationModeOptions } from "@web/components/common/Autocomplete/hooks/useGetDonationModeOptions";
import { useGetEventDropdownOptions } from "@web/components/common/Autocomplete/hooks/useGetEventDropdownOptions";
import { useGetFilterEventOptions } from "@web/components/common/Autocomplete/hooks/useGetFilterEventOptions";
import { useGetTrustOptionsFromMultipleBranch } from "@web/components/common/Autocomplete/hooks/useGetTrustOptionsFromMultipleBranch";
import {
  fromFilterDate,
  toFilterDate,
} from "@web/components/Donation/donationEntry/donationEntryList/DonationEntryList";
import { useBranch } from "@web/context/BranchContext";

type EventDonationFilterProps = {
  filterListData: FieldValues;
  handleApplyFilter: (data: FieldValues) => void;
  isHideRenderChips?: boolean;
};

export const EventDonationFilter = ({
  filterListData,
  handleApplyFilter,
  isHideRenderChips = false,
}: EventDonationFilterProps) => {
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
    eventId: currentFilter.event_id,
  });

  const { branchIds } = useBranch();

  useMemo(() => {
    if (!_isEmpty(filterListData)) {
      setCurrentFilter(filterListData);
    }
  }, [filterListData]);

  useEffect(() => {
    const event_id = searchParams.get("event_id");

    const from_date = searchParams.get("from_date");

    const to_date = searchParams.get("to_date");

    const trust_id = searchParams.get("trust_id");

    setCurrentFilter((prev) => {
      const newFilter = {
        branch_id: filterListData.branch_id || prev.branch_id,
        from_date: from_date ? from_date.toString() : fromFilterDate,
        to_date: to_date ? to_date.toString() : toFilterDate,
        ...(trust_id && { trust_id }),
        ...((event_id ?? filterListData.event_id)
          ? { event_id: event_id ?? filterListData.event_id }
          : {}),
        ...(filterListData.donation_mode_id && {
          donation_mode_id: filterListData.donation_mode_id,
        }),
        ...(filterListData.event_dropdown_filter && {
          event_dropdown_filter: filterListData.event_dropdown_filter,
        }),
      };

      const hasChanged = JSON.stringify(newFilter) !== JSON.stringify(prev);

      return hasChanged ? newFilter : prev;
    });
  }, [
    filterListData.branch_id,
    filterListData.donation_mode_id,
    filterListData.event_dropdown_filter,
    filterListData.event_id,
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
        key: "event_id",
        label: t("common.event.label"),
        options: filterEventOptions,
        type: "autoComplete",
        value: currentFilter.event_id,
      },
      {
        isDisabled: !currentFilter.event_id,
        key: "event_dropdown_filter",
        label: t("common.form.options.label"),
        multiSelect: true,
        options: eventDropdownOptions,
        type: "autoComplete",
        value: currentFilter.event_dropdown_filter,
      },
    ];

    return items;
  }, [
    trustOptions,
    donationModeOptions,
    branchOptions,
    filterEventOptions,
    eventDropdownOptions,
    currentFilter,
  ]);

  const onChange = (data: FieldValues, isPopup: boolean) => {
    if (!isPopup) {
      setCurrentFilter(data);
    }
  };

  const onApply = (data: FieldValues) => {
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
