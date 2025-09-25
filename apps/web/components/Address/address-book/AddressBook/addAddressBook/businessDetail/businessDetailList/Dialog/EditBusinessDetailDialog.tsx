import { Button, Dialog } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRef } from "react";

import {
  BusinessDetailForm,
  type BusinessDetailFormFieldValues,
  type FormRef,
} from "@web/components/Address/address-book/AddressBook/addAddressBook/businessDetail/Dialog/BusinessDetailForm";
import { EditAction } from "@web/components/common/EditAction";

type EditBusinessDetailDialogProps = {
  businessDetail: BusinessDetailFormFieldValues;
  onClose: () => void;
  onEdit: (formValues: Partial<BusinessDetailFormFieldValues>) => void;
  open: boolean;
};

export const EditBusinessDetailDialog = ({
  businessDetail,
  onClose,
  onEdit,
  open,
}: EditBusinessDetailDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const onEditBusinessDetail = () => {
    formRef.current?.submitForm((formValues) => {
      onEdit(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title={t("common.edit.label", {
        label: t("address.businessDetail.label"),
      })}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction onClick={onEditBusinessDetail} />
        </Stack>
      }
    >
      <BusinessDetailForm ref={formRef} defaultValues={businessDetail} />
    </Dialog>
  );
};
