import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import type { UserPermissionList } from "@web/components/permission/user-permissions/userPermissionsList/hooks/useGetUserPermissions";
import { useGetUserPermissions } from "@web/components/permission/user-permissions/userPermissionsList/hooks/useGetUserPermissions";
import { useUserPermissionsColumns } from "@web/components/permission/user-permissions/userPermissionsList/hooks/useUserPermissionsColumns";

export const UserPermissionsList = () => {
  const router = useRouter();

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
          onClick: (data) => {
            if (data.is_have_permission) {
              router.push(
                `/permission/user-permissions?page=edit-user-permissions&id=${data.user_id}`
              );
            } else {
              router.push(
                `/permission/user-permissions?page=add-user-permissions&id=${data.user_id}`
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
      height={200}
    />
  );
};
