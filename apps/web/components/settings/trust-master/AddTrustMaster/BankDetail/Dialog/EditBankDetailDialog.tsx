import { Button, Dialog } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";

import { EditAction } from "@web/components/common/EditAction";
import type {
  BankDetailFormFieldValues,
  FormRef,
} from "@web/components/settings/trust-master/AddTrustMaster/BankDetail/Dialog/BankDetailForm";
import { BankDetailForm } from "@web/components/settings/trust-master/AddTrustMaster/BankDetail/Dialog/BankDetailForm";

type EditBankDetailDialogProps = {
  bankDetail: BankDetailFormFieldValues;
  onClose: () => void;
  onEdit: (formValues: Partial<BankDetailFormFieldValues>) => void;
  open: boolean;
};

export const EditBankDetailDialog = ({
  bankDetail,
  onClose,
  onEdit,
  open,
}: EditBankDetailDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const onEditBankDetail = () => {
    formRef.current?.submitForm((formValues) => {
      onEdit(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Edit Bank Detail"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction onClick={onEditBankDetail} />
        </Stack>
      }
    >
      <BankDetailForm ref={formRef} defaultValues={bankDetail} />
    </Dialog>
  );
};
