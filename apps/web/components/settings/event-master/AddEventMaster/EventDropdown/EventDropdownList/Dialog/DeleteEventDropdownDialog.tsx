import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useCallback } from "react";
import type { UseFormSetValue } from "react-hook-form";

import type { EventDropdownFormFieldValues } from "@web/components/settings/event-master/AddEventMaster/EventDropdown/Dialog/EventDropdownForm";
import type { EventMasterFormFieldValues } from "@web/components/settings/event-master/AddEventMaster/EventMasterForm";

type DeleteEventDropdownDialogProps = {
  eventDropdown: EventDropdownFormFieldValues;
  eventDropdownFormValues: EventDropdownFormFieldValues[];
  onClose: () => void;
  open: boolean;
  setValue: UseFormSetValue<EventMasterFormFieldValues>;
};

export const DeleteEventDropdownDialog = ({
  eventDropdown,
  eventDropdownFormValues,
  onClose,
  open,
  setValue,
}: DeleteEventDropdownDialogProps) => {
  const onDeleteEventDropdown = useCallback(() => {
    const eventDropdownData = eventDropdownFormValues.filter(
      ({ event_dropdown_id }) =>
        event_dropdown_id !== eventDropdown.event_dropdown_id
    );

    setValue("event_dropdown", eventDropdownData, { shouldDirty: true });

    onClose();

    toasts.success({
      title: t("dialog.delete.success", {
        deleteMessage: eventDropdown.title,
      }),
    });
  }, [eventDropdownFormValues, eventDropdown, setValue, onClose, t]);

  return (
    <DeleteDialog
      title={t("dialog.delete.message", {
        deleteMessage: eventDropdown.title,
      })}
      open={open}
      isDeleteLoading={false}
      onDelete={() => onDeleteEventDropdown()}
      onClose={() => onClose()}
    />
  );
};
