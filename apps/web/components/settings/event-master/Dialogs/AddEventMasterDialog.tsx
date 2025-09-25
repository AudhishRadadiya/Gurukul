import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRef } from "react";

import type { FormRef } from "@web/components/settings/event-master/Dialogs/EventMasterForm";
import { EventMasterForm } from "@web/components/settings/event-master/Dialogs/EventMasterForm";
import { useAddEventMaster } from "@web/components/settings/event-master/Dialogs/hooks/useAddEventMaster";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type AddEventMasterDialogProps = {
  onAddSuccess: () => void;
  onClose: () => void;
  open: boolean;
};

export const AddEventMasterDialog = ({
  onAddSuccess,
  onClose,
  open,
}: AddEventMasterDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useAddEventMaster({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();

        onAddSuccess();

        toasts.success({ title: data.message });
      },
    },
  });

  const onAddEventMaster = () => {
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
        label: t("common.event.label"),
      })}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <Button
            onClick={onAddEventMaster}
            loading={isPending}
            disabled={isDisabled()}
          >
            {t("common.save.button")}
          </Button>
        </Stack>
      }
    >
      <EventMasterForm ref={formRef} />
    </Dialog>
  );
};
