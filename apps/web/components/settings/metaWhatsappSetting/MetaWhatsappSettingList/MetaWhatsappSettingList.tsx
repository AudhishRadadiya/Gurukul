import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DeleteMetaWhatsappSettingDialog } from "@web/components/settings/metaWhatsappSetting/MetaWhatsappSettingList/dialogs/DeleteMetaWhatsappSettingDialog";
import { EditMetaWhatsappSettingDialog } from "@web/components/settings/metaWhatsappSetting/MetaWhatsappSettingList/dialogs/EditMetaWhatsappSettingDialog";
import {
  useGetMetaWhatsappSetting,
  type MetaWhatsappSettingDetail,
} from "@web/components/settings/metaWhatsappSetting/MetaWhatsappSettingList/hooks/useGetMetaWhatsappSetting";
import { useMetaWhatsappSettingColumns } from "@web/components/settings/metaWhatsappSetting/MetaWhatsappSettingList/hooks/useMetaWhatsappSettingColumns";
import { META_WHATSAPP_SETTING_PERMISSION } from "@web/constants/permission/settings/metaWhatsappSetting/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";

export const MetaWhatsappSettingList = () => {
  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentMetaWhatsappSetting, setCurrentMetaWhatsappSetting] =
    useState<MetaWhatsappSettingDetail>();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetMetaWhatsappSetting({
    endRow,
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { metaWhatsappSettingDetail: rowData, totalCount } = data || {};

  const { column } = useMetaWhatsappSettingColumns();

  const dialogRenderer: DialogRenderer = {
    delete: currentMetaWhatsappSetting && (
      <DeleteMetaWhatsappSettingDialog
        open
        metaWhatsappSetting={currentMetaWhatsappSetting}
        onDeleteSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),

    edit: currentMetaWhatsappSetting && (
      <EditMetaWhatsappSettingDialog
        open
        metaWhatsappSettingId={
          currentMetaWhatsappSetting.meta_whatsapp_setting_id
        }
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<MetaWhatsappSettingDetail>
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={rowData}
        onPageChange={onPageChange}
        count={totalCount}
        onRowsPerPageChange={onRowsPerPageChange}
        onGridStateChange={setAgGridState}
        height={160}
        actions={[
          {
            isView: validateAccess(META_WHATSAPP_SETTING_PERMISSION.EDIT),
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentMetaWhatsappSetting(data);
            },
            title: t("common.edit"),
          },
          {
            isView: validateAccess(META_WHATSAPP_SETTING_PERMISSION.DELETE),
            onClick: (data) => {
              onDialogOpen("delete");
              setCurrentMetaWhatsappSetting(data);
            },
            title: t("common.delete"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
