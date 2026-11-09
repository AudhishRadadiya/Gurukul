"use client";

import {
  ContentBox,
  DateRangePickerField,
  PadBox,
  toasts,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import { DataExport } from "@web/components/common/DataExport/DataExport";
import type { GetEventSummaryExportApiSuccessResponse } from "@web/components/Event/EventSummary/EventSummaryList/hooks/useGetEventSummaryExport";
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
  const { isMobile } = useGetDeviceType();

  const theme = useTheme();

  const { branchIds } = useBranch();

  const { allowPrintExport } = useUserPermissions();

  const { slate } = theme.palette.app.color;

  const now = DateTime.now();

  const startOfWeek = now.startOf("week").minus({ days: 1 });

  const endOfWeek = startOfWeek.plus({ days: 6 });

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const [filterListData, setFilterListData] = useState<FieldValues>({
    from_date: startOfWeek.toFormat("yyyy-MM-dd"),
    to_date: endOfWeek.toFormat("yyyy-MM-dd"),
  });

  const { control, dateRange } = useDateFilters();

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
          from_date: dateRange[0],
          to_date: dateRange[1],
        },
        filterModel: agGridState.filterModel,
        sortModel: agGridState.sortModel,
        startRow: 0,
      },
      fileType,
    });
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
              {t("donation.collection.report.menu.label")}
            </Typography>

            <Box width={{ md: "auto", xs: "100%" }}>
              <DateRangePickerField
                name="date_range"
                control={control}
                showPresets
                size={isMobile ? "small" : "large"}
                placeholder="Select Date Range"
              />
            </Box>
          </Stack>
        </PadBox>
      </ContentBox>

      <ContentBox>
        <PadBox padding={{ padding: { md: "10px", xs: "8px 10px" } }}>
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
          <PadBox padding={{ padding: { md: "10px", xs: "8px 10px" } }}>
            <Box
              sx={{
                backgroundColor: slate[700],
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              <PadBox padding={{ padding: { md: "10px", xs: "8px" } }}>
                To view and take action on the data, please select the From Date
                and To Date from the filters on the right, then click Apply.
              </PadBox>
            </Box>
          </PadBox>
        ) : (
          <Box sx={{ overflow: "hidden", width: "100%" }}>
            <DonationCollectionReportList
              externalFilter={{
                ...filterListData,
                from_date: dateRange[0],
                to_date: dateRange[1],
              }}
              agGridState={agGridState}
              setAgGridState={setAgGridState}
            />
          </Box>
        )}
      </ContentBox>
    </Stack>
  );
}
