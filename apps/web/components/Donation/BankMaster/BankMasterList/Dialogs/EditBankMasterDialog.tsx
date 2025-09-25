import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import { useEditBankMaster } from "@web/components/Donation/BankMaster/BankMasterList/Dialogs/hooks/useEditBankMaster";
import { useGetBankMasterDetails } from "@web/components/Donation/BankMaster/BankMasterList/Dialogs/hooks/useGetBankMasterDetails";
import type { FormRef } from "@web/components/Donation/BankMaster/Dialogs/BankMasterForm";
import { BankMasterForm } from "@web/components/Donation/BankMaster/Dialogs/BankMasterForm";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditBankMasterDialogProps = {
  bankId: string;
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
};

export const EditBankMasterDialog = ({
  bankId,
  onClose,
  onEditSuccess,
  open,
}: EditBankMasterDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: bankMasterData, isPending: isPendingBankMasterData } =
    useGetBankMasterDetails({
      bankId,
    });

  const { isPending, mutate } = useEditBankMaster({
    bankId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onEditBankMaster = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="xs"
      onClose={onClose}
      open={open}
      title={t("common.edit.label", {
        label: t("common.master.label", {
          label: t("bank.menu.label"),
        }),
      })}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            onClick={onEditBankMaster}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <BankMasterForm
        ref={formRef}
        defaultValues={bankMasterData}
        loading={isPendingBankMasterData}
      />
    </Dialog>
  );
};
