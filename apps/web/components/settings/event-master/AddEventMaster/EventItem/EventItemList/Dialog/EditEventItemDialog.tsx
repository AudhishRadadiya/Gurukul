import { Button, ButtonContainer, Dialog } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import {
  EventItemForm,
  type EventItemFormFieldValues,
  type FormRef,
} from "@web/components/settings/event-master/AddEventMaster/EventItem/Dialog/EventItemForm";

type EditEventItemDialogProps = {
  eventItem: EventItemFormFieldValues;
  onClose: () => void;
  onEdit: (formValues: Partial<EventItemFormFieldValues>) => void;
  open: boolean;
};

export const EditEventItemDialog = ({
  eventItem,
  onClose,
  onEdit,
  open,
}: EditEventItemDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const onEditEventItem = () => {
    formRef.current?.submitForm((formValues) => {
      onEdit(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title={t("common.edit.label", {
        label: t("common.event.item"),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction onClick={onEditEventItem} />
        </ButtonContainer>
      }
    >
      <EventItemForm ref={formRef} defaultValues={eventItem} />
    </Dialog>
  );
};
