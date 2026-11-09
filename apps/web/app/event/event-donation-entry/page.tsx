"use client";

import { type DialogRenderer } from "@codezee/sixtify-brahma";
import {
  ContentBox,
  DateRangePickerField,
  PadBox,
  SearchField,
  toasts,
  useDialogActions,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import _isEmpty from "lodash/isEmpty";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";

import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { FilterEventAutocomplete } from "@web/components/common/Autocomplete/FilterEventAutocomplete";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import { ButtonLayoutProvider } from "@web/components/common/responsive/ButtonLayoutProvider";
import { AddEventDonationEntryDialog } from "@web/components/Event/eventDonationEntry/dialogs/AddEventDonationEntryDialog";
import { EventDonationEntryList } from "@web/components/Event/eventDonationEntry/eventDonationEntryList/EventDonationEntryList";
import type { GetEventDonationEntryExportApiSuccessResponse } from "@web/components/Event/eventDonationEntry/eventDonationEntryList/hooks/useGetEventDonationEntryExport";
import { useGetEventDonationEntryExport } from "@web/components/Event/eventDonationEntry/eventDonationEntryList/hooks/useGetEventDonationEntryExport";
import { EVENT_DONATION_ENTRY_PERMISSION } from "@web/constants/permission/event/eventDonationEntry/permission";
import { useBranch } from "@web/context/BranchContext";
import { useSavedFiltersHandler } from "@web/hooks/savedFilters/hooks/useSavedFiltersHandler";
import { SaveFiltersCheckbox } from "@web/hooks/savedFilters/SaveFiltersCheckbox";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import { eventDonationEntryKeys } from "@web/queryKeysFactories/eventDonationEntryKeys";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";
import { Debounce_Delay, filterSearchParams } from "@web/utils/helper";

type EventDonationEntryProps = {
  event_id: string[];
};

type EventDonationEntrySavedFilters = {
  event_id: string[];
  from_date: string;
  to_date: string;
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const queryClient = useQueryClient();

  const { isMobile } = useGetDeviceType();

  const { branchIds } = useBranch();

  const { allowPrintExport, validateAccess } = useUserPermissions();

  const {
    control: eventControl,
    setValue,
    watch: watchEvent,
  } = useForm<EventDonationEntryProps>({
    defaultValues: {
      event_id: [],
    },
  });

  const eventId = watchEvent("event_id");

  const {
    control: dateControl,
    dateRange,
    search,
    setValue: setDateValue,
  } = useDateFilters();

  const [searchInput] = useDebounceValue(search, Debounce_Delay);

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const { control: saveFiltersControl, setValue: setSaveFiltersValue } =
    useForm({
      defaultValues: {
        is_save_filter: false,
      },
    });

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
          ...(eventId && { event_id: eventId }),
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

    handleSaveFilters(checked);
  };

  useMemo(() => {
    if (!_isEmpty(filters)) {
      const { event_id, from_date, to_date } =
        filters as EventDonationEntrySavedFilters;

      setSaveFiltersValue("is_save_filter", isSaveFilter);

      if (from_date && to_date) {
        setDateValue("date_range", [from_date, to_date]);
      }

      if (event_id && Array.isArray(event_id) && event_id.length) {
        setValue("event_id", event_id);
      }
    }
  }, [filters]);

  const { mutate } = useGetEventDonationEntryExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({
        data,
        message,
      }: GetEventDonationEntryExportApiSuccessResponse) => {
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
          from_date: dateRange[0] ?? "",
          to_date: dateRange[1] ?? "",
        },
        filterModel: agGridState.filterModel,
        quickFilter: filterSearchParams(searchInput),
        sortModel: agGridState.sortModel,
        startRow: 0,
      },
      fileType,
    });
  };

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddEventDonationEntryDialog
        open
        onClose={onDialogClose}
        onAddSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: eventDonationEntryKeys.listing(),
          });
        }}
      />
    ),
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
              {t("common.event.donationEntry")}
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

              <PermissionGuard
                canAccess={validateAccess(
                  EVENT_DONATION_ENTRY_PERMISSION.CREATE
                )}
              >
                <ButtonLayoutProvider
                  onClick={() => {
                    onDialogOpen("add");
                  }}
                  size={isMobile ? "small" : "large"}
                  label={t("common.button.add", {
                    label: t("common.event.donationEntry"),
                  })}
                />
              </PermissionGuard>
            </Stack>
          </Stack>
        </PadBox>
      </ContentBox>

      <ContentBox>
        <PadBox padding={{ padding: { md: "15px", xs: "8px 10px" } }}>
          <Stack
            direction="row"
            justifyContent={{ md: "flex-end", xs: "flex-start" }}
            alignItems="center"
            flexWrap="wrap"
            gap={1}
          >
            <Box
              sx={{
                flex: { md: "0 0 auto", xs: "1 1 160px" },
                maxWidth: { md: "none", xs: "100%" },
                minWidth: { md: 250, xs: 0 },
                width: { md: "auto", xs: "100%" },
              }}
            >
              <FilterEventAutocomplete
                isUserWise
                label=""
                multiple
                name="event_id"
                control={eventControl}
                sx={{ minWidth: 0, width: "100%" }}
              />
            </Box>

            <PermissionGuard canAccess={allowPrintExport}>
              <DataExport onExport={onExport} />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <Box sx={{ overflow: "hidden", width: "100%" }}>
          <EventDonationEntryList
            page={page}
            endRow={endRow}
            eventId={eventId}
            startRow={startRow}
            rowsPerPage={rowsPerPage}
            onPageChange={onPageChange}
            agGridState={agGridState}
            onRowsPerPageChange={onRowsPerPageChange}
            setAgGridState={setAgGridState}
            search={searchInput}
            externalDateFilter={{
              from_date: dateRange[0],
              to_date: dateRange[1],
            }}
          />
        </Box>
      </ContentBox>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
}
