import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DeleteBranchMasterDialog } from "@web/components/settings/branch-master/BranchMasterList/Dialogs/DeleteBranchMasterDialog";
import { EditBranchMasterDialog } from "@web/components/settings/branch-master/BranchMasterList/Dialogs/EditBranchMasterDialog";
import { useBranchMasterColumns } from "@web/components/settings/branch-master/BranchMasterList/hooks/useBranchMasterColumns";
import {
  useGetBranchMaster,
  type Branch,
} from "@web/components/settings/branch-master/BranchMasterList/hooks/useGetBranchMaster";
import { BRANCH_MASTER_PERMISSION } from "@web/constants/permission/settings/branchMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

export const BranchMasterList = () => {
  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentBranchMaster, setCurrentBranchMaster] = useState<Branch>();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetBranchMaster({
    endRow,
    filterModel: agGridFilterModel,
    startRow,
  });

  const { branchDetails: rowData, totalCount } = data || {};

  const { column } = useBranchMasterColumns();

  const dialogRenderer: DialogRenderer = {
    delete: currentBranchMaster && (
      <DeleteBranchMasterDialog
        open
        branch={currentBranchMaster}
        onDeleteSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),

    edit: currentBranchMaster && (
      <EditBranchMasterDialog
        open
        branchId={currentBranchMaster.branch_id}
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<Branch>
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={rowData}
        onPageChange={onPageChange}
        count={totalCount}
        onRowsPerPageChange={onRowsPerPageChange}
        onFilterChange={setAgGridFilterModel}
        height={200}
        actions={[
          {
            isView: validateAccess(BRANCH_MASTER_PERMISSION.EDIT),
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentBranchMaster(data);
            },
            title: t("common.edit"),
          },
          {
            isView: validateAccess(BRANCH_MASTER_PERMISSION.DELETE),
            onClick: (data) => {
              onDialogOpen("delete");
              setCurrentBranchMaster(data);
            },
            title: t("common.delete"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
