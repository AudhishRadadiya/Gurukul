import { useQueryClient } from "@tanstack/react-query";
import type { FilterModel } from "ag-grid-community";
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

export type UpdateDonorAddressListProps = {
  agGridFilterModel: FilterModel;
  endRow: number;
  externalFilter: FieldValues;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRows: number) => void;
  page: number;
  rowsPerPage: number;
  setAgGridFilterModel: (data: FilterModel) => void;
  startRow: number;
};

export const UpdateDonorAddressList = ({
  agGridFilterModel,
  endRow,
  externalFilter,
  onPageChange,
  onRowsPerPageChange,
  page,
  rowsPerPage,
  setAgGridFilterModel,
  startRow,
}: UpdateDonorAddressListProps) => {
  const { branchIds } = useBranch();

  const queryClient = useQueryClient();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentAddress, setCurrentAddress] = useState<MismatchedAddressList>();

  const { data, isFetching } = useGetUpdateDonorAddress({
    endRow,
    externalFilter: { ...externalFilter, branch_id: [branchIds] },
    filterModel: agGridFilterModel,
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
        onFilterChange={setAgGridFilterModel}
        height={200}
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
      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
