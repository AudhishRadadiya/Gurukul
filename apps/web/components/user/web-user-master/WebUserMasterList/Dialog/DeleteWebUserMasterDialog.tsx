import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { t } from "i18next";

import { useDeleteWebUserMaster } from "@web/components/user/web-user-master/WebUserMasterList/Dialog/hooks/useDeleteWebUserMaster";
import type { WebUserListType } from "@web/components/user/web-user-master/WebUserMasterList/hooks/useGetWebUserMaster";
import { onError } from "@web/utils/errors";

type DeleteWebUserMasterDialogProps = {
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
  user: WebUserListType;
};

export const DeleteWebUserMasterDialog = ({
  onClose,
  onDeleteSuccess,
  open,
  user,
}: DeleteWebUserMasterDialogProps) => {
  const { isPending, mutate } = useDeleteWebUserMaster({
    options: {
      onError: (error) => onError(error),
      onSuccess: (data) => {
        onDeleteSuccess();
        onClose();
        toasts.success({ title: data.message });
      },
    },
    webUserId: user.web_user_id,
  });

  return (
    <DeleteDialog
      title={t("dialog.delete.message", {
        deleteMessage: user.your_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
