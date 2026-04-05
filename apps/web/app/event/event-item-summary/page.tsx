"use client";

import {
  Autocomplete,
  ContentBox,
  DatePicker,
  PadBox,
  toasts,
} from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import _first from "lodash/first";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DateFilterPeriodAutocomplete } from "@web/components/common/Autocomplete/DateFilterPeriodAutocomplete";
import { useGetFilterEventOptionsFromMultipleBranch } from "@web/components/common/Autocomplete/hooks/useGetFilterEventOptionsFromMultipleBranch";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import { EventItemSummaryBreadcrumbs } from "@web/components/Event/eventItemSummary/EventItemSummaryBreadcrumbs";
import { EventItemSummaryList } from "@web/components/Event/eventItemSummary/eventItemSummaryList/EventItemSummaryList";
import type { GetEventItemSummaryExportApiSuccessResponse } from "@web/components/Event/eventItemSummary/eventItemSummaryList/hooks/useGetEventItemSummaryExport";
import { useGetEventItemSummaryExport } from "@web/components/Event/eventItemSummary/eventItemSummaryList/hooks/useGetEventItemSummaryExport";
import { useBranch } from "@web/context/BranchContext";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

type EventFilterFormValues = {
  event_id: string | null;
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { allowPrintExport } = useUserPermissions();

  const { branchIds } = useBranch();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const {
    control: eventFilterControl,
    setValue: setEventFilterValue,
    watch: watchEventFilter,
  } = useForm<EventFilterFormValues>({
    defaultValues: {
      event_id: null,
    },
  });

  const { control: dateControl, fromDate, toDate } = useDateFilters();

  const { data: eventOptions } = useGetFilterEventOptionsFromMultipleBranch({
    branchIds: branchIds ? [branchIds] : [],
  });

  const eventId = watchEventFilter("event_id");

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
          from_date: fromDate,
          to_date: toDate,
        },
        filterModel: agGridFilterModel,
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
          setEventFilterValue("event_id", eventId as string);

          return;
        }
      }

      // If no selection, select first branch
      if (hasNoSelection) {
        const firstEventValue = _first(eventOptions);

        if (firstEventValue) {
          setEventFilterValue("event_id", firstEventValue.value as string);
        }
      }
    }
  }, [eventOptions, branchIds]);

  return (
    <Stack gap="10px">
      <EventItemSummaryBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack direction="row" gap="10px" justifyContent="space-between">
            <Typography variant="subtitle1">
              {t("summary.label", {
                label: t("common.event.item.label"),
              })}
            </Typography>

            <Stack direction="row" gap="10px" alignItems="center">
              <DateFilterPeriodAutocomplete
                name="date_filter_period"
                control={dateControl}
                clearIcon
                sx={{ width: "160px" }}
              />

              <DatePicker
                control={dateControl}
                name="from_date"
                clearable={false}
                containerProps={{ width: "160px" }}
              />

              <DatePicker
                control={dateControl}
                name="to_date"
                minDate={fromDate ? DateTime.fromISO(fromDate) : DateTime.now()}
                clearable={false}
                containerProps={{ width: "160px" }}
              />
            </Stack>
          </Stack>
        </PadBox>
      </ContentBox>

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack direction="row" gap="10px" justifyContent="flex-end">
            <Autocomplete<EventFilterFormValues>
              name="event_id"
              sx={{ width: "250px" }}
              options={eventOptions}
              control={eventFilterControl}
              placeholder={t("common.event.label")}
              clearIcon
            />

            <PermissionGuard canAccess={allowPrintExport}>
              <DataExport onExport={onExport} />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <EventItemSummaryList
          externalFilter={{
            event_id: eventId,
            from_date: fromDate,
            to_date: toDate,
          }}
          agGridFilterModel={agGridFilterModel}
          setAgGridFilterModel={setAgGridFilterModel}
          page={page}
          rowsPerPage={rowsPerPage}
          startRow={startRow}
          endRow={endRow}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </ContentBox>
    </Stack>
  );
}
