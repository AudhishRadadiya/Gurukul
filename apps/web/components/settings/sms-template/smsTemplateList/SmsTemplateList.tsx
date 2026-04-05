import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import type { FilterModel } from "ag-grid-community";
import { t } from "i18next";
import { useState } from "react";

import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DeleteSmsTemplateDialog } from "@web/components/settings/sms-template/smsTemplateList/dialogs/DeleteSmsTemplateDialog";
import { EditSmsTemplateDialog } from "@web/components/settings/sms-template/smsTemplateList/dialogs/EditSmsTemplateDialog";
import {
  useGetSmsTemplate,
  type SmsTemplateDetail,
} from "@web/components/settings/sms-template/smsTemplateList/hooks/useGetSmsTemplate";
import { useSmsTemplateColumns } from "@web/components/settings/sms-template/smsTemplateList/hooks/useSmsTemplateColumns";
import { SMS_TEMPLATE_PERMISSION } from "@web/constants/permission/settings/smsTemplate/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";

export const SmsTemplateList = () => {
  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { validateAccess } = useUserPermissions();

  const [currentSmsTemplate, setCurrentSmsTemplate] =
    useState<SmsTemplateDetail>();

  const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
    usePaginationParams();

  const [agGridFilterModel, setAgGridFilterModel] = useState<FilterModel>({});

  const startRow = page * rowsPerPage;

  const endRow = startRow + rowsPerPage;

  const { data, isFetching, refetch } = useGetSmsTemplate({
    endRow,
    filterModel: agGridFilterModel,
    startRow,
  });

  const { smsTemplateDetail, totalCount } = data || {};

  const { column } = useSmsTemplateColumns();

  const dialogRenderer: DialogRenderer = {
    delete: currentSmsTemplate && (
      <DeleteSmsTemplateDialog
        open
        smsTemplateDetail={currentSmsTemplate}
        onDeleteSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
    edit: currentSmsTemplate && (
      <EditSmsTemplateDialog
        open
        smsTemplateId={currentSmsTemplate.sms_template_id}
        onEditSuccess={() => {
          refetch();
        }}
        onClose={onDialogClose}
      />
    ),
  };

  return (
    <>
      <AgGridV2<SmsTemplateDetail>
        isLoading={isFetching}
        page={page}
        columnDefs={column}
        rowsPerPage={rowsPerPage}
        rowData={smsTemplateDetail}
        onPageChange={onPageChange}
        count={totalCount}
        onRowsPerPageChange={onRowsPerPageChange}
        onFilterChange={setAgGridFilterModel}
        height={200}
        actions={[
          {
            isView: validateAccess(SMS_TEMPLATE_PERMISSION.EDIT),
            onClick: (data) => {
              onDialogOpen("edit");
              setCurrentSmsTemplate(data);
            },
            title: t("common.edit"),
          },
          {
            isView: validateAccess(SMS_TEMPLATE_PERMISSION.DELETE),
            onClick: (data) => {
              onDialogOpen("delete");
              setCurrentSmsTemplate(data);
            },
            title: t("common.delete"),
          },
        ]}
      />

      {openedDialog && dialogRenderer[openedDialog]}
    </>
  );
};
