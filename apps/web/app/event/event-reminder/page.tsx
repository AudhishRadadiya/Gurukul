"use client";

import {
  ContentBox,
  DatePicker,
  PadBox,
  toasts,
} from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DateFilterPeriodAutocomplete } from "@web/components/common/Autocomplete/DateFilterPeriodAutocomplete";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import { EventReminderBreadcrumbs } from "@web/components/Event/EventReminder/EventReminderBreadcrumbs";
import { EventReminderFilter } from "@web/components/Event/EventReminder/EventReminderList/EventReminderFilter";
import { EventReminderList } from "@web/components/Event/EventReminder/EventReminderList/EventReminderList";
import type { GetEventReminderExportApiSuccessResponse } from "@web/components/Event/EventReminder/EventReminderList/hooks/useGetEventReminderExport";
import { useGetEventReminderExport } from "@web/components/Event/EventReminder/EventReminderList/hooks/useGetEventReminderExport";
import { useBranch } from "@web/context/BranchContext";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

export const fromFilterDate = DateTime.now().startOf("month").toISODate();

export const toFilterDate = DateTime.now().endOf("month").toISODate();

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { allowPrintExport } = useUserPermissions();

  const { branchIds } = useBranch();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [filterListData, setFilterListData] = useState<FieldValues>({
    from_date: fromFilterDate,
    to_date: toFilterDate,
  });

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { control, fromDate, toDate } = useDateFilters();

  const { mutate } = useGetEventReminderExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({
        data,
        message,
      }: GetEventReminderExportApiSuccessResponse) => {
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
          ...filterListData,
          branch_id: [branchIds],
          from_date: fromDate,
          to_date: toDate,
        },
        filterModel: agGridFilterModel,
        startRow: 0,
      },
      fileType,
    });
  };

  return (
    <Stack gap="5px">
      <EventReminderBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "5px" }}>
          <Stack
            direction="row"
            gap="10px"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">
              {t("reminder.label", {
                label: t("common.event.label"),
              })}
            </Typography>

            <Stack direction="row" gap="10px" alignItems="center">
              <DateFilterPeriodAutocomplete
                name="date_filter_period"
                control={control}
                clearIcon
                sx={{ width: "160px" }}
              />

              <DatePicker
                control={control}
                name="from_date"
                clearable={false}
                containerProps={{ width: "160px" }}
              />

              <DatePicker
                control={control}
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
          <Stack direction="row" gap="15px">
            <EventReminderFilter
              filterListData={filterListData}
              setFilterListData={setFilterListData}
            />

            <PermissionGuard canAccess={allowPrintExport}>
              <DataExport onExport={onExport} />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <EventReminderList
          externalFilter={{
            ...filterListData,
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
