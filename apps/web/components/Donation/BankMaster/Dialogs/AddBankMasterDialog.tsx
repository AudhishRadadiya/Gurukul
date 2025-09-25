import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRef } from "react";

import type { FormRef } from "@web/components/Donation/BankMaster/Dialogs/BankMasterForm";
import { BankMasterForm } from "@web/components/Donation/BankMaster/Dialogs/BankMasterForm";
import { useAddBankMaster } from "@web/components/Donation/BankMaster/Dialogs/hooks/useAddBankMaster";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type AddBankMasterDialogProps = {
  onAddSuccess: () => void;
  onClose: () => void;
  open: boolean;
};

export const AddBankMasterDialog = ({
  onAddSuccess,
  onClose,
  open,
}: AddBankMasterDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useAddBankMaster({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),

      onSuccess: (data) => {
        onClose();

        onAddSuccess();

        toasts.success({ title: data.message });
      },
    },
  });

  const onCreateBankMaster = () => {
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
        label: t("common.master.label", {
          label: t("bank.menu.label"),
        }),
      })}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <Button
            onClick={onCreateBankMaster}
            loading={isPending}
            disabled={isDisabled()}
          >
            {t("common.save.button")}
          </Button>
        </Stack>
      }
    >
      <BankMasterForm ref={formRef} />
    </Dialog>
  );
};
