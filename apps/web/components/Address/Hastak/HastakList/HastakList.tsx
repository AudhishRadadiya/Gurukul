import type { DialogRenderer } from "@codezee/sixtify-brahma";
import {
  useDialogActions,
  useGetDeviceType,
  toasts,
} from "@codezee/sixtify-brahma";
import { Box } from "@mui/material";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import { StatusToggleConfirmationDialog } from "@web/components/Address/Hastak/HastakList/dialogs/StatusToggleConfirmationDialog";
import { useCreateHastak } from "@web/components/Address/Hastak/HastakList/hooks/useCreateHastak";
import {
  type Hastak,
  useGetHastak,
} from "@web/components/Address/Hastak/HastakList/hooks/useGetHastak";
import { useHastakColumns } from "@web/components/Address/Hastak/HastakList/hooks/useHastakColumns";
import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import type { Status } from "@web/components/common/Autocomplete/hooks/useGetStatusOptions";
import { onError } from "@web/utils/errors";
import { filterSearchParams } from "@web/utils/helper";

export type HastakListProps = {
  externalDateFilter?: FieldValues;
  search: string;
  setSelectedRows: (pre: string[]) => void;
  status: Status;
};

export const HastakList = ({
  externalDateFilter,
  search,
  setSelectedRows,
  status,
}: HastakListProps) => {
  const { isMobile } = useGetDeviceType();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentHastak, setCurrentHastak] = useState<Hastak>();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetHastak({
    endRow,
    externalFilter: {
      ...externalDateFilter,
      status,
    },
    filterModel: agGridState.filterModel,
    quickFilter: filterSearchParams(search),
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { hastakList, totalCount } = data;

  const { mutate: createHastak } = useCreateHastak({
    options: {
      onError: (error) => onError(error),
      onSuccess: (response) => {
        refetch();

        toasts.success({ title: response.message });
      },
    },
  });

  const { column } = useHastakColumns({
    onCreate: ({ hastak_id }) => createHastak({ web_user_id: hastak_id }),

    onStatusChange: (hastak) => {
      setCurrentHastak(hastak);

      onDialogOpen("confirmation");
    },
  });

  const dialogRenderer: DialogRenderer = {
    confirmation: currentHastak && (
      <StatusToggleConfirmationDialog
        open
        onSaveSuccess={() => {
          refetch();
          onDialogClose();
        }}
        onClose={onDialogClose}
        hastak={currentHastak}
      />
    ),
  };

  return (
    <>
      <Box sx={{ overflow: "hidden", width: "100%" }}>
        <AgGridV2<Hastak>
          rowSelection="multiple"
          getRowId={(params) => params.data.hastak_id}
          isLoading={isFetching}
          page={page}
          columnDefs={column}
          onSelectionChanged={setSelectedRows}
          rowsPerPage={rowsPerPage}
          rowData={hastakList}
          onPageChange={onPageChange}
          count={totalCount}
          onRowsPerPageChange={onRowsPerPageChange}
          onGridStateChange={setAgGridState}
          height={isMobile ? 250 : 170}
        />
      </Box>

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
