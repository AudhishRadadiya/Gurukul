import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";

import { useDeleteMetaWhatsappSetting } from "@web/components/settings/metaWhatsappSetting/MetaWhatsappSettingList/dialogs/hooks/useDeleteMetaWhatsappSetting";
import type { MetaWhatsappSettingDetail } from "@web/components/settings/metaWhatsappSetting/MetaWhatsappSettingList/hooks/useGetMetaWhatsappSetting";
import { onError } from "@web/utils/errors";

type DeleteMetaWhatsappSettingDialogProps = {
  metaWhatsappSetting: MetaWhatsappSettingDetail;
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
};

export const DeleteMetaWhatsappSettingDialog = ({
  metaWhatsappSetting,
  onClose,
  onDeleteSuccess,
  open,
}: DeleteMetaWhatsappSettingDialogProps) => {
  const { t } = useTranslation();

  const { isPending, mutate } = useDeleteMetaWhatsappSetting({
    metaWhatsappSettingId: metaWhatsappSetting.meta_whatsapp_setting_id,
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
        deleteMessage: metaWhatsappSetting.title,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
