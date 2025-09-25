import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
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
      maxWidth="md"
      onClose={onClose}
      open={open}
      title={t("common.button.add", {
        label: t("common.event.donationEntry"),
      })}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <Button
            onClick={onAddEventDonationEntry}
            loading={isPending}
            disabled={isDisabled()}
          >
            {t("common.save.button")}
          </Button>
        </Stack>
      }
    >
      <EventDonationEntryForm ref={formRef} />
    </Dialog>
  );
};
