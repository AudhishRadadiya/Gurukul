"use client";

import { ContentBox, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import { DataExport } from "@web/components/common/DataExport/DataExport";
import type { GetEventSummaryExportApiSuccessResponse } from "@web/components/Event/EventSummary/EventSummaryList/hooks/useGetEventSummaryExport";
import { DonationCollectionReportBreadcrumbs } from "@web/components/report/donationReport/donationCollectionReport/DonationCollectionReportBreadcrumbs";
import { DonationCollectionReportFilter } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/DonationCollectionReportFilter";
import { DonationCollectionReportList } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/DonationCollectionReportList";
import { useGetDonationCollectionReportExport } from "@web/components/report/donationReport/donationCollectionReport/donationCollectionReportList/hooks/useGetDonationCollectionReportExport";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  const [filterListData, setFilterListData] = useState<FieldValues>({});

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
        externalFilter: { ...filterListData },
      },
      fileType,
    });
  };

  return (
    <Stack gap="10px">
      <DonationCollectionReportBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Typography variant="subtitle1">
            {t("donation.collection.report.menu.label")}
          </Typography>
        </PadBox>
      </ContentBox>

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack direction="row" gap="10px">
            <DonationCollectionReportFilter
              filterListData={filterListData}
              setFilterListData={setFilterListData}
            />

            <DataExport onExport={onExport} />
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
          <DonationCollectionReportList externalFilter={filterListData} />
        )}
      </ContentBox>
    </Stack>
  );
}
