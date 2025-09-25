import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { t } from "i18next";

import { useDeleteSuvicharMaster } from "@web/components/Donation/suvicharMaster/suvicharMasterList/dialogs/hooks/useDeleteSuvicharMaster";
import type { SuvicharDetails } from "@web/components/Donation/suvicharMaster/suvicharMasterList/hooks/useGetSuvicharMaster";
import { onError } from "@web/utils/errors";

type DeleteSuvicharMasterDialogProps = {
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
  suvicharDetails: SuvicharDetails;
};

export const DeleteSuvicharMasterDialog = ({
  onClose,
  onDeleteSuccess,
  open,
  suvicharDetails,
}: DeleteSuvicharMasterDialogProps) => {
  const { isPending, mutate } = useDeleteSuvicharMaster({
    options: {
      onError: (error) => onError(error),
      onSuccess: (data) => {
        onClose();
        onDeleteSuccess();
        toasts.success({ title: data.message });
      },
    },
    suvicharId: suvicharDetails.suvichar_id,
  });

  return (
    <DeleteDialog
      title={t("dialog.delete.message", {
        deleteMessage: suvicharDetails.suvichar,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
