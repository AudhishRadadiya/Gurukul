import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useCallback } from "react";
import type { UseFormSetValue } from "react-hook-form";

import type { AddressBookFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFrom";
import type { FamilyMemberFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/familyMemberDetail/Dialog/FamilyMemberForm";

type DeleteFamilyMemberDetailDialogProps = {
  familyMemberDetail: FamilyMemberFormFieldValues;
  familyMemberFormValues: FamilyMemberFormFieldValues[];
  onClose: () => void;
  open: boolean;
  setValue: UseFormSetValue<AddressBookFormFieldValues>;
};

export const DeleteFamilyMemberDetailDialog = ({
  familyMemberDetail,
  familyMemberFormValues,
  onClose,
  open,
  setValue,
}: DeleteFamilyMemberDetailDialogProps) => {
  const onFamilyMemberHandler = useCallback(() => {
    const familyMemberDetailData = familyMemberFormValues.filter(
      ({ id }) => id !== familyMemberDetail.id
    );

    setValue("family_detail", familyMemberDetailData);

    onClose();

    toasts.success({
      title: t("dialog.delete.success", {
        deleteMessage: familyMemberDetail.name,
      }),
    });
  }, [familyMemberDetail, familyMemberDetail]);

  return (
    <DeleteDialog
      title={t("dialog.delete.message", {
        deleteMessage: familyMemberDetail.name,
      })}
      open={open}
      isDeleteLoading={false}
      onDelete={() => onFamilyMemberHandler()}
      onClose={() => onClose()}
    />
  );
};
