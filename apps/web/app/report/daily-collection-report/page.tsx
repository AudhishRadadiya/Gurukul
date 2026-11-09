"use client";

import { ContentBox, PadBox } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";

import { DailyCollectionReport } from "@web/components/report/dailyCollectionReport/DailyCollectionReport";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  return (
    <Stack gap="10px">
      <ContentBox>
        <PadBox padding={{ padding: { sm: "10px", xs: "8px" } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontSize={{ sm: "1.25rem", xs: "1rem" }}>
              {t("daily.collection.report")}
            </Typography>
          </Stack>
        </PadBox>

        <PadBox padding={{ padding: { sm: "15px", xs: "10px" } }}>
          <DailyCollectionReport />
        </PadBox>
      </ContentBox>
    </Stack>
  );
}
