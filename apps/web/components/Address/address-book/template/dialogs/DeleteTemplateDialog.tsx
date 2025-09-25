import type { TabModel } from "@codezee/sixtify-brahma";
import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { t } from "i18next";

import { useDeleteLayout } from "@web/components/Address/address-book/template/dialogs/hooks/useDeleteLayout";
import { onError } from "@web/utils/errors";

type DeleteTemplateDialogProps = {
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
  templateData: TabModel;
};

export const DeleteTemplateDialog = ({
  onClose,
  onDeleteSuccess,
  open,
  templateData,
}: DeleteTemplateDialogProps) => {
  const { isPending, mutate } = useDeleteLayout({
    layoutId: templateData.value,
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
      title={t("common.template.delete.title", {
        deleteLabel: templateData.label,
      })}
      open={open}
      onDelete={mutate}
      onClose={onClose}
      isDeleteLoading={isPending}
    />
  );
};
