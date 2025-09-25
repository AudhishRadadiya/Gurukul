import { Button, Dialog } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRef } from "react";

import {
  FamilyMemberForm,
  type FamilyMemberFormFieldValues,
  type FormRef,
} from "@web/components/Address/address-book/AddressBook/addAddressBook/familyMemberDetail/Dialog/FamilyMemberForm";
import { EditAction } from "@web/components/common/EditAction";

type EditFamilyMemberDetailDialogProps = {
  familyMemberDetail: FamilyMemberFormFieldValues;
  onClose: () => void;
  onEdit: (formValues: Partial<FamilyMemberFormFieldValues>) => void;
  open: boolean;
};

export const EditFamilyMemberDetailDialog = ({
  familyMemberDetail,
  onClose,
  onEdit,
  open,
}: EditFamilyMemberDetailDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const onEditFamilyMemberDetail = () => {
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
        label: t("common.family.member"),
      })}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction onClick={onEditFamilyMemberDetail} />
        </Stack>
      }
    >
      <FamilyMemberForm ref={formRef} defaultValues={familyMemberDetail} />
    </Dialog>
  );
};
