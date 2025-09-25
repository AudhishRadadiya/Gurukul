import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";

import { useDeleteUserMaster } from "@web/components/user/user-master/UserMasterList/Dialog/hooks/useDeleteUserMaster";
import type { UserListType } from "@web/components/user/user-master/UserMasterList/hooks/useGetUserMaster";
import { onError } from "@web/utils/errors";

type DeleteUserMasterDialogProps = {
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
  user: UserListType;
};

export const DeleteUserMasterDialog = ({
  onClose,
  onDeleteSuccess,
  open,
  user,
}: DeleteUserMasterDialogProps) => {
  const { t } = useTranslation();

  const { isPending, mutate } = useDeleteUserMaster({
    options: {
      onError: (error) => onError(error),
      onSuccess: (data) => {
        onClose();
        onDeleteSuccess();
        toasts.success({ title: data.message });
      },
    },
    userId: user.user_id,
  });

  return (
    <DeleteDialog
      title={t("dialog.delete.message", {
        deleteMessage: user.user_full_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
