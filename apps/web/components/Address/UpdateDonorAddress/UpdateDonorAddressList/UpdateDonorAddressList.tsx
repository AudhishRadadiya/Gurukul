import { useGetDeviceType } from "@codezee/sixtify-brahma";
import { Box } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import { MergeAddressDialog } from "@web/components/Address/UpdateDonorAddress/UpdateDonorAddressList/Dialog/MergeAddressDialog";
import type { MismatchedAddressList } from "@web/components/Address/UpdateDonorAddress/UpdateDonorAddressList/hooks/useGetUpdateDonorAddress";
import { useGetUpdateDonorAddress } from "@web/components/Address/UpdateDonorAddress/UpdateDonorAddressList/hooks/useGetUpdateDonorAddress";
import { useUpdateDonorAddressColumns } from "@web/components/Address/UpdateDonorAddress/UpdateDonorAddressList/hooks/useUpdateDonorAddressColumns";
import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { useBranch } from "@web/context/BranchContext";
import { updateDonorAddressKeys } from "@web/queryKeysFactories/updateDonorAddress";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";
import { filterSearchParams } from "@web/utils/helper";

export type UpdateDonorAddressListProps = {
  agGridState: {
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  };
  endRow: number;
  externalFilter: FieldValues;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRows: number) => void;
  page: number;
  rowsPerPage: number;
  search: string;
  setAgGridState: (data: {
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }) => void;
  startRow: number;
};

export const UpdateDonorAddressList = ({
  agGridState,
  endRow,
  externalFilter,
  onPageChange,
  onRowsPerPageChange,
  page,
  rowsPerPage,
  search,
  setAgGridState,
  startRow,
}: UpdateDonorAddressListProps) => {
  const { isMobile } = useGetDeviceType();

  const { branchIds } = useBranch();

  const queryClient = useQueryClient();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentAddress, setCurrentAddress] = useState<MismatchedAddressList>();

  const { data, isFetching } = useGetUpdateDonorAddress({
    endRow,
    externalFilter: { ...externalFilter, branch_id: [branchIds] },
    filterModel: agGridState.filterModel,
    quickFilter: filterSearchParams(search),
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { mismatchedAddressList, totalCount } = data || {};

  const { column } = useUpdateDonorAddressColumns();

  const dialogRenderer: DialogRenderer = {
    delete: currentAddress && (
      <MergeAddressDialog
        open
        address={currentAddress}
        onMergeSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: updateDonorAddressKeys.listing(),
          });
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <Box sx={{ overflow: "hidden", width: "100%" }}>
        <AgGridV2<MismatchedAddressList>
          getRowId={(params) => params.data.donation_id}
          isLoading={isFetching}
          page={page}
          columnDefs={column}
          rowsPerPage={rowsPerPage}
          rowData={mismatchedAddressList}
          onPageChange={onPageChange}
          count={totalCount}
          onRowsPerPageChange={onRowsPerPageChange}
          onGridStateChange={setAgGridState}
          height={isMobile ? 300 : 230}
          actions={[
            {
              onClick: (data) => {
                onDialogOpen("delete");
                setCurrentAddress(data);
              },
              title: t("common.update.label"),
            },
          ]}
        />
      </Box>
      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
