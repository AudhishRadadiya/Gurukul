import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions, useGetDeviceType } from "@codezee/sixtify-brahma";
import { Box } from "@mui/material";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import { StatusToggleConfirmationDialog } from "@web/components/Address/DonorAddress/DonorAddressList/dialogs/StatusToggleConfirmationDialog";
import { useDonorAddressColumns } from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useDonorAddressColumns";
import {
  type DonorAddress,
  useGetDonorAddress,
} from "@web/components/Address/DonorAddress/DonorAddressList/hooks/useGetDonorAddress";
import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import type { Status } from "@web/components/common/Autocomplete/hooks/useGetStatusOptions";
import { useBranch } from "@web/context/BranchContext";
import { filterSearchParams } from "@web/utils/helper";

export type DonorAddressListProps = {
  externalDateFilter?: FieldValues;
  search: string;
  setSelectedRows: (pre: string[]) => void;
  status: Status;
};

export const DonorAddressList = ({
  externalDateFilter,
  search,
  setSelectedRows,
  status,
}: DonorAddressListProps) => {
  const { isMobile } = useGetDeviceType();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentDonorAddress, setCurrentDonorAddress] =
    useState<DonorAddress>();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { branchIds } = useBranch();

  const { data, isFetching, refetch } = useGetDonorAddress({
    endRow,
    externalFilter: { ...externalDateFilter, branch_id: [branchIds], status },
    filterModel: agGridState.filterModel,
    quickFilter: filterSearchParams(search),
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { donorAddressList, totalCount } = data || {};

  const { column } = useDonorAddressColumns({
    onAction: (donorAddress) => {
      onDialogOpen("confirmation");

      setCurrentDonorAddress(donorAddress);
    },
  });

  const dialogRenderer: DialogRenderer = {
    confirmation: currentDonorAddress && (
      <StatusToggleConfirmationDialog
        open
        onSaveSuccess={() => {
          refetch();
          onDialogClose();
        }}
        onClose={onDialogClose}
        donorAddress={currentDonorAddress}
      />
    ),
  };

  return (
    <>
      <Box sx={{ overflow: "hidden", width: "100%" }}>
        <AgGridV2<DonorAddress>
          rowSelection="multiple"
          getRowId={(params) => params.data.donation_id}
          isLoading={isFetching}
          page={page}
          columnDefs={column}
          onSelectionChanged={setSelectedRows}
          rowsPerPage={rowsPerPage}
          rowData={donorAddressList}
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
