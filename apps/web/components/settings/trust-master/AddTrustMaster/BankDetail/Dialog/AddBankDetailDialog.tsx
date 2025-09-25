import { Button, Dialog } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";

import type {
  BankDetailFormFieldValues,
  FormRef,
} from "@web/components/settings/trust-master/AddTrustMaster/BankDetail/Dialog/BankDetailForm";
import { BankDetailForm } from "@web/components/settings/trust-master/AddTrustMaster/BankDetail/Dialog/BankDetailForm";

type AddBankDetailDialogProps = {
  onAdd: (formValues: BankDetailFormFieldValues) => void;
  onClose: () => void;
  open: boolean;
};

export const AddBankDetailDialog = ({
  onAdd,
  onClose,
  open,
}: AddBankDetailDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const onCreateBankDetail = () => {
    formRef.current?.submitForm((formValues) => {
      onAdd(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Add Bank Detail"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button onClick={onCreateBankDetail}>Save</Button>
        </Stack>
      }
    >
      <BankDetailForm ref={formRef} />
    </Dialog>
  );
};
