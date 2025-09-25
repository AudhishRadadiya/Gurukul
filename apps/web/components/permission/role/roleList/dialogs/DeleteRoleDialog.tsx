import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { t } from "i18next";

import { useDeleteRole } from "@web/components/permission/role/roleList/dialogs/hooks/useDeleteRole";
import type { RoleDetails } from "@web/components/permission/role/roleList/hooks/useGetRole";
import { onError } from "@web/utils/errors";

type DeleteRoleDialogProps = {
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
  roleDetails: RoleDetails;
};

export const DeleteRoleDialog = ({
  onClose,
  onDeleteSuccess,
  open,
  roleDetails,
}: DeleteRoleDialogProps) => {
  const { isPending, mutate } = useDeleteRole({
    options: {
      onError: (error) => onError(error),
      onSuccess: (data) => {
        onClose();
        onDeleteSuccess();
        toasts.success({ title: data.message });
      },
    },
    roleId: roleDetails.role_id,
  });

  return (
    <DeleteDialog
      title={t("dialog.delete.message", {
        deleteMessage: roleDetails.role_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
