"use client";

import {
  ContentBox,
  DateRangePickerField,
  PadBox,
  SearchField,
  toasts,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { useForm, type FieldValues } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";

import { DataExport } from "@web/components/common/DataExport/DataExport";
import { EventSummaryFilter } from "@web/components/Event/EventSummary/EventSummaryList/EventSummaryFilter";
import { EventSummaryList } from "@web/components/Event/EventSummary/EventSummaryList/EventSummaryList";
import type { GetEventSummaryExportApiSuccessResponse } from "@web/components/Event/EventSummary/EventSummaryList/hooks/useGetEventSummaryExport";
import { useGetEventSummaryExport } from "@web/components/Event/EventSummary/EventSummaryList/hooks/useGetEventSummaryExport";
import { useBranch } from "@web/context/BranchContext";
import { useSavedFiltersHandler } from "@web/hooks/savedFilters/hooks/useSavedFiltersHandler";
import { SaveFiltersCheckbox } from "@web/hooks/savedFilters/SaveFiltersCheckbox";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";
import { Debounce_Delay, filterSearchParams } from "@web/utils/helper";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { allowPrintExport } = useUserPermissions();

  const { isMobile } = useGetDeviceType();

  const { branchIds } = useBranch();

  const [filterListData, setFilterListData] = useState<FieldValues>({});

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const {
    control,
    dateRange,
    search,
    setValue: setDateValue,
  } = useDateFilters();

  const [searchInput] = useDebounceValue(search, Debounce_Delay);

  const {
    control: saveFiltersControl,
    setValue: setSaveFiltersValue,
    watch,
  } = useForm({
    defaultValues: {
      is_save_filter: false,
    },
  });

  const is_save_filter = watch("is_save_filter");

  const {
    filters,
    isFetchingSavedFilters,
    isPendingSaveFilters,
    isSaveFilter,
    saveFiltersAction,
  } = useSavedFiltersHandler({
    moduleKey: "event",
  });

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
      const { event_id, from_date, to_date, trust_id } = filters as Record<
        string,
        string
      >;

      setSaveFiltersValue("is_save_filter", isSaveFilter);

      if (from_date && to_date) {
        setDateValue("date_range", [from_date, to_date]);
      }

      setFilterListData({
        event_id: event_id?.[0],
        trust_id,
      });
    }
  }, [filters]);

  const { mutate: getEventSummaryExport } = useGetEventSummaryExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({
        data,
        message,
      }: GetEventSummaryExportApiSuccessResponse) => {
        window.open(data.url, "_blank");

        toasts.success({ title: message });
      },
    },
  });

  const onExport = (fileType: FilType) => {
    getEventSummaryExport({
      body: {
        endRow: 0,
        externalFilter: {
          ...filterListData,
          branch_id: [branchIds],
          from_date: dateRange[0],
          to_date: dateRange[1],
        },
        filterModel: agGridState.filterModel,
        quickFilter: filterSearchParams(searchInput),
        sortModel: agGridState.sortModel,
        startRow: 0,
      },
      fileType,
    });
  };

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
                label: t("common.event.label"),
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
            <EventSummaryFilter
              filterListData={filterListData}
              handleApplyFilter={handleApplyFilter}
            />

            <PermissionGuard canAccess={allowPrintExport}>
              <DataExport onExport={onExport} />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <EventSummaryList
            search={searchInput}
            externalFilter={{
              ...filterListData,
              from_date: dateRange[0],
              to_date: dateRange[1],
            }}
            agGridState={agGridState}
            setAgGridState={setAgGridState}
          />
        </Box>
      </ContentBox>
    </Stack>
  );
}
