import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { EditBankMasterDialog } from "@web/components/settings/BankMaster/BankMasterList/Dialogs/EditBankMasterDialog";
import { useBankMasterColumns } from "@web/components/settings/BankMaster/BankMasterList/hooks/useBankMasterColumns";
import {
  useGetBankMaster,
  type BankMaster,
} from "@web/components/settings/BankMaster/BankMasterList/hooks/useGetBankMaster";

export const BankMasterList = () => {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentBankMaster, setCurrentBankMaster] = useState<BankMaster>();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetBankMaster({
    endRow,
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { bankDetails: rowData, totalCount } = data || {};

  const { column } = useBankMasterColumns();

  const dialogRenderer: DialogRenderer = {
    edit: currentBankMaster && (
      <EditBankMasterDialog
        open
        bankId={currentBankMaster.bank_id}
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<BankMaster>
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={rowData}
        onPageChange={onPageChange}
        count={totalCount}
        onRowsPerPageChange={onRowsPerPageChange}
        onGridStateChange={setAgGridState}
        height={160}
        actions={[
          {
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentBankMaster(data);
            },
            title: t("common.edit"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
