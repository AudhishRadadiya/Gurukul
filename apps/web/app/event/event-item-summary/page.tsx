"use client";

import {
  Autocomplete,
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
import _first from "lodash/first";
import _isEmpty from "lodash/isEmpty";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";

import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { useGetFilterEventOptionsFromMultipleBranch } from "@web/components/common/Autocomplete/hooks/useGetFilterEventOptionsFromMultipleBranch";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import { EventItemSummaryList } from "@web/components/Event/eventItemSummary/eventItemSummaryList/EventItemSummaryList";
import type { GetEventItemSummaryExportApiSuccessResponse } from "@web/components/Event/eventItemSummary/eventItemSummaryList/hooks/useGetEventItemSummaryExport";
import { useGetEventItemSummaryExport } from "@web/components/Event/eventItemSummary/eventItemSummaryList/hooks/useGetEventItemSummaryExport";
import { useBranch } from "@web/context/BranchContext";
import { useSavedFiltersHandler } from "@web/hooks/savedFilters/hooks/useSavedFiltersHandler";
import { SaveFiltersCheckbox } from "@web/hooks/savedFilters/SaveFiltersCheckbox";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";
import { Debounce_Delay, filterSearchParams } from "@web/utils/helper";

type EventFilterFormValues = {
  event_id: string | null;
  is_save_filter: boolean;
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { allowPrintExport } = useUserPermissions();

  const { isMobile } = useGetDeviceType();

  const { branchIds } = useBranch();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const {
    control: control,
    setValue: setValue,
    watch: watchEventFilter,
  } = useForm<EventFilterFormValues>({
    defaultValues: {
      event_id: null,
      is_save_filter: false,
    },
  });

  const {
    control: dateControl,
    dateRange,
    search,
    setValue: setDateValue,
  } = useDateFilters();

  const [searchInput] = useDebounceValue(search, Debounce_Delay);

  const { data: eventOptions } = useGetFilterEventOptionsFromMultipleBranch({
    branchIds: branchIds ? [branchIds] : [],
  });

  const eventId = watchEventFilter("event_id");

  const {
    filters,
    isFetchingSavedFilters,
    isPendingSaveFilters,
    isSaveFilter,
    saveFiltersAction,
  } = useSavedFiltersHandler({
    moduleKey: "event",
  });

  const handleSaveFilters = (checked: boolean) => {
    const payload = checked
      ? {
          from_date: dateRange[0],
          to_date: dateRange[1],
          ...(eventId && { event_id: [eventId] }),
        }
      : {};

    saveFiltersAction({
      filters: payload,
      is_save_filter: checked,
    });
  };

  const onSaveFiltersChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    setValue("is_save_filter", checked);

    handleSaveFilters(checked);
  };

  useMemo(() => {
    if (!_isEmpty(filters)) {
      const { event_id, from_date, to_date } = filters as Record<
        string,
        string
      >;

      setValue("is_save_filter", isSaveFilter);

      if (from_date && to_date) {
        setDateValue("date_range", [from_date, to_date]);
      }

      if (event_id && Array.isArray(event_id)) {
        setValue("event_id", event_id[0]);
      }
    }
  }, [filters]);

  const { mutate } = useGetEventItemSummaryExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({
        data,
        message,
      }: GetEventItemSummaryExportApiSuccessResponse) => {
        window.open(data.url, "_blank");

        toasts.success({ title: message });
      },
    },
  });

  const onExport = (fileType: FilType) => {
    mutate({
      body: {
        endRow: 0,
        externalFilter: {
          branch_id: [branchIds],
          event_id: eventId,
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

  useMemo(() => {
    const hasOptions = eventOptions && eventOptions.length > 0;

    if (hasOptions) {
      const hasNoSelection = !eventId;

      // If we have saved branchIds in context, use it
      if (eventId && hasNoSelection) {
        // Check if the saved branchId exists in options
        const savedEventExists = eventOptions.some(
          (option) => option.value === eventId
        );

        if (savedEventExists) {
          setValue("event_id", eventId as string);

          return;
        }
      }

      // If no selection, select first branch
      if (hasNoSelection) {
        const firstEventValue = _first(eventOptions);

        if (firstEventValue) {
          setValue("event_id", firstEventValue.value as string);
        }
      }
    }
  }, [eventOptions, branchIds]);

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
              {t("item.amount.summary.label")}
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
                  control={control}
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
                  control={dateControl}
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
        <PadBox padding={{ padding: { md: "10px", xs: "8px 10px" } }}>
          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            flexWrap="wrap"
            justifyContent={{ md: "flex-end", xs: "flex-start" }}
          >
            <Box
              sx={{
                flex: { md: "0 0 auto", xs: "1 1 160px" },
                maxWidth: { md: "none", xs: "100%" },
                minWidth: { md: 250, xs: 0 },
                width: { md: "auto", xs: "100%" },
              }}
            >
              <Autocomplete<EventFilterFormValues>
                name="event_id"
                sx={{ minWidth: 0, width: "100%" }}
                options={eventOptions}
                control={control}
                placeholder={t("common.event.label")}
                clearIcon
              />
            </Box>

            <PermissionGuard canAccess={allowPrintExport}>
              <DataExport onExport={onExport} />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <EventItemSummaryList
            search={searchInput}
            externalFilter={{
              event_id: eventId,
              from_date: dateRange[0],
              to_date: dateRange[1],
            }}
            agGridState={agGridState}
            setAgGridState={setAgGridState}
            page={page}
            rowsPerPage={rowsPerPage}
            startRow={startRow}
            endRow={endRow}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        </Box>
      </ContentBox>
    </Stack>
  );
}
