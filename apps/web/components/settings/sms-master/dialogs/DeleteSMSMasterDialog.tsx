import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";

import { useDeleteSMSMaster } from "@web/components/settings/sms-master/dialogs/hooks/useDeleteSMSMaster";
import type { SMSMaster } from "@web/components/settings/sms-master/smsMasterList/hooks/useGetSMSMaster";
import { onError } from "@web/utils/errors";

type DeleteSMSMasterDialogProps = {
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
  smsMaster: SMSMaster;
};

export const DeleteSMSMasterDialog = ({
  onClose,
  onDeleteSuccess,
  open,
  smsMaster,
}: DeleteSMSMasterDialogProps) => {
  const { t } = useTranslation();

  const { isPending, mutate } = useDeleteSMSMaster({
    options: {
      onError: (error) => onError(error),
      onSuccess: (data) => {
        onClose();
        onDeleteSuccess();
        toasts.success({ title: data.message });
      },
    },
    smsMasterId: smsMaster.sms_master_id,
  });

  return (
    <DeleteDialog
      title={t("dialog.delete.message", {
        deleteMessage: smsMaster.sms_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
