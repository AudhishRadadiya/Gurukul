import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DeleteWebBannerDialog } from "@web/components/web-banner/WebBannerList/dialogs/DeleteWebBannerDialog";
import { EditWebBannerDialog } from "@web/components/web-banner/WebBannerList/dialogs/EditWebBannerDialog";
import type { WebBannerDetail } from "@web/components/web-banner/WebBannerList/hooks/useGetWebBanner";
import { useGetWebBanner } from "@web/components/web-banner/WebBannerList/hooks/useGetWebBanner";
import { useWebBannerColumns } from "@web/components/web-banner/WebBannerList/hooks/useWebBannerColumns";
import { WEB_BANNER_PERMISSION } from "@web/constants/permission/settings/webBanner/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";

export const WebBannerList = () => {
  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentWebBanner, setCurrentWebBanner] = useState<WebBannerDetail>();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetWebBanner({
    endRow,
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { totalCount, webBannerDetail } = data || {};

  const { column } = useWebBannerColumns();

  const dialogRenderer: DialogRenderer = {
    delete: currentWebBanner && (
      <DeleteWebBannerDialog
        open
        webBannerDetails={currentWebBanner}
        onDeleteSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
    edit: currentWebBanner && (
      <EditWebBannerDialog
        open
        bannerId={currentWebBanner.banner_id}
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<WebBannerDetail>
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={webBannerDetail}
        onPageChange={onPageChange}
        count={totalCount}
        onRowsPerPageChange={onRowsPerPageChange}
        onGridStateChange={setAgGridState}
        height={160}
        actions={[
          {
            isView: validateAccess(WEB_BANNER_PERMISSION.EDIT),
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentWebBanner(data);
            },
            title: t("common.edit"),
          },
          {
            isView: validateAccess(WEB_BANNER_PERMISSION.DELETE),
            onClick: (data) => {
              onDialogOpen("delete");
              setCurrentWebBanner(data);
            },
            title: t("common.delete"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
