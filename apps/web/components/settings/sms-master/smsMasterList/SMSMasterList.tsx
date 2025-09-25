import type { DialogRenderer } from "@codezee/sixtify-brahma";
import { useDialogActions } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle, useState } from "react";

import type { SMSMasterListRef } from "@web/app/settings/sms-master/page";
import { AgGridV2 } from "@web/components/common/AgGridV2/AgGridV2";
import { usePaginationParams } from "@web/components/common/AgGridV2/hooks/usePaginationParams";
import { DeleteSMSMasterDialog } from "@web/components/settings/sms-master/dialogs/DeleteSMSMasterDialog";
import { EditSMSMasterDialog } from "@web/components/settings/sms-master/dialogs/EditSMSMasterDialog";
import type { SMSMaster } from "@web/components/settings/sms-master/smsMasterList/hooks/useGetSMSMaster";
import { useGetSMSMaster } from "@web/components/settings/sms-master/smsMasterList/hooks/useGetSMSMaster";
import { useSMSMasterColumns } from "@web/components/settings/sms-master/smsMasterList/hooks/useSMSMasterColumns";
import { SMS_MASTER_PERMISSION } from "@web/constants/permission/settings/smsMaster/permission";
import { useUserPermissions } from "@web/hooks/useUserPermissions/useUserPermissions";

export const SMSMasterList = forwardRef(
  (_, ref: ForwardedRef<SMSMasterListRef>) => {
    const { onPageChange, onRowsPerPageChange, page, rowsPerPage } =
      usePaginationParams();

    const { validateAccess } = useUserPermissions();

    const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

    const [currentSMSMaster, setCurrentSMSMaster] = useState<SMSMaster>();

    const startRow = page * rowsPerPage;

    const endRow = startRow + rowsPerPage;

    const { data, isFetching, refetch } = useGetSMSMaster({
      endRow,
      startRow,
    });

    const dialogRenderer: DialogRenderer = {
      delete: currentSMSMaster && (
        <DeleteSMSMasterDialog
          open
          smsMaster={currentSMSMaster}
          onDeleteSuccess={() => {
            refetch();
          }}
          onClose={onDialogClose}
        />
      ),

      edit: currentSMSMaster && (
        <EditSMSMasterDialog
          open
          smsMasterId={currentSMSMaster.sms_master_id}
          onEditSuccess={() => {
            refetch();
          }}
          onClose={onDialogClose}
        />
      ),
    };

    const { smsMasterDetail, totalCount } = data;

    const { column } = useSMSMasterColumns();

    useImperativeHandle(ref, () => ({
      refreshSMSMasterList() {
        refetch();
      },
    }));

    return (
      <>
        <AgGridV2<SMSMaster>
          isLoading={isFetching}
          page={page}
          columnDefs={column}
          rowsPerPage={rowsPerPage}
          rowData={smsMasterDetail}
          onPageChange={onPageChange}
          count={totalCount}
          onRowsPerPageChange={onRowsPerPageChange}
          height={200}
          actions={[
            {
              isView: validateAccess(SMS_MASTER_PERMISSION.EDIT),
              onClick: (data) => {
                onDialogOpen("edit");
                setCurrentSMSMaster(data);
              },
              title: t("common.edit"),
            },
            {
              isView: validateAccess(SMS_MASTER_PERMISSION.DELETE),
              onClick: (data) => {
                onDialogOpen("delete");
                setCurrentSMSMaster(data);
              },
              title: t("common.delete"),
            },
          ]}
        />

        {openedDialog && dialogRenderer[openedDialog]}
      </>
    );
  }
);

SMSMasterList.displayName = "SMSMasterList";
