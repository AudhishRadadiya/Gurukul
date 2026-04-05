"use client";

import {
  ContentBox,
  DatePicker,
  PadBox,
  toasts,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { DateTime } from "luxon";
import { useState } from "react";

import { UpdateDonorAddressBreadcrumbs } from "@web/components/Address/UpdateDonorAddress/UpdateDonorAddressBreadcrumbs";
import type { GetUpdateDonorAddressExportApiSuccessResponse } from "@web/components/Address/UpdateDonorAddress/UpdateDonorAddressList/hooks/useGetUpdateDonorAddressExport";
import { useGetUpdateDonorAddressExport } from "@web/components/Address/UpdateDonorAddress/UpdateDonorAddressList/hooks/useGetUpdateDonorAddressExport";
import { UpdateDonorAddressList } from "@web/components/Address/UpdateDonorAddress/UpdateDonorAddressList/UpdateDonorAddressList";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DateFilterPeriodAutocomplete } from "@web/components/common/Autocomplete/DateFilterPeriodAutocomplete";
import { DataExport } from "@web/components/common/DataExport/DataExport";
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

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { control, fromDate, toDate } = useDateFilters();

  const { mutate } = useGetUpdateDonorAddressExport({
    options: {
      onError: (error) => onError(error),
      onSuccess: ({
        data,
        message,
      }: GetUpdateDonorAddressExportApiSuccessResponse) => {
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
          branch_id: [branchIds],
          from_date: fromDate,
          to_date: toDate,
        },
        filterModel: agGridFilterModel,
        startRow: 0,
      },
      fileType,
    });
  };

  return (
    <Stack gap="10px">
      <UpdateDonorAddressBreadcrumbs />

      <ContentBox>
        <PadBox padding={{ padding: "10px" }}>
          <Stack direction="row" gap="10px" justifyContent="space-between">
            <Typography variant="subtitle1">
              {`${t("common.update.label")} ${t("common.donor.label", {
                label: t("address.label"),
              })}`}
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
          <Box
            display="flex"
            flexDirection="row"
            gap="15px"
            justifyContent="flex-end"
          >
            <PermissionGuard canAccess={allowPrintExport}>
              <DataExport onExport={onExport} />
            </PermissionGuard>
          </Box>
        </PadBox>

        <UpdateDonorAddressList
          externalFilter={{
            from_date: fromDate,
            to_date: toDate,
          }}
          agGridFilterModel={agGridFilterModel}
          setAgGridFilterModel={setAgGridFilterModel}
          page={page}
          rowsPerPage={rowsPerPage}
          startRow={startRow}
          endRow={endRow}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </ContentBox>
    </Stack>
  );
}
