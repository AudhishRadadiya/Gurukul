import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import type { FormRef } from "@web/components/settings/event-master/Dialogs/EventMasterForm";
import { EventMasterForm } from "@web/components/settings/event-master/Dialogs/EventMasterForm";
import { useEditEventMaster } from "@web/components/settings/event-master/EventMasterList/Dialogs/hooks/useEditEventMaster";
import { useGetEventMasterDetails } from "@web/components/settings/event-master/EventMasterList/Dialogs/hooks/useGetEventMasterDetails";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditEventMasterDialogProps = {
  eventMasterId: string;
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
};

export const EditEventMasterDialog = ({
  eventMasterId,
  onClose,
  onEditSuccess,
  open,
}: EditEventMasterDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: eventMasterData, isPending: isPendingEventMasterData } =
    useGetEventMasterDetails({
      eventMasterId,
    });

  const { isPending, mutate } = useEditEventMaster({
    eventMasterId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),

      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onEditEventMaster = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title={t("common.edit.label", {
        label: t("common.event.label"),
      })}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            onClick={onEditEventMaster}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <EventMasterForm
        ref={formRef}
        defaultValues={eventMasterData}
        loading={isPendingEventMasterData}
      />
    </Dialog>
  );
};
