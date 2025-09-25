import { SaveDialog, toasts, type TabModel } from "@codezee/sixtify-brahma";
import { t } from "i18next";

import type { EditLayoutRequest } from "@web/components/Address/address-book/template/dialogs/hooks/useEditLayout";
import { useEditLayout } from "@web/components/Address/address-book/template/dialogs/hooks/useEditLayout";

type SaveTemplateDialogProps<T> = {
  columnHide: T;
  onClose: () => void;
  onSaveSuccess: () => void;
  open: boolean;
  templateData: TabModel;
};

export const SaveTemplateDialog = <T extends Record<string, boolean>>({
  columnHide,
  onClose,
  onSaveSuccess,
  open,
  templateData,
}: SaveTemplateDialogProps<T>) => {
  const { isPending, mutate } = useEditLayout({
    layoutId: templateData.value,
    options: {
      onSuccess: (data) => {
        onClose();
        onSaveSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onSaveTemplate = () => {
    const payload: EditLayoutRequest = {
      fields: columnHide,
      is_default: false,
      layout_name: templateData.label,
    };

    mutate(payload);
  };

  return (
    <SaveDialog
      title={t("common.template.dialog.save.title", {
        templateName: templateData.label,
      })}
      isSaveLoading={isPending}
      open={open}
      onSave={onSaveTemplate}
      onClose={onClose}
    />
  );
};
