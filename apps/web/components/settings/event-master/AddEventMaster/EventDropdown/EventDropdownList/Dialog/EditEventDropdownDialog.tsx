import { Button, ButtonContainer, Dialog } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import {
  EventDropdownForm,
  type EventDropdownFormFieldValues,
  type FormRef,
} from "@web/components/settings/event-master/AddEventMaster/EventDropdown/Dialog/EventDropdownForm";

type EditEventDropdownDialogProps = {
  eventDropdown: EventDropdownFormFieldValues;
  onClose: () => void;
  onEdit: (formValues: Partial<EventDropdownFormFieldValues>) => void;
  open: boolean;
};

export const EditEventDropdownDialog = ({
  eventDropdown,
  onClose,
  onEdit,
  open,
}: EditEventDropdownDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const onEditEventDropdown = () => {
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
        label: t("common.event.dropdown"),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction onClick={onEditEventDropdown} />
        </ButtonContainer>
      }
    >
      <EventDropdownForm ref={formRef} defaultValues={eventDropdown} />
    </Dialog>
  );
};

