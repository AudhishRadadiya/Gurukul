import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRef } from "react";

import { useAddMasterEntry } from "@web/components/Address/masterEntry/dialogs/hooks/useAddMasterEntry";
import type { FormRef } from "@web/components/Address/masterEntry/dialogs/MasterEntryForm";
import { MasterEntryForm } from "@web/components/Address/masterEntry/dialogs/MasterEntryForm";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type AddMasterEntryDialogProps = {
  onAddSuccess: () => void;
  onClose: () => void;
  open: boolean;
};

export const AddMasterEntryDialog = ({
  onAddSuccess,
  onClose,
  open,
}: AddMasterEntryDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useAddMasterEntry({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();

        onAddSuccess();

        toasts.success({ title: data.message });
      },
    },
  });

  const onCreateMasterEntry = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="xs"
      onClose={onClose}
      open={open}
      title={t("common.button.add", {
        label: t("address.master.entry.menu.label"),
      })}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <Button
            onClick={onCreateMasterEntry}
            loading={isPending}
            disabled={isDisabled()}
          >
            {t("common.save.button")}
          </Button>
        </Stack>
      }
    >
      <MasterEntryForm ref={formRef} />
    </Dialog>
  );
};
