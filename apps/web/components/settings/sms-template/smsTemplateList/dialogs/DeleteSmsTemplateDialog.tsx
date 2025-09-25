import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { t } from "i18next";

import { useDeleteSmsTemplate } from "@web/components/settings/sms-template/smsTemplateList/dialogs/hooks/useDeleteSmsTemplate";
import type { SmsTemplateDetail } from "@web/components/settings/sms-template/smsTemplateList/hooks/useGetSmsTemplate";
import { onError } from "@web/utils/errors";

type DeleteSmsTemplateDialogProps = {
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
  smsTemplateDetail: SmsTemplateDetail;
};

export const DeleteSmsTemplateDialog = ({
  onClose,
  onDeleteSuccess,
  open,
  smsTemplateDetail,
}: DeleteSmsTemplateDialogProps) => {
  const { isPending, mutate } = useDeleteSmsTemplate({
    options: {
      onError: (error) => onError(error),
      onSuccess: (data) => {
        onClose();
        onDeleteSuccess();
        toasts.success({ title: data.message });
      },
    },
    smsTemplateId: smsTemplateDetail.sms_template_id,
  });

  return (
    <DeleteDialog
      title={t("dialog.delete.message", {
        deleteMessage: smsTemplateDetail.template_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
