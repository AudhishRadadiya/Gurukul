"use client";

import { ContentBox, PadBox } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";

import { DailyCollectionReport } from "@web/components/report/dailyCollectionReport/DailyCollectionReport";
import { DailyCollectionReportBreadcrumbs } from "@web/components/report/dailyCollectionReport/DailyCollectionReportBreadcrumbs";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  return (
    <Stack gap="10px">
      <DailyCollectionReportBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">{t("daily.collection.report")}</Typography>
          </Stack>
        </PadBox>

        <PadBox padding={{ padding: "15px" }}>
          <DailyCollectionReport />
        </PadBox>
      </ContentBox>
    </Stack>
  );
}
