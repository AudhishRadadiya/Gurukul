"use client";

import {
  ContentBox,
  DatePicker,
  PadBox,
  toasts,
} from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import { DateFilterPeriodAutocomplete } from "@web/components/common/Autocomplete/DateFilterPeriodAutocomplete";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import { EventSummaryBreadcrumbs } from "@web/components/Event/EventSummary/EventSummaryBreadcrumbs";
import { EventSummaryFilter } from "@web/components/Event/EventSummary/EventSummaryList/EventSummaryFilter";
import { EventSummaryList } from "@web/components/Event/EventSummary/EventSummaryList/EventSummaryList";
import type { GetEventSummaryExportApiSuccessResponse } from "@web/components/Event/EventSummary/EventSummaryList/hooks/useGetEventSummaryExport";
import { useGetEventSummaryExport } from "@web/components/Event/EventSummary/EventSummaryList/hooks/useGetEventSummaryExport";
import { useBranch } from "@web/context/BranchContext";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { allowPrintExport } = useUserPermissions();

  const { branchIds } = useBranch();

  const [filterListData, setFilterListData] = useState<FieldValues>({});

  const { control, fromDate, toDate } = useDateFilters();

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
          from_date: fromDate,
          to_date: toDate,
        },
        startRow: 0,
      },
      fileType,
    });
  };

  const handleApplyFilter = (data: FieldValues) => {
    setFilterListData(data);
  };

  return (
    <Stack gap="10px">
      <EventSummaryBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack direction="row" gap="10px" justifyContent="space-between">
            <Typography variant="subtitle1">
              {t("summary.label", {
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
          <Stack direction="row" gap="10px">
            <EventSummaryFilter
              filterListData={filterListData}
              handleApplyFilter={handleApplyFilter}
            />

            <PermissionGuard canAccess={allowPrintExport}>
              <DataExport onExport={onExport} />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <EventSummaryList
          externalFilter={{
            ...filterListData,
            from_date: fromDate,
            to_date: toDate,
          }}
        />
      </ContentBox>
    </Stack>
  );
}
