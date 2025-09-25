import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";

import type { FormRef } from "@web/components/settings/financial-year-master/Dialogs/FinancialYearMasterForm";
import { FinancialYearMasterForm } from "@web/components/settings/financial-year-master/Dialogs/FinancialYearMasterForm";
import { useAddFinancialYearMaster } from "@web/components/settings/financial-year-master/Dialogs/hooks/useAddFinancialYearMaster";
import { useDisabledButtonsCache } from "@web/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "@web/hooks/useEnableDisableButtonToggle";
import { onError } from "@web/utils/errors";

type AddFinancialYearMasterDialogProps = {
  onAddSuccess: () => void;
  onClose: () => void;
  open: boolean;
};

export const AddFinancialYearMasterDialog = ({
  onAddSuccess,
  onClose,
  open,
}: AddFinancialYearMasterDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { isPending, mutate } = useAddFinancialYearMaster({
    options: {
      onError: (error) => onError(error, formRef.current?.setError),
      onSuccess: (data) => {
        onClose();

        onAddSuccess();

        toasts.success({ title: data.message });
      },
    },
  });

  const onCreateFinancialYearMaster = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Add Financial Year"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onCreateFinancialYearMaster}
            loading={isPending}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <FinancialYearMasterForm ref={formRef} />
    </Dialog>
  );
};
