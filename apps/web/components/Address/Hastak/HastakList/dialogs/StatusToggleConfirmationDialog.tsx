import { SaveDialog, toasts } from "@codezee/sixtify-brahma";
import { t } from "i18next";

import { useEditHastak } from "@web/components/Address/Hastak/HastakList/hooks/useEditHastak";
import type { Hastak } from "@web/components/Address/Hastak/HastakList/hooks/useGetHastak";
import { onError } from "@web/utils/errors";

type StatusToggleConfirmationDialogProps = {
  hastak: Hastak;
  onClose: () => void;
  onSaveSuccess: () => void;
  open: boolean;
};

export const StatusToggleConfirmationDialog = ({
  hastak,
  onClose,
  onSaveSuccess,
  open,
}: StatusToggleConfirmationDialogProps) => {
  const { isPending, mutate } = useEditHastak({
    options: {
      onError: (error) => onError(error),
      onSuccess: (data) => {
        onSaveSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onSaveTemplate = () => {
    mutate({
      is_ignored: !hastak.is_ignored,
      web_user_id: hastak.hastak_id,
    });
  };

  return (
    <SaveDialog
      title={t("common.hastak.status.dialog.save.title", {
        action: hastak.is_ignored ? t("common.proceed") : t("common.ignored"),
        hastakName: hastak.hastak_name,
      })}
      isSaveLoading={isPending}
      open={open}
      onSave={onSaveTemplate}
      onClose={onClose}
    />
  );
};
