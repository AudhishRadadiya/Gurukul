import { PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import { type FilterModel } from "ag-grid-community";
import { useRef, useState } from "react";

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
import { formatToIndianNumber } from "@web/utils/helper";

type EventDropdownSummaryListProps = {
  eventDropdownId: string | null;
  eventMasterId: string | null;
  fromDate: string;
  toDate: string;
};

export const EventDropdownSummaryList = ({
  eventDropdownId,
  eventMasterId,
  fromDate,
  toDate,
}: EventDropdownSummaryListProps) => {
  const { allowPrintExport } = useUserPermissions();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const { branchIds } = useBranch();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const { data, isFetching } = useGetEventDropdownSummary({
    endRow: 0,
    externalFilter: {
      branch_id: [branchIds],
      event_dropdown_id: eventDropdownId,
      event_master_id: eventMasterId,
      from_date: fromDate,
      to_date: toDate,
    },
    filterModel: agGridFilterModel,
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
      event_master_id: eventMasterId,
      from_date: fromDate,
      to_date: toDate,
    },
    filterModel: agGridFilterModel,
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
      <PadBox padding={{ padding: "3px 5px" }}>
        <Stack
          direction="row"
          gap="10px"
          justifyContent="end"
          alignItems="center"
        >
          <PermissionGuard canAccess={allowPrintExport}>
            <DataExport onExport={onExport} />
          </PermissionGuard>
        </Stack>
      </PadBox>

      <AgGridV2<EventDropdownReport>
        isLoading={isFetching}
        page={page}
        count={full_count}
        columnDefs={column}
        rowData={rowData}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onFilterChange={setAgGridFilterModel}
        onRowsPerPageChange={onRowsPerPageChange}
        height={270}
        footer={
          <Stack direction="row" gap="20px" marginLeft="10px">
            <Typography variant="body2">Total Amount:</Typography>
            <Typography variant="body1">
              {formatToIndianNumber(Number(totalAmount))}
            </Typography>
          </Stack>
        }
      />
    </>
  );
};
