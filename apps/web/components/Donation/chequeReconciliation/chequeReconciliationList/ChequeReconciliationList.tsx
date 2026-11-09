import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions, useGetDeviceType } from "@codezee/sixtify-brahma";
import { useTheme } from "@mui/material";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { useChequeReconciliationColumns } from "@web/components/Donation/chequeReconciliation/chequeReconciliationList/hooks/useChequeReconciliationColumns";
import type { ChequeReconciliation } from "@web/components/Donation/chequeReconciliation/chequeReconciliationList/hooks/useGetChequeReconciliation";
import { useGetChequeReconciliation } from "@web/components/Donation/chequeReconciliation/chequeReconciliationList/hooks/useGetChequeReconciliation";
import { EditChequeReconciliationDialog } from "@web/components/Donation/chequeReconciliation/dialogs/EditChequeReconciliationDialog";
import { CHEQUE_RECONCILIATION_PERMISSION } from "@web/constants/permission/donation/chequeReconciliation/permission";
import { useBranch } from "@web/context/BranchContext";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import { filterSearchParams } from "@web/utils/helper";

export type ChequeReconciliationListProps = {
  externalFilter: FieldValues;
  search: string;
};

export const ChequeReconciliationList = ({
  externalFilter,
  search,
}: ChequeReconciliationListProps) => {
  const { isMobile } = useGetDeviceType();

  const theme = useTheme();

  const { validateAccess } = useUserPermissions();

  const { darkMint, lipstickRed } = theme.palette.app.color;

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const { branchIds } = useBranch();

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({
    filterModel: {},
    sortModel: [],
  });

  const { data, isFetching, refetch } = useGetChequeReconciliation({
    endRow,
    externalFilter: { ...externalFilter, branch_id: [branchIds] },
    filterModel: agGridState.filterModel,
    quickFilter: filterSearchParams(search),
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { chequeReconciliationData, totalCount } = data;

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentChequeReconciliation, setCurrentChequeReconciliation] =
    useState<ChequeReconciliation>();

  const { column } = useChequeReconciliationColumns();

  const dialogRenderer: DialogRenderer = {
    edit: currentChequeReconciliation && (
      <EditChequeReconciliationDialog
        open
        donationId={currentChequeReconciliation.donation_id}
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<ChequeReconciliation>
        defaultColDef={{
          cellStyle: ({ data }) => {
            if (data?.cheque_status == "2") {
              return { color: darkMint[900] };
            }

            return { color: lipstickRed[900] };
          },
        }}
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={chequeReconciliationData}
        onPageChange={onPageChange}
        count={totalCount}
        onGridStateChange={setAgGridState}
        onRowsPerPageChange={onRowsPerPageChange}
        height={isMobile ? 330 : 235}
        actions={[
          {
            isView: validateAccess(CHEQUE_RECONCILIATION_PERMISSION.EDIT),
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentChequeReconciliation(data);
            },
            title: t("common.edit"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

ChequeReconciliationList.displayName = "ChequeReconciliationList";
