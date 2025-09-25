import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DeleteTrustMasterDialog } from "@web/components/settings/trust-master/TrustMasterList/Dialogs/DeleteTrustMasterDialog";
import {
  useGetTrustMaster,
  type Trust,
} from "@web/components/settings/trust-master/TrustMasterList/hooks/useGetTrustMaster";
import { useTrustMasterColumns } from "@web/components/settings/trust-master/TrustMasterList/hooks/useTrustMasterColumns";
import { TRUST_MASTER_PERMISSION } from "@web/constants/permission/settings/trustMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

export const TrustMasterList = () => {
  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const router = useRouter();

  const { validateAccess } = useUserPermissions();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentTrustMaster, setCurrentTrustMaster] = useState<Trust>();

  const { data, isFetching, refetch } = useGetTrustMaster({
    endRow,
    filterModel: agGridFilterModel,
    startRow,
  });

  const { full_count: totalCount, trustDetails: rowData } = data || {};

  const { column } = useTrustMasterColumns();

  const dialogRenderer: DialogRenderer = {
    delete: currentTrustMaster && (
      <DeleteTrustMasterDialog
        open
        trust={currentTrustMaster}
        onDeleteSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<Trust>
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
            isView: validateAccess(TRUST_MASTER_PERMISSION.EDIT),
            onClick: (data) => {
              router.push(
                `/settings/trust-master/${data.trust_id}?page=edit-trust-master`
              );
            },
            title: t("common.edit"),
          },

          {
            isView: validateAccess(TRUST_MASTER_PERMISSION.DELETE),
            onClick: (data) => {
              onDialogOpen("delete");
              setCurrentTrustMaster(data);
            },
            title: t("common.delete"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
