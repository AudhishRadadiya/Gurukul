import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { t } from "i18next";

import { useDeleteMasterEntry } from "@web/components/Address/masterEntry/dialogs/hooks/useDeleteMasterEntry";
import type { MasterParameterDetails } from "@web/components/Address/masterEntry/masterEntryList/hooks/useGetMasterEntry";
import { onError } from "@web/utils/errors";

type DeleteMasterEntryDialogProps = {
  masterEntry: MasterParameterDetails;
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
};

export const DeleteMasterEntryDialog = ({
  masterEntry,
  onClose,
  onDeleteSuccess,
  open,
}: DeleteMasterEntryDialogProps) => {
  const { isPending, mutate } = useDeleteMasterEntry({
    masterParameterId: masterEntry.master_parameter_id,
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
        deleteMessage: masterEntry.master_type,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
