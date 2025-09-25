import { SaveDialog, toasts } from "@codezee/sixtify-brahma";
import { t } from "i18next";

import { useCloneEventMaster } from "@web/components/settings/event-master/EventMasterList/Dialogs/hooks/useCloneEventMaster";
import type { EventMasterDetail } from "@web/components/settings/event-master/EventMasterList/hooks/useGetEventMaster";
import { onError } from "@web/utils/errors";

type CloneEventMasterDialogProps = {
  event: EventMasterDetail;
  onCloneSuccess: () => void;
  onClose: () => void;
  open: boolean;
};

export const CloneEventMasterDialog = ({
  event,
  onCloneSuccess,
  onClose,
  open,
}: CloneEventMasterDialogProps) => {
  const { isPending, mutate } = useCloneEventMaster({
    eventMasterId: event.event_master_id,
    options: {
      onError: (error) => onError(error),
      onSuccess: (data) => {
        onClose();
        onCloneSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  return (
    <SaveDialog
      title={t("dialog.clone.message", {
        eventName: event.event_master_name,
      })}
      isSaveLoading={isPending}
      open={open}
      onClose={() => onClose()}
      onSave={() => {
        mutate();
      }}
    />
  );
};
