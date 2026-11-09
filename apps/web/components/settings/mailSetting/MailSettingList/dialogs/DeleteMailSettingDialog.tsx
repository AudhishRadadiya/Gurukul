import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";

import { useDeleteMailSetting } from "@web/components/settings/mailSetting/MailSettingList/dialogs/hooks/useDeleteMailSetting";
import type { MailSettingDetail } from "@web/components/settings/mailSetting/MailSettingList/hooks/useGetMailSetting";
import { onError } from "@web/utils/errors";

type DeleteMailSettingDialogProps = {
  emailSetting: MailSettingDetail;
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
};

export const DeleteMailSettingDialog = ({
  emailSetting,
  onClose,
  onDeleteSuccess,
  open,
}: DeleteMailSettingDialogProps) => {
  const { t } = useTranslation();

  const { isPending, mutate } = useDeleteMailSetting({
    emailSettingId: emailSetting.email_setting_id,
    options: {
      onError: (error) => onError(error),
      onSuccess: (data) => {
        onClose();
        onDeleteSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  return (
    <DeleteDialog
      title={t("dialog.delete.message", {
        deleteMessage: emailSetting.sender_email,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
