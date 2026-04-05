import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import type { UserPermissionList } from "@web/components/permission/user-permissions/userPermissionsList/hooks/useGetUserPermissions";
import { useGetUserPermissions } from "@web/components/permission/user-permissions/userPermissionsList/hooks/useGetUserPermissions";
import { useUserPermissionsColumns } from "@web/components/permission/user-permissions/userPermissionsList/hooks/useUserPermissionsColumns";
import { USER_PERMISSION_OF_PERMISSION } from "@web/constants/permission/permissions/userPermission/permissions";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";

export const UserPermissionsList = () => {
  const router = useRouter();

  const { validateAccess } = useUserPermissions();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching } = useGetUserPermissions({
    endRow,
    filterModel: agGridFilterModel,
    startRow,
  });

  const { totalCount, userPermissionList } = data || {};

  const { column } = useUserPermissionsColumns();

  return (
    <AgGridV2<UserPermissionList>
      isLoading={isFetching}
      page={page}
      columnDefs={column}
      actions={[
        {
          isView:
            validateAccess(USER_PERMISSION_OF_PERMISSION.CREATE) ||
            validateAccess(USER_PERMISSION_OF_PERMISSION.EDIT),
          onClick: (data) => {
            if (data.is_have_permission) {
              router.push(
                `/permission/user-permissions?page=edit-user-permissions&id=${data.user_id}`
              );
            } else {
              router.push(
                `/permission/user-permissions?page=add-user-permissions&id=${data.user_id}&user_name=${data.user_name}`
              );
            }
          },
          title: t("common.manage"),
        },
      ]}
      rowsPerPage={rowsPerPage}
      rowData={userPermissionList}
      onPageChange={onPageChange}
      count={totalCount}
      onRowsPerPageChange={onRowsPerPageChange}
      onFilterChange={setAgGridFilterModel}
      height={250}
    />
  );
};
