import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useCallback } from "react";
import type { UseFormSetValue } from "react-hook-form";
import { useTranslation } from "react-i18next";

import type { EventItemFormFieldValues } from "@web/components/settings/event-master/AddEventMaster/EventItem/Dialog/EventItemForm";
import type { EventMasterFormFieldValues } from "@web/components/settings/event-master/AddEventMaster/EventMasterForm";

type DeleteEventItemDialogProps = {
  eventItem: EventItemFormFieldValues;
  eventItemFormValues: EventItemFormFieldValues[];
  onClose: () => void;
  open: boolean;
  setValue: UseFormSetValue<EventMasterFormFieldValues>;
};

export const DeleteEventItemDialog = ({
  eventItem,
  eventItemFormValues,
  onClose,
  open,
  setValue,
}: DeleteEventItemDialogProps) => {
  const { t } = useTranslation();

  const onDeleteEventItem = useCallback(() => {
    const eventItemData = eventItemFormValues.filter(
      ({ event_item_id }) => event_item_id !== eventItem.event_item_id
    );

    setValue("event_items", eventItemData);

    onClose();

    toasts.success({
      title: t("dialog.delete.success", {
        deleteMessage: eventItem.title,
      }),
    });
  }, [eventItemFormValues, eventItem]);

  return (
    <DeleteDialog
      title={t("dialog.delete.message", {
        deleteMessage: eventItem.title,
      })}
      open={open}
      isDeleteLoading={false}
      onDelete={() => onDeleteEventItem()}
      onClose={() => onClose()}
    />
  );
};
