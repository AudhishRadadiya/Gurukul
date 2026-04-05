"use client";

import {
  ContentBox,
  DatePicker,
  PadBox,
  toasts,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import { DateFilterPeriodAutocomplete } from "@web/components/common/Autocomplete/DateFilterPeriodAutocomplete";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import type { GetEventSummaryExportApiSuccessResponse } from "@web/components/Event/EventSummary/EventSummaryList/hooks/useGetEventSummaryExport";
import { DonationCollectionReportBreadcrumbs } from "@web/components/report/donationReport/donationCollectionReport/DonationCollectionReportBreadcrumbs";
import { DonationCollectionReportFilter } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/DonationCollectionReportFilter";
import { DonationCollectionReportList } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/DonationCollectionReportList";
import { useGetDonationCollectionReportExport } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/hooks/useGetDonationCollectionReportExport";
import { useBranch } from "@web/context/BranchContext";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const theme = useTheme();

  const { branchIds } = useBranch();

  const { allowPrintExport } = useUserPermissions();

  const { slate } = theme.palette.app.color;

  const now = DateTime.now();

  const startOfWeek = now.startOf("week").minus({ days: 1 });

  const endOfWeek = startOfWeek.plus({ days: 6 });

  const [filterListData, setFilterListData] = useState<FieldValues>({
    from_date: startOfWeek.toFormat("yyyy-MM-dd"),
    to_date: endOfWeek.toFormat("yyyy-MM-dd"),
  });

  const { control, fromDate, toDate } = useDateFilters();

  const { mutate: getDonationCollectionReport } =
    useGetDonationCollectionReportExport({
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
    getDonationCollectionReport({
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

  return (
    <Stack gap="10px">
      <DonationCollectionReportBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack direction="row" gap="10px" justifyContent="space-between">
            <Typography variant="subtitle1">
              {t("donation.collection.report.menu.label")}
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
            <DonationCollectionReportFilter
              filterListData={filterListData}
              setFilterListData={setFilterListData}
            />

            <PermissionGuard canAccess={allowPrintExport}>
              <DataExport onExport={onExport} />
            </PermissionGuard>
          </Stack>
        </PadBox>

        {!filterListData.to_date ? (
          <PadBox padding={{ padding: "10px" }}>
            <Box
              sx={{
                backgroundColor: slate[700],
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              <PadBox padding={{ padding: "10px" }}>
                To view and take action on the data, please select the From Date
                and To Date from the filters on the right, then click Apply.
              </PadBox>
            </Box>
          </PadBox>
        ) : (
          <DonationCollectionReportList
            externalFilter={{
              ...filterListData,
              from_date: fromDate,
              to_date: toDate,
            }}
          />
        )}
      </ContentBox>
    </Stack>
  );
}
