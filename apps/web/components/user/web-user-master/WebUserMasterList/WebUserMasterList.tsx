import { useGetDeviceType } from "@codezee/sixtify-brahma";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DeleteWebUserMasterDialog } from "@web/components/user/web-user-master/WebUserMasterList/Dialog/DeleteWebUserMasterDialog";
import {
  useGetWebUserMaster,
  type WebUserListType,
} from "@web/components/user/web-user-master/WebUserMasterList/hooks/useGetWebUserMaster";
import { useWebUserMasterColumns } from "@web/components/user/web-user-master/WebUserMasterList/hooks/useWebUserMasterColumns";
import { WEB_USER_MASTER_PERMISSION } from "@web/constants/permission/user/webUserMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";
import type { DialogRenderer } from "@web/types/dialogs";
import { useDialogActions } from "@web/types/useDialogActions";

export const WebUserMasterList = () => {
  const router = useRouter();

  const { validateAccess } = useUserPermissions();

  const { layout } = useGetDeviceType();

  const isMobile = layout === "mobile";

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const [currentWebUser, setCurrentWebUser] = useState<WebUserListType>();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { data, isFetching, refetch } = useGetWebUserMaster({
    endRow,
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { column } = useWebUserMasterColumns();

  const dialogRenderer: DialogRenderer = {
    delete: currentWebUser && (
      <DeleteWebUserMasterDialog
        open
        user={currentWebUser}
        onClose={onDialogClose}
        onDeleteSuccess={() => {
          refetch();
        }}
      />
    ),
  };

  return (
    <>
      <AgGridV2<WebUserListType>
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={data?.webUserDetails}
        count={data?.totalCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onGridStateChange={setAgGridState}
        height={isMobile ? 130 : 170}
        actions={[
          {
            isView: validateAccess(WEB_USER_MASTER_PERMISSION.EDIT),
            onClick: (data) => {
              router.push(
                `/user/web-user-master/${data.web_user_id}?page=edit-web-user-master`
              );
            },
            title: t("common.edit"),
          },
          {
            isView: validateAccess(WEB_USER_MASTER_PERMISSION.DELETE),
            onClick: (data) => {
              setCurrentWebUser(data);
              onDialogOpen("delete");
            },
            title: t("common.delete"),
          },
        ]}
      />
      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

WebUserMasterList.displayName = "WebUserMasterList";
