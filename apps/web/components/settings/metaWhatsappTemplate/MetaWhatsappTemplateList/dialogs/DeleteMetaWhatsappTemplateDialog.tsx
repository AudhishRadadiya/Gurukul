import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";

import { useDeleteMetaWhatsappTemplate } from "@web/components/settings/metaWhatsappTemplate/MetaWhatsappTemplateList/dialogs/hooks/useDeleteMetaWhatsappTemplate";
import type { MetaWhatsappTemplateDetail } from "@web/components/settings/metaWhatsappTemplate/MetaWhatsappTemplateList/hooks/useGetMetaWhatsappTemplate";
import { onError } from "@web/utils/errors";

type DeleteMetaWhatsappTemplateDialogProps = {
  metaWhatsappTemplate: MetaWhatsappTemplateDetail;
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
};

export const DeleteMetaWhatsappTemplateDialog = ({
  metaWhatsappTemplate,
  onClose,
  onDeleteSuccess,
  open,
}: DeleteMetaWhatsappTemplateDialogProps) => {
  const { t } = useTranslation();

  const templateId = metaWhatsappTemplate.meta_whatsapp_template_id;

  if (!templateId) {
    return null;
  }

  const { isPending, mutate } = useDeleteMetaWhatsappTemplate({
    metaWhatsappTemplateId: templateId,
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
        deleteMessage: metaWhatsappTemplate.template_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
