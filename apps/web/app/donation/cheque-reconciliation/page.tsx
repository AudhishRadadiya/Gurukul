"use client";

import { ContentBox, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import { DataExport } from "@web/components/common/DataExport/DataExport";
import { ChequeReconciliationBreadcrumbs } from "@web/components/Donation/chequeReconciliation/ChequeReconciliationBreadcrumbs";
import { ChequeReconciliationFilter } from "@web/components/Donation/chequeReconciliation/chequeReconciliationList/ChequeReconciliationFilter";
import { ChequeReconciliationList } from "@web/components/Donation/chequeReconciliation/chequeReconciliationList/ChequeReconciliationList";
import type { GetChequeReconciliationExportApiSuccessResponse } from "@web/components/Donation/chequeReconciliation/chequeReconciliationList/hooks/useGetChequeReconciliationExport";
import { useGetChequeReconciliationExport } from "@web/components/Donation/chequeReconciliation/chequeReconciliationList/hooks/useGetChequeReconciliationExport";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const [filterListData, setFilterListData] = useState<FieldValues>({});

  const { mutate } = useGetChequeReconciliationExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({
        data,
        message,
      }: GetChequeReconciliationExportApiSuccessResponse) => {
        window.open(data.url, "_blank");

        toasts.success({ title: message });
      },
    },
  });

  const onExport = (fileType: FilType) => {
    mutate({
      body: {
        externalFilter: { ...filterListData },
      },
      fileType,
    });
  };

  return (
    <Stack gap="10px">
      <ChequeReconciliationBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Typography variant="subtitle1">
            {t("chequeReconciliation.label")}
          </Typography>
        </PadBox>
      </ContentBox>

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack direction="row" gap="5px">
            <ChequeReconciliationFilter
              filterListData={filterListData}
              setFilterListData={setFilterListData}
            />

            <DataExport onExport={onExport} />
          </Stack>
        </PadBox>

        <ChequeReconciliationList externalFilter={filterListData} />
      </ContentBox>
    </Stack>
  );
}
