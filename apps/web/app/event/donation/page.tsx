"use client";

import {
  ContentBox,
  DateRangePickerField,
  PadBox,
  SearchField,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import { useSearchParams } from "next/navigation";
import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import type { FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";

import { CUSTOM, SEVEN_DAYS } from "@web/components/common/hooks/constant";
import { EventDonationList } from "@web/components/Event/eventDonation/eventDonationList/EventDonationList";
import { useSavedFiltersHandler } from "@web/hooks/savedFilters/hooks/useSavedFiltersHandler";
import { SaveFiltersCheckbox } from "@web/hooks/savedFilters/SaveFiltersCheckbox";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { Debounce_Delay } from "@web/utils/helper";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { isMobile } = useGetDeviceType();

  const searchParams = useSearchParams();

  const [filterListData, setFilterListData] = useState<FieldValues>({
    branch_id: [""],
  });

  const {
    control: dateControl,
    dateRange,
    search,
    setValue: setDateValue,
  } = useDateFilters();

  const {
    control: saveFiltersControl,
    setValue: setSaveFiltersValue,
    watch,
  } = useForm({
    defaultValues: {
      is_save_filter: false,
    },
  });

  const [searchInput] = useDebounceValue(search, Debounce_Delay);

  useEffect(() => {
    const urlFromDate = searchParams.get("from_date");

    const urlToDate = searchParams.get("to_date");

    if (urlFromDate && urlToDate) {
      setDateValue("date_filter_period", CUSTOM);
      setDateValue("date_range", [urlFromDate, urlToDate]);
    } else {
      setDateValue("date_filter_period", SEVEN_DAYS);
    }
  }, [searchParams, setDateValue]);

  const {
    filters,
    isFetchingSavedFilters,
    isPendingSaveFilters,
    isSaveFilter,
    saveFiltersAction,
  } = useSavedFiltersHandler({
    moduleKey: "event",
  });

  const is_save_filter = watch("is_save_filter");

  const handleSaveFilters = (filtersData: FieldValues, checked: boolean) => {
    const { event_id, ...rest } = filtersData;

    const payload = checked
      ? {
          ...rest,
          from_date: dateRange[0],
          to_date: dateRange[1],
          ...(event_id && { event_id: [event_id] }),
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
      const { event_id, from_date, to_date, ...rest } = filters as Record<
        string,
        string
      >;

      setSaveFiltersValue("is_save_filter", isSaveFilter);

      if (from_date && to_date) {
        setDateValue("date_range", [from_date, to_date]);
      }

      setFilterListData({ ...rest, event_id: event_id?.[0] });
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
            gap="10px"
            justifyContent="space-between"
            alignItems={{ md: "center", xs: "stretch" }}
          >
            <Typography
              variant="subtitle1"
              fontSize={isMobile ? "16px" : "18px"}
              sx={{ flexShrink: 0 }}
            >
              {t("common.event.wise.donation")}
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              gap="10px"
              flexWrap="wrap"
              justifyContent={{ md: "flex-end", xs: "flex-start" }}
              sx={{
                minWidth: 0,
                width: { md: "auto", xs: "100%" },
              }}
            >
              <SaveFiltersCheckbox
                name="is_save_filter"
                control={saveFiltersControl}
                disabled={isFetchingSavedFilters || isPendingSaveFilters}
                onChange={onSaveFiltersChange}
              />

              <SearchField
                name="search"
                characterType="any-character"
                letterCase="mixed"
                control={dateControl}
                containerProps={{
                  flex: { md: "0 0 auto", xs: "1 1 160px" },
                  maxWidth: { md: "none", xs: "100%" },
                  minWidth: { md: "auto", xs: "140px" },
                  width: { md: "auto", xs: "100%" },
                }}
              />

              <Box
                sx={{
                  flex: { md: "0 0 auto", xs: "1 1 200px" },
                  maxWidth: { md: "none", xs: "100%" },
                  minWidth: { md: "auto", xs: 0 },
                  width: { md: "auto", xs: "100%" },
                }}
              >
                <DateRangePickerField
                  name="date_range"
                  control={dateControl}
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
        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <EventDonationList
            search={searchInput}
            externalDateFilter={{
              from_date: dateRange[0],
              to_date: dateRange[1],
            }}
            filterListData={filterListData}
            setFilterListData={setFilterListData}
            handleApplyFilter={handleApplyFilter}
          />
        </Box>
      </ContentBox>
    </Stack>
  );
}
