import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { useCallback } from "react";
import type { UseFormSetValue } from "react-hook-form";

import type { AddressBookFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/AddressBookFrom";
import type { BusinessDetailFormFieldValues } from "@web/components/Address/address-book/AddressBook/addAddressBook/businessDetail/Dialog/BusinessDetailForm";

type DeleteBusinessDetailDialogProps = {
  businessDetail: BusinessDetailFormFieldValues;
  businessDetailFormValues: BusinessDetailFormFieldValues[];
  onClose: () => void;
  open: boolean;
  setValue: UseFormSetValue<AddressBookFormFieldValues>;
};

export const DeleteBusinessDetailDialog = ({
  businessDetail,
  businessDetailFormValues,
  onClose,
  open,
  setValue,
}: DeleteBusinessDetailDialogProps) => {
  const onBusinessDetailHandler = useCallback(() => {
    const businessDetailData = businessDetailFormValues.filter(
      ({ business_detail_id }) =>
        business_detail_id !== businessDetail.business_detail_id
    );

    setValue("business_detail", businessDetailData);

    onClose();

    toasts.success({
      title: t("dialog.delete.success", {
        deleteMessage: businessDetail.business_name,
      }),
    });
  }, [businessDetail]);

  return (
    <DeleteDialog
      title={t("dialog.delete.message", {
        deleteMessage: businessDetail.business_name,
      })}
      open={open}
      isDeleteLoading={false}
      onDelete={() => onBusinessDetailHandler()}
      onClose={() => onClose()}
    />
  );
};
