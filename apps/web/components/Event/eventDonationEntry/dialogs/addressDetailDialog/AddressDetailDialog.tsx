import { BottomDialog, Button } from "@codezee/sixtify-brahma";
import { t } from "i18next";

import { AddressDetailList } from "@web/components/Event/eventDonationEntry/dialogs/addressDetailDialog/AddressDetailList";

type AddressDetailDialogProps = {
  idField: string;
  nameField: string;
  onClose: () => void;
  open: boolean;
};

export const AddressDetailDialog = ({
  idField,
  nameField,
  onClose,
  open,
}: AddressDetailDialogProps) => {
  return (
    <BottomDialog
      onClose={onClose}
      open={open}
      title={t("common.address.details")}
      actions={
        <Button onClick={onClose} variant="outlined">
          {t("common.cancel.button")}
        </Button>
      }
    >
      <AddressDetailList
        onClose={onClose}
        idField={idField}
        nameField={nameField}
      />
    </BottomDialog>
  );
};
