import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";

import { useDeleteTrustMaster } from "@web/components/settings/trust-master/TrustMasterList/Dialogs/hooks/useDeleteTrustMaster";
import type { Trust } from "@web/components/settings/trust-master/TrustMasterList/hooks/useGetTrustMaster";
import { onError } from "@web/utils/errors";

type DeleteTrustMasterDialogProps = {
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
  trust: Trust;
};

export const DeleteTrustMasterDialog = ({
  onClose,
  onDeleteSuccess,
  open,
  trust,
}: DeleteTrustMasterDialogProps) => {
  const { t } = useTranslation();

  const { isPending, mutate } = useDeleteTrustMaster({
    options: {
      onError: (error) => onError(error),
      onSuccess: (data) => {
        onClose();
        onDeleteSuccess();
        toasts.success({ title: data.message });
      },
    },
    trustId: trust.trust_id,
  });

  return (
    <DeleteDialog
      title={t("dialog.delete.message", {
        deleteMessage: trust.trust_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
