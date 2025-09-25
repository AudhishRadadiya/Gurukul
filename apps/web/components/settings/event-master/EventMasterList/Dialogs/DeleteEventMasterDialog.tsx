import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";

import { useDeleteEventMaster } from "@web/components/settings/event-master/EventMasterList/Dialogs/hooks/useDeleteEventMaster";
import type { EventMasterDetail } from "@web/components/settings/event-master/EventMasterList/hooks/useGetEventMaster";
import { onError } from "@web/utils/errors";

type DeleteEventMasterDialogProps = {
  event: EventMasterDetail;
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
};

export const DeleteEventMasterDialog = ({
  event,
  onClose,
  onDeleteSuccess,
  open,
}: DeleteEventMasterDialogProps) => {
  const { t } = useTranslation();

  const { isPending, mutate } = useDeleteEventMaster({
    eventMasterId: event.event_master_id,
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
        deleteMessage: event.event_master_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
