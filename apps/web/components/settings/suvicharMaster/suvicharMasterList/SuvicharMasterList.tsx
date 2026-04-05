import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DeleteSuvicharMasterDialog } from "@web/components/settings/suvicharMaster/suvicharMasterList/dialogs/DeleteSuvicharMasterDialog";
import { EditSuvicharMasterDialog } from "@web/components/settings/suvicharMaster/suvicharMasterList/dialogs/EditSuvicharMasterDialog";
import type { SuvicharDetails } from "@web/components/settings/suvicharMaster/suvicharMasterList/hooks/useGetSuvicharMaster";
import { useGetSuvicharMaster } from "@web/components/settings/suvicharMaster/suvicharMasterList/hooks/useGetSuvicharMaster";
import { useSuvicharMasterColumns } from "@web/components/settings/suvicharMaster/suvicharMasterList/hooks/useSuvicharMasterColumns";
import { SUVICHAR_MASTER_PERMISSION } from "@web/constants/permission/settings/suvicharMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";

export const SuvicharMasterList = () => {
  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentSuvicharMaster, setCurrentSuvicharMaster] =
    useState<SuvicharDetails>();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetSuvicharMaster({
    endRow,
    filterModel: agGridFilterModel,
    startRow,
  });

  const { suvicharDetails, totalCount } = data || {};

  const { column } = useSuvicharMasterColumns();

  const dialogRenderer: DialogRenderer = {
    delete: currentSuvicharMaster && (
      <DeleteSuvicharMasterDialog
        open
        suvicharDetails={currentSuvicharMaster}
        onDeleteSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
    edit: currentSuvicharMaster && (
      <EditSuvicharMasterDialog
        open
        suvicharId={currentSuvicharMaster.suvichar_id}
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<SuvicharDetails>
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={suvicharDetails}
        onPageChange={onPageChange}
        count={totalCount}
        onRowsPerPageChange={onRowsPerPageChange}
        onFilterChange={setAgGridFilterModel}
        height={200}
        actions={[
          {
            isView: validateAccess(SUVICHAR_MASTER_PERMISSION.EDIT),
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentSuvicharMaster(data);
            },
            title: t("common.edit"),
          },

          {
            isView: validateAccess(SUVICHAR_MASTER_PERMISSION.DELETE),
            onClick: (data) => {
              onDialogOpen("delete");
              setCurrentSuvicharMaster(data);
            },
            title: t("common.delete"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
