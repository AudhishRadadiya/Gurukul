import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import type { FilterModel, SortModelItem } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { EventReminderList } from "@web/components/Event/EventReminder/EventReminderList/EventReminderList";
import { EditSmsSettingsDialog } from "@web/components/settings/smsSettings/smsSettingsList/dialog/EditSmsSettingsDialog";
import type { SmsSettingDetail } from "@web/components/settings/smsSettings/smsSettingsList/hooks/useGetSmsSettings";
import { useGetSmsSettings } from "@web/components/settings/smsSettings/smsSettingsList/hooks/useGetSmsSettings";
import { useSmsSettingsColumns } from "@web/components/settings/smsSettings/smsSettingsList/hooks/useSmsSettingsColumns";
import { SMS_SETTINGS_PERMISSION } from "@web/constants/permission/settings/smsSettings/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";

export const SmsSettingsList = () => {
  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [agGridState, setAgGridState] = useState<{
    filterModel: FilterModel;
    sortModel: SortModelItem[];
  }>({ filterModel: {}, sortModel: [] });

  const [currentSmsSettings, setCurrentSmsSettings] =
    useState<SmsSettingDetail>();

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetSmsSettings({
    endRow,
    filterModel: agGridState.filterModel,
    sortModel: agGridState.sortModel,
    startRow,
  });

  const { smsSettingDetail: rowData, totalCount } = data || {};

  const { column } = useSmsSettingsColumns();

  const dialogRenderer: DialogRenderer = {
    edit: currentSmsSettings && (
      <EditSmsSettingsDialog
        open
        smsSettingId={currentSmsSettings?.sms_setting_id}
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<SmsSettingDetail>
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={rowData}
        onPageChange={onPageChange}
        count={totalCount}
        onRowsPerPageChange={onRowsPerPageChange}
        onGridStateChange={setAgGridState}
        actions={[
          {
            isView: validateAccess(SMS_SETTINGS_PERMISSION.EDIT),
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentSmsSettings(data);
            },
            title: t("common.edit"),
          },
        ]}
        height={160}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};

EventReminderList.displayName = "EventReminderList";
