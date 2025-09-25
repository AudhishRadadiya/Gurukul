"use client";

import { ContentBox, PadBox } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";

import { DonationReport } from "@web/components/report/donationReport/DonationReport";
import { DonationReportBreadcrumbs } from "@web/components/report/donationReport/DonationReportBreadcrumbs";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  return (
    <Stack gap="10px">
      <DonationReportBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              {t("common.generate", {
                label: t("donation.report.menu.label"),
              })}
            </Typography>
          </Stack>
        </PadBox>

        <PadBox padding={{ padding: "15px" }}>
          <DonationReport />
        </PadBox>
      </ContentBox>
    </Stack>
  );
}
