import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DeleteUserMasterDialog } from "@web/components/user/user-master/UserMasterList/Dialog/DeleteUserMasterDialog";
import {
  useGetUserMaster,
  type UserListType,
} from "@web/components/user/user-master/UserMasterList/hooks/useGetUserMaster";
import { useUserMasterColumns } from "@web/components/user/user-master/UserMasterList/hooks/useUserMasterColumns";
import { USER_MASTER_PERMISSION } from "@web/constants/permission/user/userMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

export const UserMasterList = () => {
  const router = useRouter();

  const { validateAccess } = useUserPermissions();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentUserMaster, setCurrentUserMaster] = useState<UserListType>();

  const { data, isFetching, refetch } = useGetUserMaster({
    endRow,
    filterModel: agGridFilterModel,
    startRow,
  });

  const { totalCount, userDetails: rowData } = data || {};

  const { column } = useUserMasterColumns();

  const dialogRenderer: DialogRenderer = {
    delete: currentUserMaster && (
      <DeleteUserMasterDialog
        open
        user={currentUserMaster}
        onDeleteSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<UserListType>
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
            isView: validateAccess(USER_MASTER_PERMISSION.EDIT),
            onClick: (data) => {
              router.push(
                `/user/user-master/${data.user_id}?page=edit-user-master`
              );
            },
            title: t("common.edit"),
          },
          {
            isView: validateAccess(USER_MASTER_PERMISSION.DELETE),
            onClick: (data) => {
              onDialogOpen("delete");
              setCurrentUserMaster(data);
            },
            title: t("common.delete"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

UserMasterList.displayName = "UserMasterList";
