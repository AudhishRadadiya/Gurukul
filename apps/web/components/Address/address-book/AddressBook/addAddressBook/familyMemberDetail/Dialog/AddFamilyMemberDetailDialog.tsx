import { Button, Dialog, useGetDeviceType } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { t } from "i18next";
import { useRef } from "react";

import {
  FamilyMemberForm,
  type FamilyMemberFormFieldValues,
  type FormRef,
} from "@web/components/Address/address-book/AddressBook/addAddressBook/familyMemberDetail/Dialog/FamilyMemberForm";

type AddFamilyMemberDetailDialogProps = {
  onAdd: (formValues: FamilyMemberFormFieldValues) => void;
  onClose: () => void;
  open: boolean;
};

export const AddFamilyMemberDetailDialog = ({
  onAdd,
  onClose,
  open,
}: AddFamilyMemberDetailDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isMobile } = useGetDeviceType();

  const onCreateFamilyMemberDetail = () => {
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
        label: t(t("common.family.member")),
      })}
      actions={
        <Stack direction="row" gap="5px" width={isMobile ? "100%" : "auto"}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ width: isMobile ? "100%" : "auto" }}
            size={isMobile ? "small" : "medium"}
          >
            {t("common.cancel.button")}
          </Button>

          <Button
            onClick={onCreateFamilyMemberDetail}
            sx={{ width: isMobile ? "100%" : "auto" }}
            size={isMobile ? "small" : "medium"}
          >
            {t("common.save.button")}
          </Button>
        </Stack>
      }
    >
      <FamilyMemberForm ref={formRef} />
    </Dialog>
  );
};
