import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { EditMasterTypeDialog } from "@web/components/settings/master-type/MasterTypeList/Dialogs/EditMasterTypeDialog";
import {
  useGetMasterType,
  type MasterType,
} from "@web/components/settings/master-type/MasterTypeList/hooks/useGetMasterType";
import { useMasterTypeColumns } from "@web/components/settings/master-type/MasterTypeList/hooks/useMasterTypeColumns";
import { MASTER_TYPE_PERMISSION } from "@web/constants/permission/settings/masterType/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";

export const MasterTypeList = () => {
  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const { validateAccess } = useUserPermissions();

  const [currentMasterType, setCurrentMasterType] = useState<MasterType>();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetMasterType({
    endRow,
    filterModel: agGridFilterModel,
    startRow,
  });

  const { masterParameterDetails: rowData, totalCount } = data || {};

  const { column } = useMasterTypeColumns();

  const dialogRenderer: DialogRenderer = {
    edit: currentMasterType && (
      <EditMasterTypeDialog
        open
        masterTypeId={currentMasterType.master_type_id}
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<MasterType>
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
            isView: validateAccess(MASTER_TYPE_PERMISSION.EDIT),
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentMasterType(data);
            },
            title: t("common.edit"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
