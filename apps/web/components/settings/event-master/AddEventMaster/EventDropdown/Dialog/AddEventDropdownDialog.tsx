import { Button, ButtonContainer, Dialog } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRef } from "react";

import {
  EventDropdownForm,
  type EventDropdownFormFieldValues,
  type FormRef,
} from "@web/components/settings/event-master/AddEventMaster/EventDropdown/Dialog/EventDropdownForm";

type AddEventDropdownDialogProps = {
  onAdd: (formValues: EventDropdownFormFieldValues) => void;
  onClose: () => void;
  open: boolean;
};

export const AddEventDropdownDialog = ({
  onAdd,
  onClose,
  open,
}: AddEventDropdownDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const onCreateEventDropdown = () => {
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
        label: t("common.form.options.label"),
      })}
      actions={
        <ButtonContainer>
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <Button onClick={onCreateEventDropdown}>
            {t("common.save.button")}
          </Button>
        </ButtonContainer>
      }
    >
      <EventDropdownForm ref={formRef} />
    </Dialog>
  );
};
