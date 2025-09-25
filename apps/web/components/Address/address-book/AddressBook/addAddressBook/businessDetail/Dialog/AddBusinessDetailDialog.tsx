import { Button, Dialog } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRef } from "react";

import {
  BusinessDetailForm,
  type BusinessDetailFormFieldValues,
  type FormRef,
} from "@web/components/Address/address-book/AddressBook/addAddressBook/businessDetail/Dialog/BusinessDetailForm";

type AddBusinessDetailDialogProps = {
  onAdd: (formValues: BusinessDetailFormFieldValues) => void;
  onClose: () => void;
  open: boolean;
};

export const AddBusinessDetailDialog = ({
  onAdd,
  onClose,
  open,
}: AddBusinessDetailDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const onCreateBusinessDetail = () => {
    formRef.current?.submitForm((formValues) => {
      onAdd(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title={t("common.button.add", {
        label: t(t("address.businessDetail.label")),
      })}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            {t("common.cancel.button")}
          </Button>

          <Button onClick={onCreateBusinessDetail}>
            {t("common.save.button")}
          </Button>
        </Stack>
      }
    >
      <BusinessDetailForm ref={formRef} />
    </Dialog>
  );
};
