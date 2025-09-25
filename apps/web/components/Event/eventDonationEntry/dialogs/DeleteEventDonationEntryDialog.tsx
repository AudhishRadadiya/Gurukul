import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { t } from "i18next";

import { useDeleteEventDonationEntry } from "@web/components/Event/eventDonationEntry/dialogs/hooks/useDeleteEventDonationEntry";
import type { EventDonationEntry } from "@web/components/Event/eventDonationEntry/eventDonationEntryList/hooks/useGetEventDonationEntry";
import { onError } from "@web/utils/errors";

type DeleteEventDonationEntryDialogProps = {
  eventDonationEntryDetails: EventDonationEntry;
  onClose: () => void;
  onDeleteSuccess: () => void;
  open: boolean;
};

export const DeleteEventDonationEntryDialog = ({
  eventDonationEntryDetails,
  onClose,
  onDeleteSuccess,
  open,
}: DeleteEventDonationEntryDialogProps) => {
  const { isPending, mutate } = useDeleteEventDonationEntry({
    eventDonationId: eventDonationEntryDetails.event_donation_id,
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
        deleteMessage: eventDonationEntryDetails.event_master_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
