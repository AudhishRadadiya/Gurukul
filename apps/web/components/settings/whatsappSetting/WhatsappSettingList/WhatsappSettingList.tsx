import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { EditWhatsappSettingDialog } from "@web/components/settings/whatsappSetting/WhatsappSettingList/dialogs/EditWhatsappSettingDialog";
import {
  useGetWhatsappSetting,
  type WhatsappSettingDetail,
} from "@web/components/settings/whatsappSetting/WhatsappSettingList/hooks/useGetWhatsappSetting";
import { useWhatsappSettingColumns } from "@web/components/settings/whatsappSetting/WhatsappSettingList/hooks/useWhatsappSettingColumns";
import { WHATSAPP_SETTINGS_PERMISSION } from "@web/constants/permission/settings/whatsappSettings/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";

export const WhatsappSettingList = () => {
  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentWhatsappSetting, setCurrentWhatsappSetting] =
    useState<WhatsappSettingDetail>();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetWhatsappSetting({
    endRow,
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { totalCount, whatsappSettingDetail } = data || {};

  const { column } = useWhatsappSettingColumns();

  const dialogRenderer: DialogRenderer = {
    edit: currentWhatsappSetting && (
      <EditWhatsappSettingDialog
        open
        whatsappSettingId={currentWhatsappSetting.whatsapp_setting_id}
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<WhatsappSettingDetail>
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={whatsappSettingDetail}
        onPageChange={onPageChange}
        count={totalCount}
        onRowsPerPageChange={onRowsPerPageChange}
        onGridStateChange={setAgGridState}
        height={160}
        actions={[
          {
            isView: validateAccess(WHATSAPP_SETTINGS_PERMISSION.EDIT),
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentWhatsappSetting(data);
            },
            title: t("common.edit"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
