import { Button, ButtonContainer, Dialog } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRef } from "react";

import {
  EventItemForm,
  type EventItemFormFieldValues,
  type FormRef,
} from "@web/components/settings/event-master/AddEventMaster/EventItem/Dialog/EventItemForm";

type AddEventItemDialogProps = {
  onAdd: (formValues: EventItemFormFieldValues) => void;
  onClose: () => void;
  open: boolean;
};

export const AddEventItemDialog = ({
  onAdd,
  onClose,
  open,
}: AddEventItemDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const onCreateEventItem = () => {
    formRef.current?.submitForm((formValues) => {
      onAdd(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title={t("common.button.add", {
        label: t("common.event.item"),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <Button onClick={onCreateEventItem}>{t("common.save.button")}</Button>
        </ButtonContainer>
      }
    >
      <EventItemForm ref={formRef} />
    </Dialog>
  );
};
