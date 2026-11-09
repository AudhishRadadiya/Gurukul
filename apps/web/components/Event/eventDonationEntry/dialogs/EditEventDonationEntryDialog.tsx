import {
  Button,
  ButtonContainer,
  Dialog,
  toasts,
  useGetDeviceType,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import type { FormRef } from "@web/components/Event/eventDonationEntry/dialogs/EventDonationEntryForm";
import { EventDonationEntryForm } from "@web/components/Event/eventDonationEntry/dialogs/EventDonationEntryForm";
import { useEditEventDonationEntry } from "@web/components/Event/eventDonationEntry/dialogs/hooks/useEditEventDonationEntry";
import { useGetEventDonationEntryDetails } from "@web/components/Event/eventDonationEntry/dialogs/hooks/useGetEventDonationEntryDetails";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditEventDonationEntryDialogProps = {
  eventDonationId: string;
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
};

export const EditEventDonationEntryDialog = ({
  eventDonationId,
  onClose,
  onEditSuccess,
  open,
}: EditEventDonationEntryDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isMobile } = useGetDeviceType();

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const {
    data: eventDonationEntryData,
    isPending: isPendingEventDonationEntryData,
  } = useGetEventDonationEntryDetails({
    eventDonationId,
  });

  const { isPending, mutate } = useEditEventDonationEntry({
    eventDonationId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onEditEventDonationEntry = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth={isMobile ? "sm" : "md"}
      onClose={onClose}
      open={open}
      title={t("common.edit.label", {
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

          <EditAction
            onClick={onEditEventDonationEntry}
            loading={isPending}
            disabled={isDisabled()}
            size={isMobile ? "small" : "medium"}
          />
        </ButtonContainer>
      }
    >
      <EventDonationEntryForm
        ref={formRef}
        defaultValues={eventDonationEntryData}
        loading={isPendingEventDonationEntryData}
      />
    </Dialog>
  );
};
