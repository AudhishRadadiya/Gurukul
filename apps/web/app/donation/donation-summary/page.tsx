"use client";

import {
  CheckBox,
  ContentBox,
  DateRangePickerField,
  PadBox,
  SearchField,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import type { ChangeEvent } from "react";
import { useMemo, useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";

import { DataExport } from "@web/components/common/DataExport/DataExport";
import { ONE_MONTH } from "@web/components/common/hooks/constant";
import { DonationSummaryFilter } from "@web/components/Donation/donationSummary/donationSummaryList/DonationSummaryFlter";
import {
  DonationSummaryList,
  type DonationSummaryListHandle,
} from "@web/components/Donation/donationSummary/donationSummaryList/DonationSummaryList";
import { useSavedFiltersHandler } from "@web/hooks/savedFilters/hooks/useSavedFiltersHandler";
import { SaveFiltersCheckbox } from "@web/hooks/savedFilters/SaveFiltersCheckbox";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import type { FilType } from "@web/types/shared-types";
import { Debounce_Delay } from "@web/utils/helper";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { allowPrintExport } = useUserPermissions();

  const { isMobile } = useGetDeviceType();

  const [filterListData, setFilterListData] = useState<FieldValues>({});

  const {
    control,
    dateRange,
    onlyContactNo,
    search,
    setValue: setDateValue,
  } = useDateFilters(ONE_MONTH);

  const [searchInput] = useDebounceValue(search, Debounce_Delay);

  const donationSummaryListRef = useRef<DonationSummaryListHandle>(null);

  const onExport = (fileType: FilType) => {
    donationSummaryListRef.current?.onExport(fileType);
  };

  const {
    control: saveFiltersControl,
    setValue: setSaveFiltersValue,
    watch: watchSaveFilters,
  } = useForm({
    defaultValues: {
      is_save_filter: false,
    },
  });

  const is_save_filter = watchSaveFilters("is_save_filter");

  const {
    filters,
    isFetchingSavedFilters,
    isPendingSaveFilters,
    isSaveFilter,
    saveFiltersAction,
  } = useSavedFiltersHandler({
    moduleKey: "donation",
  });

  const handleSaveFilters = (filtersData: FieldValues, checked: boolean) => {
    const payload = checked
      ? {
          from_date: dateRange[0],
          to_date: dateRange[1],
          ...(filtersData.trust_id && { trust_id: [filtersData.trust_id] }),
        }
      : {};

    saveFiltersAction({
      filters: payload,
      is_save_filter: checked,
    });
  };

  const onSaveFiltersChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    setSaveFiltersValue("is_save_filter", checked);

    handleSaveFilters(filterListData, checked);
  };

  useMemo(() => {
    if (!_isEmpty(filters)) {
      const { from_date, to_date, trust_id } = filters as Record<
        string,
        string
      >;

      setSaveFiltersValue("is_save_filter", isSaveFilter);

      if (from_date && to_date) {
        setDateValue("date_range", [from_date, to_date]);
      }

      if (trust_id) {
        setFilterListData({ trust_id: trust_id?.[0] });
      }
    }
  }, [filters]);

  const handleApplyFilter = (data: FieldValues) => {
    setFilterListData(data);

    if (is_save_filter) {
      handleSaveFilters(data, is_save_filter);
    }
  };

  return (
    <Stack gap={{ md: "10px", xs: "8px" }}>
      <ContentBox>
        <PadBox padding={{ padding: { md: "10px", xs: "8px 10px" } }}>
          <Stack
            direction={{ md: "row", xs: "column" }}
            gap={3}
            justifyContent="space-between"
            alignItems={{ md: "center", xs: "stretch" }}
          >
            <Typography
              variant="subtitle1"
              fontSize={isMobile ? "16px" : "18px"}
              whiteSpace="nowrap"
            >
              {t("summary.label", {
                label: t("donation.menu.label"),
              })}
            </Typography>

            <Stack
              direction="row"
              gap={1.25}
              alignItems="center"
              flexWrap="wrap"
              justifyContent={{ md: "flex-end", xs: "flex-start" }}
              sx={{ minWidth: 0, width: { md: "auto", xs: "100%" } }}
            >
              <Box sx={{ flexShrink: 0 }}>
                <SaveFiltersCheckbox
                  name="is_save_filter"
                  control={saveFiltersControl}
                  disabled={isFetchingSavedFilters || isPendingSaveFilters}
                  onChange={onSaveFiltersChange}
                />
              </Box>

              <Stack
                direction="row"
                gap={0.75}
                alignItems="center"
                sx={{ flexShrink: 0 }}
              >
                <CheckBox
                  name="only_contact_no"
                  control={control}
                  size="small"
                />
                <Typography fontSize={{ md: 15, xs: 13 }} whiteSpace="nowrap">
                  {t("only.mobile_no")}
                </Typography>
              </Stack>

              <Box
                sx={{
                  flex: { md: "0 0 220px", xs: "1 1 100%" },
                  minWidth: 0,
                  width: { md: "auto", xs: "100%" },
                }}
              >
                <SearchField
                  name="search"
                  characterType="any-character"
                  letterCase="mixed"
                  control={control}
                  containerProps={{ width: "100%" }}
                />
              </Box>

              <Box
                sx={{
                  flex: { md: "0 0 auto", xs: "1 1 100%" },
                  minWidth: 0,
                  width: { md: "auto", xs: "100%" },
                }}
              >
                <DateRangePickerField
                  name="date_range"
                  control={control}
                  showPresets
                  size={isMobile ? "small" : "large"}
                  placeholder="Select Date Range"
                />
              </Box>
            </Stack>
          </Stack>
        </PadBox>
      </ContentBox>

      <ContentBox>
        <PadBox padding={{ padding: { md: "10px", xs: "8px 10px" } }}>
          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            flexWrap="wrap"
            justifyContent={{ md: "flex-end", xs: "flex-start" }}
          >
            <DonationSummaryFilter
              filterListData={filterListData}
              handleApplyFilter={handleApplyFilter}
            />

            <PermissionGuard canAccess={allowPrintExport}>
              <DataExport onExport={onExport} />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <DonationSummaryList
            ref={donationSummaryListRef}
            externalFilter={{
              ...filterListData,
              from_date: dateRange[0],
              only_contact_no: onlyContactNo,
              to_date: dateRange[1],
            }}
            search={searchInput}
          />
        </Box>
      </ContentBox>
    </Stack>
  );
}
