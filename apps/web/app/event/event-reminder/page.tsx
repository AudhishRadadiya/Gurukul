"use client";

import { ContentBox, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import { EventReminderBreadcrumbs } from "@web/components/Event/EventReminder/EventReminderBreadcrumbs";
import { EventReminderFilter } from "@web/components/Event/EventReminder/EventReminderList/EventReminderFilter";
import { EventReminderList } from "@web/components/Event/EventReminder/EventReminderList/EventReminderList";
import type { GetEventReminderExportApiSuccessResponse } from "@web/components/Event/EventReminder/EventReminderList/hooks/useGetEventReminderExport";
import { useGetEventReminderExport } from "@web/components/Event/EventReminder/EventReminderList/hooks/useGetEventReminderExport";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

export const fromFilterDate = DateTime.now().startOf("month").toISODate();

export const toFilterDate = DateTime.now().endOf("month").toISODate();

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [filterListData, setFilterListData] = useState<FieldValues>({
    from_date: fromFilterDate,
    to_date: toFilterDate,
  });

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

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
        endRow,
        externalFilter: { ...filterListData },
        filterModel: agGridFilterModel,
        startRow,
      },
      fileType,
    });
  };

  return (
    <Stack gap="10px">
      <EventReminderBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Typography variant="subtitle1">
            {t("reminder.label", {
              label: t("common.event.label"),
            })}
          </Typography>
        </PadBox>
      </ContentBox>

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack direction="row" gap="15px">
            <EventReminderFilter
              filterListData={filterListData}
              setFilterListData={setFilterListData}
            />

            <DataExport onExport={onExport} />
          </Stack>
        </PadBox>

        <EventReminderList
          externalFilter={filterListData}
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
