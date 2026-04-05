"use client";

import { ContentBox, PadBox } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";

import { DraftPaymentBreadcrumbs } from "@web/components/settings/draftPayment/DraftPaymentBreadcrumbs";
import { DraftPaymentList } from "@web/components/settings/draftPayment/draftPaymentList/DraftPaymentList";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  return (
    <Stack gap="10px">
      <DraftPaymentBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1">
              {t("draft.payment.label")}
            </Typography>
          </Stack>
        </PadBox>

        <DraftPaymentList />
      </ContentBox>
    </Stack>
  );
}
