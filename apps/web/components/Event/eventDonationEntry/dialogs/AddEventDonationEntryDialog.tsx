import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRef } from "react";

import type { FormRef } from "@web/components/Event/eventDonationEntry/dialogs/EventDonationEntryForm";
import { EventDonationEntryForm } from "@web/components/Event/eventDonationEntry/dialogs/EventDonationEntryForm";
import { useAddEventDonationEntry } from "@web/components/Event/eventDonationEntry/dialogs/hooks/useAddEventDonationEntry";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type AddEventDonationEntryDialogProps = {
  onAddSuccess: () => void;
  onClose: () => void;
  open: boolean;
};

export const AddEventDonationEntryDialog = ({
  onAddSuccess,
  onClose,
  open,
}: AddEventDonationEntryDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isMobile } = useGetDeviceType();

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useAddEventDonationEntry({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();

        onAddSuccess();

        toasts.success({ title: data.message });
      },
    },
  });

  const onAddEventDonationEntry = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth={isMobile ? "sm" : "md"}
      onClose={onClose}
      open={open}
      title={t("common.button.add", {
        label: t("common.event.donationEntry"),
      })}
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
            onClick={onAddEventDonationEntry}
            loading={isPending}
            disabled={isDisabled()}
            size={isMobile ? "small" : "medium"}
          >
            {t("common.save.button")}
          </Button>
        </ButtonContainer>
      }
    >
      <EventDonationEntryForm ref={formRef} />
    </Dialog>
  );
};
