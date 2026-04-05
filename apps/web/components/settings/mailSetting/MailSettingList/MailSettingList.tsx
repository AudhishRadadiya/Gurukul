import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { EditMailSettingDialog } from "@web/components/settings/mailSetting/MailSettingList/dialogs/EditMailSettingDialog";
import {
  useGetMailSetting,
  type MailSettingDetail,
} from "@web/components/settings/mailSetting/MailSettingList/hooks/useGetMailSetting";
import { useMailSettingColumns } from "@web/components/settings/mailSetting/MailSettingList/hooks/useMailSettingColumns";
import { EMAIL_SETTINGS_PERMISSION } from "@web/constants/permission/settings/emailSettings/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";

export const MailSettingList = () => {
  const { validateAccess } = useUserPermissions();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [currentMailSetting, setCurrentMailSetting] =
    useState<MailSettingDetail>();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetMailSetting({
    endRow,
    filterModel: agGridFilterModel,
    startRow,
  });

  const { mailSettingDetail, totalCount } = data || {};

  const { column } = useMailSettingColumns();

  const dialogRenderer: DialogRenderer = {
    edit: currentMailSetting && (
      <EditMailSettingDialog
        open
        emailSettingId={currentMailSetting.email_setting_id}
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<MailSettingDetail>
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={mailSettingDetail}
        onPageChange={onPageChange}
        count={totalCount}
        onRowsPerPageChange={onRowsPerPageChange}
        onFilterChange={setAgGridFilterModel}
        height={220}
        actions={[
          {
            isView: validateAccess(EMAIL_SETTINGS_PERMISSION.EDIT),
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentMailSetting(data);
            },
            title: t("common.edit"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
