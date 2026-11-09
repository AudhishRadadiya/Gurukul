import { PadBox, toasts, useGetDeviceType } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import type { SortModelItem, FilterModel } from "ag-grid-community";
import { useRef, useState } from "react";
import type { FieldValues } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DataExport } from "@web/components/common/DataExport/DataExport";
import { useEventDropdownSummaryColumns } from "@web/components/Event/eventDropdownSummary/eventDropdownSummaryList/hooks/useEventDropdownSummaryColumns";
import type { EventDropdownReport } from "@web/components/Event/eventDropdownSummary/eventDropdownSummaryList/hooks/useGetEventDropdownSummary";
import { useGetEventDropdownSummary } from "@web/components/Event/eventDropdownSummary/eventDropdownSummaryList/hooks/useGetEventDropdownSummary";
import type { GetEventDropdownSummaryExportApiSuccessResponse } from "@web/components/Event/eventDropdownSummary/eventDropdownSummaryList/hooks/useGetEventDropdownSummaryExport";
import { useGetEventDropdownSummaryExport } from "@web/components/Event/eventDropdownSummary/eventDropdownSummaryList/hooks/useGetEventDropdownSummaryExport";
import { useBranch } from "@web/context/BranchContext";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { PermissionGuard } from "@web/provider/PermissionGuard";
import type { FilType } from "@web/types/shared-types";
import { onError } from "@web/utils/errors";
import { filterSearchParams, formatToIndianNumber } from "@web/utils/helper";

type EventDropdownSummaryListProps = {
  eventDropdownId: string | null;
  eventId: string | null;
  externalFilter: FieldValues;
  search: string;
};

export const EventDropdownSummaryList = ({
  eventDropdownId,
  eventId,
  externalFilter,
  search,
}: EventDropdownSummaryListProps) => {
  const { allowPrintExport } = useUserPermissions();

  const { isMobile } = useGetDeviceType();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const { branchIds } = useBranch();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const { data, isFetching } = useGetEventDropdownSummary({
    endRow: 0,
    externalFilter: {
      ...externalFilter,
      branch_id: [branchIds],
      event_dropdown_id: eventDropdownId,
      event_id: eventId,
    },
    filterModel: agGridState.filterModel,
    quickFilter: filterSearchParams(search),
    sortModel: agGridState.sortModel,
    startRow: 0,
  });

  const { eventDropdownReport: rowData, full_count, totalAmount } = data || {};

  const resetExportStateRef = useRef<(() => void) | null>(null);

  const { mutate: exportEventDropdownSummary } =
    useGetEventDropdownSummaryExport({
      options: {
        onError: (error) => onError(error),
        onSuccess: ({
          data,
          message,
        }: GetEventDropdownSummaryExportApiSuccessResponse) => {
          resetExportStateRef.current?.();
          window.open(data.url, "_blank");
          toasts.success({ title: message });
        },
      },
    });

  const getExportBody = () => ({
    endRow: 0,
    externalFilter: {
      branch_id: [branchIds],
      event_dropdown_id: eventDropdownId,
      event_id: eventId,
    },
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow: 0,
  });

  const onExport = (fileType: FilType) => {
    exportEventDropdownSummary({
      body: getExportBody(),
      fileType,
    });
  };

  const { column } = useEventDropdownSummaryColumns();

  return (
    <>
      <PadBox padding={{ padding: { md: "3px 5px", xs: "8px 10px" } }}>
        <Stack
          direction="row"
          gap={1}
          justifyContent={{ md: "flex-end", xs: "flex-start" }}
          alignItems="center"
          flexWrap="wrap"
        >
          <PermissionGuard canAccess={allowPrintExport}>
            <DataExport onExport={onExport} />
          </PermissionGuard>
        </Stack>
      </PadBox>

      <Box sx={{ overflow: "hidden", width: "100%" }}>
        <AgGridV2<EventDropdownReport>
          isLoading={isFetching}
          page={page}
          count={full_count}
          columnDefs={column}
          rowData={rowData}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onGridStateChange={setAgGridState}
          onRowsPerPageChange={onRowsPerPageChange}
          height={isMobile ? 230 : 270}
          footer={
            <Stack
              direction="row"
              gap={{ md: "20px", xs: "10px" }}
              marginLeft={{ md: "10px", xs: "4px" }}
              flexWrap="wrap"
            >
              <Typography variant="body2">Total Amount:</Typography>
              <Typography variant="body1">
                {formatToIndianNumber(Number(totalAmount))}
              </Typography>
            </Stack>
          }
        />
      </Box>
    </>
  );
};
