import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions, useGetDeviceType } from "@codezee/sixtify-brahma";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DeleteRoleDialog } from "@web/components/permission/role/roleList/dialogs/DeleteRoleDialog";
import type { RoleDetails } from "@web/components/permission/role/roleList/hooks/useGetRole";
import { useGetRole } from "@web/components/permission/role/roleList/hooks/useGetRole";
import { useRoleColumns } from "@web/components/permission/role/roleList/hooks/useRoleColumns";
import { ROLL_ENTRY_PERMISSION } from "@web/constants/permission/permissions/rollEntryAndPermission/permissions";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";

export const RoleList = () => {
  const { layout } = useGetDeviceType();

  const isMobile = layout === "mobile";

  const router = useRouter();

  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentRole, setCurrentRole] = useState<RoleDetails>();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetRole({
    endRow,
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { roleDetails, totalCount } = data || {};

  const { column } = useRoleColumns();

  const dialogRenderer: DialogRenderer = {
    delete: currentRole && (
      <DeleteRoleDialog
        open
        roleDetails={currentRole}
        onDeleteSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<RoleDetails>
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={roleDetails}
        actions={[
          {
            isView: validateAccess(ROLL_ENTRY_PERMISSION.DELETE),
            onClick: (data) => {
              onDialogOpen("delete");
              setCurrentRole(data);
            },
            title: t("common.delete"),
          },
          {
            isView: validateAccess(ROLL_ENTRY_PERMISSION.EDIT),
            onClick: (data) => {
              router.push(
                `/permission/role?page=edit-roles&id=${data.role_id}`
              );
            },
            title: t("common.edit"),
          },
        ]}
        onPageChange={onPageChange}
        count={totalCount}
        onRowsPerPageChange={onRowsPerPageChange}
        onGridStateChange={setAgGridState}
        height={isMobile ? 195 : 220}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
