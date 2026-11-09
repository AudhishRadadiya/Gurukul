import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRef } from "react";

import type { FormRef } from "@web/components/Event/eventContactGroup/Dialogs/EventContactGroupForm";
import { EventContactGroupForm } from "@web/components/Event/eventContactGroup/Dialogs/EventContactGroupForm";
import { useAddEventContactGroup } from "@web/components/Event/eventContactGroup/Dialogs/hooks/useAddEventContactGroup";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type AddEventContactGroupDialogProps = {
  onAddSuccess: () => void;
  onClose: () => void;
  open: boolean;
};

export const AddEventContactGroupDialog = ({
  onAddSuccess,
  onClose,
  open,
}: AddEventContactGroupDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isMobile } = useGetDeviceType();

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useAddEventContactGroup({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onAddSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onCreateEventContactGroup = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth={isMobile ? "sm" : "lg"}
      onClose={onClose}
      open={open}
      title="Add Event Contact Group"
      actions={
        <ButtonContainer>
          <Button
            onClick={onClose}
            variant="outlined"
            size={isMobile ? "small" : "medium"}
          >
            {t("common.cancel.button")}
          </Button>

          <Button
            onClick={onCreateEventContactGroup}
            loading={isPending}
            disabled={isDisabled()}
            size={isMobile ? "small" : "medium"}
          >
            {t("common.save.button")}
          </Button>
        </ButtonContainer>
      }
    >
      <EventContactGroupForm ref={formRef} />
    </Dialog>
  );
};
