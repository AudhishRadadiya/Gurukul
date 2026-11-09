import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";

import { useDeleteEventContactGroup } from "@web/components/Event/eventContactGroup/EventContactGroupList/Dialogs/hooks/useDeleteEventContactGroup";
import type { EventContactGroup } from "@web/components/Event/eventContactGroup/EventContactGroupList/hooks/useGetEventContactGroup";
import { onError } from "@web/utils/errors";

type DeleteEventContactDetailDialogProps = {
  eventContactDetail: EventContactGroup;
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
};

export const DeleteEventContactGroupDialog = ({
  eventContactDetail,
  onClose,
  onDeleteSuccess,
  open,
}: DeleteEventContactDetailDialogProps) => {
  const { t } = useTranslation();

  const { isPending, mutate } = useDeleteEventContactGroup({
    eventContactGroupId: eventContactDetail.event_contact_detail_id,
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
        deleteMessage: eventContactDetail.group_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
