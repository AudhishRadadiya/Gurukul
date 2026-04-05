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
import { ChequeReconciliationBreadcrumbs } from "@web/components/Donation/chequeReconciliation/ChequeReconciliationBreadcrumbs";
import { ChequeReconciliationFilter } from "@web/components/Donation/chequeReconciliation/chequeReconciliationList/ChequeReconciliationFilter";
import { ChequeReconciliationList } from "@web/components/Donation/chequeReconciliation/chequeReconciliationList/ChequeReconciliationList";
import type { GetChequeReconciliationExportApiSuccessResponse } from "@web/components/Donation/chequeReconciliation/chequeReconciliationList/hooks/useGetChequeReconciliationExport";
import { useGetChequeReconciliationExport } from "@web/components/Donation/chequeReconciliation/chequeReconciliationList/hooks/useGetChequeReconciliationExport";
import { useBranch } from "@web/context/BranchContext";
import { useDateFilters } from "@web/hooks/useDateFilters";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const { allowPrintExport } = useUserPermissions();

  const [filterListData, setFilterListData] = useState<FieldValues>({});

  const { branchIds } = useBranch();

  const { control, fromDate, toDate } = useDateFilters();

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
      <ChequeReconciliationBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack direction="row" gap="10px" justifyContent="space-between">
            <Typography variant="subtitle1">
              {t("chequeReconciliation.label")}
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
          <Stack direction="row" gap="5px">
            <ChequeReconciliationFilter
              filterListData={filterListData}
              setFilterListData={setFilterListData}
            />

            <PermissionGuard canAccess={allowPrintExport}>
              <DataExport onExport={onExport} />
            </PermissionGuard>
          </Stack>
        </PadBox>

        <ChequeReconciliationList
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
