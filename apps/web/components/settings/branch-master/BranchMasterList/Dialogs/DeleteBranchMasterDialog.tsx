import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";

import { useDeleteBranchMaster } from "@web/components/settings/branch-master/BranchMasterList/Dialogs/hooks/useDeleteBranchMaster";
import type { Branch } from "@web/components/settings/branch-master/BranchMasterList/hooks/useGetBranchMaster";
import { onError } from "@web/utils/errors";

type DeleteBranchMasterDialogProps = {
  branch: Branch;
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
};

export const DeleteBranchMasterDialog = ({
  branch,
  onClose,
  onDeleteSuccess,
  open,
}: DeleteBranchMasterDialogProps) => {
  const { t } = useTranslation();

  const { isPending, mutate } = useDeleteBranchMaster({
    branchId: branch.branch_id,
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
        deleteMessage: branch.branch_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
