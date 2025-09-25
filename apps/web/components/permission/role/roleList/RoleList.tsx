import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DeleteRoleDialog } from "@web/components/permission/role/roleList/dialogs/DeleteRoleDialog";
import type { RoleDetails } from "@web/components/permission/role/roleList/hooks/useGetRole";
import { useGetRole } from "@web/components/permission/role/roleList/hooks/useGetRole";
import { useRoleColumns } from "@web/components/permission/role/roleList/hooks/useRoleColumns";

export const RoleList = () => {
  const router = useRouter();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentRole, setCurrentRole] = useState<RoleDetails>();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetRole({
    endRow,
    filterModel: agGridFilterModel,
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
            onClick: (data) => {
              onDialogOpen("delete");
              setCurrentRole(data);
            },
            title: t("common.delete"),
          },
          {
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
        onFilterChange={setAgGridFilterModel}
        height={200}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
