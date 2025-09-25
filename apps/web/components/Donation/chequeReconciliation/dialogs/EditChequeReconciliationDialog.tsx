import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import type { FormRef } from "@web/components/Donation/chequeReconciliation/dialogs/ChequeReconciliationForm";
import { ChequeReconciliationForm } from "@web/components/Donation/chequeReconciliation/dialogs/ChequeReconciliationForm";
import { useEditChequeReconciliation } from "@web/components/Donation/chequeReconciliation/dialogs/hooks/useEditChequeReconciliation";
import { useGetChequeReconciliationDetails } from "@web/components/Donation/chequeReconciliation/dialogs/hooks/useGetChequeReconciliationDetails";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type EditChequeReconciliationDialogProps = {
  donationId: string;
  onClose: () => void;
  onEditSuccess: () => void;
  open: boolean;
};

export const EditChequeReconciliationDialog = ({
  donationId,
  onClose,
  onEditSuccess,
  open,
}: EditChequeReconciliationDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const {
    data: chequeReconciliationData,
    isPending: isPendingChequeReconciliationData,
  } = useGetChequeReconciliationDetails({
    donationId,
  });

  const { isPending, mutate } = useEditChequeReconciliation({
    donationId,
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
    },
  });

  const onEditChequeReconciliation = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title={t("common.edit.label", {
        label: t("chequeReconciliation.label"),
      })}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <EditAction
            onClick={onEditChequeReconciliation}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <ChequeReconciliationForm
        ref={formRef}
        defaultValues={chequeReconciliationData}
        loading={isPendingChequeReconciliationData}
      />
    </Dialog>
  );
};
